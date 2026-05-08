'use client'

import { useEffect, useState } from 'react'
import { Star } from 'lucide-react'
import { toast } from 'sonner'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'

const DISMISSED_KEY = 'feedback_modal_dismissed'

interface FeedbackModalProps {
  attemptId: string
  attemptCount: number
  delayMs?: number
}

export function FeedbackModal({ attemptId, attemptCount, delayMs = 3000 }: FeedbackModalProps) {
  const [open, setOpen] = useState(false)
  const [rating, setRating] = useState(0)
  const [hovered, setHovered] = useState(0)
  const [message, setMessage] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isDone, setIsDone] = useState(false)

  useEffect(() => {
    if (attemptCount < 2) return
    if (typeof window !== 'undefined' && localStorage.getItem(DISMISSED_KEY)) return
    const t = setTimeout(() => setOpen(true), delayMs)
    return () => clearTimeout(t)
  }, [attemptCount, delayMs])

  const handleDismiss = () => {
    if (!rating) {
      localStorage.setItem(DISMISSED_KEY, '1')
    }
    setOpen(false)
  }

  const handleSubmit = async () => {
    if (!rating) return

    setIsSubmitting(true)
    try {
      const res = await fetch('/api/feedback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ rating, message: message.trim() || null, attemptId }),
      })

      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.error || 'Failed to submit feedback')
      }

      setIsDone(true)
      toast.success('Thank you for your feedback!')
      setTimeout(() => setOpen(false), 1500)
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to submit. Please try again.'
      toast.error(errorMessage)
    } finally {
      setIsSubmitting(false)
    }
  }

  const placeholder =
    rating >= 4
      ? 'What did you like most? (optional)'
      : rating > 0
      ? 'What could be better? (optional)'
      : 'Share your thoughts... (optional)'

  return (
    <Dialog open={open} onOpenChange={(v) => { if (!v) handleDismiss() }}>
      <DialogContent className="max-w-md rounded-2xl p-8">
        {isDone ? (
          <div className="flex flex-col items-center gap-3 py-4 text-center">
            <p className="text-2xl font-bold uppercase tracking-tight">Thank you!</p>
            <p className="text-muted-foreground">Your feedback helps us improve.</p>
          </div>
        ) : (
          <>
            <DialogHeader className="mb-2">
              <DialogTitle className="text-2xl font-bold uppercase tracking-tight">
                How was this test?
              </DialogTitle>
              <DialogDescription className="text-sm text-muted-foreground">
                Rate your experience — it only takes a second.
              </DialogDescription>
            </DialogHeader>

            <div className="flex justify-center gap-2 py-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setRating(star)}
                  onMouseEnter={() => setHovered(star)}
                  onMouseLeave={() => setHovered(0)}
                  className="transition-transform hover:scale-110 focus:outline-none"
                  aria-label={`Rate ${star} star${star > 1 ? 's' : ''}`}
                >
                  <Star
                    className="h-10 w-10"
                    fill={(hovered || rating) >= star ? 'currentColor' : 'none'}
                    strokeWidth={1.5}
                    style={{
                      color: (hovered || rating) >= star ? '#f59e0b' : undefined,
                    }}
                  />
                </button>
              ))}
            </div>

            {rating > 0 && (
              <textarea
                className="w-full rounded-xl border border-border focus:border-foreground focus:ring-0 text-base p-4 font-medium placeholder:text-muted-foreground/40 transition-all bg-background resize-none mt-2"
                placeholder={placeholder}
                rows={3}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                disabled={isSubmitting}
                autoCorrect="off"
                autoCapitalize="none"
                spellCheck={false}
                data-form-type="other"
              />
            )}

            <div className="flex items-center justify-between mt-2">
              <button
                type="button"
                onClick={handleDismiss}
                className="text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                Skip
              </button>
              <Button
                className="px-8 py-5 rounded-xl font-bold text-sm tracking-widest uppercase"
                onClick={handleSubmit}
                disabled={isSubmitting || !rating}
              >
                {isSubmitting ? 'Submitting...' : 'Submit'}
              </Button>
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  )
}
