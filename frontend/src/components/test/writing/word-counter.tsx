'use client'

import { useWordCount } from '@/hooks/use-word-count'
import { cn } from '@/lib/utils'
import { CheckCircle, AlertCircle } from 'lucide-react'

interface WordCounterProps {
  text: string
  minWords: number
  className?: string
}

export function WordCounter({ text, minWords, className }: WordCounterProps) {
  const wordCount = useWordCount(text)
  const isMinReached = wordCount >= minWords
  const progress = Math.min((wordCount / minWords) * 100, 100)

  return (
    <div className={cn('flex items-center gap-3', className)}>
      <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
        <div
          className={cn(
            'h-full transition-all duration-300',
            isMinReached ? 'bg-green-500' : 'bg-amber-500'
          )}
          style={{ width: `${progress}%` }}
        />
      </div>
      <div className={cn(
        'flex items-center gap-1.5 text-sm font-medium min-w-[100px]',
        isMinReached ? 'text-green-600 dark:text-green-400' : 'text-amber-600 dark:text-amber-400'
      )}>
        {isMinReached ? (
          <CheckCircle className="w-4 h-4" />
        ) : (
          <AlertCircle className="w-4 h-4" />
        )}
        <span>{wordCount} / {minWords} words</span>
      </div>
    </div>
  )
}
