"use client";

import { Box } from "@mui/material";
import {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from "react";

const WEBSDK_SRC = "https://widget.dojah.io/websdk.js";

function loadDojahWebSdk(): Promise<void> {
  if (typeof window === "undefined") return Promise.resolve();
  if (customElements.get("dojah-button")) return Promise.resolve();

  const existing = document.querySelector(`script[src="${WEBSDK_SRC}"]`);
  if (existing) {
    if (customElements.get("dojah-button")) return Promise.resolve();
    return new Promise((resolve, reject) => {
      existing.addEventListener("load", () => resolve(), { once: true });
      existing.addEventListener("error", () => reject(new Error("Dojah Web SDK failed to load")), {
        once: true,
      });
      if (customElements.get("dojah-button")) resolve();
    });
  }

  return new Promise((resolve, reject) => {
    const script = document.createElement("script");
    script.src = WEBSDK_SRC;
    script.async = false;
    script.onload = () => resolve();
    script.onerror = () => reject(new Error("Dojah Web SDK failed to load"));
    document.head.appendChild(script);
  });
}

export type DojahOpenParams = {
  referenceId: string;
  metadata: Record<string, unknown>;
};

export type DojahLauncherHandle = {
  /** Call from a click/tap handler so the iframe is allowed to open (user activation). Returns false if SDK is not ready yet. */
  open: (params: DojahOpenParams) => boolean;
};

export type DojahWebSdkButtonProps = {
  widgetId: string;
  userData: Record<string, string | undefined>;
  govData: Record<string, string>;
  onSuccess: (data: unknown) => void;
  onError: (message?: string) => void;
  onClose: () => void;
  /** Fires once `websdk.js` is loaded and `dojah-button` is registered. */
  onSdkReady?: () => void;
};

/**
 * Dojah Easy Onboard via `websdk.js`. The `<dojah-button>` lives in a hidden host; call * `ref.open({ referenceId, metadata })` from **your** button’s `onClick` (same synchronous turn)
 * so the browser does not block the KYC iframe.
 */
const DojahWebSdkButton = forwardRef<DojahLauncherHandle, DojahWebSdkButtonProps>(
  function DojahWebSdkButton(
    { widgetId, userData, govData, onSuccess, onError, onClose, onSdkReady },
    ref
  ) {
    const hostRef = useRef<HTMLDivElement>(null);
    const [loadState, setLoadState] = useState<"loading" | "ready" | "error">("loading");
    const loadStateRef = useRef(loadState);
    loadStateRef.current = loadState;

    const handlersRef = useRef({ onSuccess, onError, onClose });
    handlersRef.current = { onSuccess, onError, onClose };

    const configRef = useRef({ widgetId, userData, govData });
    configRef.current = { widgetId, userData, govData };

    const onSdkReadyRef = useRef(onSdkReady);
    onSdkReadyRef.current = onSdkReady;

    useEffect(() => {
      let cancelled = false;

      (async () => {
        try {
          await loadDojahWebSdk();
          if (cancelled) return;
          setLoadState("ready");
          onSdkReadyRef.current?.();
        } catch {
          if (cancelled) return;
          setLoadState("error");
          handlersRef.current.onError("Could not load Dojah. Check your network and try again.");
        }
      })();

      return () => {
        cancelled = true;
      };
    }, []);

    useImperativeHandle(ref, () => ({
      open: ({ referenceId, metadata }) => {
        if (loadStateRef.current !== "ready" || !hostRef.current) {
          return false;
        }

        const host = hostRef.current;
        const { widgetId: wid, userData: ud, govData: gd } = configRef.current;
        if (!wid.trim()) {
          handlersRef.current.onError(
            "Invalid Dojah widget id. Set NEXT_PUBLIC_DOJAH_WIDGET_ID to the Easy Onboard widget id from app.dojah.io — not the word null, and restart the dev server."
          );
          return false;
        }
        const suffix = `${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;
        const onSuccessName = `__stillplay_dojah_ok_${suffix}`;
        const onErrorName = `__stillplay_dojah_err_${suffix}`;
        const onCloseName = `__stillplay_dojah_close_${suffix}`;

        const w = window as unknown as Record<string, unknown>;
        for (const key of Object.keys(w)) {
          if (
            key.startsWith("__stillplay_dojah_ok_") ||
            key.startsWith("__stillplay_dojah_err_") ||
            key.startsWith("__stillplay_dojah_close_")
          ) {
            delete w[key];
          }
        }
        w[onSuccessName] = (response: unknown) => {
          handlersRef.current.onSuccess(response);
        };
        w[onErrorName] = () => {
          handlersRef.current.onError("Verification error.");
        };
        w[onCloseName] = () => {
          handlersRef.current.onClose();
        };

        host.innerHTML = "";
        const el = document.createElement("dojah-button");
        el.setAttribute("widgetId", wid);
        el.setAttribute("referenceId", referenceId);
        el.setAttribute("text", "\u00a0");
        el.setAttribute("textColor", "#FFFFFF");
        el.setAttribute("backgroundColor", "#3977de");
        el.setAttribute("width", "100%");
        el.setAttribute("userData", JSON.stringify(ud));
        el.setAttribute("govData", JSON.stringify(gd));
        el.setAttribute("metadata", JSON.stringify(metadata));
        el.setAttribute("onSuccess", onSuccessName);
        el.setAttribute("onError", onErrorName);
        el.setAttribute("onClose", onCloseName);
        host.appendChild(el);

        const inner = el.shadowRoot?.querySelector<HTMLButtonElement>("#dojah-button");
        inner?.click();

        return true;
      },
    }), []);

    return (
      <Box
        ref={hostRef}
        aria-hidden
        sx={{
          position: "fixed",
          left: -9999,
          top: 0,
          width: 1,
          height: 1,
          overflow: "hidden",
          opacity: 0,
          pointerEvents: "none",
        }}
      />
    );
  }
);

export default DojahWebSdkButton;
