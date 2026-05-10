'use client'

import { useEffect } from 'react'
import { fbEvent } from '@/lib/pixel'

export function SignupPixelTracker() {
  useEffect(() => {
    if (typeof window === 'undefined') return
    const url = new URL(window.location.href)
    if (url.searchParams.get('signup') !== '1') return

    fbEvent('CompleteRegistration', {
      content_name: 'free_account',
      status: true,
    })

    url.searchParams.delete('signup')
    window.history.replaceState({}, '', url.pathname + url.search + url.hash)
  }, [])

  return null
}
