import { endpoints } from "./env";
import useAuthStore from "../store/useAuthStore";

/**
 * Decode a JWT payload without verifying the signature.
 * Returns null if the token is malformed.
 */
function decodeJwtPayload(token: string): Record<string, unknown> | null {
  try {
    const part = token.split(".")[1];
    if (!part) return null;
    const json = atob(part.replace(/-/g, "+").replace(/_/g, "/"));
    return JSON.parse(json) as Record<string, unknown>;
  } catch {
    return null;
  }
}

/** Returns true if the JWT is missing, malformed, or its `exp` has passed. */
export function isTokenExpired(token: string | null | undefined): boolean {
  if (!token) return true;
  const payload = decodeJwtPayload(token);
  if (!payload) return true;
  const exp = payload.exp;
  if (typeof exp !== "number") return false; // no expiry claim → treat as valid
  return Date.now() >= exp * 1000;
}

/**
 * Extract basic identity fields from a JWT without making an API call.
 * Returns null if the token is missing or malformed.
 */
export function decodeToken(token: string | null | undefined): {
  userId: string;
  email: string;
  role: string;
  verified: boolean;
} | null {
  if (!token) return null;
  const payload = decodeJwtPayload(token);
  if (!payload) return null;
  return {
    userId: (payload.userId ?? payload.sub ?? "") as string,
    email: (payload.email ?? "") as string,
    role: (payload.role ?? "Customer") as string,
    verified: Boolean(payload.verified),
  };
}

function getAuthHeaders(token?: string | null): HeadersInit {
  const headers: HeadersInit = { "Content-Type": "application/json" };
  if (token) {
    (headers as Record<string, string>)["Authorization"] = `Bearer ${token}`;
  }
  return headers;
}

function handleAuthError(res: Response): void {
  if (res.status === 401) {
    useAuthStore.getState().reset();
  }
}

export type LoginPayload = {
  email: string;
  password: string;
};

