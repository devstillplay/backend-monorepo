import { endpoints, requireBaseUrl } from "./env";
import { useAuthStore } from "../store/auth";
import { useUserStore } from "../store/user";

function getAuthHeaders(token?: string | null): HeadersInit {
  const headers: HeadersInit = { "Content-Type": "application/json" };
  if (token) {
    (headers as Record<string, string>)["Authorization"] = `Bearer ${token}`;
  }
  return headers;
}

/** On 401 Unauthorized (e.g. invalid/expired token), clear auth and profile so user is logged out. */
function handleAuthError(res: Response): void {
  if (res.status === 401) {
    useAuthStore.getState().reset();
    useUserStore.getState().reset();
  }
}

export type RequestCodeType = "login" | "register";

export type RequestCodePayload = {
  type: RequestCodeType;
  email: string;
  password: string;
  firstName?: string;
  lastName?: string;
  nin?: string;
  picture?: string;
};

export type VerifyCodePayload = {
  type: RequestCodeType;
  email: string;
  code: string;
};

export type RequestCodeResponse = {
  message: string;
  /** Present when Super Admin logs in (no OTP). */
  token?: string;
  user?: { id: string; email: string; role: string; firstName?: string; lastName?: string };
};

export type VerifyCodeResponse = {
  message: string;
  token: string;
  user?: {
    id: string;
    email: string;
    role: string;
    firstName?: string;
    lastName?: string;
    picture?: string | null;
  };
};

export type UserProfile = {
  id: string;
  email: string;
  role: string;
  verified?: boolean;
  firstName?: string;
  lastName?: string;
  userNumber?: string;
};

export type AdminUser = {
  id: string;
  email: string;
  firstName?: string;
  lastName?: string;
  userNumber?: string;
  nin?: string;
  ninSlip?: string | null;
  role?: string;
  verified?: boolean;
  suspended?: boolean;
  picture?: string | null;
  creditLimit?: number | null;
  createdAt?: string;
};

export type LoanEligibility = {
  canRequest: boolean;
  maxAmount: number;
  availableAmount: number;
  totalOutstanding?: number;
  reason?: string;
  activeLoan?: {
    id: string;
    status: string;
    amount: number;
    amountRepaid: number;
    remaining: number;
  } | null;
};

