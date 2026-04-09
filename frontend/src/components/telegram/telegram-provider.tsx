"use client";

import { useEffect, useState, createContext, useContext } from "react";
import { usePathname } from "next/navigation";

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

    // Detected Telegram Mini App context
    setIsTelegram(true);
    WebApp.disableVerticalSwipes();
    WebApp.ready();
    WebApp.expand();
    setIsReady(true);

    // ⚠️ Telegram auth is DISABLED FOR NOW — Supabase has been removed.
    // Previously this would auto-authenticate via /api/auth/telegram/mini-app
    // TODO: Re-enable when Telegram auth is implemented with Strapi.
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
