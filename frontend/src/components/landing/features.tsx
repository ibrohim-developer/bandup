"use client"

import { useState } from "react"
import { Mic, PenLine, BookOpen, Headphones, Trophy, CheckCircle2 } from "lucide-react"
import { cn } from "@/lib/utils"

const modules = [
  {
    id: "speaking",
    icon: Mic,
    label: "Speaking",
    headline: "Speak naturally, get evaluated instantly",
    description:
      "Our AI analyzes your fluency, pronunciation, vocabulary range, and coherence in real-time. Get detailed band score feedback for each criterion just like the real exam.",
    features: [
      "Real-time pronunciation analysis",
      "Fluency & coherence scoring",
      "Vocabulary range assessment",
      "Grammatical accuracy feedback",
    ],
    preview: {
      title: "Speaking Band Score",
      scores: [
        { label: "Fluency & Coherence", score: 7.0 },
        { label: "Lexical Resource", score: 6.5 },
        { label: "Grammar Range", score: 7.0 },
        { label: "Pronunciation", score: 6.5 },
      ],
      overall: 6.5,
    },
  },
  {
    id: "writing",
    icon: PenLine,
    label: "Writing",
    headline: "Submit Task 1 & Task 2, get detailed feedback",
    description:
      "AI evaluates your writing across all four IELTS criteria. Receive highlighted corrections, improvement suggestions, and a precise band score prediction.",
    features: [
      "Task Achievement analysis",
      "Coherence & Cohesion review",
      "Lexical Resource evaluation",
      "Grammatical Range & Accuracy",
    ],
    preview: {
      title: "Writing Band Score",
      scores: [
        { label: "Task Achievement", score: 7.0 },
        { label: "Coherence & Cohesion", score: 6.5 },
        { label: "Lexical Resource", score: 7.0 },
        { label: "Grammar Range", score: 6.0 },
      ],
      overall: 6.5,
    },
  },
  {
    id: "reading",
    icon: BookOpen,
    label: "Reading",
    headline: "Practice with real-format passages and questions",
    description:
      "Train with authentic IELTS-style reading passages. Timed practice sessions with multiple question types and instant scoring after every attempt.",
    features: [
      "Authentic passage formats",
      "Timed practice mode",
      "Multiple question types",
      "Instant auto-grading",
    ],
    preview: {
      title: "Reading Band Score",
      scores: [
        { label: "True/False/NG", score: 8.0 },
        { label: "Matching Headings", score: 7.0 },
        { label: "Fill in Blanks", score: 7.5 },
        { label: "Multiple Choice", score: 7.0 },
      ],
      overall: 7.5,
    },
  },
  {
    id: "listening",
    icon: Headphones,
    label: "Listening",
    headline: "Train your ear with exam-style audio",
    description:
      "Practice with realistic IELTS listening recordings. Multiple question types are auto-graded so you can focus on improving your listening comprehension.",
    features: [
      "Exam-style audio recordings",
      "All question types covered",
      "Auto-graded answers",
      "Playback speed control",
    ],
    preview: {
      title: "Listening Band Score",
      scores: [
        { label: "Section 1", score: 8.0 },
        { label: "Section 2", score: 7.5 },
        { label: "Section 3", score: 7.0 },
        { label: "Section 4", score: 6.5 },
      ],
      overall: 7.0,
    },
  },
  {
    id: "mock",
    icon: Trophy,
    label: "Full Mock Exam",
    headline: "Take a complete mock exam under real conditions",
    description:
      "Experience the full IELTS exam with all 4 modules timed exactly like the real test. Get a comprehensive overall band score prediction and detailed performance analysis.",
    features: [
      "All 4 modules in one session",
      "Real exam timing conditions",
      "Overall band score prediction",
      "Comprehensive results dashboard",
    ],
    preview: {
      title: "Overall Band Score",
      scores: [
        { label: "Listening", score: 7.0 },
        { label: "Reading", score: 7.5 },
        { label: "Writing", score: 6.5 },
        { label: "Speaking", score: 6.5 },
      ],
      overall: 7.0,
    },
  },
]

export function Features() {
  const [active, setActive] = useState("speaking")
  const activeModule = modules.find((m) => m.id === active)!

  return (
    <section id="features" className="bg-secondary/50 py-20 md:py-28">
      <div className="mx-auto max-w-[1200px] px-6">
        <div className="text-center">
          <p className="text-sm font-semibold uppercase tracking-wider text-accent">
            Modules
          </p>
          <h2 className="mt-3 text-balance text-3xl font-bold tracking-tight text-foreground md:text-4xl">
            Practice every IELTS module
          </h2>
          <p className="mt-4 text-pretty text-muted-foreground md:text-lg">
            Comprehensive preparation covering all four skills plus full mock exams
          </p>
        </div>

        {/* Module Tabs */}
        <div className="mt-12 flex flex-wrap items-center justify-center gap-2">
          {modules.map((mod) => (
            <button
              key={mod.id}
              onClick={() => setActive(mod.id)}
              className={cn(
                "flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-medium transition-all",
                active === mod.id
                  ? "bg-foreground text-background shadow-md"
                  : "bg-card text-muted-foreground border border-border hover:bg-secondary hover:text-foreground"
              )}
            >
              <mod.icon className="size-4" />
              <span className="hidden sm:inline">{mod.label}</span>
            </button>
          ))}
        </div>

        {/* Active Module Content */}
        <div className="mt-12 grid items-center gap-10 lg:grid-cols-2">
          {/* Left: Description */}
          <div>
            <div className="flex items-center gap-3">
              <div className="flex size-10 items-center justify-center rounded-lg bg-accent/10">
                <activeModule.icon className="size-5 text-accent" />
              </div>
              <span className="text-sm font-semibold uppercase tracking-wider text-accent">
                {activeModule.label}
              </span>
            </div>
            <h3 className="mt-5 text-2xl font-bold text-foreground md:text-3xl">
              {activeModule.headline}
            </h3>
            <p className="mt-4 leading-relaxed text-muted-foreground">
              {activeModule.description}
            </p>
            <ul className="mt-6 flex flex-col gap-3">
              {activeModule.features.map((f) => (
                <li key={f} className="flex items-center gap-3 text-sm text-foreground">
                  <CheckCircle2 className="size-4 shrink-0 text-accent" />
                  {f}
                </li>
              ))}
            </ul>
          </div>

          {/* Right: Score Preview Card */}
          <div className="rounded-2xl border border-border bg-card p-6 shadow-lg md:p-8">
            <div className="mb-6 flex items-center justify-between">
              <h4 className="font-semibold text-foreground">{activeModule.preview.title}</h4>
              <div className="flex size-14 items-center justify-center rounded-xl bg-accent/10">
                <span className="text-2xl font-bold text-accent">
                  {activeModule.preview.overall}
                </span>
              </div>
            </div>
            <div className="flex flex-col gap-4">
              {activeModule.preview.scores.map((s) => (
                <div key={s.label}>
                  <div className="mb-1.5 flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">{s.label}</span>
                    <span className="font-semibold text-foreground">{s.score}</span>
                  </div>
                  <div className="h-2 overflow-hidden rounded-full bg-secondary">
                    <div
                      className="h-full rounded-full bg-accent transition-all duration-500"
                      style={{ width: `${(s.score / 9) * 100}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
