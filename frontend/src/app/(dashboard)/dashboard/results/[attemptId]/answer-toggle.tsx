'use client'

import { useState } from 'react'
import { CheckCircle, XCircle } from 'lucide-react'
import { cn } from '@/lib/utils'

interface AnswerResult {
  id: string
  questionNumber: number
  questionText: string
  userAnswer: string
  correctAnswer: string
  isCorrect: boolean
}

export function AnswerToggle({ answerResults }: { answerResults: AnswerResult[] }) {
  const [showAnswers, setShowAnswers] = useState(false)

  return (
    <>
      <div className="p-8 border-b border-border flex flex-col lg:flex-row items-center justify-between gap-6">
          <h3 className="text-2xl font-bold uppercase whitespace-nowrap tracking-tight">
            Detailed Review
          </h3>
         <div className="flex items-center gap-3  px-4 py-2 rounded-lg border border-border cursor-pointer" onClick={() => setShowAnswers(!showAnswers)}>
            <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
              Show Correct Answers
            </span>
            <button
              className={cn(
                'cursor-pointer relative inline-flex items-center h-6 rounded-full w-12 transition-colors duration-200 ease-in-out border-1',
                showAnswers
                  ? 'bg-primary border-primary'
                  : 'bg-background border-foreground'
              )}
            >
              <span
                className={cn(
                  'inline-block w-4 h-4 rounded-full transition duration-200 ease-in-out',
                  showAnswers
                    ? 'translate-x-6 bg-white'
                    : 'translate-x-1 bg-foreground'
                )}
              />
            </button>
          </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead>
            <tr className="bg-muted border-b border-border">
              <th className="px-8 py-5 text-xs font-bold uppercase text-muted-foreground">
                Question #
              </th>
              <th className="px-8 py-5 text-xs font-bold uppercase text-muted-foreground">
                Your Answer
              </th>
              <th className="px-8 py-5 text-xs font-bold uppercase text-muted-foreground">
                Correct Answer
              </th>
              <th className="px-8 py-5 text-xs font-bold uppercase text-muted-foreground text-right">
                Status
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {answerResults.map((result) => (
              <tr key={result.id} className="hover:bg-muted/50 transition-colors">
                <td className="px-8 py-5 font-bold text-lg">
                  {result.questionNumber}
                </td>
                <td
                  className={cn(
                    'px-8 py-5 font-bold text-lg',
                    result.isCorrect ? 'text-green-500' : 'text-red-500'
                  )}
                >
                  {result.userAnswer}
                </td>
                <td
                  className={cn(
                    'px-8 py-5 font-bold text-lg transition-all duration-300',
                    !showAnswers && 'opacity-20 blur-sm select-none'
                  )}
                >
                  {result.correctAnswer}
                </td>
                <td className="px-8 py-5 text-right">
                  {result.isCorrect ? (
                    <CheckCircle className="h-7 w-7 text-green-500 inline-block" />
                  ) : (
                    <XCircle className="h-7 w-7 text-red-500 inline-block" />
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  )
}
