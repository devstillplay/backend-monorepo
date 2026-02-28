import { create } from "zustand";
import {
  persist,
  createJSONStorage,
  type StateStorage,
} from "zustand/middleware";
import { isTokenExpired } from "../lib/api";

export type AuthStatus = "unauthenticated" | "otp_required" | "authenticated";

export type UserProfile = {
  id: string;
  email: string;
  role: string;
  verified?: boolean;
  firstName?: string;
  lastName?: string;
  picture?: string | null;
  userNumber?: string;
  createdAt?: string;
};

type AuthState = {
  status: AuthStatus;
  token: string | null;
  user: UserProfile | null;
  otpEmail: string | null;
  otpExpiresAt: number | null;
  fullName: string | null;
  _hasRehydrated: boolean;
  lastLoginAt: number | null;

  setPendingOtp: (email: string, otpExpiresAt: number, fullName?: string) => void;
  setAuthenticated: (token: string, user: UserProfile | null) => void;
  setUser: (user: UserProfile) => void;
  setRehydrated: () => void;
  reset: () => void;

  /** @deprecated use setAuthenticated */
  login: () => void;
  /** @deprecated use reset */
  logout: () => void;
  isAuthenticated: boolean;
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
  isAuthenticated: false,
};

const useAuthStore = create<AuthState>()(
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
          isAuthenticated: true,
        }),

      setUser: (user) => set({ user }),

      setRehydrated: () => set({ _hasRehydrated: true }),

      reset: () => set({ ...initialState, _hasRehydrated: true, isAuthenticated: false }),

      login: () => set({ isAuthenticated: true, status: "authenticated" }),
      logout: () => set({ ...initialState, _hasRehydrated: true }),
    }),
    {
      name: "stillplay-mobile-auth",
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
        isAuthenticated: state.isAuthenticated,
      }),
      onRehydrateStorage: () => () => {
        const state = useAuthStore.getState();
        // If the persisted token is expired, clear auth before marking as rehydrated
        // so the dashboard guard always redirects to login with a clean state.
        if (state.status === "authenticated" && isTokenExpired(state.token)) {
          state.reset();
        } else {
          state.setRehydrated();
        }
      },
    }
  )
);

export default useAuthStore;
