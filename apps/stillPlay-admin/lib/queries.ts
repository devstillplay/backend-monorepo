import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useAuthStore } from "../store/auth";
import {
  listAdminUsers,
  getAdminUser,
  updateAdminUser,
  deleteAdminUser,
  listAdminActivity,
  recordAdminActivity,
  listProviders,
  getBudpayBanks,
  listProvidersForDisbursement,
  executeDisbursement,
  createProvider,
  deleteProvider,
  listEmployees,
  createEmployee,
  updateEmployee,
  getLoanEligibility,
  getUserLoanHistory,
  getUserRepayments,
  getUserWallet,
  getCompanyBalance,
  requestLoanForUser,
  approveLoan,
  rejectLoan,
  listAllLoans,
  listAllRepayments,
  getAppSettings,
  setAppSetting,
  getChatThreads,
  getChatMessages,
  sendChatMessage,
  createChatThread,
  listWaitlist,
  type AdminUser,
  type CreateProviderPayload,
  type CreateEmployeePayload,
  type Employee,
} from "./api";

export const adminKeys = {
  all: ["admin"] as const,
  users: () => [...adminKeys.all, "users"] as const,
  waitlist: () => [...adminKeys.all, "waitlist"] as const,
  user: (id: string) => [...adminKeys.users(), id] as const,
  employees: () => [...adminKeys.all, "employees"] as const,
  activity: () => [...adminKeys.all, "activity"] as const,
  settings: () => [...adminKeys.all, "settings"] as const,
  companyBalance: () => [...adminKeys.all, "companyBalance"] as const,
  loans: {
    all: () => [...adminKeys.all, "loans", "all"] as const,
    allRepayments: () => [...adminKeys.all, "loans", "repayments", "all"] as const,
    userLoans: (userId: string) => [...adminKeys.all, "loans", "user", userId] as const,
    userRepayments: (userId: string) => [...adminKeys.all, "loans", "repayments", "user", userId] as const,
    userWallet: (userId: string) => [...adminKeys.all, "loans", "wallet", userId] as const,
    userEligibility: (userId: string) => [...adminKeys.all, "loans", "eligibility", userId] as const,
  },
};

export const providerKeys = {
  all: ["providers"] as const,
  list: () => [...providerKeys.all, "list"] as const,
  disbursement: () => [...providerKeys.all, "disbursement"] as const,
  banks: (currency?: string) => [...providerKeys.all, "banks", currency ?? "NGN"] as const,
};

/** Fetch admin users list with TanStack Query; refetches on window focus and when invalidated. */
export function useAdminUsers() {
  const token = useAuthStore((s) => s.token);

  return useQuery({
    queryKey: adminKeys.users(),
    queryFn: () => listAdminUsers(token!),
    enabled: !!token,
    refetchOnWindowFocus: true,
    staleTime: 60 * 1000, // 1 min
  });
}

/** Landing / partners waitlist entries (admin). */
export function useWaitlist() {
  const token = useAuthStore((s) => s.token);
  return useQuery({
    queryKey: adminKeys.waitlist(),
    queryFn: () => listWaitlist(token!),
    enabled: !!token,
    refetchOnWindowFocus: true,
    staleTime: 30 * 1000,
  });
}

/** Fetch full details for a single user (includes nin, ninSlip, etc.). */
export function useAdminUserDetail(id: string | null) {
  const token = useAuthStore((s) => s.token);
  return useQuery({
    queryKey: [...adminKeys.users(), "detail", id],
    queryFn: () => getAdminUser(token!, id!),
    enabled: !!token && !!id,
    staleTime: 30 * 1000,
  });
}

/** Invalidate users list (e.g. after create/update/delete). */
export function useInvalidateAdminUsers() {
  const queryClient = useQueryClient();
  return () => queryClient.invalidateQueries({ queryKey: adminKeys.users() });
}

