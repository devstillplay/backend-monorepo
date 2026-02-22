/**
 * Single place for base URL and API endpoints.
 * Use NEXT_PUBLIC_* in .env.local so they are available in the browser.
 */

const baseUrl =
  typeof window !== "undefined"
    ? (process.env.NEXT_PUBLIC_API_BASE_URL ?? "")
    : process.env.NEXT_PUBLIC_API_BASE_URL ?? "";

export function getBaseUrl(): string {
  return baseUrl.replace(/\/$/, "");
}

/** Use before auth/API calls; throws if API base URL is not set (avoids 404 to same origin). */
export function requireBaseUrl(): void {
  const url = getBaseUrl();
  if (!url) {
    throw new Error(
      "API URL not configured. Add NEXT_PUBLIC_API_BASE_URL to .env.local (e.g. http://localhost:3000/api) and restart the dev server."
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
  admin: {
    users: () => `${getBaseUrl()}/admin/users`,
    userById: (id: string) => `${getBaseUrl()}/admin/users/${id}`,
    employees: () => `${getBaseUrl()}/admin/employees`,
    employeeById: (id: string) => `${getBaseUrl()}/admin/employees/${id}`,
    activity: () => `${getBaseUrl()}/admin/activity`,
  },
  providers: {
    list: () => `${getBaseUrl()}/providers`,
    one: (id: string) => `${getBaseUrl()}/providers/${id}`,
    create: () => `${getBaseUrl()}/providers`,
    update: (id: string) => `${getBaseUrl()}/providers/${id}`,
  },
  files: {
    upload: () => `${getBaseUrl()}/files/upload`,
  },
} as const;
