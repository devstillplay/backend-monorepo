"use client";

import { Box } from "@mui/material";
import {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from "react";

import { dojahDebugLog } from "@/lib/dojahConfig";
import { isDojahIdentityOrigin, parseDojahPostMessageSuccess } from "@/lib/dojahPayload";

const WEBSDK_SRC = "https://widget.dojah.io/websdk.js";

/** Values for double-quoted HTML attributes (used with `innerHTML` so Dojah’s constructor sees `widgetId`). */
function escapeHtmlAttr(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/"/g, "&quot;")
    .replace(/</g, "&lt;")
    .replace(/\r/g, "&#13;");
}

/** Remove stale `message` listener between `open()` calls. */
let lastDojahMessageListener: ((e: MessageEvent) => void) | null = null;

function removeDojahMessageListener(): void {
  if (lastDojahMessageListener) {
    window.removeEventListener("message", lastDojahMessageListener);
    lastDojahMessageListener = null;
  }
}

function loadDojahWebSdk(): Promise<void> {
  if (typeof window === "undefined") return Promise.resolve();
  if (customElements.get("dojah-button")) return Promise.resolve();

  const existing = document.querySelector(`script[src="${WEBSDK_SRC}"]`);
  if (existing) {
    if (customElements.get("dojah-button")) return Promise.resolve();
    return new Promise((resolve, reject) => {
      let settled = false;
      let pollId = 0;
      const settle = (fn: () => void) => {
        if (settled) return;
        settled = true;
        window.clearInterval(pollId);
        fn();
      };
      const tryResolve = () => {
        if (customElements.get("dojah-button")) settle(() => resolve());
      };
      existing.addEventListener(
        "load",
        () => {
          if (customElements.get("dojah-button")) settle(() => resolve());
          else
            settle(() =>
              reject(
                new Error(
                  "Dojah script ran but <dojah-button> did not register (blocked script or wrong URL?)."
                )
              )
            );
        },
        { once: true }
      );
      existing.addEventListener(
        "error",
        () => settle(() => reject(new Error("Dojah Web SDK failed to load"))),
        { once: true }
      );
      queueMicrotask(tryResolve);
      let attempts = 0;
      pollId = window.setInterval(() => {
        if (settled) return;
        if (customElements.get("dojah-button")) settle(() => resolve());
        else if (++attempts > 80) {
          settle(() =>
            reject(
              new Error(
                "Dojah Web SDK timed out waiting for <dojah-button>. Check network / ad blockers and hard-refresh."
              )
            )
          );
        }
      }, 50);
    });
  }

  return new Promise((resolve, reject) => {
    const script = document.createElement("script");
    script.src = WEBSDK_SRC;
    script.async = false;
    script.onload = () => {
      if (customElements.get("dojah-button")) resolve();
      else
        reject(
          new Error("Dojah script loaded but <dojah-button> was not registered.")
        );
    };
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

export type DojahSdkLoadStatus = "loading" | "ready" | "error";

export type DojahWebSdkButtonProps = {
  widgetId: string;
  /**
   * When `true`, sends `userData` / `govData` into the iframe (can skip Dojah’s own input steps).
   * When `false` (default), sends `{}` / `{}` so the user enters data in Dojah’s widget pages.
   * @see https://docs.dojah.io/sdks/javascript-library — `user_data` / `gov_data` are optional.
   */
  prefillFromParent?: boolean;
  /** Only used when `prefillFromParent` is true. */
  userData?: Record<string, string | undefined>;
  /** Only used when `prefillFromParent` is true. */
  govData?: Record<string, string>;
  onSuccess: (data: unknown) => void;
  onError: (message?: string) => void;
  onClose: () => void;
  /** Fires once `websdk.js` is loaded and `dojah-button` is registered. */
  onSdkReady?: () => void;
  /** Loading lifecycle (for UI: enable button, show errors). */
  onSdkStatus?: (status: DojahSdkLoadStatus, message?: string) => void;
};

/**
 * Dojah Easy Onboard via `websdk.js` + `<dojah-button>` (official embed).
 * @see https://docs.dojah.io/overview/quickstart
 * @see https://docs.dojah.io/sdks/javascript-library
 *
 * `ref.open(...)` must run in the same synchronous turn as the user’s tap (user activation).
 */
const DojahWebSdkButton = forwardRef<DojahLauncherHandle, DojahWebSdkButtonProps>(
  function DojahWebSdkButton(
    {
      widgetId,
      prefillFromParent = false,
      userData: userDataProp = {},
      govData: govDataProp = {},
      onSuccess,
      onError,
      onClose,
      onSdkReady,
      onSdkStatus,
    },
    ref
  ) {
    const hostRef = useRef<HTMLDivElement>(null);
    const [loadState, setLoadState] = useState<"loading" | "ready" | "error">("loading");
    const loadStateRef = useRef(loadState);
    loadStateRef.current = loadState;

    const handlersRef = useRef({ onSuccess, onError, onClose });
    handlersRef.current = { onSuccess, onError, onClose };

    const configRef = useRef({
      widgetId,
      prefillFromParent,
      userData: userDataProp,
      govData: govDataProp,
    });
    configRef.current = {
      widgetId,
      prefillFromParent,
      userData: userDataProp,
      govData: govDataProp,
    };

    const onSdkReadyRef = useRef(onSdkReady);
    onSdkReadyRef.current = onSdkReady;
    const onSdkStatusRef = useRef(onSdkStatus);
    onSdkStatusRef.current = onSdkStatus;

    useEffect(() => {
      let cancelled = false;
      onSdkStatusRef.current?.("loading");

      (async () => {
        try {
          await loadDojahWebSdk();
          if (cancelled) return;
          setLoadState("ready");
          onSdkStatusRef.current?.("ready");
          onSdkReadyRef.current?.();
        } catch (e) {
          if (cancelled) return;
          setLoadState("error");
          const msg =
            e instanceof Error
              ? e.message
              : "Could not load Dojah. Check your network and try again.";
          onSdkStatusRef.current?.("error", msg);
          handlersRef.current.onError(msg);
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

        removeDojahMessageListener();

        const host = hostRef.current;
        const { widgetId: wid, prefillFromParent: prefill, userData: udIn, govData: gdIn } =
          configRef.current;
        const ud = prefill ? udIn : {};
        const gd = prefill ? gdIn : {};
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

        let successFired = false;
        const fireSuccessOnce = (response: unknown) => {
          if (successFired) return;
          successFired = true;
          removeDojahMessageListener();
          dojahDebugLog("onSuccess (once) payload:", response);
          handlersRef.current.onSuccess(response);
        };

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
          dojahDebugLog("widget onSuccess callback argument:", response);
          fireSuccessOnce(response);
        };
        w[onErrorName] = () => {
          removeDojahMessageListener();
          dojahDebugLog("widget onError callback");
          handlersRef.current.onError("Verification error.");
        };
        w[onCloseName] = () => {
          removeDojahMessageListener();
          dojahDebugLog("widget onClose callback");
          handlersRef.current.onClose();
        };

        const onMessage = (e: MessageEvent) => {
          if (!isDojahIdentityOrigin(e.origin)) return;
          const parsed = parseDojahPostMessageSuccess(e.data);
          if (parsed != null) fireSuccessOnce(parsed);
          else dojahDebugLog("Dojah postMessage (not success or unknown shape):", e.data);
        };
        lastDojahMessageListener = onMessage;
        window.addEventListener("message", onMessage);

        const userDataJson = JSON.stringify(ud);
        const govDataJson = JSON.stringify(gd);
        const metadataJson = JSON.stringify(metadata);
        // Dojah’s `websdk.js` reads `widgetId` in the custom element constructor. With
        // `createElement` + `setAttribute`, the constructor runs first and captures `null`,
        // producing `https://identity.dojah.io/?widget_id=null`. Parsing from markup sets
        // attributes before the constructor runs.
        host.innerHTML = `<dojah-button widgetId="${escapeHtmlAttr(wid)}" referenceId="${escapeHtmlAttr(referenceId)}" text="${escapeHtmlAttr("\u00a0")}" textColor="${escapeHtmlAttr("#FFFFFF")}" backgroundColor="${escapeHtmlAttr("#3977de")}" width="${escapeHtmlAttr("100%")}" userData="${escapeHtmlAttr(userDataJson)}" govData="${escapeHtmlAttr(govDataJson)}" metadata="${escapeHtmlAttr(metadataJson)}" onSuccess="${escapeHtmlAttr(onSuccessName)}" onError="${escapeHtmlAttr(onErrorName)}" onClose="${escapeHtmlAttr(onCloseName)}"></dojah-button>`;
        const el = host.querySelector("dojah-button");

        dojahDebugLog("mounted <dojah-button>", {
          widgetId: wid,
          referenceId,
          prefillFromParent: prefill,
          userData: ud,
          govData: gd,
          metadata,
        });

        if (!el) {
          handlersRef.current.onError("Could not mount Dojah button.");
          return true;
        }

        const tryClickInner = (): boolean => {
          const inner = el.shadowRoot?.querySelector<HTMLButtonElement>("#dojah-button");
          if (inner) {
            inner.click();
            return true;
          }
          return false;
        };

        if (tryClickInner()) {
          return true;
        }

        let frames = 0;
        const maxFrames = 45;
        const tick = () => {
          frames += 1;
          if (tryClickInner()) {
            dojahDebugLog("Dojah inner button found after deferred frames:", frames);
            return;
          }
          if (frames >= maxFrames) {
            dojahDebugLog("shadow #dojah-button not found after rAF retries");
            handlersRef.current.onError(
              "Could not start Dojah: the widget button did not appear. Try refreshing the page or disable extensions that block third-party scripts."
            );
            return;
          }
          requestAnimationFrame(tick);
        };
        requestAnimationFrame(tick);

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
