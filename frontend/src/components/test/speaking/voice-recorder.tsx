"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import { Mic, Square, Play, Pause, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";

interface VoiceRecorderProps {
  onRecordingComplete: (blob: Blob, durationSeconds: number) => void;
  onRecordingStateChange?: (recording: boolean) => void;
  disabled?: boolean;
}

export function VoiceRecorder({ onRecordingComplete, onRecordingStateChange, disabled }: VoiceRecorderProps) {
  const [state, setState] = useState<"idle" | "recording" | "recorded">("idle");
  const [elapsed, setElapsed] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const blobRef = useRef<Blob | null>(null);
  const startTimeRef = useRef(0);

  const clearTimer = useCallback(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  useEffect(() => {
    return () => {
      clearTimer();
      if (mediaRecorderRef.current?.state === "recording") {
        mediaRecorderRef.current.stop();
      }
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, [clearTimer]);

  const startRecording = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream, {
        mimeType: MediaRecorder.isTypeSupported("audio/webm;codecs=opus")
          ? "audio/webm;codecs=opus"
          : "audio/webm",
      });

      chunksRef.current = [];
      mediaRecorderRef.current = mediaRecorder;

      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) chunksRef.current.push(e.data);
      };

      mediaRecorder.onstop = () => {
        stream.getTracks().forEach((t) => t.stop());
        const blob = new Blob(chunksRef.current, { type: "audio/webm" });
        blobRef.current = blob;
        const duration = Math.round((Date.now() - startTimeRef.current) / 1000);
        setElapsed(duration);
        setState("recorded");
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
  }, [onRecordingComplete, onRecordingStateChange]);

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
  );
}
