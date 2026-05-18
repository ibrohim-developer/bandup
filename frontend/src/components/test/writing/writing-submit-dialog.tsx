'use client'

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { AlertTriangle, Check } from 'lucide-react'

interface WritingTaskStatus {
  taskNumber: number
  wordCount: number
  minWords: number
}

interface WritingSubmitDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onConfirm: () => void
  tasks: WritingTaskStatus[]
  isSubmitting?: boolean
  timeUp?: boolean
}

export function WritingSubmitDialog({
  open,
  onOpenChange,
  onConfirm,
  tasks,
  isSubmitting = false,
  timeUp = false,
}: WritingSubmitDialogProps) {
  const underMinTasks = tasks.filter((t) => t.wordCount < t.minWords)
  const allMet = underMinTasks.length === 0

  const handleSubmit = () => {
    onConfirm()
    onOpenChange(false)
  }

  if (timeUp) {
    return (
      <Dialog open={open} onOpenChange={undefined}>
        <DialogContent
          onPointerDownOutside={(e) => e.preventDefault()}
          onEscapeKeyDown={(e) => e.preventDefault()}
        >
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-red-500" />
              Time&apos;s Up!
            </DialogTitle>
            <DialogDescription>
              Your time has expired. Your test is being submitted automatically.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button onClick={handleSubmit} disabled={isSubmitting}>
              {isSubmitting ? 'Submitting...' : 'Submit Test'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    )
  }

  if (allMet) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Finalize Your Test</DialogTitle>
            <DialogDescription>
              You&apos;ve met the word count for all tasks. Once you submit,
              your essay will be evaluated by AI and you won&apos;t be able to
              make further changes.
            </DialogDescription>
          </DialogHeader>
          <TaskBreakdown tasks={tasks} />
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button onClick={handleSubmit} disabled={isSubmitting}>
              {isSubmitting ? 'Submitting...' : 'Submit Test'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    )
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-amber-500" />
            Word Count Below Minimum
          </DialogTitle>
          <DialogDescription>
            {underMinTasks.length === 1 ? (
              <>
                Task {underMinTasks[0].taskNumber} requires at least{' '}
                <span className="font-semibold text-amber-600">
                  {underMinTasks[0].minWords} words
                </span>
                . Essays below the minimum lose marks for Task Achievement.
              </>
            ) : (
              <>
                Some tasks are below the required word count. Essays below the
                minimum lose marks for Task Achievement.
              </>
            )}
          </DialogDescription>
        </DialogHeader>

        <TaskBreakdown tasks={tasks} />

        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isSubmitting}
          >
            Keep Writing
          </Button>
          <Button onClick={handleSubmit} disabled={isSubmitting}>
            {isSubmitting ? 'Submitting...' : 'Submit Anyway'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

function TaskBreakdown({ tasks }: { tasks: WritingTaskStatus[] }) {
  return (
    <div className="py-2">
      <div className="bg-muted rounded-lg p-4 space-y-3">
        {tasks.map((task) => {
          const met = task.wordCount >= task.minWords
          return (
            <div
              key={task.taskNumber}
              className="flex items-center justify-between text-sm"
            >
              <div className="flex items-center gap-2">
                {met ? (
                  <Check className="h-4 w-4 text-green-600" />
                ) : (
                  <AlertTriangle className="h-4 w-4 text-amber-500" />
                )}
                <span className="font-medium">Task {task.taskNumber}</span>
                <span className="text-muted-foreground">
                  (min {task.minWords})
                </span>
              </div>
              <p
                className={`text-lg font-bold ${
                  met ? 'text-green-600' : 'text-amber-600'
                }`}
              >
                {task.wordCount}{' '}
                <span className="text-xs font-normal text-muted-foreground">
                  words
                </span>
              </p>
            </div>
          )
        })}
      </div>
    </div>
  )
}
