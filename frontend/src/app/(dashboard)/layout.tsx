import type { Metadata } from 'next'
import { Suspense } from 'react'
import { Sidebar } from '@/components/layout/sidebar'
import { DashboardMain } from '@/components/layout/dashboard-main'
import { ThemeProvider } from '@/components/theme-provider'
import { getCurrentUser } from '@/lib/strapi/server'

export const metadata: Metadata = {
  title: {
    template: '%s | BandUp IELTS',
    default: 'Dashboard | BandUp IELTS',
  },
}

async function AuthSidebar() {
  const user = await getCurrentUser()
  const mappedUser = user ? {
    id: String(user.id),
    email: user.email,
    user_metadata: {
      full_name: user.full_name,
      avatar_url: user.avatar_url,
    },
  } : null
  return <Sidebar user={mappedUser} />
}

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="light"
      enableSystem
      disableTransitionOnChange
    >
      <div className="flex h-screen overflow-hidden" style={{ fontFamily: 'Arial, sans-serif' }}>
        <Suspense fallback={<Sidebar />}>
          <AuthSidebar />
        </Suspense>
        <DashboardMain>
          {children}
        </DashboardMain>
      </div>
    </ThemeProvider>
  )
}
