import type { Metadata } from "next";
import { ThemeProvider } from '@/components/theme-provider'

export const metadata: Metadata = {
  robots: { index: false, follow: false },
};

export default function AuthLayout({
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
      <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-background p-4 relative">
        <div className="w-full max-w-[440px] relative z-10">
          {children}
        </div>
        {/* Decorative background blobs */}
        <div className="fixed top-0 left-0 w-full h-full -z-10 overflow-hidden pointer-events-none opacity-20 dark:opacity-5">
          <div className="absolute -top-[10%] -left-[10%] w-[40%] h-[40%] bg-primary rounded-full blur-[120px]" />
          <div className="absolute -bottom-[10%] -right-[10%] w-[30%] h-[30%] bg-primary rounded-full blur-[100px]" />
        </div>
      </div>
    </ThemeProvider>
  )
}
