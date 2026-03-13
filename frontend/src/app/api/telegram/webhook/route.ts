import { NextResponse } from 'next/server'

// Telegram webhook is disabled — Supabase has been removed.

export async function POST() {
  return NextResponse.json(
    { error: 'Telegram webhook is disabled' },
    { status: 404 }
  )
}

/*
// Original implementation (used Supabase):

import { createServiceClient } from '@/lib/supabase/service'
import crypto from 'crypto'

const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN!

interface TelegramUpdate {
  message?: {
    chat: { id: number }
    from: { id: number; first_name: string; last_name?: string; username?: string }
    text?: string
    contact?: {
      phone_number: string
      first_name: string
      last_name?: string
      user_id?: number
    }
  }
}

function generateCode(): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'
  let code = ''
  const bytes = crypto.randomBytes(6)
  for (let i = 0; i < 6; i++) {
    code += chars[bytes[i] % chars.length]
  }
  return code
}

async function sendMessage(chatId: number, text: string, replyMarkup?: object) {
  const body: Record<string, unknown> = {
    chat_id: chatId,
    text,
    parse_mode: 'HTML',
  }
  if (replyMarkup) {
    body.reply_markup = replyMarkup
  }

  await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  })
}

export async function POST(request: Request) {
  const secretToken = request.headers.get('x-telegram-bot-api-secret-token')
  const expectedSecret = process.env.TELEGRAM_WEBHOOK_SECRET
  if (expectedSecret && secretToken !== expectedSecret) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const update: TelegramUpdate = await request.json()
  const message = update.message
  if (!message) {
    return NextResponse.json({ ok: true })
  }

  const chatId = message.chat.id

  if (message.text === '/start') {
    await sendMessage(
      chatId,
      'BandUp — IELTS Mock Exams\n\nTap the button below to open the app.',
      {
        inline_keyboard: [
          [{ text: 'Open BandUp', web_app: { url: 'https://bandup.uz/dashboard' } }],
        ],
      }
    )

    await sendMessage(
      chatId,
      'Or share your contact to get a login code for the website:',
      {
        keyboard: [
          [{ text: 'Share my contact', request_contact: true }],
        ],
        resize_keyboard: true,
        one_time_keyboard: true,
      }
    )
    return NextResponse.json({ ok: true })
  }

  if (message.contact) {
    const contact = message.contact
    const telegramUser = message.from

    if (contact.user_id && contact.user_id !== telegramUser.id) {
      await sendMessage(chatId, 'Please share your own contact, not someone else\'s.')
      return NextResponse.json({ ok: true })
    }

    const supabase = createServiceClient()
    const code = generateCode()
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000).toISOString()

    await supabase
      .from('telegram_auth_codes')
      .delete()
      .eq('telegram_id', telegramUser.id)
      .eq('used', false)

    const { error } = await supabase.from('telegram_auth_codes').insert({
      code,
      telegram_id: telegramUser.id,
      first_name: contact.first_name || telegramUser.first_name,
      last_name: contact.last_name || telegramUser.last_name || null,
      username: telegramUser.username || null,
      phone: contact.phone_number,
      expires_at: expiresAt,
    })

    if (error) {
      await sendMessage(chatId, 'Something went wrong. Please try again.')
      return NextResponse.json({ ok: true })
    }

    await sendMessage(
      chatId,
      `Your login code:\n\n<b>${code}</b>\n\nEnter this code on the website to sign in.\nThe code expires in 10 minutes.`,
      { remove_keyboard: true }
    )

    return NextResponse.json({ ok: true })
  }

  await sendMessage(chatId, 'Send /start to get a login code.')
  return NextResponse.json({ ok: true })
}
*/
