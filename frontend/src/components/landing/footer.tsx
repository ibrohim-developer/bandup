"use client"

import Link from "next/link"

const footerLinks = {
  Product: [
    { label: "Features", href: "/#features" },
    { label: "Mock Exams", href: "/dashboard/full-mock-test" },
    { label: "AI Feedback", href: "/#ai-feedback" },
  ],
  Resources: [
    { label: "FAQ", href: "/#faq" },
    { label: "IELTS Tips", href: "/ielts-tips" },
    { label: "Terms of Service", href: "/terms" },
  ],
  Company: [
    { label: "About", href: "/about" },
    { label: "For Business", href: "/for-business" },
    { label: "Privacy Policy", href: "/privacy" },
  ],
}

export function LandingFooter() {
  return (
    <footer className="border-t border-border bg-card">
      <div className="mx-auto max-w-[1200px] px-6 py-16">
        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-5">
          {/* Brand */}
          <div className="lg:col-span-2">
            <Link href="/" className="flex items-center">
              <span className="text-xl font-bold tracking-tight text-foreground">
                BandUp
              </span>
            </Link>
            <p className="mt-4 max-w-sm text-sm leading-relaxed text-muted-foreground">
              AI-powered IELTS preparation platform. Practice all 4 modules and get your estimated band score in minutes.
            </p>
            <div className="mt-6 flex gap-4">
              {/* Social links */}
              <SocialLink label="Telegram" href="https://t.me/bandup_ielts">
                <svg viewBox="0 0 24 24" className="size-5 fill-current"><path d="M21.198 2.433a2.242 2.242 0 0 0-1.022.215l-16.376 6.95a1.108 1.108 0 0 0 .002 2.043l3.81 1.493 1.475 4.733a.985.985 0 0 0 1.692.396l2.227-2.1 4.13 3.043a1.108 1.108 0 0 0 1.737-.668l3.087-15.142a1.108 1.108 0 0 0-.762-1.236.83.83 0 0 0 0-.012zm-3.5 3.918-7.79 7.79-.293 3.39-1.21-3.88 9.293-7.3z"/></svg>
              </SocialLink>
              <SocialLink label="Instagram" href="https://instagram.com/bandupuz">
                <svg viewBox="0 0 24 24" className="size-5 fill-current"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/></svg>
              </SocialLink>
              {/* <SocialLink label="YouTube" href="https://youtube.com/@bandup">
                <svg viewBox="0 0 24 24" className="size-5 fill-current"><path d="M23.498 6.186a3.016 3.016 0 00-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 00.502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 002.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 002.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>
              </SocialLink> */}
            </div>
          </div>

          {/* Links */}
          {Object.entries(footerLinks).map(([category, links]) => (
            <div key={category}>
              <h4 className="text-sm font-semibold text-foreground">{category}</h4>
              <ul className="mt-4 flex flex-col gap-2.5">
                {links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom bar */}
        <div className="mt-12 border-t border-border pt-8">
          <p className="text-xs leading-relaxed text-muted-foreground">
            IELTS is a registered trademark of the British Council, IDP: IELTS Australia and Cambridge Assessment English. BandUp is not affiliated with or endorsed by these organizations.
          </p>
        </div>
      </div>
    </footer>
  )
}

function SocialLink({ label, href, children }: { label: string; href: string; children: React.ReactNode }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="flex size-9 items-center justify-center rounded-lg bg-secondary text-muted-foreground transition-colors hover:bg-accent/10 hover:text-accent"
      aria-label={label}
    >
      {children}
    </a>
  )
}
