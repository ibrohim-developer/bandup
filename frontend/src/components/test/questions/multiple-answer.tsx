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
}: MultipleAnswerProps) {
  const selectedLetters = value ? value.split(',').filter(Boolean) : []
  const correctLetters = correctAnswer ? correctAnswer.split(',').filter(Boolean) : []

  const toggleOption = (letter: string) => {
    if (disabled) return
    const newSelected = selectedLetters.includes(letter)
      ? selectedLetters.filter((l) => l !== letter)
      : [...selectedLetters, letter].sort()
    onChange(newSelected.join(','))
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
    <div id={`question-${questionId}`} className="space-y-3">
      <div className="flex gap-2 items-start">
        <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded bg-gray-200 text-xs font-bold text-gray-700">
          {questionNumber}
        </span>
        <p className="text-sm leading-relaxed">
          {questionText}
          {getQuestionBadge()}
        </p>
      </div>

      <div className="ml-8 space-y-2">
        {options.map((option, index) => {
          const optionLetter = String.fromCharCode(65 + index)
          const isSelected = selectedLetters.includes(optionLetter)
          const isCorrectOption = correctLetters.includes(optionLetter)
          return (
            <div
              key={`${questionId}-${index}`}
              className={cn(
                'flex items-center space-x-3 rounded-lg border p-4 transition-colors',
                !disabled && 'cursor-pointer',
                reviewMode && isSelected && isCorrectOption && 'border-green-500 bg-green-50 dark:bg-green-950/20',
                reviewMode && isSelected && !isCorrectOption && 'border-red-500 bg-red-50 dark:bg-red-950/20',
                reviewMode && !isSelected && isCorrectOption && 'border-green-300 bg-green-50/50 dark:bg-green-950/10',
                !reviewMode && isSelected && 'border-primary bg-primary/5',
                !reviewMode && !isSelected && 'hover:bg-muted/50'
              )}
              onClick={() => toggleOption(optionLetter)}
            >
              <Checkbox
                checked={isSelected}
                disabled={disabled}
                className="pointer-events-none"
              />
              <Label
                className={cn("flex-1", !disabled && "cursor-pointer")}
              >
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
