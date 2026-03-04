"use client"

import { useMemo } from 'react'

export function useWordCount(text: string) {
  return useMemo(() => {
    if (!text || text.trim() === '') return 0
    return text.trim().split(/\s+/).filter(word => word.length > 0).length
  }, [text])
}
