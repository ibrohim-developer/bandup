"use client"

import { useEffect, useCallback, useRef } from 'react'
import { useTestStore } from '@/stores/test-store'

export function useTestTimer(onTimeUp?: () => void) {
  const { timeRemaining, isTimerRunning, tick, pauseTimer, resumeTimer } = useTestStore()
  const onTimeUpRef = useRef(onTimeUp)

  useEffect(() => {
    onTimeUpRef.current = onTimeUp
  }, [onTimeUp])

  // Interval lifecycle: only depends on isTimerRunning — not recreated on every tick
  useEffect(() => {
    if (!isTimerRunning || timeRemaining <= 0) return

    const id = setInterval(() => {
      tick()
    }, 1000)

    return () => clearInterval(id)
  }, [isTimerRunning, tick]) // eslint-disable-line react-hooks/exhaustive-deps

  // Time-up detection: separate from the interval
  useEffect(() => {
    if (timeRemaining === 0 && isTimerRunning) {
      onTimeUpRef.current?.()
    }
  }, [timeRemaining, isTimerRunning])

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
