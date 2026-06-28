"use client";

import Link from "@/components/no-prefetch-link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import {
  BookOpenCheck,
  Headphones,
  PenTool,
  Mic,
  ClipboardList,
  LogOut,
  Sun,
  Moon,
  PlayCircle,
  Layers,
  LayoutDashboard,
  Clock,
  X,
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { signOut } from "@/actions/auth";
import { useTestStore } from "@/stores/test-store";
import { useTheme } from "next-themes";

// Clear any persisted in-progress test answers before signing out, so the next
// user on this browser can't inherit them from sessionStorage.
function handleSignOut() {
  try {
    useTestStore.getState().resetTest();
    useTestStore.persist.clearStorage();
  } catch {
    // best-effort — still sign out
  }
  signOut();
}

interface SidebarProps {
  user?: {
    id: string;
    email?: string;
    user_metadata?: {
      full_name?: string;
      avatar_url?: string;
    };
  } | null;
}

const testItems = [
  {
    title: "Dashboard",
    href: "/dashboard/progress",
    icon: LayoutDashboard,
  },
  {
    title: "Reading",
    href: "/dashboard/reading",
    icon: BookOpenCheck,
  },
  {
    title: "Listening",
    href: "/dashboard/listening",
    icon: Headphones,
  },
  {
    title: "Writing",
    href: "/dashboard/writing",
    icon: PenTool,
  },
  {
    title: "Speaking",
    href: "/dashboard/speaking",
    icon: Mic,
  },
  {
    title: "Full Mock Test",
    href: "/dashboard/full-mock-test",
    icon: ClipboardList,
  },
];

const learnItems = [
  {
    title: "Video Lessons",
    href: "/dashboard/videos",
    icon: PlayCircle,
  },
  {
    title: "Flashcards",
    href: "/dashboard/flashcards",
    icon: Layers,
  },
];

const mobileTestItems = testItems.filter((i) => i.href !== "/dashboard/progress");

const testRoutePattern =
  /^\/dashboard\/((reading|listening|writing)\/(?!history)[^/]+|speaking\/(?!(test|result|history|mock-exam|questions)$)[^/]+|speaking\/(mock-exam|test)\/[^/]+|full-mock-test\/(?!history)[^/]+|results\/[^/]+)$/;

