"use client";

import Link from "@/components/no-prefetch-link";
import { useEffect, useState } from "react";

export default function NotFound() {
  const [theme, setTheme] = useState<"light" | "dark">("light");

  useEffect(() => {
    const stored = localStorage.getItem("theme");
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    const initial = stored === "dark" || stored === "light" ? stored : prefersDark ? "dark" : "light";
    setTheme(initial as "light" | "dark");
    document.documentElement.classList.toggle("dark", initial === "dark");
  }, []);

  const toggleTheme = () => {
    const next = theme === "light" ? "dark" : "light";
    setTheme(next);
    localStorage.setItem("theme", next);
    document.documentElement.classList.toggle("dark", next === "dark");
  };

  return (
    <div className="relative flex min-h-screen w-full flex-col overflow-x-hidden bg-background">
      {/* Theme Toggle */}
      <div className="absolute top-8 right-8 z-20">
        <button
          onClick={toggleTheme}
          className="p-3 rounded-lg border border-border bg-card text-foreground hover:bg-muted transition-colors"
          aria-label="Toggle theme"
        >
          {theme === "light" ? (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M21.752 15.002A9.718 9.718 0 0118 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 003 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 006.002-2.082 9.718 9.718 0 003-3.916z" />
            </svg>
          ) : (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v2.25m6.364.386l-1.591 1.591M21 12h-2.25m-.386 6.364l-1.591-1.591M12 18.75V21m-4.773-4.227l-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z" />
            </svg>
          )}
        </button>
      </div>

      {/* Main Content */}
      <main className="flex flex-1 flex-col items-center justify-center px-6 relative">
        {/* Subtle Dot Grid Background */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            backgroundImage: "radial-gradient(var(--primary) 0.5px, transparent 0.5px)",
            backgroundSize: "24px 24px",
            opacity: 0.03,
          }}
        />

        <div className="max-w-3xl w-full text-center z-10">
          {/* 404 Display */}
          <h1 className="text-foreground text-[120px] md:text-[220px] font-black leading-none tracking-tighter select-none">
            404
          </h1>

          {/* Text Content */}
          <div className="mt-4 space-y-4">
            <h2 className="text-foreground text-3xl md:text-5xl font-extrabold tracking-tight uppercase">
              Page Not Found
            </h2>
            <p className="text-muted-foreground text-lg md:text-xl font-medium max-w-xl mx-auto leading-relaxed">
              It seems you&apos;ve wandered off the preparation path.{" "}
              <br className="hidden md:block" />
              Let&apos;s get you back to your IELTS practice.
            </p>
          </div>

          {/* Actions */}
          <div className="mt-12 flex flex-col items-center gap-8">
            <Link
              href="/dashboard/reading"
              className="bg-primary text-primary-foreground text-base md:text-lg font-bold tracking-widest px-12 py-5 rounded-lg shadow-xl shadow-primary/20 uppercase"
            >
              Back to Dashboard
            </Link>
          </div>
        </div>
      </main>

      {/* Footer Decoration */}
      <footer className="py-12 px-8 flex justify-between items-end">
        <div className="flex gap-2">
          <div className="h-12 w-1 bg-primary" />
          <div className="h-12 w-1 bg-foreground" />
          <div className="h-12 w-1 bg-border" />
        </div>
        <div className="text-[10px] text-muted-foreground font-bold uppercase tracking-[0.2em]">
          &copy; 2026 band.up
        </div>
      </footer>

      {/* Background Decoration */}
      <div
        className="fixed top-0 right-0 w-1/4 h-full bg-muted -z-10 opacity-50 hidden lg:block"
        style={{ clipPath: "polygon(100% 0, 0% 100%, 100% 100%)" }}
      />
    </div>
  );
}
