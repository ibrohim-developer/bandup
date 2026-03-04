'use client'

import { useState } from 'react'
import Link from '@/components/no-prefetch-link'
import { resetPassword } from '@/actions/auth'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { BookOpen, Loader2, ArrowLeft, Mail } from 'lucide-react'

export function ResetPasswordForm() {
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  async function handleSubmit(formData: FormData) {
    setIsLoading(true)
    setError(null)

    const result = await resetPassword(formData)

    if (result?.error) {
      setError(result.error)
      setIsLoading(false)
    } else if (result?.success) {
      setSuccess(true)
      setIsLoading(false)
    }
  }

  if (success) {
    return (
      <div className="bg-card shadow-2xl rounded-[24px] p-8 md:p-10 border border-border">
        <div className="flex flex-col items-center text-center space-y-4">
          <div className="w-14 h-14 bg-blue-100 dark:bg-blue-900/30 rounded-2xl flex items-center justify-center">
            <Mail className="w-7 h-7 text-blue-600 dark:text-blue-400" />
          </div>
          <h2 className="text-2xl font-[800] text-gray-900 dark:text-white tracking-tight">Check your email</h2>
          <p className="text-gray-500 dark:text-gray-400 leading-relaxed max-w-[280px]">
            We&apos;ve sent you a password reset link. Please check your email.
          </p>
          <Link href="/sign-in">
            <Button variant="outline" className="mt-4 rounded-xl font-bold">
              Back to Sign In
            </Button>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-card shadow-2xl rounded-[24px] p-8 md:p-10 border border-border">
      {/* Header */}
      <div className="flex flex-col items-center mb-8 text-center">
        <div className="w-14 h-14 bg-primary rounded-2xl flex items-center justify-center mb-6 shadow-lg shadow-primary/20 dark:shadow-none">
          <BookOpen className="w-7 h-7 text-primary-foreground" />
        </div>
        <h1 className="text-3xl font-[800] text-gray-900 dark:text-white tracking-tight leading-tight mb-3">
          Forgot Password?
        </h1>
        <p className="text-gray-500 dark:text-gray-400 leading-relaxed max-w-[280px] font-medium">
          Enter your email address and we will send you instructions to reset your password.
        </p>
      </div>

      <div className="space-y-6">
        {/* Error message */}
        {error && (
          <div className="p-3 rounded-xl bg-destructive/10 text-destructive text-sm">
            {error}
          </div>
        )}

        {/* Email Form */}
        <form action={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="email" className="block text-[11px] font-bold uppercase tracking-wider text-gray-500 mb-1.5 dark:text-gray-400">
              Email Address
            </label>
            <Input
              id="email"
              name="email"
              type="email"
              placeholder="name@example.com"
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
                Sending reset link...
              </>
            ) : (
              'Send Reset Link'
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
