"use client"

import { useRouter } from "next/navigation"

interface LoginRequiredLinkProps {
  href: string
  className?: string
  children: React.ReactNode
}

export function LoginRequiredLink({ href, className, children }: LoginRequiredLinkProps) {
  const router = useRouter()

  const handleClick = () => {
    // The JWT cookie is httpOnly so we can't check it from JS.
    // Just navigate — the middleware will redirect to /sign-in if not authenticated.
    router.push(href)
  }

  return (
    <button onClick={handleClick} className={className}>
      {children}
    </button>
  )
}
