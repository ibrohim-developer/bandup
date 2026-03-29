import { Star } from "lucide-react"

const testimonials = [
  {
    name: "Dilshod K.",
    location: "Tashkent, Uzbekistan",
    target: "7.0",
    achieved: "7.5",
    quote:
      "I improved my Writing score from 5.5 to 7.0 in just 6 weeks. The AI feedback on my essays was incredibly detailed and helped me understand exactly where I was losing marks.",
    avatar: "DK",
  },
  {
    name: "Madina R.",
    location: "Almaty, Kazakhstan",
    target: "6.5",
    achieved: "7.0",
    quote:
      "Being able to practice Speaking at any time was a game-changer. I used to be so nervous about speaking English, but BandUp helped me build real confidence.",
    avatar: "MR",
  },
  {
    name: "Sardor A.",
    location: "Samarkand, Uzbekistan",
    target: "7.0",
    achieved: "7.5",
    quote:
      "The full mock exams feel exactly like the real test. After taking 5 mock exams on BandUp, I walked into my actual IELTS test feeling completely prepared.",
    avatar: "SA",
  },
  {
    name: "Aisha T.",
    location: "Bishkek, Kyrgyzstan",
    target: "6.5",
    achieved: "7.0",
    quote:
      "Much better than any prep course I tried before. The instant feedback and progress tracking kept me motivated and focused on what mattered most.",
    avatar: "AT",
  },
]

export function Testimonials() {
  return (
    <section className="bg-secondary/50 py-20 md:py-28">
      <div className="mx-auto max-w-[1200px] px-6">
        <div className="text-center">
          <p className="text-sm font-semibold uppercase tracking-wider text-accent">
            Success Stories
          </p>
          <h2 className="mt-3 text-balance text-3xl font-bold tracking-tight text-foreground md:text-4xl">
            Trusted by students from 15+ countries
          </h2>
          <p className="mt-4 text-pretty text-muted-foreground md:text-lg">
            Real results from real IELTS test-takers
          </p>
        </div>

        <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {testimonials.map((t) => (
            <div
              key={t.name}
              className="flex flex-col rounded-xl border border-border bg-card p-6 transition-all hover:-translate-y-1 hover:shadow-md"
            >
              {/* Stars */}
              <div className="flex gap-0.5">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} className="size-4 fill-accent text-accent" />
                ))}
              </div>

              {/* Quote */}
              <p className="mt-4 flex-1 text-sm leading-relaxed text-muted-foreground">
                {`"${t.quote}"`}
              </p>

              {/* Score badge */}
              <div className="mt-4 flex items-center gap-2">
                <span className="rounded-full bg-secondary px-2.5 py-0.5 text-xs font-medium text-muted-foreground">
                  Target: {t.target}
                </span>
                <span className="rounded-full bg-accent/10 px-2.5 py-0.5 text-xs font-semibold text-accent">
                  Got: {t.achieved}
                </span>
              </div>

              {/* Author */}
              <div className="mt-4 flex items-center gap-3 border-t border-border pt-4">
                <div className="flex size-9 items-center justify-center rounded-full bg-foreground text-xs font-bold text-background">
                  {t.avatar}
                </div>
                <div>
                  <p className="text-sm font-semibold text-foreground">{t.name}</p>
                  <p className="text-xs text-muted-foreground">{t.location}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
