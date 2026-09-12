import { create } from "zustand";
import { setAccessToken } from "../lib/axios";
import { devtools } from "zustand/middleware";
import type { AuthState } from "@/types/user.types";



export const useAuthStore = create<AuthState>()(
  devtools(
    (set) => ({
      token: "",
      isAuthenticated: false,
      setToken: (token: string) => {
        setAccessToken(token);
        set({ token, isAuthenticated: !!token });
      },
      clearAuth: () => {
        setAccessToken("");
        set({ token: "", isAuthenticated: false });
      },
    }),
    { name: "AuthStore" },
  ),
);
