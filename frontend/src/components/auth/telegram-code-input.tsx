'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Loader2, Send, ChevronDown, ChevronUp } from 'lucide-react'

interface TelegramCodeInputProps {
  botName: string
}

export function TelegramCodeInput({ botName }: TelegramCodeInputProps) {
  const [isExpanded, setIsExpanded] = useState(false)
  const [code, setCode] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!code.trim() || code.trim().length !== 6) {
      setError('Please enter a 6-character code')
      return
    }

    setIsLoading(true)
    setError(null)

    try {
      const response = await fetch('/api/auth/telegram/verify-code', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code: code.trim().toUpperCase() }),
      })

      const data = await response.json()

      if (!response.ok || !data.token_hash) {
        setError(data.error || 'Invalid or expired code')
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

  return (
    <div className="space-y-3">
      <button
        type="button"
        onClick={() => setIsExpanded(!isExpanded)}
        className="flex items-center gap-2 text-primary font-bold text-sm cursor-pointer hover:underline"
      >
        <Send className="h-4 w-4" />
        Have a Telegram code?
        {isExpanded ? <ChevronUp className="h-3.5 w-3.5" /> : <ChevronDown className="h-3.5 w-3.5" />}
      </button>

      <div
        className="grid transition-all duration-300 ease-in-out"
        style={{ gridTemplateRows: isExpanded ? '1fr' : '0fr' }}
      >
        <div className="overflow-hidden">
          <div className="p-4 bg-gray-50 dark:bg-gray-800/50 rounded-2xl space-y-3 mt-3">
            <p className="text-[12px] text-gray-500 dark:text-gray-400 leading-relaxed">
              Open{' '}
              <a
                href={`https://t.me/${botName}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary font-semibold hover:underline"
              >
                @{botName}
              </a>
              {' '}in Telegram, share your contact, and enter the code below.
            </p>

            {error && (
              <div className="p-3 rounded-xl bg-destructive/10 text-destructive text-sm">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="flex gap-2">
              <Input
                value={code}
                onChange={(e) => setCode(e.target.value.toUpperCase())}
                placeholder="ENTER 6-DIGIT CODE"
                maxLength={6}
                className="text-center font-mono tracking-widest uppercase px-4 py-3 h-auto rounded-xl border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-sm"
                disabled={isLoading}
              />
              <Button
                type="submit"
                disabled={isLoading || code.trim().length !== 6}
                className="px-6 py-3 h-auto rounded-xl font-bold shadow-md shadow-primary/20 active:scale-95 transition-all"
              >
                {isLoading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  'Verify'
                )}
              </Button>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}
