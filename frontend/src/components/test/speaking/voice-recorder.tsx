"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import { Mic, Square, Play, Pause, RotateCcw, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

const MIN_BLOB_SIZE = 5000; // 5KB — silent ogg/opus is typically 2-5KB
const SILENCE_RMS_THRESHOLD = 0.01;

// Official IELTS Part 2 monologue: 1–2 minutes, examiner stops at exactly 2 minutes.
// We auto-stop at 2:05 to give a small buffer.
const PART_LIMITS: Record<number, { min: number; max: number | null }> = {
  1: { min: 5, max: null },
  2: { min: 30, max: 125 },
  3: { min: 5, max: null },
};

// opus-recorder produces OGG-Opus (audio/ogg), which Gemini accepts directly —
// unlike MediaRecorder's audio/webm or iOS Safari's audio/mp4, which Gemini
// rejects with INVALID_ARGUMENT. Every browser now produces the same format.
const OUTPUT_MIME = "audio/ogg";
const OUTPUT_EXTENSION = "ogg";

type OpusRecorderInstance = import("opus-recorder").default;

export interface RecordingResult {
  blob: Blob;
  durationSeconds: number;
  mimeType: string;
  extension: string;
}

interface VoiceRecorderProps {
  onRecordingComplete: (blob: Blob, durationSeconds: number, meta: { mimeType: string; extension: string }) => void;
  onRecordingCleared?: () => void;
  onRecordingRejected?: (reason: string) => void;
  onRecordingStateChange?: (recording: boolean) => void;
  disabled?: boolean;
  partNumber?: number;
}

