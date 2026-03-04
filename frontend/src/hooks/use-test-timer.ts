"use client"

import { useEffect, useCallback, useRef } from 'react'
import { useTestStore } from '@/stores/test-store'

export function useTestTimer(onTimeUp?: () => void) {
  const { timeRemaining, isTimerRunning, tick, pauseTimer, resumeTimer } = useTestStore()
  const intervalRef = useRef<NodeJS.Timeout | null>(null)
  const onTimeUpRef = useRef(onTimeUp)

  useEffect(() => {
    onTimeUpRef.current = onTimeUp
  }, [onTimeUp])

  useEffect(() => {
    if (isTimerRunning && timeRemaining > 0) {
      intervalRef.current = setInterval(() => {
        tick()
      }, 1000)
    } else if (timeRemaining === 0 && isTimerRunning) {
      onTimeUpRef.current?.()
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }
  }, [isTimerRunning, timeRemaining, tick])

  const formatTime = useCallback((seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }, [])

  return {
    timeRemaining,
    formattedTime: formatTime(timeRemaining),
    isRunning: isTimerRunning,
    isLowTime: timeRemaining <= 300, // 5 minutes
    isCritical: timeRemaining <= 60, // 1 minute
    pause: pauseTimer,
    resume: resumeTimer,
  }
}
