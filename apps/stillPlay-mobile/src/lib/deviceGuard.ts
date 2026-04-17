/**
 * Optional DeviceGuard / device fingerprint (e.g. Elta). Used to detect returning devices;
 * pair with cached Dojah `reference_id` to reload verification from your API gateway.
 */

export type DeviceGuardFingerprintResult = {
  deviceId?: string;
  ipAddress?: string;
  country?: string;
  isNewDevice?: boolean;
  isBlocked?: boolean;
  isTrusted?: boolean;
  riskScore?: number;
  riskFactors?: unknown[];
  deviceObject?: Record<string, unknown>;
};

/**
 * POST to your fingerprint endpoint. Body shape depends on your provider’s SDK — extend as needed.
 * Set `NEXT_PUBLIC_DEVICEGUARD_FINGERPRINT_URL` (and optional `NEXT_PUBLIC_DEVICEGUARD_API_KEY`).
 */
export async function postDeviceFingerprint(
  body: Record<string, unknown> = {}
): Promise<DeviceGuardFingerprintResult | null> {
  if (typeof window === "undefined") return null;
  const url = process.env.NEXT_PUBLIC_DEVICEGUARD_FINGERPRINT_URL?.trim();
  if (!url) return null;

  const key = process.env.NEXT_PUBLIC_DEVICEGUARD_API_KEY?.trim();
  const headers: Record<string, string> = { "Content-Type": "application/json" };
  if (key) headers.Authorization = `Bearer ${key}`;

  try {
    const res = await fetch(url, {
      method: "POST",
      headers,
      body: JSON.stringify({ source: "stillplay-mobile", ...body }),
      credentials: "omit",
    });
    if (!res.ok) return null;
    return (await res.json()) as DeviceGuardFingerprintResult;
  } catch {
    return null;
  }
}