export type LoginResponse = {
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

export async function login(payload: LoginPayload): Promise<LoginResponse> {
  const res = await fetch(endpoints.auth.login(), {
    method: "POST",
    headers: getAuthHeaders(),
    body: JSON.stringify(payload),
  });
  const data = await res.json().catch(() => ({}));
  handleAuthError(res);
  if (!res.ok) {
    throw new Error(
      typeof data.message === "string"
        ? data.message
        : Array.isArray(data.message)
          ? data.message[0]
          : "Invalid email or password"
    );
  }
  return data as LoginResponse;
}

export type UserProfileResponse = {
  id: string;
  email: string;
  role: string;
  firstName?: string;
  lastName?: string;
  picture?: string | null;
  verified?: boolean;
  nin?: string | null;
  ninSlip?: string | null;
  userNumber?: string;
  createdAt?: string;
};

export type WalletResponse = {
  id: string;
  userId: string;
  balance: number;
  currency?: string;
};

export type LoanStatus =
  | "PENDING"
  | "APPROVED"
  | "DISBURSED"
  | "REPAID"
  | "REJECTED";

export type LoanItem = {
  id: string;
  userId: string;
  amount: number;
  amountRepaid: number;
  purpose?: string;
  status: LoanStatus;
  dueDate?: string | null;
  approvedAt?: string | null;
  disbursedAt?: string | null;
  repaidAt?: string | null;
  createdAt: string;
  updatedAt?: string;
};

/** Fetch the authenticated user's full profile. Requires a valid token. */
export async function getProfile(token: string): Promise<UserProfileResponse> {
  const res = await fetch(endpoints.user.profile(), {
    headers: getAuthHeaders(token),
  });
  const data = await res.json().catch(() => ({}));
  handleAuthError(res);
  if (!res.ok) {
    throw new Error(
      typeof data.message === "string" ? data.message : "Failed to load profile"
    );
  }
  // Response shape: { message: string, user: UserProfileResponse }
  const profile = (data as { user?: UserProfileResponse }).user ?? data;
  return profile as UserProfileResponse;
}

/** Fetch a user's wallet balance by userId. */
export async function getWallet(
  token: string,
  userId: string
): Promise<WalletResponse> {
  const res = await fetch(endpoints.loans.wallet(userId), {
    headers: getAuthHeaders(token),
  });
  const data = await res.json().catch(() => ({}));
  handleAuthError(res);
  if (!res.ok) {
    throw new Error(
      typeof data.message === "string" ? data.message : "Failed to load wallet"
    );
  }
  return data as WalletResponse;
}

/** Fetch a user's loan history by userId. */
export async function listLoans(
  token: string,
  userId: string
): Promise<LoanItem[]> {
  const res = await fetch(endpoints.loans.list(userId), {
    headers: getAuthHeaders(token),
  });
  const data = await res.json().catch(() => ({}));
  handleAuthError(res);
  if (!res.ok) {
    throw new Error(
      typeof data.message === "string" ? data.message : "Failed to load loans"
    );
  }
  // Response shape from loan-service: { loans: LoanItem[] }
  if (Array.isArray(data)) return data;
  const nested = data as { loans?: LoanItem[]; data?: LoanItem[] };
  return nested.loans ?? nested.data ?? [];
}

export type RepaymentItem = {
  id: string;
  loanId: string;
  userId: string;
  amount: number;
  repaidAt: string;
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

/** Check if a user is eligible to request a loan and how much they can borrow. */
export async function getLoanEligibility(
  token: string,
  userId: string
): Promise<LoanEligibility> {
  const res = await fetch(endpoints.loans.eligibility(userId), {
    headers: getAuthHeaders(token),
  });
  const data = await res.json().catch(() => ({}));
  handleAuthError(res);
  if (!res.ok) {
    throw new Error(
      typeof data.message === "string" ? data.message : "Failed to check eligibility"
    );
  }
  return data as LoanEligibility;
}

/** Submit a loan request for the authenticated user. */
export async function requestLoan(
  token: string,
  payload: { userId: string; amount: number; purpose?: string }
): Promise<{ message: string; loan: LoanItem }> {
  const res = await fetch(endpoints.loans.request(), {
    method: "POST",
    headers: getAuthHeaders(token),
    body: JSON.stringify(payload),
  });
  const data = await res.json().catch(() => ({}));
  handleAuthError(res);
  if (!res.ok) {
    throw new Error(
      typeof data.message === "string"
        ? data.message
        : Array.isArray(data.message)
          ? data.message[0]
          : "Failed to submit loan request"
    );
  }
  return data as { message: string; loan: LoanItem };
}

// ─── Registration ──────────────────────────────────────────────────────────────

/** Direct registration — creates user immediately without OTP. User starts unverified. */
export async function registerUser(
  payload: {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    nin: string;
    picture?: string | null;
    ninSlip?: string | null;
  }
): Promise<{ message: string; user: { id: string; email: string; firstName: string; lastName: string; userNumber?: string } }> {
  const res = await fetch(endpoints.auth.register(), {
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
          : "Registration failed"
    );
  }
  return data as { message: string; user: { id: string; email: string; firstName: string; lastName: string; userNumber?: string } };
}

export type RegisterCodePayload = {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  nin: string;
  picture?: string | null;
  ninSlip?: string | null;
};

/** Step 1 of register: store pending registration, send OTP to email. */
export async function requestRegisterCode(
  payload: RegisterCodePayload
): Promise<{ message: string }> {
  const res = await fetch(endpoints.auth.requestCode(), {
    method: "POST",
    headers: getAuthHeaders(),
    body: JSON.stringify({ type: "register", ...payload }),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(
      typeof data.message === "string"
        ? data.message
        : Array.isArray(data.message)
          ? data.message[0]
          : "Failed to send verification code"
    );
  }
  return data as { message: string };
}

/** Step 2: verify OTP (type 'login' or 'register'). Returns JWT + user. */
export async function verifyCode(payload: {
  type: "login" | "register";
  email: string;
  code: string;
}): Promise<{
  message: string;
  token: string;
  user?: {
    id: string;
    email: string;
    role: string;
    firstName?: string;
    lastName?: string;
    picture?: string | null;
    verified?: boolean;
  };
}> {
  const res = await fetch(endpoints.auth.verifyCode(), {
    method: "POST",
    headers: getAuthHeaders(),
    body: JSON.stringify(payload),
  });
  const data = await res.json().catch(() => ({}));
  handleAuthError(res);
  if (!res.ok) {
    throw new Error(
      typeof data.message === "string"
        ? data.message
        : Array.isArray(data.message)
          ? data.message[0]
          : "Invalid or expired code"
    );
  }
  return data as {
    message: string;
    token: string;
    user?: { id: string; email: string; role: string; firstName?: string; lastName?: string; picture?: string | null; verified?: boolean };
  };
}

/** Upload an image file to Cloudinary via the file-service. Returns the secure URL. */
export async function uploadImage(
  file: File,
  options?: { folder?: string; token?: string | null }
): Promise<{ url: string; secureUrl: string; publicId?: string }> {
  const formData = new FormData();
  formData.append("file", file);
  if (options?.folder) formData.append("folder", options.folder);
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
  return data as { url: string; secureUrl: string; publicId?: string };
}

/** Record a loan repayment. Called after a successful BudPay payment. */
export async function recordLoanRepayment(
  token: string,
  payload: { loanId: string; amount: number }
): Promise<{ message: string; loan: LoanItem }> {
  const res = await fetch(endpoints.loans.repay(), {
    method: "POST",
    headers: getAuthHeaders(token),
    body: JSON.stringify(payload),
  });
  const data = await res.json().catch(() => ({}));
  handleAuthError(res);
  if (!res.ok) {
    throw new Error(
      typeof data.message === "string"
        ? data.message
        : Array.isArray(data.message)
          ? data.message[0]
          : "Failed to record repayment"
    );
  }
  return data as { message: string; loan: LoanItem };
}

/** Fetch a user's repayment transactions by userId. */
export async function listUserRepayments(
  token: string,
  userId: string
): Promise<RepaymentItem[]> {
  const res = await fetch(endpoints.loans.repayments(userId), {
    headers: getAuthHeaders(token),
  });
  const data = await res.json().catch(() => ({}));
  handleAuthError(res);
  if (!res.ok) {
    throw new Error(
      typeof data.message === "string"
        ? data.message
        : "Failed to load repayments"
    );
  }
  // Response shape: { userId, repayments: [...] }
  const raw = data as { repayments?: RepaymentItem[] } | RepaymentItem[];
  return Array.isArray(raw) ? raw : (raw.repayments ?? []);
}
