/** API base for public endpoints (e.g. waitlist). Override with NEXT_PUBLIC_API_BASE_URL. */
const baseUrl =
  process.env.NEXT_PUBLIC_API_BASE_URL ??
  (process.env.NODE_ENV === "development"
    ? "http://localhost:3000/api"
    : "https://api-gateway-production-dab1.up.railway.app/api");

export function getPublicApiBaseUrl(): string {
  return baseUrl.replace(/\/$/, "");
}
