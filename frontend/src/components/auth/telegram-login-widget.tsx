'use client'

import { useEffect, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Loader2 } from 'lucide-react'

interface TelegramLoginWidgetProps {
  botName: string
}

declare global {
  interface Window {
    onTelegramAuth: (user: Record<string, string | number>) => void
  }
}

export function TelegramLoginWidget({ botName }: TelegramLoginWidgetProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  useEffect(() => {
    // Define the callback that Telegram widget calls
    window.onTelegramAuth = async (user) => {
      setIsLoading(true)
      setError(null)

      try {
        const response = await fetch('/api/auth/telegram/widget', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(user),
        })

        const data = await response.json()

        if (!response.ok || !data.token_hash) {
          setError(data.error || 'Failed to sign in with Telegram')
          setIsLoading(false)
          return
        }

        const supabase = createClient()
        const { error: otpError } = await supabase.auth.verifyOtp({
          token_hash: data.token_hash,
          type: 'magiclink',
        })

        if (otpError) {
          setError(otpError.message)
          setIsLoading(false)
          return
        }

        router.push('/dashboard')
      } catch {
        setError('Something went wrong. Please try again.')
        setIsLoading(false)
      }
    }

    // Load the Telegram widget script
    if (containerRef.current) {
      containerRef.current.innerHTML = ''
      const script = document.createElement('script')
      script.src = 'https://telegram.org/js/telegram-widget.js?22'
      script.setAttribute('data-telegram-login', botName)
      script.setAttribute('data-size', 'large')
      script.setAttribute('data-onauth', 'onTelegramAuth(user)')
      script.setAttribute('data-request-access', 'write')
      script.async = true
      containerRef.current.appendChild(script)
    }
  }, [botName, router])

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-3">
        <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
        <span className="ml-2 text-sm text-muted-foreground">Signing in with Telegram...</span>
      </div>
    )
  }

  return (
    <div>
      {error && (
        <div className="p-3 rounded-lg bg-destructive/10 text-destructive text-sm mb-2">
          {error}
        </div>
      )}
      <div ref={containerRef} className="flex justify-center" />
    </div>
  )
}
