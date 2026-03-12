"use client";

import Script from "next/script";
import { useEffect, useRef } from "react";
import { useAuthStore } from "../store/auth";

const ONE_SIGNAL_APP_ID = process.env.NEXT_PUBLIC_ONE_SIGNAL_APP_ID ?? "";

declare global {
  interface Window {
    OneSignalDeferred?: Array<(OneSignal: OneSignalType) => void | Promise<void>>;
    OneSignal?: OneSignalType;
  }
}

interface OneSignalType {
  init: (options: { appId: string; allowLocalhostAsSecureOrigin?: boolean }) => Promise<void>;
  login: (externalId: string) => Promise<void>;
  logout: () => Promise<void>;
}

export default function OneSignalProvider({ children }: { children: React.ReactNode }) {
  const userId = useAuthStore((s) => s.user?.id);
  const token = useAuthStore((s) => s.token);
  const loginAttempted = useRef(false);

  useEffect(() => {
    if (!ONE_SIGNAL_APP_ID || !userId || !token) return;

    const tryLogin = async () => {
      const OneSignal = window.OneSignal;
      if (!OneSignal || loginAttempted.current) return;
      try {
        loginAttempted.current = true;
        await OneSignal.login(userId);
      } catch {
        loginAttempted.current = false;
      }
    };

    tryLogin();
    const id = setInterval(tryLogin, 2000);
    return () => clearInterval(id);
  }, [userId, token]);

  useEffect(() => {
    if (!userId) loginAttempted.current = false;
  }, [userId]);

  // Push init before Script loads (must run synchronously)
  if (typeof window !== "undefined" && ONE_SIGNAL_APP_ID) {
    window.OneSignalDeferred = window.OneSignalDeferred || [];
    if (!(window as { _onesignalInitPushed?: boolean })._onesignalInitPushed) {
      (window as { _onesignalInitPushed?: boolean })._onesignalInitPushed = true;
      window.OneSignalDeferred.push(async (OneSignal: OneSignalType) => {
        await OneSignal.init({
          appId: ONE_SIGNAL_APP_ID,
          allowLocalhostAsSecureOrigin: process.env.NODE_ENV === "development",
        });
        (window as Window & { OneSignal?: OneSignalType }).OneSignal = OneSignal;
      });
    }
  }

  if (!ONE_SIGNAL_APP_ID) {
    return <>{children}</>;
  }

  return (
    <>
      <Script
        src="https://cdn.onesignal.com/sdks/web/v16/OneSignalSDK.page.js"
        strategy="afterInteractive"
      />
      {children}
    </>
  );
}
