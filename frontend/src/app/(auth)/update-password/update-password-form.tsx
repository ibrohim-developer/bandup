'use client'

import { useMemo, useState } from 'react'
import Link from '@/components/no-prefetch-link'
import { useRouter } from 'next/navigation'
import { updatePassword } from '@/actions/auth'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Lock, Loader2, ArrowLeft } from 'lucide-react'

function getPasswordStrength(password: string) {
  let score = 0
  if (password.length >= 6) score++
  if (password.length >= 10) score++
  if (/[A-Z]/.test(password)) score++
  if (/[0-9]/.test(password)) score++
  if (/[^A-Za-z0-9]/.test(password)) score++

  if (score <= 1) return { label: 'Weak', percent: 20, color: 'bg-red-500' }
  if (score === 2) return { label: 'Fair', percent: 40, color: 'bg-orange-500' }
  if (score === 3) return { label: 'Good', percent: 65, color: 'bg-yellow-500' }
  if (score === 4) return { label: 'Strong', percent: 85, color: 'bg-green-500' }
  return { label: 'Very Strong', percent: 100, color: 'bg-green-600' }
}

export function UpdatePasswordForm() {
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [password, setPassword] = useState('')
  const router = useRouter()

  const strength = useMemo(() => getPasswordStrength(password), [password])

  async function handleSubmit(formData: FormData) {
    setIsLoading(true)
    setError(null)

    const result = await updatePassword(formData)

    if (result?.error) {
      setError(result.error)
      setIsLoading(false)
    } else if (result?.success) {
      router.push('/dashboard')
    }
  }

  return (
    <div className="bg-card shadow-2xl rounded-[24px] p-8 md:p-10 border border-border">
      {/* Header */}
      <div className="flex flex-col items-center mb-8 text-center">
        <div className="w-14 h-14 bg-primary rounded-2xl flex items-center justify-center mb-6 shadow-lg shadow-primary/20 dark:shadow-none">
          <Lock className="w-7 h-7 text-primary-foreground" />
        </div>
        <h1 className="text-3xl font-[800] text-gray-900 dark:text-white tracking-tight leading-tight mb-3">
          Reset Password
        </h1>
        <p className="text-gray-500 dark:text-gray-400 leading-relaxed font-medium">
          Enter a new, strong password for your account to finish the recovery process.
        </p>
      </div>

      <div className="space-y-6">
        {/* Error message */}
        {error && (
          <div className="p-3 rounded-xl bg-destructive/10 text-destructive text-sm">
            {error}
          </div>
        )}

        {/* Password Form */}
        <form action={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="password" className="block text-[11px] font-bold uppercase tracking-wider text-gray-500 mb-1.5 dark:text-gray-400">
              New Password
            </label>
            <Input
              id="password"
              name="password"
              type="password"
              placeholder="••••••••"
              required
              disabled={isLoading}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="px-4 py-3 h-auto rounded-xl border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-primary focus:border-transparent text-sm"
            />
            {password.length > 0 && (
              <>
                <div className="h-1 w-full bg-gray-200 dark:bg-gray-700 rounded-full mt-2 overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all ${strength.color}`}
                    style={{ width: `${strength.percent}%` }}
                  />
                </div>
                <p className="text-[10px] text-gray-400 font-medium mt-1">
                  Password strength: {strength.label}
                </p>
              </>
            )}
          </div>

          <div>
            <label htmlFor="confirmPassword" className="block text-[11px] font-bold uppercase tracking-wider text-gray-500 mb-1.5 dark:text-gray-400">
              Confirm New Password
            </label>
            <Input
              id="confirmPassword"
              name="confirmPassword"
              type="password"
              placeholder="••••••••"
              required
              disabled={isLoading}
              className="px-4 py-3 h-auto rounded-xl border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-primary focus:border-transparent text-sm"
            />
          </div>

          <Button
            type="submit"
            disabled={isLoading}
            className="w-full py-4 h-auto rounded-xl font-bold shadow-xl shadow-primary/20 active:scale-[0.98] transition-all uppercase tracking-widest text-sm"
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Updating password...
              </>
            ) : (
              'Update Password'
            )}
          </Button>
        </form>

        {/* Back to login link */}
        <div className="text-center pt-4">
          <Link
            href="/sign-in"
            className="inline-flex items-center gap-2 text-sm font-bold text-gray-900 dark:text-white hover:text-primary transition-colors group"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            Back to Login
          </Link>
        </div>
      </div>
    </div>
  )
}
