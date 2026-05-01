'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Loader2, Send } from 'lucide-react'

const BOT_USERNAME = process.env.NEXT_PUBLIC_TELEGRAM_BOT_NAME || 'bandupuz_bot'
const BOT_LINK = `https://t.me/${BOT_USERNAME}?start=auth`

interface Props {
  redirectTo?: string | null
}

export function TelegramTab({ redirectTo }: Props) {
  const router = useRouter()
  const [code, setCode] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (code.length !== 6) return

    setError(null)
    setIsLoading(true)

    try {
      const res = await fetch('/api/auth/telegram/verify-code', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code }),
      })
      const data = await res.json()
      if (!res.ok) {
        setError(data.error || 'Verification failed')
        setIsLoading(false)
        return
      }
      router.push(redirectTo || '/dashboard')
      router.refresh()
    } catch {
      setError('Something went wrong')
      setIsLoading(false)
    }
  }

  return (
    <div className="space-y-4 mt-4">
      <div className="rounded-xl border border-gray-200 dark:border-gray-700 p-4 bg-gray-50 dark:bg-gray-900/40">
        <ol className="space-y-2 text-sm text-gray-700 dark:text-gray-300">
          <li>
            <span className="font-bold text-gray-900 dark:text-white">1.</span>{' '}
            Open the Telegram bot and tap <span className="font-bold">Start</span>.
          </li>
          <li>
            <span className="font-bold text-gray-900 dark:text-white">2.</span>{' '}
            Copy the 6-digit code the bot sends you.
          </li>
          <li>
            <span className="font-bold text-gray-900 dark:text-white">3.</span>{' '}
            Paste it below and tap Continue.
          </li>
        </ol>
        <a
          href={BOT_LINK}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-3 w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-[#229ED9] hover:bg-[#1c8dc4] text-white font-bold rounded-lg transition-colors"
        >
          <Send className="w-4 h-4" />
          Open Telegram bot
        </a>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <div className="p-3 rounded-xl bg-destructive/10 text-destructive text-sm">
            {error}
          </div>
        )}

        <div>
          <label htmlFor="tg-code" className="block text-[11px] font-bold uppercase tracking-wider text-gray-500 mb-1.5 dark:text-gray-400">
            6-digit code
          </label>
          <Input
            id="tg-code"
            type="text"
            inputMode="numeric"
            pattern="[0-9]{6}"
            maxLength={6}
            placeholder="000000"
            value={code}
            onChange={(e) => setCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
            required
            disabled={isLoading}
            className="px-4 py-3 h-auto rounded-xl border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-primary focus:border-transparent text-center text-2xl font-mono tracking-[0.5em]"
          />
        </div>

        <Button
          type="submit"
          disabled={isLoading || code.length !== 6}
          className="w-full py-4 h-auto rounded-xl font-bold shadow-xl shadow-primary/20 active:scale-[0.98] transition-all"
        >
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Verifying...
            </>
          ) : (
            'Continue'
          )}
        </Button>
      </form>
    </div>
  )
}
