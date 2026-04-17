/** Persist last Dojah `reference_id` per signup email on this browser (for restore + server lookup). */

const PREFIX = "stillplay_dojah_ref_v1:";

function key(email: string): string {
  return `${PREFIX}${email.trim().toLowerCase()}`;
}

export function saveDojahReferenceForEmail(email: string, referenceId: string): void {
  if (typeof window === "undefined" || !email?.trim() || !referenceId?.trim()) return;
  try {
    localStorage.setItem(
      key(email),
      JSON.stringify({ referenceId: referenceId.trim(), at: Date.now() })
    );
  } catch {
    /* quota / private mode */
  }
}

export function loadDojahReferenceForEmail(email: string): string | null {
  if (typeof window === "undefined" || !email?.trim()) return null;
  try {
    const raw = localStorage.getItem(key(email));
    if (!raw) return null;
    const p = JSON.parse(raw) as { referenceId?: string };
    return typeof p.referenceId === "string" && p.referenceId.length > 0 ? p.referenceId : null;
  } catch {
    return null;
  }
}
