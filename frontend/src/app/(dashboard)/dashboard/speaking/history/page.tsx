import { Mic } from 'lucide-react'
import { ModuleHistory } from '@/components/history/module-history'

export default function SpeakingHistoryPage() {
  return (
    <ModuleHistory
      module={{
        type: 'speaking',
        label: 'Speaking',
        Icon: Mic,
        bgLight: 'bg-pink-50',
        bgDark: 'dark:bg-pink-950',
        textLight: 'text-pink-600',
        textDark: 'dark:text-pink-400',
        resultHref: (id) => `/dashboard/speaking/result/${id}`,
        backHref: '/dashboard/speaking',
      }}
    />
  )
}
