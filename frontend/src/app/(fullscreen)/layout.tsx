import { ThemeProvider } from "@/components/theme-provider";

export default function FullscreenLayout({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider attribute="class" defaultTheme="light" enableSystem disableTransitionOnChange>
      <main className="flex flex-col min-h-screen overflow-y-auto bg-background">
        {children}
      </main>
    </ThemeProvider>
  );
}
