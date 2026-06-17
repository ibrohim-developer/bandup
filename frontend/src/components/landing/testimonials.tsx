type Testimonial = {
  name: string
  quote: string
}

const TESTIMONIALS: Testimonial[] = [
  {
    name: "Dilnoza R.",
    quote:
      "I used to pay $40 an hour for a speaking partner. With BandUp I practised every night and walked into the exam genuinely calm — and hit 7.5, half a band over my target.",
  },
  {
    name: "Jasur A.",
    quote:
      "The writing feedback is what changed everything. Getting examiner-style scoring in seconds meant I could actually rewrite and improve, not wait three days for a teacher.",
  },
  {
    name: "Madina K.",
    quote:
      "Speaking was my weakest skill. Recording answers at home, with nobody judging me, built my confidence faster than any course ever did.",
  },
  {
    name: "Sardor T.",
    quote:
      "I'm from Namangan, where good tutors are hard to find. BandUp gave me the same quality of practice as students in Tashkent — completely free.",
  },
  {
    name: "Aziza M.",
    quote:
      "The band estimate was scary-accurate. It predicted 7.5 and that's exactly what I scored on the real test.",
  },
  {
    name: "Bekzod S.",
    quote:
      "Two weeks before my exam I did a full mock every single day. Knowing my weak areas in advance is the only reason I passed.",
  },
  {
    name: "Nilufar O.",
    quote:
      "I honestly didn't believe free could be this good. The reading and listening tests feel identical to the real thing.",
  },
  {
    name: "Otabek N.",
    quote:
      "I went from 6.0 to 7.0 in six weeks just by following the feedback. No tutor, no expensive course — just consistent practice.",
  },
  {
    name: "Kamila E.",
    quote:
      "As a working mum I could only study after midnight. Having instant feedback at 1am, with no appointment, is what made my score possible.",
  },
]

const CHIP_PALETTE = [
  { bg: "#FDE7EE", fg: "#D11149" },
  { bg: "#FCEDEF", fg: "#A8123C" },
  { bg: "#FFEFE8", fg: "#C2410C" },
] as const

function initialsOf(name: string) {
  const parts = name.trim().split(" ")
  return (parts[0][0] + (parts[1]?.[0] ?? "")).toUpperCase()
}

type Card = Testimonial & { chip: (typeof CHIP_PALETTE)[number] }

// Stable chip color per testimonial, independent of which row it lands in.
const CARDS: Card[] = TESTIMONIALS.map((t, i) => ({
  ...t,
  chip: CHIP_PALETTE[i % CHIP_PALETTE.length],
}))

function TestimonialCard({ t }: { t: Card }) {
  const chip = t.chip
  return (
    <div className="flex w-[372px] shrink-0 flex-col gap-5 rounded-[20px] border border-[#ECECEE] bg-white p-7 shadow-[0_14px_32px_-26px_rgba(16,17,19,0.4)]">
      <div className="h-3.5 text-[34px] font-bold leading-[0.6] text-accent">&ldquo;</div>
      <p className="m-0 text-[15.5px] font-normal leading-[1.6] text-[#2C2F35]">
        {t.quote}
      </p>
      <div className="mt-auto flex items-center gap-[13px]">
        <div
          className="flex size-11 shrink-0 items-center justify-center rounded-xl text-sm font-semibold"
          style={{ background: chip.bg, color: chip.fg }}
        >
          {initialsOf(t.name)}
        </div>
        <span className="text-[15px] font-semibold text-[#101113]">{t.name}</span>
      </div>
    </div>
  )
}

function MarqueeLane({
  items,
  duration,
  direction,
}: {
  items: Card[]
  duration: string
  direction: "left" | "right"
}) {
  // Duplicate the set so the -50% keyframe loop is seamless. With all 9 cards
  // per lane, a single copy comfortably overflows even very wide screens, so
  // there's never a gap as the track scrolls.
  const loop = [...items, ...items]
  return (
    <div className="bu-marquee-lane">
      <div
        className="bu-marquee-track"
        data-dir={direction}
        style={{ "--bu-duration": duration } as React.CSSProperties}
      >
        {loop.map((t, i) => (
          <TestimonialCard key={`${t.name}-${i}`} t={t} />
        ))}
      </div>
    </div>
  )
}

export function Testimonials() {
  const row1 = CARDS
  // Second lane shows the same cards in a rotated order so it stays full while
  // looking different from the first lane.
  const row2 = [...CARDS.slice(5), ...CARDS.slice(0, 5)]

  return (
    <section className="overflow-hidden py-20 md:py-28">
      <div className="mx-auto mb-14 max-w-[720px] px-6 text-center">
        <p className="mb-4 text-[13px] font-semibold uppercase tracking-[0.14em] text-accent">
          Loved by test-takers
        </p>
        <h2 className="m-0 text-balance text-3xl font-bold leading-[1.08] tracking-[-0.02em] text-[#101113] md:text-[46px]">
          From their first mock to their dream band
        </h2>
        <p className="mx-auto mt-[18px] max-w-2xl text-pretty text-base leading-[1.5] text-[#5B5F66] md:text-lg">
          Real students, real results. Here is what the BandUp community is
          saying — in their own words.
        </p>
      </div>

      <div className="flex flex-col gap-5">
        <MarqueeLane items={row1} duration="64s" direction="left" />
        <MarqueeLane items={row2} duration="72s" direction="right" />
      </div>
    </section>
  )
}
