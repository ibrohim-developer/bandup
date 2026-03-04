'use client'

import { useEffect } from 'react'
import { useTheme } from 'next-themes'
import type { ContrastMode } from '@/hooks/use-test-options'

export function ForceLightTheme() {
  useEffect(() => {
    const html = document.documentElement
    const wasDark = html.classList.contains('dark')
    html.classList.remove('dark')
    html.style.colorScheme = 'light'

    return () => {
      if (wasDark) {
        html.classList.add('dark')
        html.style.colorScheme = 'dark'
      }
    }
  }, [])

  return null
}

export function useSyncTestTheme(contrast: ContrastMode) {
  const { theme } = useTheme()
  const needsDark = contrast === 'white-on-black' || contrast === 'yellow-on-black'

  useEffect(() => {
    const html = document.documentElement

    if (needsDark) {
      html.classList.add('dark')
      html.style.colorScheme = 'dark'
    } else {
      html.classList.remove('dark')
      html.style.colorScheme = 'light'
    }

    return () => {
      // Restore dashboard theme when navigating back
      if (theme === 'dark') {
        html.classList.add('dark')
        html.style.colorScheme = 'dark'
      } else {
        html.classList.remove('dark')
        html.style.colorScheme = 'light'
      }
    }
  }, [needsDark, theme])
}
