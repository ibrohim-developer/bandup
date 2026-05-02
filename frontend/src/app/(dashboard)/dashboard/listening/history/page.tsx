import { Headphones } from 'lucide-react'
import { ModuleHistory } from '@/components/history/module-history'

export default function ListeningHistoryPage() {
  return (
    <ModuleHistory
      module={{
        type: 'listening',
        label: 'Listening',
        Icon: Headphones,
        bgLight: 'bg-blue-50',
        bgDark: 'dark:bg-blue-950',
        textLight: 'text-blue-600',
        textDark: 'dark:text-blue-400',
        resultHref: (id) => `/dashboard/results/${id}`,
        backHref: '/dashboard/listening',
      }}
    />
  )
}
