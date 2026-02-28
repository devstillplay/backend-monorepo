const baseUrl =
  process.env.NODE_ENV === "development"
    ? "http://localhost:3000/api"
    : "https://api-gateway-production-dab1.up.railway.app/api";

export function getBaseUrl(): string {
  return baseUrl;
}

export function requireBaseUrl(): void {
  if (!getBaseUrl()) {
    throw new Error(
      "API URL not configured. Set NEXT_PUBLIC_API_BASE_URL in .env.local."
    );
  }
}

export const endpoints = {
  auth: {
    requestCode: () => `${getBaseUrl()}/auth/request-code`,
    verifyCode: () => `${getBaseUrl()}/auth/verify-code`,
    login: () => `${getBaseUrl()}/auth/login`,
    register: () => `${getBaseUrl()}/auth/register`,
    forgotPassword: () => `${getBaseUrl()}/auth/forgot-password`,
    resetPassword: () => `${getBaseUrl()}/auth/reset-password`,
  },
  user: {
    profile: () => `${getBaseUrl()}/user`,
  },
  loans: {
    wallet: (userId: string) => `${getBaseUrl()}/loans/wallet/${userId}`,
    list: (userId: string) => `${getBaseUrl()}/loans/list/${userId}`,
    repayments: (userId: string) => `${getBaseUrl()}/loans/repayments/${userId}`,
    eligibility: (userId: string) => `${getBaseUrl()}/loans/eligibility/${userId}`,
    request: () => `${getBaseUrl()}/loans/request`,
    repay: () => `${getBaseUrl()}/loans/repay`,
  },
  files: {
    upload: () => `${getBaseUrl()}/files/upload`,
  },
} as const;
