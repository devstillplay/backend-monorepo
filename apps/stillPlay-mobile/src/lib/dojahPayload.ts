const DOJAH_IDENTITY_ORIGIN = "https://identity.dojah.io";

/**
 * Parse postMessage payload from `identity.dojah.io` when the widget completes successfully.
 * The Web SDK normally forwards `event.data.response` to `onSuccess`; this covers alternate shapes.
 */
export function parseDojahPostMessageSuccess(raw: unknown): unknown | null {
  if (raw == null) return null;
  let m: Record<string, unknown>;
  if (typeof raw === "string") {
    try {
      m = JSON.parse(raw) as Record<string, unknown>;
    } catch {
      return null;
    }
  } else if (typeof raw === "object") {
    m = raw as Record<string, unknown>;
  } else {
    return null;
  }
  const type =
    (typeof m.type === "string" ? m.type : null) ??
    (typeof m.event === "string" ? m.event : null);
  if (type !== "connect.account.success") return null;
  const inner = m.data;
  if (inner && typeof inner === "object") {
    const d = inner as Record<string, unknown>;
    if ("response" in d) return d.response;
  }
  if ("response" in m) return m.response;
  return inner ?? null;
}

export function isDojahIdentityOrigin(origin: string): boolean {
  return origin === DOJAH_IDENTITY_ORIGIN;
}

/**
 * Dojah Easy Onboard Web SDK (`websdk.js`) posts `connect.account.success` to the parent with
 * `data.response` as the payload (see widget message handler). Shape may vary by widget config.
 * @see https://docs.dojah.io/overview/quickstart
 */
export function extractDojahReference(data: unknown): string | null {
  if (data == null) return null;
  if (typeof data === "string") {
    const s = data.trim();
    return s.length > 0 ? s : null;
  }
  if (typeof data !== "object") return null;

  const o = data as Record<string, unknown>;
  const tryRef = (obj: Record<string, unknown>): string | null => {
    const ref = obj.reference_id ?? obj.referenceId ?? obj.reference;
    if (typeof ref === "string" && ref.length > 0) return ref;
    const nested = obj.data;
    if (nested && typeof nested === "object") {
      const d = nested as Record<string, unknown>;
      const inner = d.reference_id ?? d.referenceId;
      if (typeof inner === "string" && inner.length > 0) return inner;
    }
    return null;
  };

  const direct = tryRef(o);
  if (direct) return direct;

  const response = o.response;
  if (response && typeof response === "object") {
    return tryRef(response as Record<string, unknown>);
  }

  return null;
}

/** Short lines for UI from a Dojah verification API payload (shape varies by product). */
export function summarizeDojahVerificationForUi(dojah: unknown): string[] {
  if (dojah == null || typeof dojah !== "object") return [];
  const root = dojah as Record<string, unknown>;
  const entity = (root.entity ?? root.data ?? root) as Record<string, unknown>;
  const lines: string[] = [];
  const push = (label: string, val: unknown) => {
    if (val !== undefined && val !== null && String(val).length > 0) {
      lines.push(`${label}: ${String(val)}`);
    }
  };
  push("Status", entity.status ?? root.status);
  push("Reference", entity.reference_id ?? root.reference_id);
  const id = entity.id_data ?? entity.identity;
  if (id && typeof id === "object") {
    const o = id as Record<string, unknown>;
    push("First name", o.first_name ?? o.firstName);
    push("Last name", o.last_name ?? o.lastName);
  }
  return lines;
}
