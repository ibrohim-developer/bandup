'use client'

import { signInWithTelegram } from '@/actions/auth'

interface TelegramLoginWidgetProps {
  botName: string
}

export function TelegramLoginWidget({ botName }: TelegramLoginWidgetProps) {
  const isConfigured = botName && botName !== 'YourBotName'

  if (!isConfigured) return null

  return (
    <button
      type="button"
      onClick={() => signInWithTelegram()}
      className="w-full flex items-center justify-center gap-3 px-4 py-3 border-2 border-primary/10 hover:border-primary/30 dark:border-primary/20 dark:hover:border-primary/40 rounded-xl bg-card transition-colors group"
    >
      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none">
        <path
          d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.64 6.8c-.15 1.58-.8 5.42-1.13 7.19-.14.75-.42 1-.68 1.03-.58.05-1.02-.38-1.58-.75-.88-.58-1.38-.94-2.23-1.5-.99-.65-.35-1.01.22-1.59.15-.15 2.71-2.48 2.76-2.69.01-.03.01-.14-.07-.2-.08-.06-.19-.04-.27-.02-.12.03-1.99 1.27-5.62 3.72-.53.36-1.01.54-1.44.53-.47-.01-1.38-.27-2.06-.49-.83-.27-1.49-.42-1.43-.88.03-.24.37-.49 1.02-.75 3.99-1.73 6.65-2.88 7.99-3.44 3.81-1.58 4.6-1.86 5.12-1.87.11 0 .37.03.53.17.14.12.18.28.2.47-.01.06.01.24 0 .37z"
          fill="#2AABEE"
        />
      </svg>
      <span className="font-bold text-gray-800 dark:text-gray-100">Continue with Telegram</span>
    </button>
  )
}