export function Sidebar({ user }: SidebarProps) {
  const pathname = usePathname();
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  const isDark = mounted && resolvedTheme === "dark";

  // Hide sidebar on test pages
  if (testRoutePattern.test(pathname)) {
    return null;
  }

  const userInitials =
    user?.user_metadata?.full_name
      ?.split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2) ||
    user?.email?.[0]?.toUpperCase() ||
    "U";

  const isPlaceholderEmail = user?.email?.endsWith("@telegram.bandup.uz") ?? false;
  const displayEmail = isPlaceholderEmail ? null : user?.email;

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex fixed left-0 top-0 z-40 h-screen w-64 bg-card border-r border-border flex-col shrink-0">
        {/* Logo */}
        <div className="p-8 pointer-events-none">
          <span className="text-2xl font-black tracking-tighter text-foreground">
            band<span className="text-primary">.</span>up
          </span>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-4 space-y-1 overflow-y-auto">
          {testItems.map((item) => {
            const isActive = pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 px-4 py-3 text-sm font-bold transition-all rounded-lg",
                  isActive
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:bg-muted",
                )}
              >
                <item.icon className="h-5 w-5 shrink-0" />
                <span>{item.title}</span>
              </Link>
            );
          })}

          <div className="pt-3 mt-2 border-t border-border">
            <p className="px-4 pb-1 text-[10px] font-black uppercase tracking-widest text-muted-foreground/60">
              Learn
            </p>
            {learnItems.map((item) => {
              const isActive = pathname.startsWith(item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "flex items-center gap-3 px-4 py-3 text-sm font-bold transition-all rounded-lg",
                    isActive
                      ? "bg-primary text-primary-foreground"
                      : "text-muted-foreground hover:bg-muted",
                  )}
                >
                  <item.icon className="h-5 w-5 shrink-0" />
                  <span>{item.title}</span>
                </Link>
              );
            })}
          </div>
        </nav>

        {/* Theme Toggle */}
        <div className="px-4 pb-2">
          <button
            onClick={() => setTheme(isDark ? "light" : "dark")}
            className="flex items-center gap-3 px-4 py-3 text-sm font-bold transition-all rounded-lg w-full text-muted-foreground hover:bg-muted"
          >
            <span className="h-5 w-5 shrink-0" suppressHydrationWarning>
              {mounted && (isDark ? <Moon className="h-5 w-5" /> : <Sun className="h-5 w-5" />)}
            </span>
            <span>Toggle Theme</span>
          </button>
        </div>

        {/* User Profile */}
        <div className="p-4 border-t border-border">
          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="flex items-center gap-3 w-full text-left px-2 py-1 rounded-lg hover:bg-muted transition-colors">
                  <Avatar className="h-10 w-10">
                    <AvatarImage
                      src={user?.user_metadata?.avatar_url}
                      alt={user?.user_metadata?.full_name || "User"}
                    />
                    <AvatarFallback className="bg-muted text-muted-foreground font-bold">
                      {userInitials}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex flex-col flex-1 min-w-0">
                    <span className="text-xs font-bold truncate">
                      {user?.user_metadata?.full_name || "User"}
                    </span>
                  </div>
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                align="start"
                side="top"
                className="w-64 p-4"
              >
                <div className="flex flex-col items-center gap-3">
                  <Avatar className="h-16 w-16">
                    <AvatarImage
                      src={user?.user_metadata?.avatar_url}
                      alt={user?.user_metadata?.full_name || "User"}
                    />
                    <AvatarFallback className="bg-muted text-muted-foreground font-bold text-lg">
                      {userInitials}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex flex-col items-center text-center">
                    <span className="text-sm font-bold">
                      {user?.user_metadata?.full_name || "User"}
                    </span>
                    {displayEmail && (
                      <span className="text-xs text-muted-foreground truncate max-w-full">
                        {displayEmail}
                      </span>
                    )}
                  </div>
                  <DropdownMenuSeparator className="w-full" />
                  <DropdownMenuItem asChild className="cursor-pointer w-full justify-center">
                    <Link href="/dashboard/history">
                      <Clock className="mr-2 h-4 w-4" />
                      <span>Test History</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    className="cursor-pointer w-full justify-center group"
                    onClick={handleSignOut}
                  >
                    <LogOut className="mr-2 h-4 w-4 text-foreground group-hover:text-white dark:group-hover:text-white" />
                    <span>Sign Out</span>
                  </DropdownMenuItem>
                </div>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Link
              href="/sign-in"
              className="flex items-center justify-center gap-2 w-full px-4 py-3 bg-primary text-primary-foreground rounded-lg font-bold text-sm hover:opacity-90 transition-all"
            >
              <LogOut className="h-4 w-4" />
              Sign In
            </Link>
          )}
        </div>
      </aside>

      {/* Mobile Top Header */}
      <header className="md:hidden fixed top-0 left-0 right-0 z-40 bg-card border-b border-border">
        <div className="flex items-center justify-between px-4 py-3">
          <span className="text-xl font-black tracking-tighter text-foreground pointer-events-none">
            band<span className="text-primary">.</span>up
          </span>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setTheme(isDark ? "light" : "dark")}
              aria-label="Toggle theme"
              className="flex h-10 w-10 items-center justify-center rounded-full text-muted-foreground hover:bg-muted transition-colors"
            >
              <span className="h-5 w-5" suppressHydrationWarning>
                {mounted && (isDark ? <Moon className="h-5 w-5" /> : <Sun className="h-5 w-5" />)}
              </span>
            </button>
          {user ? (
            <Sheet>
              <SheetTrigger asChild>
                <button className="rounded-full focus:outline-none focus:ring-2 focus:ring-primary">
                  <Avatar className="h-8 w-8">
                    <AvatarImage
                      src={user?.user_metadata?.avatar_url}
                      alt={user?.user_metadata?.full_name || "User"}
                    />
                    <AvatarFallback className="bg-muted text-muted-foreground font-bold text-xs">
                      {userInitials}
                    </AvatarFallback>
                  </Avatar>
                </button>
              </SheetTrigger>
              <SheetContent
                side="right"
                className="w-full max-w-none p-0 gap-0"
                showCloseButton={false}
              >
                <SheetTitle className="sr-only">Account menu</SheetTitle>

                {/* Drawer header */}
                <div className="flex items-center justify-between px-5 pt-5 pb-2">
                  <span className="text-xl font-black tracking-tighter text-foreground">
                    band<span className="text-primary">.</span>up
                  </span>
                  <SheetClose asChild>
                    <button
                      aria-label="Close menu"
                      className="flex h-10 w-10 items-center justify-center rounded-full text-muted-foreground hover:bg-muted transition-colors"
                    >
                      <X className="h-6 w-6" />
                    </button>
                  </SheetClose>
                </div>

                {/* Profile block */}
                <div className="flex flex-col items-center gap-3 px-6 pt-4 pb-6 border-b border-border">
                  <Avatar className="h-20 w-20">
                    <AvatarImage
                      src={user?.user_metadata?.avatar_url}
                      alt={user?.user_metadata?.full_name || "User"}
                    />
                    <AvatarFallback className="bg-muted text-muted-foreground font-bold text-2xl">
                      {userInitials}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex flex-col items-center text-center">
                    <span className="text-lg font-bold">
                      {user?.user_metadata?.full_name || "User"}
                    </span>
                    {displayEmail && (
                      <span className="text-sm text-muted-foreground truncate max-w-full">
                        {displayEmail}
                      </span>
                    )}
                  </div>
                </div>

                {/* Menu items */}
                <nav className="flex-1 overflow-y-auto p-4 space-y-1">
                  {[
                    { title: "Dashboard", href: "/dashboard/progress", icon: LayoutDashboard },
                    { title: "Test History", href: "/dashboard/history", icon: Clock },
                    ...learnItems,
                  ].map((item) => {
                    const isActive = pathname.startsWith(item.href);
                    return (
                      <SheetClose asChild key={item.href}>
                        <Link
                          href={item.href}
                          className={cn(
                            "flex items-center gap-4 px-4 h-12 rounded-xl text-base font-bold transition-colors",
                            isActive
                              ? "bg-primary/10 text-primary"
                              : "text-foreground hover:bg-muted",
                          )}
                        >
                          <item.icon className="h-5 w-5 shrink-0" />
                          <span>{item.title}</span>
                        </Link>
                      </SheetClose>
                    );
                  })}
                </nav>

                {/* Footer */}
                <div className="mt-auto border-t border-border p-4 space-y-1">
                  <button
                    onClick={() => setTheme(isDark ? "light" : "dark")}
                    className="flex items-center gap-4 px-4 h-12 w-full rounded-xl text-base font-bold text-foreground hover:bg-muted transition-colors"
                  >
                    <span className="h-5 w-5 shrink-0" suppressHydrationWarning>
                      {mounted && (isDark ? <Moon className="h-5 w-5" /> : <Sun className="h-5 w-5" />)}
                    </span>
                    <span>Toggle Theme</span>
                  </button>
                  <button
                    onClick={handleSignOut}
                    className="flex items-center gap-4 px-4 h-12 w-full rounded-xl text-base font-bold text-foreground hover:bg-muted transition-colors"
                  >
                    <LogOut className="h-5 w-5 shrink-0" />
                    <span>Sign Out</span>
                  </button>
                </div>
              </SheetContent>
            </Sheet>
          ) : (
            <Link
              href="/sign-in"
              className="px-3 py-1.5 bg-primary text-primary-foreground rounded-lg font-bold text-xs hover:opacity-90 transition-all"
            >
              Sign In
            </Link>
          )}
          </div>
        </div>
      </header>

      {/* Mobile Bottom Navigation */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-card border-t border-border">
        <div className="flex items-center justify-around px-2 py-2 safe-bottom">
          {mobileTestItems.map((item) => {
            const isActive =
              item.href === "/dashboard"
                ? pathname === "/dashboard"
                : pathname.startsWith(item.href);

            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "relative flex flex-col items-center gap-1 px-3 py-1.5 text-[11px] font-bold transition-all rounded-lg min-w-0",
                  isActive ? "text-primary" : "text-muted-foreground",
                )}
              >
                <item.icon className="h-5 w-5 shrink-0" />
                <span className="truncate">{item.title}</span>
              </Link>
            );
          })}
        </div>
      </nav>
    </>
  );
}
