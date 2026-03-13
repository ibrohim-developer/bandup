'use client'

import { useEffect, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Loader2 } from 'lucide-react'

interface TelegramLoginWidgetProps {
  botName: string
}

declare global {
  interface Window {
    __onTelegramAuth?: (user: TelegramUser) => void
  }
}

interface TelegramUser {
  id: number
  first_name: string
  last_name?: string
  username?: string
  photo_url?: string
  auth_date: number
  hash: string
}

export function TelegramLoginWidget({ botName }: TelegramLoginWidgetProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const isConfigured = botName && botName !== 'YourBotName'

  useEffect(() => {
    if (!isConfigured) return
    // Define the global callback
    window.__onTelegramAuth = async (user: TelegramUser) => {
      setIsLoading(true)
      setError(null)

      try {
        const res = await fetch('/api/auth/telegram/widget', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(user),
        })

        if (res.ok) {
          router.push('/dashboard/reading')
        } else {
          const data = await res.json()
          setError(data.error || 'Telegram login failed')
          setIsLoading(false)
        }
      } catch {
        setError('Something went wrong. Please try again.')
        setIsLoading(false)
      }
    }

    // Inject Telegram widget script
    const container = containerRef.current
    if (!container) return

    const script = document.createElement('script')
    script.src = 'https://telegram.org/js/telegram-widget.js?22'
    script.async = true
    script.setAttribute('data-telegram-login', botName)
    script.setAttribute('data-size', 'large')
    script.setAttribute('data-onauth', '__onTelegramAuth(user)')
    script.setAttribute('data-request-access', 'write')
    container.appendChild(script)

    return () => {
      delete window.__onTelegramAuth
      if (container.contains(script)) {
        container.removeChild(script)
      }
    }
  }, [botName, router, isConfigured])

  if (!isConfigured) return null

  if (isLoading) {
    return (
      <div className="w-full flex items-center justify-center gap-3 px-4 py-3 border-2 border-[#54a9eb]/30 rounded-xl bg-card">
        <Loader2 className="h-4 w-4 animate-spin text-[#54a9eb]" />
        <span className="font-bold text-gray-800 dark:text-gray-100">Signing in with Telegram...</span>
      </div>
    )
  }

  return (
    <div className="space-y-2">
      <div ref={containerRef} className="flex justify-center [&>iframe]:!w-full" />
      {error && (
        <p className="text-sm text-destructive text-center">{error}</p>
      )}
    </div>
  )
}
