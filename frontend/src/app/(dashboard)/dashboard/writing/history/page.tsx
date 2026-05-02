import { PenTool } from 'lucide-react'
import { ModuleHistory } from '@/components/history/module-history'

export default function WritingHistoryPage() {
  return (
    <ModuleHistory
      module={{
        type: 'writing',
        label: 'Writing',
        Icon: PenTool,
        bgLight: 'bg-orange-50',
        bgDark: 'dark:bg-orange-950',
        textLight: 'text-orange-600',
        textDark: 'dark:text-orange-400',
        resultHref: (id) => `/dashboard/results/${id}`,
        backHref: '/dashboard/writing',
      }}
    />
  )
}
