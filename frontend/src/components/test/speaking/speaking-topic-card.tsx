import Link from "next/link";
import { Clock, MessageSquare, Mic } from "lucide-react";
import { DifficultyDots } from "@/components/test/common/difficulty-dots";

export interface SpeakingTopicItem {
  id: string;
  testId: string;
  title: string;
  topic: string;
  partNumber: number;
  preparationTime: number;
  speakingTime: number;
  difficulty: string;
  questions: unknown;
}

export function SpeakingTopicCard({ topic }: { topic: SpeakingTopicItem }) {
  const questionCount = Array.isArray(topic.questions)
    ? topic.questions.length
    : 0;

  return (
    <div className="bg-card border border-border p-4 md:p-6 rounded-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-3 mb-1 md:mb-2">
          <h3 className="text-lg md:text-xl font-bold truncate">
            {topic.topic}
          </h3>
        </div>
        <p className="text-[11px] text-muted-foreground font-bold uppercase mb-3 md:mb-4">
          Part {topic.partNumber} - {topic.title}
        </p>
        <div className="flex items-center gap-4 md:gap-6 text-xs font-bold text-muted-foreground">
          <DifficultyDots difficulty={topic.difficulty} />
          <span className="flex items-center gap-1.5">
            <Clock className="h-4 w-4" />
            {Math.round(topic.speakingTime / 60)} mins
          </span>
          {questionCount > 0 && (
            <span className="flex items-center gap-1.5">
              <MessageSquare className="h-4 w-4" />
              {questionCount} questions
            </span>
          )}
        </div>
      </div>
      <div className="flex items-center gap-2">
        <span className="bg-primary/10 text-primary px-3 py-1.5 rounded-lg font-black text-xs tracking-widest uppercase">
          Part {topic.partNumber}
        </span>
        <Link
          href={`/dashboard/speaking/${topic.id}`}
          className="flex items-center gap-1.5 bg-primary text-primary-foreground px-4 py-1.5 rounded-lg font-bold text-xs tracking-widest uppercase hover:bg-primary/90 transition-colors"
        >
          <Mic className="h-3.5 w-3.5" />
          Practice
        </Link>
      </div>
    </div>
  );
}
