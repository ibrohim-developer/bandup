'use client'

import { useRef, useState, useCallback, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Loader2, Send } from 'lucide-react'

const BOT_USERNAME = process.env.NEXT_PUBLIC_TELEGRAM_BOT_NAME || 'bandupuz_bot'
const BOT_LINK = `https://t.me/${BOT_USERNAME}?start=auth`
const LENGTH = 6

interface Props {
  redirectTo?: string | null
}

export function TelegramTab({ redirectTo }: Props) {
  const router = useRouter()
  const [digits, setDigits] = useState<string[]>(Array(LENGTH).fill(''))
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const inputs = useRef<Array<HTMLInputElement | null>>([])

  const code = digits.join('')

  const focus = (i: number) => inputs.current[i]?.focus()

  const updateDigit = useCallback((i: number, val: string) => {
    setDigits((prev) => {
      const next = [...prev]
      next[i] = val
      return next
    })
  }, [])

  const handleChange = (i: number, e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value.replace(/\D/g, '')
    if (!raw) {
      updateDigit(i, '')
      return
    }
    // Handle paste: distribute chars across boxes
    if (raw.length > 1) {
      const filled = raw.slice(0, LENGTH).split('')
      setDigits((prev) => {
        const next = [...prev]
        filled.forEach((c, j) => { if (i + j < LENGTH) next[i + j] = c })
        return next
      })
      const lastFilled = Math.min(i + filled.length, LENGTH - 1)
      setTimeout(() => focus(lastFilled), 0)
      return
    }
    updateDigit(i, raw)
    if (i < LENGTH - 1) setTimeout(() => focus(i + 1), 0)
  }

  const handleKeyDown = (i: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace') {
      if (digits[i]) {
        updateDigit(i, '')
      } else if (i > 0) {
        updateDigit(i - 1, '')
        setTimeout(() => focus(i - 1), 0)
      }
    } else if (e.key === 'ArrowLeft' && i > 0) {
      focus(i - 1)
    } else if (e.key === 'ArrowRight' && i < LENGTH - 1) {
      focus(i + 1)
    }
  }

  // Auto-submit when all digits are filled
  useEffect(() => {
    if (code.length === LENGTH && !isLoading) {
      submit(code)
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [code])

  async function submit(finalCode: string) {
    setError(null)
    setIsLoading(true)

    try {
      const res = await fetch('/api/auth/telegram/verify-code', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code: finalCode }),
      })
      const data = await res.json()
      if (!res.ok) {
        setError(data.error || 'Verification failed')
        setDigits(Array(LENGTH).fill(''))
        setTimeout(() => focus(0), 0)
        setIsLoading(false)
        return
      }
      router.push(redirectTo || '/dashboard')
      router.refresh()
    } catch {
      setError('Something went wrong')
      setDigits(Array(LENGTH).fill(''))
      setTimeout(() => focus(0), 0)
      setIsLoading(false)
    }
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (code.length === LENGTH) submit(code)
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
            Tap the code to copy it, then paste it below.
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
          <label className="block text-[11px] font-bold uppercase tracking-wider text-gray-500 mb-3 dark:text-gray-400">
            Enter code
          </label>
          <div className="flex gap-2 justify-between">
            {Array.from({ length: LENGTH }).map((_, i) => (
              <input
                key={i}
                ref={(el) => { inputs.current[i] = el }}
                type="text"
                inputMode="numeric"
                maxLength={6}
                value={digits[i]}
                onChange={(e) => handleChange(i, e)}
                onKeyDown={(e) => handleKeyDown(i, e)}
                onFocus={(e) => e.target.select()}
                disabled={isLoading}
                className="w-full aspect-square text-center text-xl font-bold rounded-xl border-2 border-gray-200 dark:border-gray-700 bg-transparent dark:bg-input/30 focus:border-primary focus:outline-none transition-colors disabled:opacity-50"
              />
            ))}
          </div>
        </div>

        <Button
          type="submit"
          disabled={isLoading || code.length !== LENGTH}
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