export function VoiceRecorder({ onRecordingComplete, onRecordingCleared, onRecordingRejected, onRecordingStateChange, disabled, partNumber = 1 }: VoiceRecorderProps) {
  const limits = PART_LIMITS[partNumber] ?? PART_LIMITS[1];
  const minDuration = limits.min;
  const maxDuration = limits.max;
  const [state, setState] = useState<"idle" | "recording" | "recorded">("idle");
  const [elapsed, setElapsed] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [warning, setWarning] = useState<string | null>(null);

  const recorderRef = useRef<OpusRecorderInstance | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const blobRef = useRef<Blob | null>(null);
  const startTimeRef = useRef(0);

  // Silence detection refs
  const analyserRef = useRef<AnalyserNode | null>(null);
  const hasSignificantAudioRef = useRef(false);
  const silenceCheckRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const clearTimer = useCallback(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  const teardown = useCallback(() => {
    if (silenceCheckRef.current) {
      clearInterval(silenceCheckRef.current);
      silenceCheckRef.current = null;
    }
    analyserRef.current = null;
    if (recorderRef.current) {
      try {
        recorderRef.current.close();
      } catch {}
      recorderRef.current = null;
    }
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((t) => t.stop());
      streamRef.current = null;
    }
    if (audioContextRef.current && audioContextRef.current.state !== "closed") {
      audioContextRef.current.close().catch(() => {});
      audioContextRef.current = null;
    }
  }, []);

  useEffect(() => {
    return () => {
      clearTimer();
      teardown();
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, [clearTimer, teardown]);

  const startRecording = useCallback(async () => {
    try {
      setWarning(null);

      const { default: Recorder } = await import("opus-recorder");

      if (!Recorder.isRecordingSupported()) {
        alert("Your browser does not support audio recording. Please use Chrome, Firefox, or Safari 14.5+.");
        return;
      }

      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;

      const audioContext = new AudioContext();
      audioContextRef.current = audioContext;
      const sourceNode = audioContext.createMediaStreamSource(stream);

      const recorder = new Recorder({
        encoderPath: "/opus-encoderWorker.min.js",
        sourceNode,
        numberOfChannels: 1,
        encoderSampleRate: 48000,
        encoderApplication: 2048, // voice-optimised
        streamPages: false,
      });
      recorderRef.current = recorder;
      hasSignificantAudioRef.current = false;

      // Silence detection on the same stream
      try {
        const analyser = audioContext.createAnalyser();
        analyser.fftSize = 2048;
        sourceNode.connect(analyser);
        analyserRef.current = analyser;

        const dataArray = new Float32Array(analyser.fftSize);
        silenceCheckRef.current = setInterval(() => {
          if (!analyserRef.current) return;
          analyserRef.current.getFloatTimeDomainData(dataArray);
          let sum = 0;
          for (let i = 0; i < dataArray.length; i++) {
            sum += dataArray[i] * dataArray[i];
          }
          const rms = Math.sqrt(sum / dataArray.length);
          if (rms > SILENCE_RMS_THRESHOLD) {
            hasSignificantAudioRef.current = true;
          }
        }, 200);
      } catch {
        hasSignificantAudioRef.current = true;
      }

      recorder.ondataavailable = (data: Uint8Array) => {
        const blob = new Blob([data], { type: OUTPUT_MIME });
        const duration = Math.round((Date.now() - startTimeRef.current) / 1000);

        // We're done with the recorder/stream/context at this point.
        teardown();

        if (duration < minDuration) {
          const reason = partNumber === 2
            ? `Part 2 requires a 1–2 minute monologue. Please speak for at least ${minDuration} seconds.`
            : `Recording too short. Please speak for at least ${minDuration} seconds.`;
          setWarning(reason);
          setState("idle");
          setElapsed(0);
          onRecordingRejected?.(reason);
          onRecordingStateChange?.(false);
          return;
        }

        if (blob.size < MIN_BLOB_SIZE) {
          const reason = "No speech detected. Please try again and speak clearly.";
          setWarning(reason);
          setState("idle");
          setElapsed(0);
          onRecordingRejected?.(reason);
          onRecordingStateChange?.(false);
          return;
        }

        if (!hasSignificantAudioRef.current) {
          const reason = "No speech detected. Please try again and speak into your microphone.";
          setWarning(reason);
          setState("idle");
          setElapsed(0);
          onRecordingRejected?.(reason);
          onRecordingStateChange?.(false);
          return;
        }

        blobRef.current = blob;
        setElapsed(duration);
        setState("recorded");
        setWarning(null);
        onRecordingStateChange?.(false);
        onRecordingComplete(blob, duration, { mimeType: OUTPUT_MIME, extension: OUTPUT_EXTENSION });
      };

      await recorder.start();
      startTimeRef.current = Date.now();
      setElapsed(0);
      setState("recording");
      onRecordingStateChange?.(true);

      timerRef.current = setInterval(() => {
        const seconds = Math.round((Date.now() - startTimeRef.current) / 1000);
        setElapsed(seconds);
        if (maxDuration !== null && seconds >= maxDuration) {
          stopRecordingRef.current();
        }
      }, 500);
    } catch {
      teardown();
      alert("Microphone access is required to record your answer.");
    }
  }, [onRecordingComplete, onRecordingRejected, onRecordingStateChange, teardown, minDuration, maxDuration, partNumber]);

  const stopRecording = useCallback(() => {
    clearTimer();
    const rec = recorderRef.current;
    if (rec) {
      // ondataavailable fires before stop() resolves; we handle finalize there.
      rec.stop().catch(() => {});
    }
  }, [clearTimer]);

  const stopRecordingRef = useRef(stopRecording);
  useEffect(() => {
    stopRecordingRef.current = stopRecording;
  }, [stopRecording]);

  const reRecord = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current = null;
    }
    setIsPlaying(false);
    blobRef.current = null;
    setState("idle");
    setElapsed(0);
    setWarning(null);
    onRecordingCleared?.();
  }, [onRecordingCleared]);

  const togglePlayback = useCallback(() => {
    if (!blobRef.current) return;

    if (isPlaying && audioRef.current) {
      audioRef.current.pause();
      setIsPlaying(false);
      return;
    }

    const audio = new Audio(URL.createObjectURL(blobRef.current));
    audioRef.current = audio;
    audio.onended = () => setIsPlaying(false);
    audio.play();
    setIsPlaying(true);
  }, [isPlaying]);

  const formatTime = (s: number) => {
    const m = Math.floor(s / 60);
    const sec = s % 60;
    return `${m}:${sec.toString().padStart(2, "0")}`;
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center gap-3">
        {state === "idle" && (
          <Button
            type="button"
            onClick={startRecording}
            disabled={disabled}
            variant="outline"
            className="group gap-2 px-5 h-11 text-base hover:bg-red-500 hover:text-white hover:border-red-500"
          >
            <Mic className="h-5 w-5 text-red-500 group-hover:text-white transition-colors" />
            Record
          </Button>
        )}

        {state === "recording" && (
          <>
            <div className="flex items-center gap-2">
              <span className="h-2.5 w-2.5 rounded-full bg-red-500 animate-pulse" />
              <span className="text-sm font-mono font-bold text-red-500">
                {formatTime(elapsed)}
                {maxDuration !== null && (
                  <span className="text-muted-foreground font-normal"> / {formatTime(maxDuration)}</span>
                )}
              </span>
            </div>
            <Button
              type="button"
              onClick={stopRecording}
              variant="destructive"
              size="sm"
              className="gap-2"
            >
              <Square className="h-3.5 w-3.5" />
              Stop
            </Button>
          </>
        )}

        {state === "recorded" && (
          <>
            <span className="text-sm font-mono text-muted-foreground">
              {formatTime(elapsed)}
            </span>
            <Button
              type="button"
              onClick={togglePlayback}
              variant="outline"
              size="sm"
              className="gap-2"
            >
              {isPlaying ? (
                <Pause className="h-3.5 w-3.5" />
              ) : (
                <Play className="h-3.5 w-3.5" />
              )}
              {isPlaying ? "Pause" : "Play"}
            </Button>
            <Button
              type="button"
              onClick={reRecord}
              variant="ghost"
              size="sm"
              className="gap-2"
              disabled={disabled}
            >
              <RotateCcw className="h-3.5 w-3.5" />
              Re-record
            </Button>
          </>
        )}
      </div>

      {warning && (
        <div className="flex items-center gap-2 text-sm text-amber-600 dark:text-amber-400">
          <AlertCircle className="h-4 w-4 shrink-0" />
          {warning}
        </div>
      )}
    </div>
  );
}
