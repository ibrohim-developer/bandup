'use client'

import { useEffect, useRef, useState } from 'react'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import { ScrollContainerContext } from '@/components/test/common/scroll-container-context'

const testRoutePattern = /^\/dashboard\/((reading|listening|writing)\/(?!history)[^/]+|speaking\/(?!(test|result|history|mock-exam|questions)$)[^/]+|speaking\/(mock-exam|history|test)\/[^/]+|results\/[^/]+)$/

export function DashboardMain({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const isTestPage = testRoutePattern.test(pathname)
  const mainRef = useRef<HTMLElement | null>(null)
  const [scrollElement, setScrollElement] = useState<HTMLElement | null>(null)

  useEffect(() => {
    setScrollElement(mainRef.current)
  }, [])

  return (
    <ScrollContainerContext.Provider value={scrollElement}>
      <main
        ref={mainRef}
        className={cn(
          'flex-1 flex flex-col min-w-0 overflow-y-auto bg-background',
          !isTestPage && 'md:pl-64'
        )}
      >
        <div className={cn(!isTestPage && 'pt-16 px-4 pb-24 md:pt-8 md:px-8 md:pb-8')}>
          {children}
        </div>
      </main>
    </ScrollContainerContext.Provider>
  )
}
