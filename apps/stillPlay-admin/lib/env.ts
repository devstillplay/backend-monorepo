/**
 * Single place for base URL and API endpoints.
 * Must use NEXT_PUBLIC_* so the value is available in the browser (Next.js only inlines that prefix).
 * Set NEXT_PUBLIC_API_BASE_URL in Railway / .env.local (e.g. https://your-api.railway.app/api).
 */

const baseUrl =
  process.env.NODE_ENV === 'development'
    ? 'http://localhost:3000/api'
    : 'https://api-gateway-production-dab1.up.railway.app/api';

export function getBaseUrl(): string {
  return baseUrl;
}

/** Use before auth/API calls; throws if API base URL is not set (avoids 404 to same origin). */
export function requireBaseUrl(): void {
  const url = getBaseUrl();
  if (!url) {
    throw new Error(
      'API URL not configured. Set NEXT_PUBLIC_API_BASE_URL in .env.local or Railway (e.g. https://your-api.railway.app/api).',
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
    loans: {
      eligibility: (userId: string) => `${getBaseUrl()}/loans/eligibility/${userId}`,
      request: () => `${getBaseUrl()}/admin/loans/request`,
      all: () => `${getBaseUrl()}/admin/loans`,
      allRepayments: () => `${getBaseUrl()}/admin/loans/all/repayments`,
      userLoans: (userId: string) =>
        `${getBaseUrl()}/admin/loans/user/${userId}`,
      userRepayments: (userId: string) =>
        `${getBaseUrl()}/admin/loans/user/${userId}/repayments`,
      loanRepayments: (loanId: string) =>
        `${getBaseUrl()}/admin/loans/${loanId}/repayments`,
      userWallet: (userId: string) =>
        `${getBaseUrl()}/admin/loans/user/${userId}/wallet`,
      approve: () => `${getBaseUrl()}/admin/loans/approve`,
      reject: () => `${getBaseUrl()}/admin/loans/reject`,
    },
  },
  settings: {
    get: () => `${getBaseUrl()}/admin/settings`,
    set: () => `${getBaseUrl()}/admin/settings`,
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
