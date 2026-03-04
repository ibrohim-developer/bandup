import { NextResponse } from 'next/server'
import { createServiceClient } from '@/lib/supabase/service'
import { findOrCreateTelegramUser } from '@/app/api/auth/telegram/verify-code/route'
import crypto from 'crypto'

interface TelegramWidgetData {
  id: number
  first_name: string
  last_name?: string
  username?: string
  photo_url?: string
  auth_date: number
  hash: string
}

function verifyTelegramWidget(data: TelegramWidgetData): boolean {
  const botToken = process.env.TELEGRAM_BOT_TOKEN!
  const secret = crypto.createHash('sha256').update(botToken).digest()

  // Build the check string from all fields except hash
  const checkFields: string[] = []
  const entries = Object.entries(data) as [string, string | number][]
  for (const [key, value] of entries) {
    if (key !== 'hash') {
      checkFields.push(`${key}=${value}`)
    }
  }
  checkFields.sort()
  const checkString = checkFields.join('\n')

  const hmac = crypto.createHmac('sha256', secret).update(checkString).digest('hex')
  return hmac === data.hash
}

export async function POST(request: Request) {
  const widgetData: TelegramWidgetData = await request.json()

  // Verify the data is from Telegram
  if (!verifyTelegramWidget(widgetData)) {
    return NextResponse.json({ error: 'Invalid Telegram data' }, { status: 401 })
  }

  // Check auth_date is recent (within 1 hour)
  const now = Math.floor(Date.now() / 1000)
  if (now - widgetData.auth_date > 3600) {
    return NextResponse.json({ error: 'Authentication data expired' }, { status: 401 })
  }

  const supabase = createServiceClient()

  const { token_hash, error } = await findOrCreateTelegramUser(supabase, {
    telegram_id: widgetData.id,
    first_name: widgetData.first_name,
    last_name: widgetData.last_name || null,
    username: widgetData.username || null,
    phone: null,
    photo_url: widgetData.photo_url || null,
  })

  if (error) {
    return NextResponse.json({ error }, { status: 500 })
  }

  return NextResponse.json({ token_hash })
}
