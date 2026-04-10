import { getPublicApiBaseUrl } from "./env";

export type JoinWaitlistLanding = {
  fullName: string;
  email: string;
  source: "landing";
  /** Shown in admin as Business — optional for individual bettors */
  businessName?: string;
  /** Shown in admin as Partner type — optional */
  partnerType?: string;
};

export type JoinWaitlistPartners = {
  fullName: string;
  email: string;
  source: "partners";
  businessName: string;
  partnerType: string;
};

/** Home page liquidity / financial partner interest (Survey → Financial tab). */
export type JoinWaitlistFinancial = {
  fullName: string;
  email: string;
  source: "financial";
  businessName: string;
  /** Defaults to Financial Institution on the server if omitted */
  partnerType?: string;
};

export type JoinWaitlistPayload =
  | JoinWaitlistLanding
  | JoinWaitlistPartners
  | JoinWaitlistFinancial;

export async function joinWaitlist(
  payload: JoinWaitlistPayload
): Promise<{ message: string }> {
  const res = await fetch(`${getPublicApiBaseUrl()}/waitlist`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  const data = (await res.json().catch(() => ({}))) as {
    message?: string;
    statusCode?: number;
  };
  if (!res.ok) {
    const msg =
      typeof data.message === "string"
        ? data.message
        : `Could not join waitlist (${res.status})`;
    throw new Error(msg);
  }
  return { message: typeof data.message === "string" ? data.message : "Success" };
}
