/** Mobile/web app URL – update for production */
export const MOBILE_APP_URL =
  process.env.NEXT_PUBLIC_MOBILE_APP_URL ?? "https://stillplay.app";

/** Public marketing site URL (used in calendar invites and share metadata) */
export const SITE_URL = (
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://still-play.com"
).replace(/\/$/, "");

/** Login page URL (web version) */
export const LOGIN_URL = `${MOBILE_APP_URL}/login`;

/** Company info */
export const COMPANY_NAME = "Still Play by Utilii Loci Ltd";
export const COMPANY_LEGAL_NAME = "Utilii Loci Ltd";
export const RC_NUMBER = "7313142";
export const COMPANY_ADDRESS = "The New Road, StillPlay, WC11";
export const PARTNERSHIP_EMAIL = "partnerships@stillplay.com";
export const SUPPORT_EMAIL = "support@stillplay.com";
