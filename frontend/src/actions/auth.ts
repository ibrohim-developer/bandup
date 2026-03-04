'use server'

import { redirect } from 'next/navigation'
import { setToken, clearToken, getCurrentUser, STRAPI_URL } from '@/lib/strapi/server'

export async function signUp(formData: FormData) {
  const email = formData.get('email') as string
  const password = formData.get('password') as string
  const fullName = formData.get('fullName') as string

  try {
    const res = await fetch(`${STRAPI_URL}/api/auth/local/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        username: email.split('@')[0] + '_' + Date.now(),
        email,
        password,
        full_name: fullName,
      }),
    })

    const data = await res.json()

    if (data.error) {
      return { error: data.error.message }
    }

    await setToken(data.jwt)

    // Strapi register only saves username/email/password by default,
    // so update the user's full_name via admin API token.
    if (fullName && data.user?.id) {
      await fetch(`${STRAPI_URL}/api/users/${data.user.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${process.env.STRAPI_API_TOKEN}`,
        },
        body: JSON.stringify({ full_name: fullName }),
      })
    }
  } catch {
    return { error: 'Something went wrong' }
  }

  redirect('/dashboard')
}

export async function signIn(formData: FormData) {
  const email = formData.get('email') as string
  const password = formData.get('password') as string
  const redirectTo = formData.get('redirect') as string | null

  try {
    const res = await fetch(`${STRAPI_URL}/api/auth/local`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ identifier: email, password }),
    })

    const data = await res.json()

    if (data.error) {
      return { error: data.error.message }
    }

    await setToken(data.jwt)
  } catch {
    return { error: 'Something went wrong' }
  }

  redirect(redirectTo || '/dashboard')
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

// Telegram auth stubs — to be implemented later
export async function signInWithTelegramCode(_code: string) {
  return { error: 'Telegram auth not yet migrated to Strapi' }
}

export async function signInWithTelegramWidget(_widgetData: Record<string, string | number>) {
  return { error: 'Telegram auth not yet migrated to Strapi' }
}

export async function signInWithGoogle() {
  // Strapi Google OAuth — redirect URL is configured in Strapi admin
  // (Settings → Providers → Google → Redirect URL = http://localhost:3000/auth/callback)
  redirect(`${STRAPI_URL}/api/connect/google`)
}
