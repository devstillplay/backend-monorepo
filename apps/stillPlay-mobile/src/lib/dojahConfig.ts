/** Reject placeholder strings that become the literal `"null"` / `"undefined"` in the client bundle. */
function sanitizePublicEnv(value: string | undefined): string {
  const s = (value ?? "").trim();
  if (!s) return "";
  const lower = s.toLowerCase();
  if (lower === "null" || lower === "undefined" || lower === "none") return "";
  return s;
}

/**
 * Dojah Connect / Easy Onboard widget configuration.
 * @see https://docs.dojah.io/sdks/react-library
 * @see https://docs.dojah.io/overview/quickstart
 *
 * **Easy Onboard Web SDK (`websdk.js` + `<dojah-button>`):**
 * - `NEXT_PUBLIC_DOJAH_WIDGET_ID` — required in the browser (embed snippet from Easy Onboard).
 * - `user_data` / `gov_data` are optional in the JS SDK: omit or pass `{}` so users fill Dojah’s own pages.
 *   Set `prefillFromParent` on `DojahWebSdkButton` if you want to skip those steps from your form.
 *
 * **Connect / REST (optional in browser):**
 * - `NEXT_PUBLIC_DOJAH_APP_ID`, `NEXT_PUBLIC_DOJAH_PUBLIC_KEY` — used if you call `widget.js` / Connect directly.
 *
 * **Server:** `DOJAH_SECRET_KEY` for REST/webhooks only — never `NEXT_PUBLIC_`.
 *
 * **Registration:** send `dojahReferenceId` from the widget success payload on `POST /auth/register`;
 * auth-service stores it and sets `verified: true` when present (ideally re-validate with Dojah API / webhooks in production).
 */
export function getDojahClientConfig(): {
  appID: string;
  publicKey: string;
  widgetId: string;
  isConfigured: boolean;
} {
  const appID = sanitizePublicEnv(process.env.NEXT_PUBLIC_DOJAH_APP_ID);
  const publicKey = sanitizePublicEnv(process.env.NEXT_PUBLIC_DOJAH_PUBLIC_KEY);
  const widgetId = sanitizePublicEnv(process.env.NEXT_PUBLIC_DOJAH_WIDGET_ID);

  return {
    appID,
    publicKey,
    widgetId,
    isConfigured: Boolean(appID && publicKey && widgetId),
  };
}

/**
 * SDK `env="development"` loads `dev-widget.dojah.services` — Easy Onboard /
 * sandbox widgets from the dashboard are on **`widget.dojah.io`** (production script).
 * Only set `NEXT_PUBLIC_DOJAH_USE_DEV_WIDGET=true` if Dojah tells you to use the dev host.
 */
export function getDojahConnectEnvProp(): "development" | undefined {
  return process.env.NEXT_PUBLIC_DOJAH_USE_DEV_WIDGET === "true"
    ? "development"
    : undefined;
}

/** Easy Onboard Web SDK only needs `NEXT_PUBLIC_DOJAH_WIDGET_ID` on the client (real id from the dashboard, not `null`). */
export function getDojahWebSdkConfig(): { widgetId: string; isReady: boolean } {
  const widgetId = sanitizePublicEnv(process.env.NEXT_PUBLIC_DOJAH_WIDGET_ID);
  return { widgetId, isReady: Boolean(widgetId) };
}

/** Verbose Dojah logs in dev or when `NEXT_PUBLIC_DEBUG_DOJAH=true`. */
export function dojahDebugLog(...args: unknown[]): void {
  if (
    typeof process !== "undefined" &&
    (process.env.NODE_ENV === "development" || process.env.NEXT_PUBLIC_DEBUG_DOJAH === "true")
  ) {
    console.log("[Dojah]", ...args);
  }
}
