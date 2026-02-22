import { create } from "zustand";
import { persist, createJSONStorage, type StateStorage } from "zustand/middleware";
import type { UserProfile } from "./auth";

type UserState = {
  profile: UserProfile | null;
  setProfile: (profile: UserProfile | null) => void;
  reset: () => void;
};

const noopStorage: StateStorage = {
  getItem: () => null,
  setItem: () => {},
  removeItem: () => {},
};

export const useUserStore = create<UserState>()(
  persist(
    (set) => ({
      profile: null,
      setProfile: (profile) => set({ profile }),
      reset: () => set({ profile: null }),
    }),
    {
      name: "stillplay-admin-user",
      storage: createJSONStorage(() =>
        typeof window === "undefined" ? noopStorage : localStorage
      ),
      partialize: (state) => ({ profile: state.profile }),
    }
  )
);

/** Role-based access: allowed roles for admin dashboard. */
export const ADMIN_ROLES = ["admin", "operations", "superadmin"] as const;

export function useHasAccess(): boolean {
  const profile = useUserStore((s) => s.profile);
  if (!profile?.role) return false;
  return ADMIN_ROLES.includes(profile.role.toLowerCase() as (typeof ADMIN_ROLES)[number]);
}