/** Update admin user (e.g. suspend/unsuspend) and invalidate list. */
export function useUpdateAdminUser() {
  const token = useAuthStore((s) => s.token);
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      id,
      payload,
    }: {
      id: string;
      payload: Parameters<typeof import("./api").updateAdminUser>[2];
    }) => updateAdminUser(token!, id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: adminKeys.users() });
      recordActivity({ action: "User edited" });
      queryClient.invalidateQueries({ queryKey: adminKeys.activity() });
    },
  });
}

/** Fetch current admin user's activity list. */
export function useAdminActivity(limit?: number) {
  const token = useAuthStore((s) => s.token);
  return useQuery({
    queryKey: [...adminKeys.activity(), limit ?? 50],
    queryFn: () => listAdminActivity(token!, limit),
    enabled: !!token,
    staleTime: 30 * 1000,
  });
}

/** Record activity (e.g. from layout on navigation). Call directly; no hook needed. */
export function recordActivity(payload: { action: string; ip?: string }) {
  const token = useAuthStore.getState().token;
  if (!token) return;
  recordAdminActivity(token, payload).catch(() => {});
}

/** Delete admin user (wallet and loans/transactions deleted on backend) and invalidate list. */
export function useDeleteAdminUser() {
  const token = useAuthStore((s) => s.token);
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => deleteAdminUser(token!, id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: adminKeys.users() });
      recordActivity({ action: "User deleted" });
      queryClient.invalidateQueries({ queryKey: adminKeys.activity() });
    },
  });
}

/** Fetch providers list with TanStack Query. */
export function useProviders() {
  const token = useAuthStore((s) => s.token);
  return useQuery({
    queryKey: providerKeys.list(),
    queryFn: () => listProviders(token!),
    enabled: !!token,
    refetchOnWindowFocus: true,
    staleTime: 60 * 1000,
  });
}

/** Fetch BudPay bank list for provider form. */
export function useBudpayBanks(currency = "NGN") {
  const token = useAuthStore((s) => s.token);
  return useQuery({
    queryKey: providerKeys.banks(currency),
    queryFn: () => getBudpayBanks(token!, currency),
    enabled: !!token,
    staleTime: 60 * 60 * 1000, // 1 hour - banks rarely change
  });
}

/** Fetch providers for disbursement page (with balance and total paid). */
export function useProvidersForDisbursement() {
  const token = useAuthStore((s) => s.token);
  return useQuery({
    queryKey: providerKeys.disbursement(),
    queryFn: () => listProvidersForDisbursement(token!),
    enabled: !!token,
    refetchOnWindowFocus: true,
    staleTime: 30 * 1000,
  });
}

/** Execute disbursement and invalidate lists. */
export function useDisbursement() {
  const token = useAuthStore((s) => s.token);
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: { transfers: { providerId: string; amount: number }[]; currency?: string; simulate?: boolean }) =>
      executeDisbursement(token!, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: providerKeys.list() });
      queryClient.invalidateQueries({ queryKey: providerKeys.disbursement() });
      queryClient.invalidateQueries({ queryKey: adminKeys.companyBalance() });
      recordActivity({ action: "Provider disbursement" });
      queryClient.invalidateQueries({ queryKey: adminKeys.activity() });
    },
  });
}

/** Create provider and invalidate list. */
export function useCreateProvider() {
  const token = useAuthStore((s) => s.token);
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: CreateProviderPayload) =>
      createProvider(token!, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: providerKeys.list() });
      queryClient.invalidateQueries({ queryKey: providerKeys.disbursement() });
      queryClient.invalidateQueries({ queryKey: adminKeys.companyBalance() });
      recordActivity({ action: "Provider added" });
      queryClient.invalidateQueries({ queryKey: adminKeys.activity() });
    },
  });
}

/** Delete provider (with optional payout first). */
export function useDeleteProvider() {
  const token = useAuthStore((s) => s.token);
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      providerId,
      payoutFirst,
    }: {
      providerId: string;
      payoutFirst: boolean;
    }) => deleteProvider(token!, providerId, payoutFirst),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: providerKeys.list() });
      queryClient.invalidateQueries({ queryKey: providerKeys.disbursement() });
      queryClient.invalidateQueries({ queryKey: adminKeys.companyBalance() });
      recordActivity({ action: "Provider deleted" });
      queryClient.invalidateQueries({ queryKey: adminKeys.activity() });
    },
  });
}

