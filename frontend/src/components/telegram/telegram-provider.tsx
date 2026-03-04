"use client";

import { useEffect, useState, createContext, useContext } from "react";
import { useRouter, usePathname } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

interface TelegramContextValue {
  isTelegram: boolean;
  isReady: boolean;
}

const TelegramContext = createContext<TelegramContextValue>({
  isTelegram: false,
  isReady: false,
});

export function useTelegram() {
  return useContext(TelegramContext);
}

export function TelegramProvider({ children }: { children: React.ReactNode }) {
  const [isTelegram, setIsTelegram] = useState(false);
  const [isReady, setIsReady] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const WebApp = (
      window as unknown as {
        Telegram?: {
          WebApp?: {
            initData: string;
            ready: () => void;
            expand: () => void;
            disableVerticalSwipes: () => void;
            colorScheme: string;
            BackButton: {
              show: () => void;
              hide: () => void;
              onClick: (cb: () => void) => void;
              offClick: (cb: () => void) => void;
            };
          };
        };
      }
    )?.Telegram?.WebApp;

    if (!WebApp || !WebApp.initData) {
      setIsReady(true);
      return;
    }

    setIsTelegram(true);
    WebApp.disableVerticalSwipes();

    const backHandler = () => router.back();

    async function authenticate() {
      try {
        const supabase = createClient();
        const {
          data: { session },
        } = await supabase.auth.getSession();

        if (session) {
          WebApp!.ready();
          WebApp!.expand();
          setIsReady(true);
          return;
        }

        const response = await fetch("/api/auth/telegram/mini-app", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ initData: WebApp!.initData }),
        });

        const data = await response.json();
        if (data.token_hash) {
          await supabase.auth.verifyOtp({
            token_hash: data.token_hash,
            type: "magiclink",
          });

          if (
            pathname === "/" ||
            pathname?.startsWith("/sign-in") ||
            pathname?.startsWith("/sign-up")
          ) {
            router.replace("/dashboard");
          }
        }
      } catch (err) {
        console.error("Telegram Mini App auth failed:", err);
      } finally {
        WebApp!.ready();
        WebApp!.expand();
        setIsReady(true);
      }
    }

    authenticate();

    WebApp.BackButton.onClick(backHandler);

    return () => {
      WebApp.BackButton.offClick(backHandler);
    };
  }, []);

  useEffect(() => {
    if (!isTelegram) return;

    const WebApp = (
      window as unknown as {
        Telegram?: {
          WebApp?: {
            BackButton: { show: () => void; hide: () => void };
          };
        };
      }
    )?.Telegram?.WebApp;

    if (!WebApp) return;

    if (pathname === "/dashboard") {
      WebApp.BackButton.hide();
    } else {
      WebApp.BackButton.show();
    }
  }, [pathname, isTelegram]);

  return (
    <TelegramContext.Provider value={{ isTelegram, isReady }}>
      {children}
    </TelegramContext.Provider>
  );
}
