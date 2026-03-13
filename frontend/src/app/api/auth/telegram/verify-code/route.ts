import { NextResponse } from 'next/server'

// Telegram auth is disabled — Supabase has been removed.
// The findOrCreateTelegramUser function and code verification logic
// have been commented out. Re-enable when Telegram auth is implemented with Strapi.

export async function POST() {
  return NextResponse.json(
    { error: 'Telegram auth is disabled' },
    { status: 404 }
  )
}

/*
// Original implementation (used Supabase):

import { createServiceClient } from '@/lib/supabase/service'
import crypto from 'crypto'

export async function POST(request: Request) {
  const { code } = await request.json()

  if (!code || typeof code !== 'string' || code.length !== 6) {
    return NextResponse.json({ error: 'Invalid code format' }, { status: 400 })
  }

  const supabase = createServiceClient()

  const { data: authCode, error: lookupError } = await supabase
    .from('telegram_auth_codes')
    .select('*')
    .eq('code', code.toUpperCase())
    .eq('used', false)
    .gt('expires_at', new Date().toISOString())
    .single()

  if (lookupError || !authCode) {
    return NextResponse.json(
      { error: 'Invalid or expired code. Please get a new code from the Telegram bot.' },
      { status: 400 }
    )
  }

  await supabase
    .from('telegram_auth_codes')
    .update({ used: true })
    .eq('id', authCode.id)

  const { token_hash, error: authError } = await findOrCreateTelegramUser(supabase, {
    telegram_id: authCode.telegram_id,
    first_name: authCode.first_name,
    last_name: authCode.last_name,
    username: authCode.username,
    phone: authCode.phone,
    photo_url: authCode.photo_url,
  })

  if (authError) {
    return NextResponse.json({ error: authError }, { status: 500 })
  }

  return NextResponse.json({ token_hash })
}

interface TelegramUserData {
  telegram_id: number
  first_name: string | null
  last_name: string | null
  username: string | null
  phone: string | null
  photo_url: string | null
}

export async function findOrCreateTelegramUser(
  supabase: ReturnType<typeof createServiceClient>,
  userData: TelegramUserData
): Promise<{ token_hash?: string; error?: string }> {
  const fullName = [userData.first_name, userData.last_name].filter(Boolean).join(' ') || 'Telegram User'
  const email = `tg_${userData.telegram_id}@telegram.placeholder`

  const { data: existingProfile } = await supabase
    .from('profiles')
    .select('id')
    .eq('telegram_id', userData.telegram_id)
    .single()

  let userId: string

  if (existingProfile) {
    userId = existingProfile.id
    await supabase
      .from('profiles')
      .update({
        full_name: fullName,
        avatar_url: userData.photo_url,
        phone: userData.phone,
      })
      .eq('id', userId)
  } else {
    const password = crypto.randomBytes(32).toString('hex')
    const { data: newUser, error: createError } = await supabase.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
      user_metadata: {
        full_name: fullName,
        avatar_url: userData.photo_url,
        telegram_id: userData.telegram_id,
      },
    })

    if (createError || !newUser.user) {
      return { error: 'Failed to create user account' }
    }

    userId = newUser.user.id
    await supabase
      .from('profiles')
      .update({
        telegram_id: userData.telegram_id,
        phone: userData.phone,
        full_name: fullName,
        avatar_url: userData.photo_url,
      })
      .eq('id', userId)
  }

  const { data: linkData, error: linkError } = await supabase.auth.admin.generateLink({
    type: 'magiclink',
    email,
  })

  if (linkError || !linkData.properties?.hashed_token) {
    return { error: 'Failed to generate session' }
  }

  return { token_hash: linkData.properties.hashed_token }
}
*/
