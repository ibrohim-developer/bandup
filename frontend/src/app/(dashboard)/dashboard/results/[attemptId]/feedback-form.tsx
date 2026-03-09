'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { toast } from 'sonner'

export function FeedbackForm({ attemptId }: { attemptId: string }) {
  const [message, setMessage] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)

  const handleSubmit = async () => {
    if (!message.trim()) return

    setIsSubmitting(true)
    try {
      const res = await fetch('/api/feedback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message, attemptId }),
      })

      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.error || 'Failed to submit feedback')
      }

      setIsSubmitted(true)
      toast.success('Thank you for your feedback!')
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to submit feedback. Please try again.'
      toast.error(errorMessage)
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isSubmitted) {
    return (
      <section className="border-1 border-border rounded-xl p-8 mb-16">
        <h3 className="text-2xl font-bold uppercase mb-4 tracking-tight">Your Feedback</h3>
        <p className="text-muted-foreground">Thank you for your feedback! It helps us improve.</p>
      </section>
    )
  }

  return (
    <section className="border-1 border-border rounded-xl p-8 mb-16">
      <h3 className="text-2xl font-bold uppercase mb-6 tracking-tight">Your Feedback</h3>
      <div className="space-y-6">
        <textarea
          className="w-full rounded-xl border-1 border-border focus:border-foreground focus:ring-0 text-lg p-6 font-medium placeholder:text-muted-foreground/40 transition-all bg-background"
          placeholder="Share your thoughts or report an issue with this test..."
          rows={6}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          disabled={isSubmitting}
        />
        <div className="flex justify-end">
          <Button
            className="px-10 py-6 rounded-xl font-bold text-sm tracking-widest uppercase"
            onClick={handleSubmit}
            disabled={isSubmitting || !message.trim()}
          >
            {isSubmitting ? 'Submitting...' : 'Submit Feedback'}
          </Button>
        </div>
      </div>
    </section>
  )
}
