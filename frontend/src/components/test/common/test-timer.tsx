'use client'

import { useTestTimer } from '@/hooks/use-test-timer'
import { cn } from '@/lib/utils'
import { Clock } from 'lucide-react'

interface TestTimerProps {
  onTimeUp?: () => void
  className?: string
}

export function TestTimer({ onTimeUp, className }: TestTimerProps) {
  const { formattedTime, isLowTime, isCritical } = useTestTimer(onTimeUp)

  return (
    <div
      className={cn(
        'flex items-center gap-2 rounded-lg px-4 py-2 font-mono text-lg font-bold transition-colors',
        isCritical && 'animate-pulse bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
        isLowTime && !isCritical && 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400',
        !isLowTime && !isCritical && 'bg-muted text-foreground',
        className
      )}
    >
      <Clock className="h-5 w-5" />
      <span>{formattedTime}</span>
    </div>
  )
}
