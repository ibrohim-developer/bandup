import { NextResponse } from 'next/server'

const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN!

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const secret = searchParams.get('secret')

  // Simple protection — require a secret to set up the webhook
  if (secret !== process.env.STRAPI_API_TOKEN?.slice(0, 16)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const webhookUrl = `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/api/telegram/webhook`
  const webhookSecret = process.env.TELEGRAM_WEBHOOK_SECRET

  const body: Record<string, string> = { url: webhookUrl }
  if (webhookSecret) {
    body.secret_token = webhookSecret
  }

  const response = await fetch(
    `https://api.telegram.org/bot${BOT_TOKEN}/setWebhook`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    }
  )

  const result = await response.json()

  // Set the bot menu button to open the Mini App
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://bandup.uz'
  const menuResponse = await fetch(
    `https://api.telegram.org/bot${BOT_TOKEN}/setChatMenuButton`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        menu_button: {
          type: 'web_app',
          text: 'Open BandUp',
          web_app: { url: `${siteUrl}/dashboard` },
        },
      }),
    }
  )

  const menuResult = await menuResponse.json()

  return NextResponse.json({ webhook: result, menu_button: menuResult })
}
