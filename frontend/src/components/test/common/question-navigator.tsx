'use client'

import { cn } from '@/lib/utils'
import { useTestStore } from '@/stores/test-store'

interface QuestionNavigatorProps {
  totalQuestions: number
  questionsPerSection?: number[]
  onQuestionSelect: (section: number, question: number) => void
}

export function QuestionNavigator({
  totalQuestions,
  questionsPerSection = [10, 10, 10, 10],
  onQuestionSelect,
}: QuestionNavigatorProps) {
  const { currentSection, currentQuestion, answers } = useTestStore()

  let questionIndex = 0

  return (
    <div className="bg-card rounded-lg border p-4">
      <h3 className="font-semibold mb-4">Question Navigator</h3>
      <div className="space-y-4">
        {questionsPerSection.map((count, sectionIndex) => {
          const section = sectionIndex + 1
          const sectionQuestions = Array.from({ length: count }, (_, i) => {
            questionIndex++
            return questionIndex
          })

          // Reset for actual rendering
          const startIndex = questionsPerSection.slice(0, sectionIndex).reduce((a, b) => a + b, 0)

          return (
            <div key={section}>
              <p className="text-xs text-muted-foreground mb-2">Section {section}</p>
              <div className="grid grid-cols-5 gap-2">
                {Array.from({ length: count }, (_, i) => {
                  const qNum = i + 1
                  const globalQNum = startIndex + qNum
                  const questionId = `q-${globalQNum}`
                  const isAnswered = !!answers[questionId]
                  const isCurrent = currentSection === section && currentQuestion === qNum

                  return (
                    <button
                      key={qNum}
                      onClick={() => onQuestionSelect(section, qNum)}
                      className={cn(
                        'w-8 h-8 rounded text-sm font-medium transition-colors',
                        isCurrent && 'ring-2 ring-primary ring-offset-2',
                        isAnswered && !isCurrent && 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
                        !isAnswered && !isCurrent && 'bg-muted hover:bg-muted/80'
                      )}
                    >
                      {globalQNum}
                    </button>
                  )
                })}
              </div>
            </div>
          )
        })}
      </div>

      {/* Legend */}
      <div className="mt-6 pt-4 border-t flex flex-wrap gap-4 text-xs">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded bg-muted" />
          <span>Not answered</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded bg-green-100 dark:bg-green-900/30" />
          <span>Answered</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded ring-2 ring-primary ring-offset-1" />
          <span>Current</span>
        </div>
      </div>
    </div>
  )
}
