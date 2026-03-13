'use client'

import { useState } from 'react'
import Link from '@/components/no-prefetch-link'
import { signUp, signInWithGoogle } from '@/actions/auth'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { BookOpen, Loader2, CheckCircle, Eye, EyeOff, ArrowLeft } from 'lucide-react'
import { TelegramLoginWidget } from '@/components/auth/telegram-login-widget'

const TELEGRAM_BOT_NAME = process.env.NEXT_PUBLIC_TELEGRAM_BOT_NAME || 'YourBotName'

export default function SignUpPage() {
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)

  async function handleSubmit(formData: FormData) {
    setIsLoading(true)
    setError(null)

    const result = await signUp(formData)

    // signUp redirects on success, so if we get here it's an error
    if (result?.error) {
      setError(result.error)
      setIsLoading(false)
    }
  }

  if (success) {
    return (
      <div className="bg-card shadow-2xl rounded-[24px] p-6 sm:p-8 md:p-10 border border-border">
        <div className="pt-4 pb-4 text-center space-y-4">
          <div className="mx-auto w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center">
            <CheckCircle className="w-8 h-8 text-green-600 dark:text-green-400" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Check your email</h2>
          <p className="text-gray-500 dark:text-gray-400">
            We&apos;ve sent you a confirmation link. Please check your email to verify your account.
          </p>
          <Link href="/sign-in">
            <Button variant="outline" className="mt-4 rounded-xl">
              Back to Sign In
            </Button>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-card shadow-2xl rounded-[24px] p-6 sm:p-8 md:p-10 border border-border w-full max-w-[480px]">

      {/* Header */}
      <div className="flex flex-col items-center mb-8 text-center">
        <div className="w-14 h-14 bg-primary rounded-2xl flex items-center justify-center mb-6 shadow-lg shadow-primary/20 dark:shadow-none">
          <BookOpen className="w-7 h-7 text-primary-foreground" />
        </div>
        <h1 className="text-3xl font-[800] text-gray-900 dark:text-white tracking-tight leading-tight">
          Create Account
        </h1>
        <p className="mt-2 text-gray-500 dark:text-gray-400 font-medium">
          Start your IELTS preparation journey today
        </p>
      </div>

      <div className="space-y-6">
        {/* Error message */}
        {error && (
          <div className="p-3 rounded-xl bg-destructive/10 text-destructive text-sm">
            {error}
          </div>
        )}

        {/* Google Sign In */}
        <button
          type="button"
          disabled={isLoading}
          onClick={() => signInWithGoogle()}
          className="w-full flex items-center justify-center gap-3 px-4 py-3 border-2 border-primary/10 hover:border-primary/30 dark:border-primary/20 dark:hover:border-primary/40 rounded-xl bg-card transition-colors group disabled:opacity-50"
        >
          <svg className="w-5 h-5" viewBox="0 0 24 24">
            <path
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              fill="#4285F4"
            />
            <path
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              fill="#34A853"
            />
            <path
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
              fill="#FBBC05"
            />
            <path
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              fill="#EA4335"
            />
          </svg>
          <span className="font-bold text-gray-800 dark:text-gray-100">Continue with Google</span>
        </button>

        {/* Telegram */}
        <TelegramLoginWidget botName={TELEGRAM_BOT_NAME} />

        {/* Divider */}
        <div className="relative py-4">
          <div className="absolute inset-0 flex items-center" aria-hidden="true">
            <div className="w-full border-t border-gray-200 dark:border-gray-800" />
          </div>
          <div className="relative flex justify-center text-xs font-bold uppercase tracking-widest">
            <span className="bg-card px-4 text-gray-400">
              Or continue with email
            </span>
          </div>
        </div>

        {/* Email Form */}
        <form action={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="fullName" className="block text-[11px] font-bold uppercase tracking-wider text-gray-500 mb-1.5 dark:text-gray-400">
              Full Name
            </label>
            <Input
              id="fullName"
              name="fullName"
              type="text"
              placeholder="e.g. John Doe"
              required
              disabled={isLoading}
              className="px-4 py-3 h-auto rounded-xl border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-primary focus:border-transparent text-sm"
            />
          </div>

          <div>
            <label htmlFor="email" className="block text-[11px] font-bold uppercase tracking-wider text-gray-500 mb-1.5 dark:text-gray-400">
              Email
            </label>
            <Input
              id="email"
              name="email"
              type="email"
              placeholder="you@example.com"
              required
              disabled={isLoading}
              className="px-4 py-3 h-auto rounded-xl border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-primary focus:border-transparent text-sm"
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-[11px] font-bold uppercase tracking-wider text-gray-500 mb-1.5 dark:text-gray-400">
              Password
            </label>
            <div className="relative">
              <Input
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                placeholder="Min. 8 characters"
                required
                minLength={8}
                disabled={isLoading}
                className="px-4 py-3 pr-11 h-auto rounded-xl border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-primary focus:border-transparent text-sm"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                tabIndex={-1}
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <Button
            type="submit"
            disabled={isLoading}
            className="w-full py-4 h-auto rounded-xl font-bold shadow-xl shadow-primary/20 active:scale-[0.98] transition-all mt-4"
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Creating account...
              </>
            ) : (
              'Create Account'
            )}
          </Button>
        </form>

        {/* Sign in link */}
        <div className="text-center pt-4">
          <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">
            Already have an account?{' '}
            <Link href="/sign-in" className="text-primary font-bold hover:underline ml-1">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
