"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from "@/components/ui/sheet"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Menu, ChevronUp } from "lucide-react"
import { cn } from "@/lib/utils"

const navLinks = [
  { label: "Features", href: "#features" },
  { label: "How It Works", href: "#how-it-works" },
  // { label: "Pricing", href: "#pricing" },
  { label: "FAQ", href: "#faq" },
  { label: "For Businesses", href: "/for-business" },
]

interface NavbarProps {
  isLoggedIn?: boolean
  userEmail?: string | null
  userAvatar?: string | null
  userName?: string | null
}

export function Navbar({ isLoggedIn = false, userEmail, userAvatar, userName }: NavbarProps) {
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)

  const getInitials = () => {
    if (userName) return userName.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2)
    if (userEmail) return userEmail.slice(0, 2).toUpperCase()
    return "U"
  }

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
        scrolled
          ? "bg-card/80 backdrop-blur-xl border-b border-border shadow-sm"
          : "bg-transparent"
      )}
    >
      <nav className="mx-auto flex max-w-[1200px] items-center justify-between px-6 py-4">
        <Link href="/" className="flex items-center gap-1.5">
          <div className="flex size-8 items-center justify-center rounded-lg bg-foreground">
            <ChevronUp className="size-5 text-background" strokeWidth={3} />
          </div>
          <span className="text-xl font-bold tracking-tight text-foreground">
            BandUp
          </span>
        </Link>

        <div className="hidden items-center gap-8 md:flex">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
            >
              {link.label}
            </Link>
          ))}
        </div>

        <div className="hidden items-center gap-3 md:flex">
          {isLoggedIn ? (
            <>
              <Button asChild size="default" className="rounded-full bg-accent px-5 font-semibold text-accent-foreground hover:bg-accent/90">
                <Link href="/dashboard/reading">Dashboard</Link>
              </Button>
              <Avatar className="size-8">
                <AvatarImage src={userAvatar || undefined} alt={userName || userEmail || "User"} />
                <AvatarFallback className="text-xs">{getInitials()}</AvatarFallback>
              </Avatar>
            </>
          ) : (
            <>
              <Button variant="ghost" size="sm" asChild>
                <Link href="/sign-in" className="text-muted-foreground">Sign In</Link>
              </Button>
              <Button asChild size="default" className="rounded-full bg-accent px-5 font-semibold text-accent-foreground hover:bg-accent/90">
                <Link href="/dashboard/reading">Start Free Practice</Link>
              </Button>
            </>
          )}
        </div>

        <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
          <SheetTrigger asChild className="md:hidden">
            <Button variant="ghost" size="icon">
              <Menu className="size-5" />
              <span className="sr-only">Open menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="right" className="w-[300px] bg-card">
            <SheetTitle className="sr-only">Navigation Menu</SheetTitle>
            <div className="flex flex-col gap-6 pt-8">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileOpen(false)}
                  className="text-lg font-medium text-foreground transition-colors hover:text-accent"
                >
                  {link.label}
                </Link>
              ))}
              <div className="flex flex-col gap-3 border-t border-border pt-4">
                {isLoggedIn ? (
                  <>
                    <div className="flex items-center gap-2 mb-2">
                      <Avatar className="size-8">
                        <AvatarImage src={userAvatar || undefined} alt={userName || userEmail || "User"} />
                        <AvatarFallback className="text-xs">{getInitials()}</AvatarFallback>
                      </Avatar>
                      <div className="flex flex-col text-xs">
                        <span className="font-bold">{userName || "User"}</span>
                        <span className="text-muted-foreground">{userEmail}</span>
                      </div>
                    </div>
                    <Button asChild className="w-full rounded-full bg-accent font-semibold text-accent-foreground hover:bg-accent/90">
                      <Link href="/dashboard/reading">Dashboard</Link>
                    </Button>
                  </>
                ) : (
                  <>
                    <Button asChild variant="outline" className="w-full rounded-full">
                      <Link href="/sign-in">Sign In</Link>
                    </Button>
                    <Button asChild className="w-full rounded-full bg-accent font-semibold text-accent-foreground hover:bg-accent/90">
                      <Link href="/dashboard/reading">Start Free Practice</Link>
                    </Button>
                  </>
                )}
              </div>
            </div>
          </SheetContent>
        </Sheet>
      </nav>
    </header>
  )
}
