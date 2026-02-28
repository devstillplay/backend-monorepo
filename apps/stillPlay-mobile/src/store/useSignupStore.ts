import { create } from "zustand";

/** Data collected across the multi-step signup flow. */
export type SignupFormData = {
  firstName: string;
  lastName: string;
  nin: string;
  email: string;
  password: string;
  /** Cloudinary URL for the user's selfie (optional). */
  picture: string | null;
  /** Cloudinary URL for the NIN slip (optional). */
  ninSlip: string | null;
};

type SignupStore = SignupFormData & {
  setPersonalDetails: (data: Pick<SignupFormData, "firstName" | "lastName" | "nin" | "email" | "password">) => void;
  setPicture: (url: string | null) => void;
  setNinSlip: (url: string | null) => void;
  reset: () => void;
};

const initialState: SignupFormData = {
  firstName: "",
  lastName: "",
  nin: "",
  email: "",
  password: "",
  picture: null,
  ninSlip: null,
};

/** In-memory store — intentionally not persisted so it resets on tab close / refresh. */
export const useSignupStore = create<SignupStore>((set) => ({
  ...initialState,

  setPersonalDetails: (data) => set(data),
  setPicture: (url) => set({ picture: url }),
  setNinSlip: (url) => set({ ninSlip: url }),
  reset: () => set(initialState),
}));
