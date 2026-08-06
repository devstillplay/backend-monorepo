/**
 * Dojah KYC step in signup (verify-identity). Off by default until re-enabled.
 * Set `NEXT_PUBLIC_DOJAH_KYC_ENABLED=true` in `.env.local` to show it again.
 */
export function isDojahKycEnabled(): boolean {
  return process.env.NEXT_PUBLIC_DOJAH_KYC_ENABLED === "true";
}

/** Signup progress bar: 4 steps with KYC, 3 without. */
export function getSignupStepCount(): number {
  return isDojahKycEnabled() ? 4 : 3;
}

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
 * **React SDK (`dojah-kyc-sdk-react` on verify-identity):**
 * - `NEXT_PUBLIC_DOJAH_APP_ID`, `NEXT_PUBLIC_DOJAH_PUBLIC_KEY`, `NEXT_PUBLIC_DOJAH_WIDGET_ID` — all required in the browser.
 * - `user_data` / `gov_data` are optional: pass `{}` so users fill Dojah’s own pages (see `DojahReactKyc`).
 *
 * @see https://docs.dojah.io/sdks/react-library
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
