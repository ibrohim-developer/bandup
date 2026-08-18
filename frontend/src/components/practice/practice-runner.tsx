"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import {
  Loader2,
  Mic,
  Square,
  Check,
  Headphones,
  Sparkles,
  MessageSquare,
  Clock,
  User,
  Lightbulb,
} from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { PremiumUpgradeDialog } from "@/components/premium-upgrade-dialog";
import { useUtteranceRecorder } from "@/hooks/use-utterance-recorder";
import { useSetPracticeQuota, type PracticeQuotaPayload } from "@/hooks/use-practice-quota";
import { formatPracticeTime, MIN_SECONDS_TO_START } from "@/lib/practice-limits";
import { pickFiller } from "@/lib/practice-fillers";
import { computeSessionStats, type SessionStats } from "@/lib/practice-stats";
import type { GrammarCorrection } from "@/lib/highlight-corrections";
import { MarkedTranscript } from "./marked-transcript";
import { CorrectionsPanel, type PanelCorrection } from "./corrections-panel";
import { difficultyMeta, DIFFICULTY_CHIP_BASE } from "./practice-ui";

export interface SessionPrompt {
  title: string;
  openingQuestion: string;
  difficulty: string;
  openingAudioUrl: string | null;
}

/** Below this many words, an answer gets a gentle "say more" nudge. */
const SHORT_ANSWER_WORDS = 25;

/**
 * Deterministic per-bar baseline for the mic waveform — a stable sine so bars
 * keep their relative shape while the live mic `level` scales the whole set.
 */
const WAVE_BARS = Array.from({ length: 28 }, (_, i) => 0.3 + 0.7 * Math.abs(Math.sin(i * 1.7)));

/**
 * Convert a `data:` URI to a blob object URL. A large data: URI (the reply
 * voice is ~1MB) fails in an <audio> element on Chrome with NotSupportedError
 * even when the bytes are a valid WAV; an object URL plays reliably.
 */
function dataUriToBlobUrl(dataUri: string): string | null {
  try {
    const comma = dataUri.indexOf(",");
    if (comma < 0) return null;
    const mime = /data:([^;]+)/.exec(dataUri.slice(0, comma))?.[1] ?? "audio/wav";
    const bin = atob(dataUri.slice(comma + 1));
    const bytes = new Uint8Array(bin.length);
    for (let i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i);
    return URL.createObjectURL(new Blob([bytes], { type: mime }));
  } catch {
    return null;
  }
}

interface FeedTurn {
  role: "assistant" | "user";
  text: string;
  corrections?: GrammarCorrection[];
}

/** One event from the streaming /api/practice/turn response (NDJSON). */
type TurnEvent =
  | { type: "transcript"; transcript: string; noSpeech?: boolean }
  | {
      type: "reply";
      reply?: string;
      corrections?: GrammarCorrection[];
      quota?: PracticeQuotaPayload;
      limitReached?: boolean;
    }
  | { type: "audio"; replyAudio?: { dataUri?: string } }
  | { type: "done"; quota?: PracticeQuotaPayload; limitReached?: boolean }
  | { type: "error"; error?: string };

const STATE_LABEL: Record<string, string> = {
  idle: "Not listening",
  listening: "Listening — just start talking",
  speaking: "Listening…",
  processing: "Thinking…",
  paused: "Speaking…",
};

interface SessionSummary extends SessionStats {
  spokenSeconds: number;
}

