'use client'

import { Checkbox } from '@/components/ui/checkbox'
import { Label } from '@/components/ui/label'
import { cn } from '@/lib/utils'
import { CheckCircle, XCircle } from 'lucide-react'

interface MultipleAnswerProps {
  questionId: string
  questionNumber: number
  questionText: string
  options: string[]
  value: string
  onChange: (value: string) => void
  disabled?: boolean
  reviewMode?: boolean
  correctAnswer?: string
  isCorrect?: boolean
  isUnanswered?: boolean
  maxSelections?: number
}

export function MultipleAnswer({
  questionId,
  questionNumber,
  questionText,
  options,
  value,
  onChange,
  disabled,
  reviewMode,
  correctAnswer,
  isCorrect,
  isUnanswered,
  maxSelections = 2,
}: MultipleAnswerProps) {
  const selectedLetters = value ? value.split(',').filter(Boolean) : []
  const correctLetters = correctAnswer ? correctAnswer.split(',').filter(Boolean) : []
  const limitReached = selectedLetters.length >= maxSelections

  const toggleOption = (letter: string) => {
    if (disabled) return
    if (selectedLetters.includes(letter)) {
      onChange(selectedLetters.filter((l) => l !== letter).join(','))
    } else {
      if (limitReached) return
      onChange([...selectedLetters, letter].sort().join(','))
    }
  }

  const getQuestionBadge = () => {
    if (!reviewMode) return null

    if (isUnanswered) {
      return <span className="ml-2 text-xs px-2 py-1 rounded bg-red-100 dark:bg-red-950/30 text-red-600 dark:text-red-400">Unanswered</span>
    }

    if (isCorrect) {
      return <CheckCircle className="ml-2 h-5 w-5 text-green-600 inline" />
    } else {
      return <XCircle className="ml-2 h-5 w-5 text-red-600 inline" />
    }
  }

  return (
    <div id={`question-${questionId}`} className="space-y-2">
      <div>
        <p className="text-sm leading-relaxed">
          <span className="font-bold mr-2">{questionNumber}</span>
          {questionText}
          {getQuestionBadge()}
        </p>
        {!reviewMode && (
          <p className="text-xs text-muted-foreground mt-0.5 ml-5">
            Choose {maxSelections} answers ({selectedLetters.length}/{maxSelections} selected)
          </p>
        )}
      </div>

      <div className="space-y-0 flex flex-col gap-1">
        {options.map((option, index) => {
          const optionLetter = String.fromCharCode(65 + index)
          const isSelected = selectedLetters.includes(optionLetter)
          const isCorrectOption = correctLetters.includes(optionLetter)
          const isDisabledByLimit = !isSelected && limitReached && !disabled
          return (
            <div
              key={`${questionId}-${index}`}
              className={cn(
                'flex items-center gap-3 px-4 py-3 w-full transition-colors',
                !disabled && !isDisabledByLimit && 'cursor-pointer',
                isDisabledByLimit && 'cursor-not-allowed opacity-50',
                reviewMode && isSelected && isCorrectOption && 'bg-green-100 dark:bg-green-950/30',
                reviewMode && isSelected && !isCorrectOption && 'bg-red-100 dark:bg-red-950/30',
                reviewMode && !isSelected && isCorrectOption && 'bg-green-50 dark:bg-green-950/10',
                !reviewMode && isSelected && 'bg-gray-200 dark:bg-muted',
                !reviewMode && !isSelected && !isDisabledByLimit && 'hover:bg-gray-100 dark:hover:bg-muted/50',
              )}
              onClick={() => toggleOption(optionLetter)}
            >
              <Checkbox
                checked={isSelected}
                disabled={disabled || isDisabledByLimit}
                className="pointer-events-none shrink-0"
              />
              <Label className={cn("flex-1 text-sm font-medium text-foreground", !disabled && !isDisabledByLimit && "cursor-pointer")}>
                <span className="font-semibold mr-2">{optionLetter}.</span>
                {option}
              </Label>
            </div>
          )
        })}
      </div>
    </div>
  )
}
