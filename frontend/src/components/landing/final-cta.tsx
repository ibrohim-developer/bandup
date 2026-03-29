import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"

export function FinalCTA() {
  return (
    <section className="py-20 md:py-28">
      <div className="mx-auto max-w-[1200px] px-6">
        <div className="relative overflow-hidden rounded-3xl bg-foreground px-8 py-16 text-center md:px-16 md:py-24">
          {/* Background decoration */}
          <div className="pointer-events-none absolute inset-0 overflow-hidden">
            <div className="absolute -top-20 -right-20 size-[300px] rounded-full bg-accent/10" />
            <div className="absolute -bottom-16 -left-16 size-[250px] rounded-full bg-accent/5" />
          </div>

          <div className="relative">
            <h2 className="mx-auto max-w-2xl text-balance text-3xl font-bold tracking-tight text-background md:text-5xl">
              Your Target Band Score Is Closer Than You Think
            </h2>
            <p className="mx-auto mt-5 max-w-xl text-pretty text-base leading-relaxed text-background/80 md:text-lg">
              Join thousands of students who have improved their IELTS scores with AI-powered practice. Start your free session today.
            </p>
            <div className="mt-10 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
              <Button
                asChild
                size="lg"
                className="h-12 rounded-full bg-accent px-8 text-base font-semibold text-accent-foreground shadow-lg shadow-accent/25 hover:bg-accent/90"
              >
                <Link href="/dashboard/reading">
                  Start Free Practice Now
                  <ArrowRight className="ml-1 size-4" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
