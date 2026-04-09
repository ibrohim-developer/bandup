"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import { Mic, Square, Play, Pause, RotateCcw, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

const MIN_DURATION_SECONDS = 5;
const MIN_BLOB_SIZE = 5000; // 5KB — silent webm is typically 2-5KB
const SILENCE_RMS_THRESHOLD = 0.01; // RMS amplitude threshold for speech detection

interface VoiceRecorderProps {
  onRecordingComplete: (blob: Blob, durationSeconds: number) => void;
  onRecordingRejected?: (reason: string) => void;
  onRecordingStateChange?: (recording: boolean) => void;
  disabled?: boolean;
}

export function VoiceRecorder({ onRecordingComplete, onRecordingRejected, onRecordingStateChange, disabled }: VoiceRecorderProps) {
  const [state, setState] = useState<"idle" | "recording" | "recorded">("idle");
  const [elapsed, setElapsed] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [warning, setWarning] = useState<string | null>(null);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const blobRef = useRef<Blob | null>(null);
  const startTimeRef = useRef(0);

  // Silence detection refs
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const hasSignificantAudioRef = useRef(false);
  const silenceCheckRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const clearTimer = useCallback(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  const cleanupAudioAnalysis = useCallback(() => {
    if (silenceCheckRef.current) {
      clearInterval(silenceCheckRef.current);
      silenceCheckRef.current = null;
    }
    if (audioContextRef.current && audioContextRef.current.state !== "closed") {
      audioContextRef.current.close();
      audioContextRef.current = null;
    }
    analyserRef.current = null;
  }, []);

  useEffect(() => {
    return () => {
      clearTimer();
      cleanupAudioAnalysis();
      if (mediaRecorderRef.current?.state === "recording") {
        mediaRecorderRef.current.stop();
      }
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, [clearTimer, cleanupAudioAnalysis]);

  const startRecording = useCallback(async () => {
    try {
      setWarning(null);
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream, {
        mimeType: MediaRecorder.isTypeSupported("audio/webm;codecs=opus")
          ? "audio/webm;codecs=opus"
          : "audio/webm",
      });

      chunksRef.current = [];
      mediaRecorderRef.current = mediaRecorder;
      hasSignificantAudioRef.current = false;

      // Set up Web Audio API for silence detection
      try {
        const audioContext = new AudioContext();
        const source = audioContext.createMediaStreamSource(stream);
        const analyser = audioContext.createAnalyser();
        analyser.fftSize = 2048;
        source.connect(analyser);

        audioContextRef.current = audioContext;
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
        // If Web Audio API fails, skip silence detection
        hasSignificantAudioRef.current = true;
      }

      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) chunksRef.current.push(e.data);
      };

      mediaRecorder.onstop = () => {
        stream.getTracks().forEach((t) => t.stop());
        cleanupAudioAnalysis();

        const blob = new Blob(chunksRef.current, { type: "audio/webm" });
        const duration = Math.round((Date.now() - startTimeRef.current) / 1000);

        // Validate recording
        if (duration < MIN_DURATION_SECONDS) {
          const reason = `Recording too short. Please speak for at least ${MIN_DURATION_SECONDS} seconds.`;
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
        onRecordingComplete(blob, duration);
      };

      startTimeRef.current = Date.now();
      setElapsed(0);
      mediaRecorder.start(1000);
      setState("recording");
      onRecordingStateChange?.(true);

      timerRef.current = setInterval(() => {
        setElapsed(Math.round((Date.now() - startTimeRef.current) / 1000));
      }, 500);
    } catch {
      alert("Microphone access is required to record your answer.");
    }
  }, [onRecordingComplete, onRecordingRejected, onRecordingStateChange, cleanupAudioAnalysis]);

  const stopRecording = useCallback(() => {
    clearTimer();
    if (mediaRecorderRef.current?.state === "recording") {
      mediaRecorderRef.current.stop();
    }
  }, [clearTimer]);

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
  }, []);

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
            size="sm"
            className="gap-2"
          >
            <Mic className="h-4 w-4 text-red-500" />
            Record
          </Button>
        )}

        {state === "recording" && (
          <>
            <div className="flex items-center gap-2">
              <span className="h-2.5 w-2.5 rounded-full bg-red-500 animate-pulse" />
              <span className="text-sm font-mono font-bold text-red-500">
                {formatTime(elapsed)}
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
