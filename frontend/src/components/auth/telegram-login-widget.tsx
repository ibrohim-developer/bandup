// Telegram login widget is disabled — Supabase has been removed.
// Re-enable when Telegram auth is implemented with Strapi.

interface TelegramLoginWidgetProps {
  botName: string
}

export function TelegramLoginWidget({ botName: _botName }: TelegramLoginWidgetProps) {
  return null
}
