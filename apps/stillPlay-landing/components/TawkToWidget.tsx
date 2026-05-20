"use client";

import { useEffect } from "react";

const TAWK_PROPERTY_ID =
  process.env.NEXT_PUBLIC_TAWK_PROPERTY_ID ?? "69f8250f3902bf1c376092b2";
const TAWK_WIDGET_ID =
  process.env.NEXT_PUBLIC_TAWK_WIDGET_ID ?? "1jnol1i3s";

const TAWK_EMBED_SRC = `https://embed.tawk.to/${TAWK_PROPERTY_ID}/${TAWK_WIDGET_ID}`;
const TAWK_SCRIPT_ID = "tawk-to-embed";

declare global {
  interface Window {
    Tawk_API?: {
      maximize?: () => void;
      onLoad?: () => void;
    };
    Tawk_LoadStart?: Date;
  }
}

export function openTawkChat() {
  if (typeof window === "undefined") return;
  const api = window.Tawk_API;
  if (typeof api?.maximize === "function") {
    api.maximize();
    return;
  }
  window.Tawk_API = window.Tawk_API || {};
  const previousOnLoad = window.Tawk_API.onLoad;
  window.Tawk_API.onLoad = function () {
    previousOnLoad?.();
    window.Tawk_API?.maximize?.();
  };
}

function loadTawkEmbed() {
  if (typeof document === "undefined" || document.getElementById(TAWK_SCRIPT_ID)) {
    return;
  }

  window.Tawk_API = window.Tawk_API || {};
  window.Tawk_LoadStart = new Date();

  const script = document.createElement("script");
  const firstScript = document.getElementsByTagName("script")[0];
  script.id = TAWK_SCRIPT_ID;
  script.async = true;
  script.src = TAWK_EMBED_SRC;
  script.charset = "UTF-8";
  script.setAttribute("crossorigin", "*");
  firstScript?.parentNode?.insertBefore(script, firstScript);
}

export default function TawkToWidget() {
  useEffect(() => {
    if (!TAWK_PROPERTY_ID || !TAWK_WIDGET_ID) return;
    loadTawkEmbed();
  }, []);

  return null;
}
