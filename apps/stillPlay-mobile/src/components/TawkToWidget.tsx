"use client";

import { useEffect } from "react";

const TAWK_PROPERTY_ID =
  process.env.NEXT_PUBLIC_TAWK_PROPERTY_ID ?? "69f8250f3902bf1c376092b2";
const TAWK_WIDGET_ID =
  process.env.NEXT_PUBLIC_TAWK_WIDGET_ID ?? "1jnol1i3s";

/** Off on localhost unless set — avoids Tawk SDK console.error(true) spam in Next.js 16 dev overlay. */
const TAWK_ENABLED =
  process.env.NEXT_PUBLIC_TAWK_ENABLED === "true" ||
  process.env.NODE_ENV === "production";

const TAWK_EMBED_SRC = `https://embed.tawk.to/${TAWK_PROPERTY_ID}/${TAWK_WIDGET_ID}`;
const TAWK_SCRIPT_ID = "tawk-to-embed";
const TAWK_HIDE_STYLE_ID = "tawk-hide-default-bubble";

declare global {
  interface Window {
    Tawk_API?: {
      maximize?: () => void;
      showWidget?: () => void;
      onLoad?: () => void;
    };
    Tawk_LoadStart?: Date;
  }
}

function injectHideBubbleStyle() {
  if (typeof document === "undefined" || document.getElementById(TAWK_HIDE_STYLE_ID)) {
    return;
  }
  const style = document.createElement("style");
  style.id = TAWK_HIDE_STYLE_ID;
  style.textContent = `
    #tawk-bubble-container,
    #tawkchat-minified-wrapper,
    .tawk-min-container {
      display: none !important;
    }
  `;
  document.head.appendChild(style);
}

export function openTawkChat() {
  if (typeof window === "undefined" || !TAWK_ENABLED) return;
  const api = window.Tawk_API;
  if (typeof api?.maximize === "function") {
    api.showWidget?.();
    api.maximize();
    return;
  }
  window.Tawk_API = window.Tawk_API || {};
  const previousOnLoad = window.Tawk_API.onLoad;
  window.Tawk_API.onLoad = function () {
    previousOnLoad?.();
    window.Tawk_API?.showWidget?.();
    window.Tawk_API?.maximize?.();
  };
}

type TawkToWidgetProps = {
  /** Hide Tawk's floating bubble; use `openTawkChat()` from your own button instead. */
  hideDefaultWidget?: boolean;
};

function loadTawkEmbed(hideDefaultWidget: boolean) {
  if (
    !TAWK_ENABLED ||
    typeof document === "undefined" ||
    document.getElementById(TAWK_SCRIPT_ID)
  ) {
    return;
  }

  if (hideDefaultWidget) {
    injectHideBubbleStyle();
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

export default function TawkToWidget({ hideDefaultWidget = false }: TawkToWidgetProps) {
  useEffect(() => {
    if (!TAWK_PROPERTY_ID || !TAWK_WIDGET_ID) return;
    loadTawkEmbed(hideDefaultWidget);
  }, [hideDefaultWidget]);

  return null;
}
