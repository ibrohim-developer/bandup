"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { MAX_UTTERANCE_SECONDS } from "@/lib/practice-limits";

/**
 * Voice-activity-detected utterance recorder for AI speaking practice.
 *
 * Extends the RMS silence detection already used in
 * `components/test/speaking/voice-recorder.tsx` (which only flips a boolean) into
 * real utterance segmentation: it counts *consecutive* silent windows and closes
 * the utterance once the learner has clearly stopped.
 *
 * WHY START/STOP CYCLES, NOT SLICING: an OGG-Opus fragment without its header
 * pages is not a decodable file and Gemini rejects it — the same constraint
 * documented at voice-recorder.tsx:18-20. Each utterance therefore gets its own
 * recorder instance so every emitted blob is self-contained. The AudioContext
 * and MediaStream are opened once for the whole session and reused, so cycling
 * costs nothing and there is no repeated mic permission prompt.
 */

const OUTPUT_MIME = "audio/ogg";

/**
 * Learners pause mid-sentence while searching for words far more than native
 * speakers do. 1.4s is long enough not to cut them off mid-thought, short
 * enough that the conversation doesn't feel laggy. The manual "Done" button in
 * the UI is the escape hatch when this still guesses wrong.
 */
const SILENCE_HANG_MS = 1400;

/** Below this RMS counts as silence. Matches voice-recorder.tsx. */
const SILENCE_RMS_THRESHOLD = 0.01;

const POLL_MS = 100;
const SILENT_POLLS_TO_CLOSE = Math.round(SILENCE_HANG_MS / POLL_MS);

/** Ignore blips of noise so a cough or door slam doesn't open an utterance. */
const MIN_SPEECH_MS = 400;
const MIN_SPEECH_POLLS = Math.round(MIN_SPEECH_MS / POLL_MS);

/** Hard ceiling; also guards against a stuck-open VAD. Single source of truth
 * with the server's per-turn cap in practice-limits (client-safe module). */
const MAX_UTTERANCE_MS = MAX_UTTERANCE_SECONDS * 1000;

const MIN_BLOB_BYTES = 2000;

type OpusRecorderInstance = import("opus-recorder").default;

export type RecorderState = "idle" | "listening" | "speaking" | "processing" | "paused";

interface UseUtteranceRecorderOptions {
  /** Fires once per detected utterance. Awaited — recording stays paused until it resolves. */
  onUtterance: (blob: Blob, durationSeconds: number) => void | Promise<void>;
  onError?: (message: string) => void;
}

