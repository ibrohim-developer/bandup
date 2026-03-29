'use client'

import Link from 'next/link'
import { ChevronUp, ArrowLeft } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { useState, useEffect } from 'react'

export function ForBusinessNavbar() {
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const scrollToForm = () => {
    document.getElementById('application-form')?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <header
      className={cn(
        'fixed top-0 left-0 right-0 z-50 transition-all duration-300',
        scrolled
          ? 'bg-card/80 backdrop-blur-xl border-b border-border shadow-sm'
          : 'bg-transparent'
      )}
    >
      <nav className="mx-auto flex max-w-[1200px] items-center justify-between px-6 py-4">
        <div className="flex items-center gap-6">
          <Link href="/" className="flex items-center gap-1.5">
            <div className="flex size-8 items-center justify-center rounded-lg bg-foreground">
              <ChevronUp className="size-5 text-background" strokeWidth={3} />
            </div>
            <span className="text-xl font-bold tracking-tight text-foreground">BandUp</span>
          </Link>
        </div>

        <Button
          onClick={scrollToForm}
          className="rounded-full bg-accent px-5 font-semibold text-accent-foreground hover:bg-accent/90"
        >
          Apply Now
        </Button>
      </nav>
    </header>
  )
}