/** Fetch staff / employees list. */
export function useEmployees() {
  const token = useAuthStore((s) => s.token);
  return useQuery({
    queryKey: adminKeys.employees(),
    queryFn: () => listEmployees(token!),
    enabled: !!token,
    refetchOnWindowFocus: true,
    staleTime: 60 * 1000,
  });
}

/** Create staff / admin account and invalidate list. */
export function useCreateEmployee() {
  const token = useAuthStore((s) => s.token);
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: CreateEmployeePayload) =>
      createEmployee(token!, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: adminKeys.employees() });
      recordActivity({ action: "Staff/employee created" });
      queryClient.invalidateQueries({ queryKey: adminKeys.activity() });
    },
  });
}

/** Update staff (suspend / reinstate / edit fields). */
export function useUpdateEmployee() {
  const token = useAuthStore((s) => s.token);
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      id,
      payload,
    }: {
      id: string;
      payload: Partial<
        Pick<Employee, "email" | "firstName" | "lastName" | "role" | "active">
      >;
    }) => updateEmployee(token!, id, payload),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: adminKeys.employees() });
      const action =
        variables.payload.active === false
          ? "Staff suspended"
          : variables.payload.active === true
            ? "Staff reinstated"
            : "Staff updated";
      recordActivity({ action });
      queryClient.invalidateQueries({ queryKey: adminKeys.activity() });
    },
  });
}

/** Fetch a user's loan history (admin). */
export function useUserLoanHistory(userId: string | null) {
  const token = useAuthStore((s) => s.token);
  return useQuery({
    queryKey: adminKeys.loans.userLoans(userId ?? ""),
    queryFn: () => getUserLoanHistory(token!, userId!),
    enabled: !!token && !!userId,
    staleTime: 30 * 1000,
  });
}

/** Fetch a user's repayment history (admin). */
export function useUserRepayments(userId: string | null) {
  const token = useAuthStore((s) => s.token);
  return useQuery({
    queryKey: adminKeys.loans.userRepayments(userId ?? ""),
    queryFn: () => getUserRepayments(token!, userId!),
    enabled: !!token && !!userId,
    staleTime: 30 * 1000,
  });
}

/** Fetch a user's wallet (admin). */
export function useUserWallet(userId: string | null) {
  const token = useAuthStore((s) => s.token);
  return useQuery({
    queryKey: adminKeys.loans.userWallet(userId ?? ""),
    queryFn: () => getUserWallet(token!, userId!),
    enabled: !!token && !!userId,
    staleTime: 30 * 1000,
  });
}

/** Fetch company account balance (admin). */
export function useCompanyBalance() {
  const token = useAuthStore((s) => s.token);
  return useQuery({
    queryKey: adminKeys.companyBalance(),
    queryFn: () => getCompanyBalance(token!),
    enabled: !!token,
    staleTime: 30 * 1000,
  });
}

/** Fetch loan eligibility for a user (admin). */
export function useUserLoanEligibility(userId: string | null) {
  const token = useAuthStore((s) => s.token);
  return useQuery({
    queryKey: adminKeys.loans.userEligibility(userId ?? ""),
    queryFn: () => getLoanEligibility(token!, userId!),
    enabled: !!token && !!userId,
    staleTime: 15 * 1000,
  });
}

/** Request a loan for a user (admin); invalidates that user's loans and wallet. */
export function useRequestLoanForUser() {
  const token = useAuthStore((s) => s.token);
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: {
      userId: string;
      amount: number;
      purpose?: string;
    }) => requestLoanForUser(token!, payload),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: adminKeys.loans.userLoans(variables.userId),
      });
      queryClient.invalidateQueries({
        queryKey: adminKeys.loans.userWallet(variables.userId),
      });
      queryClient.invalidateQueries({
        queryKey: adminKeys.loans.userRepayments(variables.userId),
      });
      queryClient.invalidateQueries({
        queryKey: adminKeys.loans.userEligibility(variables.userId),
      });
      queryClient.invalidateQueries({ queryKey: adminKeys.loans.all() });
      queryClient.invalidateQueries({ queryKey: adminKeys.loans.allRepayments() });
    },
  });
}