export function useUtteranceRecorder({ onUtterance, onError }: UseUtteranceRecorderOptions) {
  const [state, setState] = useState<RecorderState>("idle");
  /** 0-1 mic level, for the waveform indicator. */
  const [level, setLevel] = useState(0);

  const streamRef = useRef<MediaStream | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const sourceNodeRef = useRef<MediaStreamAudioSourceNode | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const recorderRef = useRef<OpusRecorderInstance | null>(null);
  const pollRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const speakingRef = useRef(false);
  const silentPollsRef = useRef(0);
  const speechPollsRef = useRef(0);
  const utteranceStartRef = useRef(0);
  /** Set while the AI reply plays, so the open mic doesn't transcribe our own voice. */
  const suspendedRef = useRef(false);
  const closingRef = useRef(false);

  const onUtteranceRef = useRef(onUtterance);
  const onErrorRef = useRef(onError);
  useEffect(() => {
    onUtteranceRef.current = onUtterance;
    onErrorRef.current = onError;
  }, [onUtterance, onError]);

  const stopPolling = useCallback(() => {
    if (pollRef.current) {
      clearInterval(pollRef.current);
      pollRef.current = null;
    }
  }, []);

  const teardown = useCallback(() => {
    stopPolling();
    if (recorderRef.current) {
      try {
        recorderRef.current.close();
      } catch {}
      recorderRef.current = null;
    }
    analyserRef.current = null;
    sourceNodeRef.current = null;
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((t) => t.stop());
      streamRef.current = null;
    }
    if (audioContextRef.current && audioContextRef.current.state !== "closed") {
      audioContextRef.current.close().catch(() => {});
      audioContextRef.current = null;
    }
    speakingRef.current = false;
    closingRef.current = false;
    setLevel(0);
  }, [stopPolling]);

  useEffect(() => teardown, [teardown]);

  /** Begin capturing a new utterance. One recorder instance per utterance. */
  const openUtterance = useCallback(async () => {
    const audioContext = audioContextRef.current;
    const sourceNode = sourceNodeRef.current;
    if (!audioContext || !sourceNode) return;

    const { default: Recorder } = await import("opus-recorder");
    const recorder = new Recorder({
      encoderPath: "/opus-encoderWorker.min.js",
      sourceNode,
      numberOfChannels: 1,
      encoderSampleRate: 48000,
      encoderApplication: 2048, // voice-optimised
      streamPages: false,
    });

    recorder.ondataavailable = (data: Uint8Array) => {
      const blob = new Blob([data as BlobPart], { type: OUTPUT_MIME });
      const durationSeconds = (Date.now() - utteranceStartRef.current) / 1000;
      recorderRef.current = null;
      closingRef.current = false;

      // Too small to contain speech — drop it and resume listening rather than
      // spending a Gemini call on a cough.
      if (blob.size < MIN_BLOB_BYTES) {
        if (!suspendedRef.current) setState("listening");
        return;
      }

      setState("processing");
      Promise.resolve(onUtteranceRef.current(blob, durationSeconds))
        .catch((err) => {
          console.error("[practice] utterance handler failed:", err);
          onErrorRef.current?.("Something went wrong processing that. Try again.");
        })
        .finally(() => {
          if (!suspendedRef.current) setState("listening");
        });
    };

    recorderRef.current = recorder;
    await recorder.start();
    utteranceStartRef.current = Date.now();
    speakingRef.current = true;
    silentPollsRef.current = 0;
    setState("speaking");
  }, []);

  /** Close the current utterance; ondataavailable delivers the blob. */
  const closeUtterance = useCallback(() => {
    if (closingRef.current) return;
    const recorder = recorderRef.current;
    speakingRef.current = false;
    speechPollsRef.current = 0;
    silentPollsRef.current = 0;
    if (!recorder) return;
    closingRef.current = true;
    recorder.stop().catch(() => {
      closingRef.current = false;
    });
  }, []);

  const start = useCallback(async () => {
    try {
      const { default: Recorder } = await import("opus-recorder");
      if (!Recorder.isRecordingSupported()) {
        onErrorRef.current?.(
          "Your browser does not support audio recording. Please use Chrome, Firefox, or Safari 14.5+."
        );
        return;
      }

      const stream = await navigator.mediaDevices.getUserMedia({
        // Echo cancellation matters here: unlike the exam recorder, the AI is
        // speaking through the same device we're listening on.
        audio: { echoCancellation: true, noiseSuppression: true, autoGainControl: true },
      });
      streamRef.current = stream;

      const audioContext = new AudioContext();
      audioContextRef.current = audioContext;
      const sourceNode = audioContext.createMediaStreamSource(stream);
      sourceNodeRef.current = sourceNode;

      const analyser = audioContext.createAnalyser();
      analyser.fftSize = 2048;
      sourceNode.connect(analyser);
      analyserRef.current = analyser;

      const samples = new Float32Array(analyser.fftSize);
      setState("listening");

      pollRef.current = setInterval(() => {
        const node = analyserRef.current;
        if (!node || suspendedRef.current) return;

        node.getFloatTimeDomainData(samples);
        let sum = 0;
        for (let i = 0; i < samples.length; i++) sum += samples[i] * samples[i];
        const rms = Math.sqrt(sum / samples.length);
        setLevel(Math.min(1, rms * 12));

        const isSpeech = rms > SILENCE_RMS_THRESHOLD;

        if (!speakingRef.current) {
          // Waiting for speech onset — require a sustained run so noise
          // doesn't open an utterance.
          speechPollsRef.current = isSpeech ? speechPollsRef.current + 1 : 0;
          if (speechPollsRef.current >= MIN_SPEECH_POLLS && !recorderRef.current) {
            void openUtterance();
          }
          return;
        }

        // Mid-utterance — close after a sustained silence, or at the ceiling.
        if (Date.now() - utteranceStartRef.current >= MAX_UTTERANCE_MS) {
          closeUtterance();
          return;
        }
        silentPollsRef.current = isSpeech ? 0 : silentPollsRef.current + 1;
        if (silentPollsRef.current >= SILENT_POLLS_TO_CLOSE) closeUtterance();
      }, POLL_MS);
    } catch {
      teardown();
      setState("idle");
      onErrorRef.current?.("Microphone access is required for speaking practice.");
    }
  }, [openUtterance, closeUtterance, teardown]);

  const stop = useCallback(() => {
    if (recorderRef.current) closeUtterance();
    teardown();
    setState("idle");
  }, [closeUtterance, teardown]);

  /** Manual "Done" — for when the VAD hasn't noticed the learner finished. */
  const finishTurn = useCallback(() => {
    if (speakingRef.current) closeUtterance();
  }, [closeUtterance]);

  /**
   * Suspend while the AI reply plays. Without this the open mic hears our own
   * voice through the speakers and transcribes it as the learner's next turn.
   */
  const suspend = useCallback(() => {
    suspendedRef.current = true;
    if (speakingRef.current) closeUtterance();
    speechPollsRef.current = 0;
    setLevel(0);
    setState("paused");
  }, [closeUtterance]);

  const resume = useCallback(() => {
    suspendedRef.current = false;
    speechPollsRef.current = 0;
    silentPollsRef.current = 0;
    setState("listening");
  }, []);

  return { state, level, start, stop, finishTurn, suspend, resume };
}
