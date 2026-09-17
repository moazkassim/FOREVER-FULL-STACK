import { create } from "zustand";
import { setAccessToken } from "../lib/axios";
import { devtools, persist } from "zustand/middleware";
import type { AuthState, AuthUser } from "@/types/user.types";

export const useAuthStore = create<AuthState>()(
  devtools(
    persist(
      (set) => ({
        token: "",
        user: null,
        isAuthenticated: false,

        setToken: (token: string) => {
          setAccessToken(token);
          set({ token, isAuthenticated: !!token });
        },

        setUser: (user: AuthUser) => {
          set({ user });
        },

        clearAuth: () => {
          setAccessToken("");
          set({ token: "", user: null, isAuthenticated: false });
        },
      }),
      {
        name: "auth-storage",
        // ✅ Only persist token (user data comes from API on load)
        partialize: (state) => ({ token: state.token }),
      },
    ),
    { name: "AuthStore" },
  ),
);
