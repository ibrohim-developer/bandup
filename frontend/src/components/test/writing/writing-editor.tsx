'use client'

import { toast } from 'sonner'
import { Textarea } from '@/components/ui/textarea'
import { WordCounter } from './word-counter'

interface WritingEditorProps {
  value: string
  onChange: (value: string) => void
  minWords: number
  placeholder?: string
  disabled?: boolean
  onTypedDelta?: (delta: number) => void
}

// Single change events larger than this are treated as bulk insertions
// (paste-like) and not credited as typed characters. Generous enough to
// allow IME composition commits and autocomplete word replacements.
const MAX_TYPED_DELTA = 12

export function WritingEditor({
  value,
  onChange,
  minWords,
  placeholder = 'Start writing your response here...',
  disabled = false,
  onTypedDelta
}: WritingEditorProps) {
  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 relative">
        <Textarea
          value={value}
          onChange={(e) => {
            const next = e.target.value
            const delta = next.length - value.length
            if (delta > 0 && delta <= MAX_TYPED_DELTA) {
              onTypedDelta?.(delta)
            }
            onChange(next)
          }}
          onPaste={(e) => {
            e.preventDefault()
            toast.error('Pasting is disabled. Please type your response.')
          }}
          onDrop={(e) => {
            e.preventDefault()
            toast.error('Dropping text is disabled. Please type your response.')
          }}
          placeholder={placeholder}
          disabled={disabled}
          className="w-full h-full min-h-[400px] resize-none p-4 text-base leading-relaxed"
          spellCheck={true}
        />
      </div>
      <div className="mt-4">
        <WordCounter text={value} minWords={minWords} />
      </div>
    </div>
  )
}
