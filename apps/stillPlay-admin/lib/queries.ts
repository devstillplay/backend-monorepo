import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useAuthStore } from "../store/auth";
import {
  listAdminUsers,
  updateAdminUser,
  deleteAdminUser,
  listAdminActivity,
  recordAdminActivity,
  listProviders,
  createProvider,
  listEmployees,
  createEmployee,
  getUserLoanHistory,
  getUserRepayments,
  getUserWallet,
  requestLoanForUser,
  approveLoan,
  rejectLoan,
  listAllLoans,
  listAllRepayments,
  type AdminUser,
  type CreateProviderPayload,
  type CreateEmployeePayload,
} from "./api";

export const adminKeys = {
  all: ["admin"] as const,
  users: () => [...adminKeys.all, "users"] as const,
  user: (id: string) => [...adminKeys.users(), id] as const,
  employees: () => [...adminKeys.all, "employees"] as const,
  activity: () => [...adminKeys.all, "activity"] as const,
  loans: {
    all: () => [...adminKeys.all, "loans", "all"] as const,
    allRepayments: () => [...adminKeys.all, "loans", "repayments", "all"] as const,
    userLoans: (userId: string) => [...adminKeys.all, "loans", "user", userId] as const,
    userRepayments: (userId: string) => [...adminKeys.all, "loans", "repayments", "user", userId] as const,
    userWallet: (userId: string) => [...adminKeys.all, "loans", "wallet", userId] as const,
  },
};

export const providerKeys = {
  all: ["providers"] as const,
  list: () => [...providerKeys.all, "list"] as const,
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

/** Create provider and invalidate list. */
export function useCreateProvider() {
  const token = useAuthStore((s) => s.token);
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: CreateProviderPayload) =>
      createProvider(token!, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: providerKeys.list() });
      recordActivity({ action: "Provider added" });
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

/** Approve a loan (admin); invalidates all loans list. */
export function useApproveLoan() {
  const token = useAuthStore((s) => s.token);
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (loanId: string) => approveLoan(token!, loanId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: adminKeys.loans.all() });
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
