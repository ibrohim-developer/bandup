"use client";

import Link from "@/components/no-prefetch-link";
import { usePathname } from "next/navigation";
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
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { signOut } from "@/actions/auth";
import { useTheme } from "next-themes";

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

const testRoutePattern =
  /^\/dashboard\/((reading|listening|writing)\/(?!history)[^/]+|speaking\/mock-exam\/[^/]+|full-mock-test\/(?!history)[^/]+|results\/[^/]+)$/;

export function Sidebar({ user }: SidebarProps) {
  const pathname = usePathname();
  const { theme, setTheme } = useTheme();

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
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            className="flex items-center gap-3 px-4 py-3 text-sm font-bold transition-all rounded-lg w-full text-muted-foreground hover:bg-muted"
          >
            <Sun className="h-5 w-5 shrink-0 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
            <Moon className="absolute h-5 w-5 shrink-0 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
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
                    {user?.email && (
                      <span className="text-xs text-muted-foreground truncate max-w-full">
                        {user.email}
                      </span>
                    )}
                  </div>
                  <DropdownMenuSeparator className="w-full" />
                  <DropdownMenuItem
                    className="cursor-pointer w-full justify-center group"
                    onClick={() => signOut()}
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
          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
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
              </DropdownMenuTrigger>
              <DropdownMenuContent
                align="end"
                side="bottom"
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
                    {user?.email && (
                      <span className="text-xs text-muted-foreground truncate max-w-full">
                        {user.email}
                      </span>
                    )}
                  </div>
                  <DropdownMenuSeparator className="w-full" />
                  <DropdownMenuItem
                    className="cursor-pointer w-full justify-center"
                    onClick={() =>
                      setTheme(theme === "dark" ? "light" : "dark")
                    }
                  >
                    <Sun className="mr-2 h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
                    <Moon className="absolute -ml-2 h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
                    <span className="ml-4">Toggle Theme</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    className="cursor-pointer w-full justify-center group"
                    onClick={() => signOut()}
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
              className="px-3 py-1.5 bg-primary text-primary-foreground rounded-lg font-bold text-xs hover:opacity-90 transition-all"
            >
              Sign In
            </Link>
          )}
        </div>
      </header>

      {/* Mobile Bottom Navigation */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-card border-t border-border">
        <div className="flex items-center justify-around px-2 py-2 safe-bottom">
          {[...testItems, ...learnItems].map((item) => {
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
