import { create } from "zustand";

type ValidationResult = {
  isValid: boolean;
  error?: string | null;
};

interface LoginState {
  email: string;
  password: string;
  isLoading: boolean;
  error: string | null;
  setEmail: (email: string) => void;
  setPassword: (password: string) => void;
  validateForm: () => ValidationResult;
  resetForm: () => void;
  resetError: () => void;
  setLoading: (isLoading: boolean) => void;
}

const PASSWORD_MIN_LENGTH = 6;
const PASSWORD_MAX_LENGTH = 50;

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const useLoginStore = create<LoginState>((set, get) => ({
  email: "",
  password: "",
  isLoading: false,
  error: null,

  setEmail: (email) => set({ email: email.trim() }),

  setPassword: (password) => set({ password }),

  setLoading: (isLoading) => set({ isLoading }),

  validateForm: (): ValidationResult => {
    const { email, password } = get();

    if (!email.trim()) {
      return {
        isValid: false,
        error: "Email is required.",
      };
    }

    if (!emailRegex.test(email)) {
      return {
        isValid: false,
        error: "Please enter a valid email address.",
      };
    }

    if (!password) {
      return {
        isValid: false,
        error: "Password is required.",
      };
    }

    if (password.length < PASSWORD_MIN_LENGTH) {
      return {
        isValid: false,
        error: `Password must be at least ${PASSWORD_MIN_LENGTH} characters long.`,
      };
    }

    if (password.length > PASSWORD_MAX_LENGTH) {
      return {
        isValid: false,
        error: `Password must be less than ${PASSWORD_MAX_LENGTH} characters.`,
      };
    }

    return {
      isValid: true,
      error: null,
    };
  },

  resetForm: () =>
    set({
      email: "",
      password: "",
      error: null,
    }),

  resetError: () => set({ error: null }),
}));

export default useLoginStore;
