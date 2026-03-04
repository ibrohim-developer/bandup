import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Link from "@/components/no-prefetch-link";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ArrowLeft, Award, Clock, Star } from "lucide-react";
import { examiners } from "@/lib/data/examiners";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ examinerId: string }>;
}): Promise<Metadata> {
  const { examinerId } = await params;
  const examiner = examiners.find((e) => e.id === examinerId);
  if (!examiner) return { title: "Examiner Not Found" };

  return {
    title: `Book a Speaking Mock Exam with ${examiner.name}`,
    description: examiner.bio,
  };
}

export default async function ExaminerPage({
  params,
}: {
  params: Promise<{ examinerId: string }>;
}) {
  const { examinerId } = await params;
  const examiner = examiners.find((e) => e.id === examinerId);
  if (!examiner) notFound();

  return (
    <div className="space-y-6 md:space-y-8 pb-12 max-w-2xl mx-auto">
      <Link
        href="/dashboard/speaking/mock-exam"
        className="inline-flex items-center gap-2 text-xs font-bold text-muted-foreground hover:text-foreground transition-colors"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Examiners
      </Link>

      <div className="bg-card border border-border p-6 md:p-8 rounded-xl flex flex-col items-center text-center gap-6">
        <Avatar className="h-24 w-24">
          <AvatarImage src={examiner.image} alt={examiner.name} />
          <AvatarFallback className="bg-muted text-muted-foreground font-bold text-xl">
            {examiner.name
              .split(" ")
              .map((n) => n[0])
              .join("")}
          </AvatarFallback>
        </Avatar>

        <div className="space-y-2">
          <h2 className="text-2xl md:text-3xl font-black">{examiner.name}</h2>
          <p className="text-sm text-muted-foreground max-w-md">
            {examiner.bio}
          </p>
        </div>

        <div className="flex items-center gap-4 text-sm font-bold">
          <span className="bg-primary/10 text-primary px-3 py-1.5 rounded-lg">
            IELTS {examiner.ieltsOverall}
          </span>
          <span className="bg-primary/10 text-primary px-3 py-1.5 rounded-lg">
            Speaking {examiner.speakingScore}
          </span>
        </div>

        <div className="w-full border-t border-border pt-6 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm">
            <div className="flex flex-col items-center gap-2 p-3 rounded-lg bg-muted/50">
              <Clock className="h-5 w-5 text-muted-foreground" />
              <span className="font-bold">{examiner.experience}</span>
              <span className="text-xs text-muted-foreground">Experience</span>
            </div>
            <div className="flex flex-col items-center gap-2 p-3 rounded-lg bg-muted/50">
              <Award className="h-5 w-5 text-muted-foreground" />
              <span className="font-bold">{examiner.ieltsOverall}</span>
              <span className="text-xs text-muted-foreground">
                Overall Band
              </span>
            </div>
            <div className="flex flex-col items-center gap-2 p-3 rounded-lg bg-muted/50">
              <Star className="h-5 w-5 text-muted-foreground" />
              <span className="font-bold">{examiner.speakingScore}</span>
              <span className="text-xs text-muted-foreground">
                Speaking Band
              </span>
            </div>
          </div>

          <div className="text-left space-y-2">
            <h4 className="text-sm font-bold uppercase tracking-widest text-muted-foreground">
              Specialties
            </h4>
            <div className="flex flex-wrap gap-2">
              {examiner.specialties.map((specialty) => (
                <span
                  key={specialty}
                  className="bg-muted px-3 py-1 rounded-full text-xs font-bold"
                >
                  {specialty}
                </span>
              ))}
            </div>
          </div>
        </div>

        <button className="bg-primary text-primary-foreground px-8 py-3 rounded-lg font-black text-xs tracking-widest hover:opacity-90 transition-all uppercase w-full sm:w-auto">
          Book a Session
        </button>
      </div>
    </div>
  );
}
