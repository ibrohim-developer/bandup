'use client'

import Link from '@/components/no-prefetch-link'
import { Menu, X } from 'lucide-react'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { useState } from 'react'

interface HeaderProps {
  isLoggedIn?: boolean
  userEmail?: string | null
  userAvatar?: string | null
  userName?: string | null
}

export function Header({ isLoggedIn = false, userEmail, userAvatar, userName }: HeaderProps) {
  const getInitials = () => {
    if (userName) {
      return userName.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
    }
    if (userEmail) {
      return userEmail.slice(0, 2).toUpperCase()
    }
    return 'U'
  }
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  return (
    <nav className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm border-b border-black">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          <Link href="/" className="flex items-center gap-2">
            <span className="text-2xl font-black tracking-tighter text-black">
              band<span className="text-primary">.</span>up
            </span>
          </Link>
          <div className="hidden md:flex items-center space-x-10 text-xs font-bold uppercase tracking-widest">
            <a className="hover:text-primary transition-colors" href="#features">Features</a>
            <a className="hover:text-primary transition-colors" href="#how-it-works">How it Works</a>
            <Link className="hover:text-primary transition-colors" href="/for-business">For Business</Link>
            {isLoggedIn ? (
              <div className="flex items-center gap-3">
                <Link
                  href="/dashboard/reading"
                  className="bg-primary text-white px-6 py-3 font-black hover:bg-primary/90 transition-all uppercase text-[11px] tracking-widest rounded-lg"
                >
                  Dashboard
                </Link>
                <Avatar className="h-8 w-8">
                  <AvatarImage src={userAvatar || undefined} alt={userName || userEmail || 'User'} />
                  <AvatarFallback className="text-xs">{getInitials()}</AvatarFallback>
                </Avatar>
              </div>
            ) : (
              <Link
                href="/dashboard/reading"
                className="bg-primary text-white px-6 py-3 font-black hover:bg-primary/90 transition-all uppercase text-[11px] tracking-widest rounded-lg"
              >
                Free Mock Test
              </Link>
            )}
          </div>

          <button
            className="md:hidden p-2"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {isMenuOpen && (
          <div className="md:hidden py-6 border-t border-black">
            <nav className="flex flex-col gap-6">
              <a className="text-xs font-bold uppercase tracking-widest hover:text-primary" href="#features">Features</a>
              <a className="text-xs font-bold uppercase tracking-widest hover:text-primary" href="#how-it-works">How it Works</a>
              <a className="text-xs font-bold uppercase tracking-widest hover:text-primary" href="#pricing">Pricing</a>
              <Link className="text-xs font-bold uppercase tracking-widest hover:text-primary" href="/for-business">For Business</Link>
              <div className="pt-4 border-t border-black">
                {isLoggedIn ? (
                  <div className="flex flex-col gap-3">
                    <div className="flex items-center gap-2">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={userAvatar || undefined} alt={userName || userEmail || 'User'} />
                        <AvatarFallback className="text-xs">{getInitials()}</AvatarFallback>
                      </Avatar>
                      <div className="flex flex-col text-xs">
                        <span className="font-bold">{userName || 'User'}</span>
                        <span className="text-neutral-500">{userEmail}</span>
                      </div>
                    </div>
                    <Link
                      href="/dashboard/reading"
                      className="bg-primary text-white px-6 py-3 font-black hover:bg-primary/90 transition-all uppercase text-[11px] tracking-widest rounded-lg text-center"
                    >
                      Dashboard
                    </Link>
                  </div>
                ) : (
                  <div className="flex flex-col gap-3">
                    <Link
                      href="/sign-in"
                      className="border border-black text-black hover:bg-neutral-50 px-6 py-3 font-black text-[11px] tracking-widest transition-all uppercase text-center rounded-lg"
                    >
                      Sign In
                    </Link>
                    <Link
                      href="/dashboard/reading"
                      className="bg-primary text-white px-6 py-3 font-black hover:bg-primary/90 transition-all uppercase text-[11px] tracking-widest rounded-lg text-center"
                    >
                      Free Mock Test
                    </Link>
                  </div>
                )}
              </div>
            </nav>
          </div>
        )}
      </div>
    </nav>
  )
}
