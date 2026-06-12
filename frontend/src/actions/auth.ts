'use server'

import { redirect } from 'next/navigation'
import { setToken, clearToken, getCurrentUser, STRAPI_URL } from '@/lib/strapi/server'
import { safeRedirectPath } from '@/lib/safe-redirect'

export async function signUp(formData: FormData) {
  const password = formData.get('password') as string
  const fullName = formData.get('fullName') as string
  const email = formData.get('email') as string

  if (!email) return { error: 'Email is required' }

  try {
    const res = await fetch(`${STRAPI_URL}/api/auth/local/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        username: email.split('@')[0] + '_' + Date.now(),
        email,
        password,
      }),
    })

    const data = await res.json()

    if (data.error) {
      return { error: data.error.message }
    }

    await setToken(data.jwt)

    // Strapi register only saves username/email/password by default —
    // update full_name via admin token.
    if (data.user?.id) {
      await fetch(`${STRAPI_URL}/api/users/${data.user.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${process.env.STRAPI_API_TOKEN}`,
        },
        body: JSON.stringify({
          full_name: fullName,
          pixel_signup_fired: true,
        }),
      })
    }
  } catch {
    return { error: 'Something went wrong' }
  }

  return { success: true, isNewUser: true }
}

export async function signIn(formData: FormData) {
  const password = formData.get('password') as string
  const redirectTo = formData.get('redirect') as string | null
  const identifier = formData.get('email') as string

  try {
    const res = await fetch(`${STRAPI_URL}/api/auth/local`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ identifier, password }),
    })

    const data = await res.json()

    if (data.error) {
      return { error: data.error.message }
    }

    await setToken(data.jwt)
  } catch {
    return { error: 'Something went wrong' }
  }

  redirect(safeRedirectPath(redirectTo))
}

export async function signOut() {
  await clearToken()
  redirect('/')
}

export async function resetPassword(formData: FormData) {
  const email = formData.get('email') as string

  try {
    const res = await fetch(`${STRAPI_URL}/api/auth/forgot-password`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email }),
    })

    const data = await res.json()

    if (data.error) {
      return { error: data.error.message }
    }

    return { success: true, message: 'Check your email for password reset link' }
  } catch {
    return { error: 'Something went wrong' }
  }
}

export async function updatePassword(formData: FormData) {
  const password = formData.get('password') as string
  const confirmPassword = formData.get('confirmPassword') as string
  const code = formData.get('code') as string

  if (password !== confirmPassword) {
    return { error: 'Passwords do not match' }
  }

  if (password.length < 6) {
    return { error: 'Password must be at least 6 characters' }
  }

  try {
    const res = await fetch(`${STRAPI_URL}/api/auth/reset-password`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        code,
        password,
        passwordConfirmation: password,
      }),
    })

    const data = await res.json()

    if (data.error) {
      return { error: data.error.message }
    }

    return { success: true }
  } catch {
    return { error: 'Something went wrong' }
  }
}

export async function getUser() {
  const user = await getCurrentUser()
  if (!user) return null

  // Map to match the shape the frontend expects
  return {
    id: String(user.id),
    email: user.email,
    user_metadata: {
      full_name: user.full_name,
      avatar_url: user.avatar_url,
    },
  }
}

export async function signInWithGoogle(redirectTo?: string | null) {
  // Strapi Google OAuth — redirect URL is configured in Strapi admin
  // (Settings → Providers → Google → Redirect URL = http://localhost:3000/auth/callback)
  // Strapi doesn't forward our own state through the OAuth roundtrip, so stash the
  // post-login destination in a short-lived cookie that the callback can read.
  if (redirectTo) {
    const { cookies } = await import('next/headers')
    const cookieStore = await cookies()
    cookieStore.set('post_oauth_redirect', redirectTo, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 600, // 10 minutes
    })
  }
  redirect(`${STRAPI_URL}/api/connect/google`)
}

// NOTE: A legacy Telegram OpenID Connect login (signInWithTelegram + an
// /api/auth/telegram/callback route) was removed — login uses the 6-digit code
// flow (TelegramTab → /api/auth/telegram/verify-code) and Google instead.