export function PracticeRunner({
  sessionId,
  prompt,
  initialQuota,
  onEnd,
}: {
  sessionId: string;
  prompt: SessionPrompt;
  initialQuota: PracticeQuotaPayload;
  onEnd: () => void;
}) {
  const [feed, setFeed] = useState<FeedTurn[]>([
    { role: "assistant", text: prompt.openingQuestion },
  ]);
  const [corrections, setCorrections] = useState<PanelCorrection[]>([]);
  const [remaining, setRemaining] = useState(initialQuota.remaining);
  const [ending, setEnding] = useState(false);
  const [summary, setSummary] = useState<SessionSummary | null>(null);

  const setPracticeQuota = useSetPracticeQuota();
  const feedEndRef = useRef<HTMLDivElement | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const turnRef = useRef(0);
  const lastFillerRef = useRef<number | null>(null);
  const finishingRef = useRef(false);
  // Mirrors of state the finish flow needs without re-creating callbacks.
  const feedRef = useRef<FeedTurn[]>([]);
  const remainingRef = useRef(initialQuota.remaining);
  // Recorder controls are needed inside onUtterance, which is itself a
  // dependency of the recorder — a ref breaks the cycle.
  const controlsRef = useRef<{
    suspend: () => void;
    resume: () => void;
    stop: () => void;
  } | null>(null);

  useEffect(() => {
    feedRef.current = feed;
  }, [feed]);
  useEffect(() => {
    remainingRef.current = remaining;
  }, [remaining]);

  /**
   * Play one clip; resolves when it ends. Mic suspension is handled at turn
   * level (one suspension covers filler + reply), not per clip.
   */
  const playAudio = useCallback(async (src: string, label = "audio") => {
    // Play big reply voices via a blob URL — see dataUriToBlobUrl.
    let playSrc = src;
    let objectUrl: string | null = null;
    if (src.startsWith("data:")) {
      const url = dataUriToBlobUrl(src);
      if (url) {
        objectUrl = url;
        playSrc = url;
      }
    }
    await new Promise<void>((resolve) => {
      const audio = new Audio(playSrc);
      audioRef.current = audio;
      audio.onended = () => resolve();
      audio.onerror = () => {
        console.error(`[practice] ${label} onerror`, audio.error?.code);
        resolve();
      };
      audio.play().catch((e) => {
        console.error(`[practice] ${label} play() rejected`, e?.name);
        resolve();
      });
    });
    if (objectUrl) URL.revokeObjectURL(objectUrl);
  }, []);

  /**
   * End the session and show the stats card. Every exit path (End button, 402,
   * limitReached) funnels through here; the guard makes repeats harmless.
   */
  const finishSession = useCallback(async () => {
    if (finishingRef.current) return;
    finishingRef.current = true;
    setEnding(true);
    audioRef.current?.pause();
    controlsRef.current?.stop();

    let spokenSeconds = 0;
    let stats: SessionStats;
    try {
      const res = await fetch("/api/practice/session", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sessionId }),
      });
      if (!res.ok) throw new Error(`end failed: ${res.status}`);
      const data = await res.json();
      spokenSeconds = data.spokenSeconds ?? 0;
      stats = computeSessionStats(data.transcript ?? [], spokenSeconds);
    } catch {
      // Best-effort fallback: the local feed mirrors the server transcript, and
      // the quota delta approximates billed seconds. The next session start
      // abandons the stale row server-side anyway.
      spokenSeconds = Math.max(0, initialQuota.remaining - remainingRef.current);
      stats = computeSessionStats(feedRef.current, spokenSeconds);
    }
    setSummary({ ...stats, spokenSeconds });
  }, [sessionId, initialQuota.remaining]);

  const handleUtterance = useCallback(
    async (blob: Blob, durationSeconds: number) => {
      // One suspension spans the whole turn — filler, round trip, and reply —
      // so the mic can never transcribe our own audio or open a second
      // concurrent turn while this one is in flight.
      controlsRef.current?.suspend();

      // The filler starts NOW, concurrent with the request: the learner hears
      // an acknowledgement within ~100ms instead of dead air.
      const filler = pickFiller(lastFillerRef.current);
      lastFillerRef.current = filler.index;
      const fillerDone = playAudio(filler.url);

      try {
        const form = new FormData();
        form.append("sessionId", sessionId);
        // Duration is passed for logging only — the server measures the audio
        // itself for metering and ignores anything we claim here.
        form.append("clientDuration", String(durationSeconds));
        form.append("audio", blob, "utterance.ogg");

        const res = await fetch("/api/practice/turn", { method: "POST", body: form });

        if (res.status === 402) {
          const body = await res.json();
          toast.error(body.error ?? "Daily practice limit reached.");
          setRemaining(0);
          await fillerDone;
          void finishSession();
          return;
        }
        if (!res.ok || !res.body) {
          toast.error("Couldn't process that. Try speaking again.");
          await fillerDone;
          return;
        }

        const applyQuota = (q?: PracticeQuotaPayload) => {
          if (!q) return;
          setRemaining(q.remaining);
          setPracticeQuota(q);
        };

        // The early no-speech guards reply with plain JSON, not a stream.
        if (!(res.headers.get("content-type") ?? "").includes("ndjson")) {
          const data = await res.json();
          applyQuota(data.quota);
          toast.info("I didn't catch that — try speaking a little louder.");
          await fillerDone;
          return;
        }

        // Stream: render each stage the moment it arrives. Transcript first,
        // then the reply text (what the learner reads), then the voice.
        const reader = res.body.getReader();
        const decoder = new TextDecoder();
        let buffer = "";
        let limitReached = false;

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          buffer += decoder.decode(value, { stream: true });

          let nl: number;
          while ((nl = buffer.indexOf("\n")) >= 0) {
            const line = buffer.slice(0, nl).trim();
            buffer = buffer.slice(nl + 1);
            if (!line) continue;
            let evt: TurnEvent;
            try {
              evt = JSON.parse(line) as TurnEvent;
            } catch (e) {
              console.error("[practice] bad event line, len=", line.length, e);
              continue;
            }
            if (evt.type === "transcript") {
              if (evt.noSpeech) {
                toast.info("I didn't catch that — try speaking a little louder.");
              } else {
                turnRef.current += 1;
                setFeed((f) => [...f, { role: "user", text: evt.transcript, corrections: [] }]);
                // Nudge toward longer answers — each prompt is meant to pull a
                // minute or two of continuous speech.
                const words = String(evt.transcript).trim().split(/\s+/).filter(Boolean).length;
                if (words > 0 && words < SHORT_ANSWER_WORDS) {
                  toast.info(
                    "Try to say more — give reasons, examples and details. Aim for a good minute of speaking per question."
                  );
                }
              }
            } else if (evt.type === "reply") {
              applyQuota(evt.quota);
              limitReached = !!evt.limitReached;
              const turn = turnRef.current;
              const replyText = evt.reply as string | undefined;
              const corr = (evt.corrections ?? []) as GrammarCorrection[];
              setFeed((f) => {
                // Attach corrections to the most recent learner turn, then
                // append the assistant's reply — one atomic update, no stale
                // index across the async stream.
                const next = f.slice();
                for (let i = next.length - 1; i >= 0; i--) {
                  if (next[i].role === "user") {
                    next[i] = { ...next[i], corrections: corr };
                    break;
                  }
                }
                return replyText ? [...next, { role: "assistant", text: replyText }] : next;
              });
              if (corr.length) {
                setCorrections((c) => [...c, ...corr.map((x) => ({ ...x, turn }))]);
              }
            } else if (evt.type === "audio") {
              // Let the filler finish before the real voice — the same voice
              // overlapping itself is worse than a beat of silence.
              await fillerDone;
              if (evt.replyAudio?.dataUri) await playAudio(evt.replyAudio.dataUri, "reply");
            } else if (evt.type === "error") {
              toast.error("Couldn't process that. Try speaking again.");
            } else if (evt.type === "done") {
              applyQuota(evt.quota);
              limitReached = !!evt.limitReached;
            }
          }
        }

        // Ensure the filler has finished before the mic reopens, even when no
        // audio event arrived (e.g. voice synthesis failed).
        await fillerDone;

        if (limitReached) {
          toast.info("That's your practice time for today. Nice work.");
          void finishSession();
        }
      } catch {
        toast.error("Couldn't process that. Check your connection and try again.");
      } finally {
        if (!finishingRef.current) controlsRef.current?.resume();
      }
    },
    [sessionId, playAudio, finishSession, setPracticeQuota]
  );

  const { state, level, start, stop, finishTurn, suspend, resume } = useUtteranceRecorder({
    onUtterance: handleUtterance,
    onError: (message) => toast.error(message),
  });

  useEffect(() => {
    controlsRef.current = { suspend, resume, stop };
  }, [suspend, resume, stop]);

  // Open the mic and play the opening question once, on mount. Fillers never
  // fire here — they only accompany a learner utterance.
  const startedRef = useRef(false);
  useEffect(() => {
    if (startedRef.current) return;
    startedRef.current = true;
    void (async () => {
      await start();
      if (prompt.openingAudioUrl) {
        controlsRef.current?.suspend();
        try {
          await playAudio(prompt.openingAudioUrl);
        } finally {
          if (!finishingRef.current) controlsRef.current?.resume();
        }
      }
    })();
  }, [start, playAudio, prompt.openingAudioUrl]);

  useEffect(() => {
    return () => {
      audioRef.current?.pause();
      audioRef.current = null;
    };
  }, []);

  useEffect(() => {
    feedEndRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [feed]);

  if (summary) {
    const outOfTime = remaining < MIN_SECONDS_TO_START;
    return (
      <div className="mx-auto max-w-md space-y-5 rounded-xl border bg-card p-8 text-center">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-primary/10">
          <Sparkles className="h-7 w-7 text-primary" />
        </div>
        <div>
          <h1 className="text-xl font-bold">Nice session!</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Here&apos;s how you did on &ldquo;{prompt.title}&rdquo;.
          </p>
        </div>

        <div className="grid grid-cols-3 gap-2">
          {[
            { value: formatPracticeTime(summary.spokenSeconds), label: "spoken" },
            { value: String(summary.totalWords), label: "words" },
            { value: String(summary.wpm), label: "words/min" },
            { value: String(summary.correctionCount), label: "corrections" },
            { value: String(summary.longestTurnWords), label: "longest answer" },
            { value: String(summary.fillerCount), label: "um's & uh's" },
          ].map((tile) => (
            <div key={tile.label} className="rounded-xl border bg-muted/30 px-2 py-3">
              <p className="text-lg font-bold">{tile.value}</p>
              <p className="text-[11px] text-muted-foreground">{tile.label}</p>
            </div>
          ))}
        </div>

        <p className="text-sm text-muted-foreground">
          {formatPracticeTime(remaining)} of practice left today
        </p>

        {!initialQuota.premium && outOfTime ? (
          <>
            <PremiumUpgradeDialog
              variant="energy"
              trigger={<Button className="w-full">Get more practice time</Button>}
            />
            <Button variant="ghost" className="w-full" onClick={onEnd}>
              Back to topics
            </Button>
          </>
        ) : (
          <Button className="w-full" onClick={onEnd}>
            Back to topics
          </Button>
        )}
      </div>
    );
  }

  const isBusy = state === "processing";
  const isListening = state === "speaking";
  const meta = difficultyMeta(prompt.difficulty);

  return (
    <div className="grid gap-4 lg:grid-cols-[1fr_21rem]">
      <div className="flex min-w-0 flex-col rounded-2xl border bg-card">
        {/* Header — icon tile, title, difficulty + inline time, End session */}
        <div className="flex items-center justify-between gap-3 border-b px-4 py-3.5 sm:px-6">
          <div className="flex min-w-0 items-center gap-3">
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <MessageSquare className="h-5 w-5" />
            </span>
            <div className="min-w-0">
              <h1 className="truncate text-base font-bold leading-tight sm:text-lg">
                {prompt.title}
              </h1>
              <div className="mt-1 flex flex-wrap items-center gap-x-2.5 gap-y-1">
                <span className={cn(DIFFICULTY_CHIP_BASE, meta.badge)}>{meta.label}</span>
                <span className="inline-flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
                  <Clock className="h-3.5 w-3.5" />
                  {formatPracticeTime(remaining)} left today
                </span>
              </div>
            </div>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={finishSession}
            disabled={ending}
            className="shrink-0 gap-2 border-primary/30 text-primary hover:bg-primary/5 hover:text-primary"
          >
            {ending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Square className="h-4 w-4" />}
            <span className="hidden sm:inline">End session</span>
            <span className="sm:hidden">End</span>
          </Button>
        </div>

        {/* Centered chat column */}
        <div className="min-h-[22rem] max-h-[56vh] flex-1 overflow-y-auto px-4 py-5 sm:px-6">
          <div className="mx-auto flex max-w-2xl flex-col gap-4">
            <div className="flex justify-center">
              <span className="inline-flex items-center gap-2 rounded-full border bg-muted/40 px-3.5 py-1.5 text-center text-xs text-muted-foreground">
                <Lightbulb className="h-3.5 w-3.5 shrink-0 text-amber-500" />
                Treat each question like a mini-speech — keep talking for a minute or two.
              </span>
            </div>

            {feed.map((turn, i) =>
              turn.role === "assistant" ? (
                <div key={i} className="flex items-start gap-2.5">
                  <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-violet-500/15 text-[10px] font-extrabold text-violet-600 dark:text-violet-300">
                    AI
                  </span>
                  <div className="max-w-[85%] rounded-2xl rounded-tl-sm bg-muted px-4 py-2.5 text-sm leading-relaxed">
                    {turn.text}
                  </div>
                </div>
              ) : (
                <div key={i} className="flex flex-row-reverse items-start gap-2.5">
                  <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-emerald-500/15 text-emerald-600 dark:text-emerald-300">
                    <User className="h-4 w-4" />
                  </span>
                  <div className="max-w-[85%] rounded-2xl rounded-tr-sm border border-primary/20 bg-primary/10 px-4 py-2.5 text-sm leading-relaxed">
                    <MarkedTranscript text={turn.text} corrections={turn.corrections} />
                  </div>
                </div>
              )
            )}
            <div ref={feedEndRef} />
          </div>
        </div>

        {/* Active mic bar */}
        <div className="border-t px-4 py-4 sm:px-6">
          <div className="mx-auto max-w-2xl">
            <div
              className={cn(
                "flex items-center gap-3 rounded-2xl border bg-background px-3 py-3 transition-all",
                isListening && "border-primary ring-4 ring-primary/10"
              )}
            >
              <div
                className={cn(
                  "flex h-11 w-11 shrink-0 items-center justify-center rounded-xl transition-colors",
                  isListening ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
                )}
              >
                {isBusy ? (
                  <Loader2 className="h-5 w-5 animate-spin" />
                ) : state === "paused" ? (
                  <Headphones className="h-5 w-5" />
                ) : (
                  <Mic className="h-5 w-5" />
                )}
              </div>

              <div className="flex h-6 flex-1 items-center justify-between overflow-hidden">
                {WAVE_BARS.map((base, i) => {
                  const height = isListening
                    ? Math.min(1, base * (0.45 + level * 1.6))
                    : isBusy
                      ? 0.3
                      : 0.16;
                  return (
                    <span
                      key={i}
                      className={cn(
                        "w-[3px] shrink-0 rounded-full transition-colors",
                        isListening ? "bg-primary" : "bg-muted-foreground/30"
                      )}
                      style={{ height: `${Math.round(height * 100)}%` }}
                    />
                  );
                })}
              </div>

              <span
                className={cn(
                  "shrink-0 pr-1 text-sm font-semibold",
                  isListening ? "text-primary" : "text-muted-foreground"
                )}
              >
                {STATE_LABEL[state] ?? ""}
              </span>

              {/* Escape hatch for when the VAD hasn't noticed the learner finished. */}
              {isListening && (
                <Button size="sm" variant="secondary" onClick={finishTurn} className="shrink-0 gap-1.5">
                  <Check className="h-4 w-4" />
                  Done
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>

      <CorrectionsPanel corrections={corrections} />
    </div>
  );
}
