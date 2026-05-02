import { BookOpen } from 'lucide-react'
import { ModuleHistory } from '@/components/history/module-history'

export default function ReadingHistoryPage() {
  return (
    <ModuleHistory
      module={{
        type: 'reading',
        label: 'Reading',
        Icon: BookOpen,
        bgLight: 'bg-purple-50',
        bgDark: 'dark:bg-purple-950',
        textLight: 'text-purple-600',
        textDark: 'dark:text-purple-400',
        resultHref: (id) => `/dashboard/results/${id}`,
        backHref: '/dashboard/reading',
      }}
    />
  )
}
