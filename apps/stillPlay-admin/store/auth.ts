import { create } from "zustand";
import {
  persist,
  createJSONStorage,
  type StateStorage,
} from "zustand/middleware";
import { useUserStore } from "./user";

export type AuthStatus = "unauthenticated" | "otp_required" | "authenticated";

export type UserProfile = {
  id: string;
  email: string;
  role: string;
  verified?: boolean;
  firstName?: string;
  lastName?: string;
  userNumber?: string;
  picture?: string | null;
};

type AuthState = {
  status: AuthStatus;
  token: string | null;
  user: UserProfile | null;
  /** Email used for OTP step (login or register) */
  otpEmail: string | null;
  otpExpiresAt: number | null;
  /** Display name before profile is loaded (e.g. from email) */
  fullName: string | null;
  /** True after persisted state has been restored from localStorage (avoids redirect before rehydrate) */
  _hasRehydrated: boolean;
  /** Timestamp of last successful login (for settings activity tab) */
  lastLoginAt: number | null;
  /** IP at last login (if captured) */
  lastLoginIp: string | null;
  /** Last action carried out (e.g. "Viewed Users") */
  lastAction: string | null;

  setPendingOtp: (email: string, otpExpiresAt: number, fullName?: string) => void;
  setAuthenticated: (token: string, user: UserProfile | null) => void;
  setUser: (user: UserProfile) => void;
  setRehydrated: () => void;
  setLastAction: (action: string) => void;
  setLastLoginIp: (ip: string) => void;
  reset: () => void;
};

const initialState = {
  status: "unauthenticated" as AuthStatus,
  token: null as string | null,
  user: null as UserProfile | null,
  otpEmail: null as string | null,
  otpExpiresAt: null as number | null,
  fullName: null as string | null,
  _hasRehydrated: false,
  lastLoginAt: null as number | null,
  lastLoginIp: null as string | null,
  lastAction: null as string | null,
};

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      ...initialState,

      setPendingOtp: (email, otpExpiresAt, fullName) =>
        set({
          status: "otp_required",
          otpEmail: email,
          otpExpiresAt,
          fullName: fullName ?? null,
        }),

      setAuthenticated: (token, user) =>
        set({
          status: "authenticated",
          token,
          user,
          otpEmail: null,
          otpExpiresAt: null,
          lastLoginAt: Date.now(),
        }),

      setUser: (user) => set({ user }),

      setRehydrated: () => set({ _hasRehydrated: true }),

      setLastAction: (action) => set({ lastAction: action }),
      setLastLoginIp: (ip) => set({ lastLoginIp: ip }),

      reset: () => set(initialState),
    }),
    {
      name: "stillplay-admin-auth",
      storage: createJSONStorage(() => {
        if (typeof window === "undefined") {
          const noopStorage: StateStorage = {
            getItem: () => null,
            setItem: () => {},
            removeItem: () => {},
          };
          return noopStorage;
        }
        return localStorage;
      }),
      partialize: (state) => ({
        status: state.status,
        token: state.token,
        user: state.user,
        fullName: state.fullName,
        otpEmail: state.otpEmail,
        otpExpiresAt: state.otpExpiresAt,
        lastLoginAt: state.lastLoginAt,
        lastLoginIp: state.lastLoginIp,
        lastAction: state.lastAction,
      }),
      onRehydrateStorage: () => () => {
        const state = useAuthStore.getState();
        state.setRehydrated();
        if (state.user) {
          useUserStore.getState().setProfile(state.user);
        }
      },
    }
  )
);

/** Access control: any logged-in staff member (non-Customer role) can access the dashboard. */
export function useHasAdminAccess(): boolean {
  const user = useAuthStore((s) => s.user);
  const token = useAuthStore((s) => s.token);
  if (!token || !user?.role) return false;
  return user.role.toLowerCase() !== "customer";
}
