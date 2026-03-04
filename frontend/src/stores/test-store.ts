"use client"

import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'

interface Answer {
  questionId: string
  answer: string
  answeredAt: Date
}

interface TestState {
  testId: string | null
  moduleType: 'listening' | 'reading' | 'writing' | null
  currentSection: number
  currentQuestion: number
  timeRemaining: number
  isTimerRunning: boolean
  answers: Record<string, Answer>

  // Actions
  initTest: (testId: string, moduleType: 'listening' | 'reading' | 'writing', totalTime: number, startTimer?: boolean) => void
  setAnswer: (questionId: string, answer: string) => void
  goToQuestion: (section: number, question: number) => void
  tick: () => void
  pauseTimer: () => void
  resumeTimer: () => void
  resetTest: () => void
  setTimeRemaining: (time: number) => void
}

export const useTestStore = create<TestState>()(
  persist(
    (set) => ({
      testId: null,
      moduleType: null,
      currentSection: 1,
      currentQuestion: 1,
      timeRemaining: 0,
      isTimerRunning: false,
      answers: {},

      initTest: (testId, moduleType, totalTime, startTimer = true) => set({
        testId,
        moduleType,
        currentSection: 1,
        currentQuestion: 1,
        timeRemaining: totalTime,
        isTimerRunning: startTimer,
        answers: {},
      }),

      setAnswer: (questionId, answer) => set((state) => ({
        answers: {
          ...state.answers,
          [questionId]: {
            questionId,
            answer,
            answeredAt: new Date(),
          },
        },
      })),

      goToQuestion: (section, question) => set({
        currentSection: section,
        currentQuestion: question,
      }),

      tick: () => set((state) => ({
        timeRemaining: Math.max(0, state.timeRemaining - 1),
      })),

      pauseTimer: () => set({ isTimerRunning: false }),
      resumeTimer: () => set({ isTimerRunning: true }),

      setTimeRemaining: (time) => set({ timeRemaining: time }),

      resetTest: () => set({
        testId: null,
        moduleType: null,
        currentSection: 1,
        currentQuestion: 1,
        timeRemaining: 0,
        isTimerRunning: false,
        answers: {},
      }),
    }),
    {
      name: 'ielts-test-storage',
      storage: createJSONStorage(() => sessionStorage),
      partialize: (state) => ({
        testId: state.testId,
        moduleType: state.moduleType,
        currentSection: state.currentSection,
        currentQuestion: state.currentQuestion,
        timeRemaining: state.timeRemaining,
        answers: state.answers,
      }),
    }
  )
)