/** Update admin user (partial). */
export async function updateAdminUser(
  token: string,
  id: string,
  payload: Partial<Pick<AdminUser, "firstName" | "lastName" | "picture" | "verified" | "suspended" | "creditLimit">>
): Promise<{ message: string; user: AdminUser }> {
  const res = await fetch(endpoints.admin.userById(id), {
    method: "PATCH",
    headers: getAuthHeaders(token),
    body: JSON.stringify(payload),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    handleAuthError(res);
    throw new Error(
      typeof data.message === "string"
        ? data.message
        : Array.isArray(data.message)
          ? data.message[0]
          : "Failed to update user"
    );
  }
  return data;
}

/** Delete admin user (and their wallet and loans/transactions). */
export async function deleteAdminUser(
  token: string,
  id: string
): Promise<{ message: string }> {
  const res = await fetch(endpoints.admin.userById(id), {
    method: "DELETE",
    headers: getAuthHeaders(token),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    handleAuthError(res);
    throw new Error(
      typeof data.message === "string"
        ? data.message
        : Array.isArray(data.message)
          ? data.message[0]
          : "Failed to delete user"
    );
  }
  return data;
}

/** Activity record (id attached to user). */
export type AdminActivityRecord = {
  id: string;
  userId: string;
  action: string;
  ip: string | null;
  createdAt: string;
};

/** Record admin user activity. */
export async function recordAdminActivity(
  token: string,
  payload: { action: string; ip?: string }
): Promise<{ message: string; activity: AdminActivityRecord }> {
  const res = await fetch(endpoints.admin.activity(), {
    method: "POST",
    headers: getAuthHeaders(token),
    body: JSON.stringify(payload),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    handleAuthError(res);
    throw new Error(
      typeof data.message === "string"
        ? data.message
        : Array.isArray(data.message)
          ? data.message[0]
          : "Failed to record activity"
    );
  }
  return data;
}

/** List current admin user's activities. */
export async function listAdminActivity(
  token: string,
  limit?: number
): Promise<{ activities: AdminActivityRecord[] }> {
  const url = new URL(endpoints.admin.activity());
  if (limit != null) url.searchParams.set("limit", String(limit));
  const res = await fetch(url.toString(), { headers: getAuthHeaders(token) });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    handleAuthError(res);
    throw new Error(
      typeof data.message === "string"
        ? data.message
        : "Failed to load activity"
    );
  }
  return data;
}

// ---------- Admin: loans (user wallet, loan history, repayments, request loan) ----------

export type Loan = {
  id: string;
  userId: string;
  amount: number;
  purpose?: string | null;
  status: string;
  dueDate?: string | null;
  disbursedAt?: string | null;
  amountRepaid: number;
  repaidAt?: string | null;
  createdAt: string;
  updatedAt: string;
};

export type LoanRepayment = {
  id: string;
  loanId: string;
  userId: string;
  amount: number;
  repaidAt: string;
};

export type UserWallet = {
  id: string;
  userId: string;
  balance: number;
  currency: string;
  createdAt?: string;
  updatedAt?: string;
};

/** Request a loan for a user (admin). */
export async function requestLoanForUser(
  token: string,
  payload: { userId: string; amount: number; purpose?: string }
): Promise<{ message: string; loan: Loan }> {
  const res = await fetch(endpoints.admin.loans.request(), {
    method: "POST",
    headers: getAuthHeaders(token),
    body: JSON.stringify(payload),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    handleAuthError(res);
    throw new Error(
      typeof data.message === "string"
        ? data.message
        : Array.isArray(data.message)
          ? data.message[0]
          : "Failed to request loan"
    );
  }
  return data;
}

/** Approve a loan (admin). */
export async function approveLoan(
  token: string,
  loanId: string
): Promise<{ message: string }> {
  const res = await fetch(endpoints.admin.loans.approve(), {
    method: "POST",
    headers: getAuthHeaders(token),
    body: JSON.stringify({ loanId }),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    handleAuthError(res);
    throw new Error(
      typeof data.message === "string" ? data.message : "Failed to approve loan"
    );
  }
  return data;
}

/** Reject a loan (admin). */
export async function rejectLoan(
  token: string,
  loanId: string
): Promise<{ message: string }> {
  const res = await fetch(endpoints.admin.loans.reject(), {
    method: "POST",
    headers: getAuthHeaders(token),
    body: JSON.stringify({ loanId }),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    handleAuthError(res);
    throw new Error(
      typeof data.message === "string" ? data.message : "Failed to reject loan"
    );
  }
  return data;
}

/** Get loan eligibility for a user (admin). */
export async function getLoanEligibility(
  token: string,
  userId: string
): Promise<LoanEligibility> {
  const res = await fetch(endpoints.admin.loans.eligibility(userId), {
    headers: getAuthHeaders(token),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    handleAuthError(res);
    throw new Error(
      typeof data.message === "string"
        ? data.message
        : "Failed to load eligibility"
    );
  }
  return data as LoanEligibility;
}

/** Get a user's loan history (admin). */
export async function getUserLoanHistory(
  token: string,
  userId: string
): Promise<{ loans: Loan[] }> {
  const res = await fetch(endpoints.admin.loans.userLoans(userId), {
    headers: getAuthHeaders(token),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    handleAuthError(res);
    throw new Error(
      typeof data.message === "string" ? data.message : "Failed to load loans"
    );
  }
  return { loans: Array.isArray(data.loans) ? data.loans : [] };
}

/** Get a user's repayment history (admin). */
export async function getUserRepayments(
  token: string,
  userId: string
): Promise<{ userId: string; repayments: LoanRepayment[] }> {
  const res = await fetch(endpoints.admin.loans.userRepayments(userId), {
    headers: getAuthHeaders(token),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    handleAuthError(res);
    throw new Error(
      typeof data.message === "string"
        ? data.message
        : "Failed to load repayments"
    );
  }
  return {
    userId: data.userId ?? userId,
    repayments: Array.isArray(data.repayments) ? data.repayments : [],
  };
}

/** Get repayments for a specific loan (admin). */
export async function getLoanRepayments(
  token: string,
  loanId: string
): Promise<{ loanId: string; repayments: LoanRepayment[] }> {
  const res = await fetch(endpoints.admin.loans.loanRepayments(loanId), {
    headers: getAuthHeaders(token),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    handleAuthError(res);
    throw new Error(
      typeof data.message === "string"
        ? data.message
        : "Failed to load repayments"
    );
  }
  return {
    loanId: data.loanId ?? loanId,
    repayments: Array.isArray(data.repayments) ? data.repayments : [],
  };
}

/** Get a user's wallet (admin). */
export async function getUserWallet(
  token: string,
  userId: string
): Promise<UserWallet> {
  const res = await fetch(endpoints.admin.loans.userWallet(userId), {
    headers: getAuthHeaders(token),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    handleAuthError(res);
    throw new Error(
      typeof data.message === "string"
        ? data.message
        : "Failed to load wallet"
    );
  }
  return data;
}

/** List all loans (admin). */
export async function listAllLoans(token: string): Promise<{ loans: Loan[] }> {
  const res = await fetch(endpoints.admin.loans.all(), {
    headers: getAuthHeaders(token),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    handleAuthError(res);
    throw new Error(
      typeof data.message === "string" ? data.message : "Failed to load loans"
    );
  }
  return { loans: Array.isArray(data.loans) ? data.loans : [] };
}

/** List all repayments (admin). */
export async function listAllRepayments(
  token: string
): Promise<{ repayments: LoanRepayment[] }> {
  const res = await fetch(endpoints.admin.loans.allRepayments(), {
    headers: getAuthHeaders(token),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    handleAuthError(res);
    throw new Error(
      typeof data.message === "string"
        ? data.message
        : "Failed to load repayments"
    );
  }
  return { repayments: Array.isArray(data.repayments) ? data.repayments : [] };
}

/** Staff / admin employee (dashboard user) */
export type Employee = {
  id: string;
  employeeNumber: string;
  email: string;
  firstName: string;
  lastName: string;
  role: string;
  active: boolean;
  createdAt?: string;
  updatedAt?: string;
};

export type CreateEmployeePayload = {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  role?: string;
};

/** Roles for staff dropdown (matches backend Role enum, excluding Customer) */
export const STAFF_ROLES = [
  "Super Admin",
  "Finance",
  "Customer Support",
  "Operations",
  "Legal & Compliance",
  "Auditor",
] as const;

/** Funding provider – supplies capital for loans */
export type Provider = {
  id: string;
  providerNumber: string;
  name: string;
  email?: string | null;
  accountNumber?: string | null;
  bankName?: string | null;
  agreedAmount?: number | null;
  percentageToAdd: number;
  /** Portion of percentageToAdd credited to the provider; company keeps the rest. */
  providerCutPercentage: number;
  agreedAt?: string | null;
  agreedTerms?: string | null;
  createdAt?: string;
  updatedAt?: string;
};

export type CreateProviderPayload = {
  name: string;
  email?: string;
  accountNumber?: string;
  bankName?: string;
  agreedAmount?: number;
  percentageToAdd?: number;
  providerCutPercentage?: number;
  agreedAt?: string;
  agreedTerms?: string;
};

/** Amount returned to provider = agreedAmount × (1 + providerCutPercentage / 100) */
export function getProviderFinalAmount(p: Provider): number | null {
  const amount = p.agreedAmount ?? null;
  if (amount == null || amount <= 0) return null;
  const cut = p.providerCutPercentage ?? 0;
  return Math.round(amount * (1 + cut / 100) * 100) / 100;
}

/** Amount kept by the company = agreedAmount × (percentageToAdd - providerCutPercentage) / 100 */
export function getCompanyCutAmount(p: Provider): number | null {
  const amount = p.agreedAmount ?? null;
  if (amount == null || amount <= 0) return null;
  const spread = (p.percentageToAdd ?? 0) - (p.providerCutPercentage ?? 0);
  if (spread <= 0) return 0;
  return Math.round(amount * (spread / 100) * 100) / 100;
}

/** Direct email + password login for admin staff (no OTP). Works for both User and Employee accounts. */
export type AdminLoginResponse = {
  message: string;
  token: string;
  user?: { id: string; email: string; role: string; firstName?: string; lastName?: string };
};

export async function adminLogin(payload: {
  email: string;
  password: string;
}): Promise<AdminLoginResponse> {
  const res = await fetch(endpoints.auth.login(), {
    method: "POST",
    headers: getAuthHeaders(),
    body: JSON.stringify({ email: payload.email.trim(), password: payload.password }),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(
      typeof data.message === "string"
        ? data.message
        : Array.isArray(data.message)
          ? data.message[0]
          : "Invalid email or password"
    );
  }
  return data as AdminLoginResponse;
}

/** Request OTP (login or register). Uses type to determine flow. */
export async function requestCode(
  payload: RequestCodePayload
): Promise<RequestCodeResponse> {
  const res = await fetch(endpoints.auth.requestCode(), {
    method: "POST",
    headers: getAuthHeaders(),
    body: JSON.stringify(payload),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(
      typeof data.message === "string"
        ? data.message
        : Array.isArray(data.message)
          ? data.message[0]
          : "Failed to send code"
    );
  }
  return data as RequestCodeResponse;
}

const RESET_TOKEN_KEY = "stillplay_reset_token";

/** Request password reset: sends 4-digit code to email if account exists. Returns resetToken to store and send with reset. */
export async function requestPasswordReset(
  email: string
): Promise<{ message: string; resetToken?: string }> {
  requireBaseUrl();
  const res = await fetch(endpoints.auth.forgotPassword(), {
    method: "POST",
    headers: getAuthHeaders(),
    body: JSON.stringify({ email: email.trim() }),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(
      typeof data.message === "string"
        ? data.message
        : Array.isArray(data.message)
          ? data.message[0]
          : "Failed to send reset code"
    );
  }
  return data;
}

/** Get stored reset token (from forgot-password). Clear after successful reset. */
export function getStoredResetToken(): string | null {
  if (typeof window === "undefined") return null;
  return sessionStorage.getItem(RESET_TOKEN_KEY);
}

/** Store reset token after forgot-password (client only). */
export function setStoredResetToken(token: string): void {
  if (typeof window === "undefined") return;
  sessionStorage.setItem(RESET_TOKEN_KEY, token);
}

/** Clear stored reset token (after successful reset or on cancel). */
export function clearStoredResetToken(): void {
  if (typeof window === "undefined") return;
  sessionStorage.removeItem(RESET_TOKEN_KEY);
}

/**
 * Upload image via Cloudinary (file-service) using multipart/form-data.
 * Field "file" = the image file; optional "folder" = Cloudinary folder.
 * Returns secure URL or throws.
 */
export async function uploadImage(
  file: File,
  options?: { folder?: string; token?: string | null }
): Promise<{ url: string; secureUrl: string; publicId?: string }> {
  requireBaseUrl();
  const formData = new FormData();
  formData.append("file", file);
  if (options?.folder) formData.append("folder", options.folder);
  // Do not set Content-Type: browser sets multipart/form-data with boundary
  const headers: HeadersInit = {};
  if (options?.token) {
    (headers as Record<string, string>)["Authorization"] = `Bearer ${options.token}`;
  }
  const res = await fetch(endpoints.files.upload(), {
    method: "POST",
    headers,
    body: formData,
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(
      typeof data.message === "string"
        ? data.message
        : (data as { error?: string }).error ?? "Upload failed"
    );
  }
  if (data && typeof data === "object" && "error" in data) {
    throw new Error((data as { error: string }).error);
  }
  return data as { url: string; secureUrl: string; publicId?: string };
}

/** Reset password with resetToken (from forgot-password) or email, plus code and new password. */
export async function resetPassword(payload: {
  resetToken?: string;
  email?: string;
  code: string;
  newPassword: string;
}): Promise<{ message: string }> {
  requireBaseUrl();
  const res = await fetch(endpoints.auth.resetPassword(), {
    method: "POST",
    headers: getAuthHeaders(),
    body: JSON.stringify(payload),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(
      typeof data.message === "string"
        ? data.message
        : Array.isArray(data.message)
          ? data.message[0]
          : "Failed to reset password"
    );
  }
  return data;
}

/** Verify OTP and get token (and optionally create user for register). */
export async function verifyCode(
  payload: VerifyCodePayload
): Promise<VerifyCodeResponse> {
  requireBaseUrl();
  const res = await fetch(endpoints.auth.verifyCode(), {
    method: "POST",
    headers: getAuthHeaders(),
    body: JSON.stringify(payload),
  });
  const text = await res.text();
  let data: Record<string, unknown> = {};
  try {
    data = text ? JSON.parse(text) : {};
  } catch {
    if (text.trimStart().startsWith("<!")) {
      throw new Error(
        "Received a web page instead of API. Set NEXT_PUBLIC_API_BASE_URL in .env.local to your API gateway (e.g. http://localhost:3000/api) and restart."
      );
    }
    throw new Error(text.slice(0, 120) || "Invalid or expired code");
  }
  if (!res.ok) {
    throw new Error(
      typeof data.message === "string"
        ? data.message
        : Array.isArray(data.message)
          ? (data.message[0] as string)
          : "Invalid or expired code"
    );
  }
  return data as VerifyCodeResponse;
}

/** Get current user profile (requires token). */
export async function getProfile(token: string): Promise<UserProfile> {
  const res = await fetch(endpoints.user.profile(), {
    headers: getAuthHeaders(token),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    handleAuthError(res);
    throw new Error(
      typeof data.message === "string" ? data.message : "Failed to load profile"
    );
  }
  return data;
}

/** List admin users (requires token). */
export async function listAdminUsers(token: string): Promise<AdminUser[]> {
  const res = await fetch(endpoints.admin.users(), {
    headers: getAuthHeaders(token),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    handleAuthError(res);
    throw new Error(
      typeof data.message === "string" ? data.message : "Failed to load users"
    );
  }
  return Array.isArray(data) ? data : data.users ?? [];
}

/** Get single admin user (requires token). */
export async function getAdminUser(
  token: string,
  id: string
): Promise<AdminUser> {
  const res = await fetch(endpoints.admin.userById(id), {
    headers: getAuthHeaders(token),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    handleAuthError(res);
    throw new Error(
      typeof data.message === "string" ? data.message : "Failed to load user"
    );
  }
  return data;
}

/** List staff / employees (requires token). */
export async function listEmployees(token: string): Promise<Employee[]> {
  const res = await fetch(endpoints.admin.employees(), {
    headers: getAuthHeaders(token),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    handleAuthError(res);
    throw new Error(
      typeof data.message === "string" ? data.message : "Failed to load staff"
    );
  }
  return Array.isArray(data) ? data : data.employees ?? [];
}

/** Create staff / admin account (requires token). */
export async function createEmployee(
  token: string,
  payload: CreateEmployeePayload
): Promise<{ message: string; employee: Employee }> {
  const res = await fetch(endpoints.admin.employees(), {
    method: "POST",
    headers: getAuthHeaders(token),
    body: JSON.stringify(payload),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    handleAuthError(res);
    throw new Error(
      typeof data.message === "string"
        ? data.message
        : Array.isArray(data.message)
          ? data.message[0]
          : "Failed to create staff"
    );
  }
  return data;
}

/** List funding providers (requires token). */
export async function listProviders(token: string): Promise<Provider[]> {
  const res = await fetch(endpoints.providers.list(), {
    headers: getAuthHeaders(token),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    handleAuthError(res);
    throw new Error(
      typeof data.message === "string" ? data.message : "Failed to load providers"
    );
  }
  return Array.isArray(data) ? data : data.providers ?? [];
}

/** Create funding provider (requires token). */
export async function createProvider(
  token: string,
  payload: CreateProviderPayload
): Promise<{ message: string; provider: Provider }> {
  const res = await fetch(endpoints.providers.create(), {
    method: "POST",
    headers: getAuthHeaders(token),
    body: JSON.stringify(payload),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    handleAuthError(res);
    throw new Error(
      typeof data.message === "string"
        ? data.message
        : Array.isArray(data.message)
          ? data.message[0]
          : "Failed to create provider"
    );
  }
  return data;
}

/** Get all app settings (key-value). */
export async function getAppSettings(
  token: string
): Promise<Record<string, string>> {
  const res = await fetch(endpoints.settings.get(), {
    headers: getAuthHeaders(token),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    handleAuthError(res);
    throw new Error(
      typeof data.message === "string" ? data.message : "Failed to load settings"
    );
  }
  return data as Record<string, string>;
}

/** Set a single app setting. */
export async function setAppSetting(
  token: string,
  key: string,
  value: string
): Promise<{ key: string; value: string }> {
  const res = await fetch(endpoints.settings.set(), {
    method: "POST",
    headers: getAuthHeaders(token),
    body: JSON.stringify({ key, value }),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    handleAuthError(res);
    throw new Error(
      typeof data.message === "string" ? data.message : "Failed to save setting"
    );
  }
  return data as { key: string; value: string };
}
