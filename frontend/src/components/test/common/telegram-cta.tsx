import { Button } from "@/components/ui/button";

function TelegramIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="currentColor" aria-hidden="true">
      <path d="M21.198 2.433a2.242 2.242 0 0 0-1.022.215l-16.376 6.95a1.108 1.108 0 0 0 .002 2.043l3.81 1.493 1.475 4.733a.985.985 0 0 0 1.692.396l2.227-2.1 4.13 3.043a1.108 1.108 0 0 0 1.737-.668l3.087-15.142a1.108 1.108 0 0 0-.762-1.236.83.83 0 0 0 0-.012zm-3.5 3.918-7.79 7.79-.293 3.39-1.21-3.88 9.293-7.3z" />
    </svg>
  );
}

export function TelegramCta() {
  return (
    <div className="mb-12 rounded-xl border border-border bg-[#229ED9]/5 px-6 py-10 md:px-12">
      <div className="flex flex-col items-center justify-center gap-5 text-center">
        <div className="flex h-14 w-14 items-center justify-center rounded-full bg-[#229ED9]/10">
          <TelegramIcon className="h-7 w-7 text-[#229ED9]" />
        </div>
        <p className="text-base md:text-xl font-bold uppercase tracking-tight">
          Join our Telegram for free IELTS tips, new tests, and updates
        </p>
        <Button
          asChild
          size="lg"
          className="flex items-center gap-3 px-8 md:px-12 py-6 rounded-xl font-bold text-sm tracking-widest uppercase bg-[#229ED9] text-white hover:bg-[#1c8cc0]"
        >
          <a href="https://t.me/bandup_ielts" target="_blank" rel="noopener noreferrer">
            <TelegramIcon className="h-5 w-5" />
            Join Channel
          </a>
        </Button>
      </div>
    </div>
  );
}