/** Fetch all loans (admin) for loan-request page. */
export function useAllLoans() {
  const token = useAuthStore((s) => s.token);
  return useQuery({
    queryKey: adminKeys.loans.all(),
    queryFn: () => listAllLoans(token!),
    enabled: !!token,
    refetchOnWindowFocus: true,
    staleTime: 30 * 1000,
  });
}

/** Fetch all repayments (admin) for loan-repayment page. */
export function useAllRepayments() {
  const token = useAuthStore((s) => s.token);
  return useQuery({
    queryKey: adminKeys.loans.allRepayments(),
    queryFn: () => listAllRepayments(token!),
    enabled: !!token,
    refetchOnWindowFocus: true,
    staleTime: 30 * 1000,
  });
}

/** Approve a loan (admin); invalidates all loans list and company balance. */
export function useApproveLoan() {
  const token = useAuthStore((s) => s.token);
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (loanId: string) => approveLoan(token!, loanId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: adminKeys.loans.all() });
      queryClient.invalidateQueries({ queryKey: adminKeys.companyBalance() });
      recordActivity({ action: "Loan approved" });
      queryClient.invalidateQueries({ queryKey: adminKeys.activity() });
    },
  });
}

/** Reject a loan (admin); invalidates all loans list. */
export function useRejectLoan() {
  const token = useAuthStore((s) => s.token);
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (loanId: string) => rejectLoan(token!, loanId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: adminKeys.loans.all() });
      recordActivity({ action: "Loan rejected" });
      queryClient.invalidateQueries({ queryKey: adminKeys.activity() });
    },
  });
}

export function useAppSettings() {
  const token = useAuthStore((s) => s.token);
  return useQuery({
    queryKey: adminKeys.settings(),
    queryFn: () => getAppSettings(token!),
    enabled: !!token,
    staleTime: 60 * 1000,
  });
}

export function useSetAppSetting() {
  const token = useAuthStore((s) => s.token);
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ key, value }: { key: string; value: string }) =>
      setAppSetting(token!, key, value),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: adminKeys.settings() });
    },
  });
}

// ---------- Chat (support) ----------

export const chatKeys = {
  all: ["chat"] as const,
  threads: (params?: { userId?: string; status?: string }) =>
    [...chatKeys.all, "threads", params ?? {}] as const,
  messages: (chatSupportId: string, userId?: string) =>
    [...chatKeys.all, "messages", chatSupportId, userId ?? ""] as const,
};

export function useChatThreads(params?: { userId?: string; status?: string }) {
  const token = useAuthStore((s) => s.token);
  return useQuery({
    queryKey: chatKeys.threads(params),
    queryFn: () => getChatThreads(token!, params),
    enabled: !!token,
    refetchOnWindowFocus: true,
    staleTime: 15 * 1000,
  });
}

export function useChatMessages(
  chatSupportId: string | null,
  limit?: number,
  userId?: string | null
) {
  const token = useAuthStore((s) => s.token);
  return useQuery({
    queryKey: chatKeys.messages(chatSupportId ?? "", userId ?? undefined),
    queryFn: () => getChatMessages(token!, chatSupportId!, limit),
    enabled: !!token && !!chatSupportId,
    staleTime: 5 * 1000,
    // Prevent showing cached messages from a different user when switching
    placeholderData: undefined,
  });
}

export function useSendChatMessage() {
  const token = useAuthStore((s) => s.token);
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: { chatSupportId: string; content: string; recipientUserId?: string }) =>
      sendChatMessage(token!, payload),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["chat", "messages", variables.chatSupportId],
      });
      queryClient.invalidateQueries({ queryKey: chatKeys.threads() });
    },
  });
}

export function useCreateChatThread() {
  const token = useAuthStore((s) => s.token);
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (options?: { userId?: string }) =>
      createChatThread(token!, options),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: chatKeys.threads() });
    },
  });
}
