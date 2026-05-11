import { ThemeProvider } from '@/components/theme-provider'
import { TestContextMenu } from '@/components/test/common/test-context-menu'

export default function ExamLayout({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="light"
      enableSystem
      disableTransitionOnChange
    >
      {children}
      <TestContextMenu module="full-mock-test" />
    </ThemeProvider>
  )
}
