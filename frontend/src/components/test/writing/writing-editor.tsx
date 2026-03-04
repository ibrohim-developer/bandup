'use client'

import { Textarea } from '@/components/ui/textarea'
import { WordCounter } from './word-counter'

interface WritingEditorProps {
  value: string
  onChange: (value: string) => void
  minWords: number
  placeholder?: string
  disabled?: boolean
}

export function WritingEditor({
  value,
  onChange,
  minWords,
  placeholder = 'Start writing your response here...',
  disabled = false
}: WritingEditorProps) {
  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 relative">
        <Textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
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
