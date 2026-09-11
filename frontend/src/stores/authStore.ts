import { create } from "zustand";
import api, { setAccessToken } from "../lib/axios";
import { devtools } from "zustand/middleware";
import type { AuthState } from "@/types/user.types";

// ✅ Module-level flag to prevent double restoreSession calls
let hasRestored = false;

export const useAuthStore = create<AuthState>()(
  devtools(
    (set, get) => ({
      token: "",
      isAuthenticated: false,

      setToken: (token: string) => {
        setAccessToken(token);
        set({ token, isAuthenticated: !!token });
      },

      sessionLoading: true,

      restoreSession: async () => {
        // ✅ Prevent double-calling
        if (hasRestored) return;
        hasRestored = true;

        try {
          const { data } = await api.post(
            "/api/user/refresh",
            {},
            { withCredentials: true },
          );

          if (data.success) {
            set({ token: data.token, isAuthenticated: true });
            setAccessToken(data.token);
          } else {
            set({ token: "", isAuthenticated: false });
          }
        } catch {
          // ✅ Expected when no refresh token exists
          set({ token: "", isAuthenticated: false });
        } finally {
          // ✅ CRITICAL: Always stop loading
          set({ sessionLoading: false });
        }
      },

      logout: async () => {
        try {
          await api.post("/api/user/logout");
        } catch (error) {
          console.log("Logout error:", error);
        } finally {
          setAccessToken("");
          set({ token: "", isAuthenticated: false, sessionLoading: false });
          hasRestored = false; // ✅ Allow re-restore after login
        }
      },
    }),
    { name: "AuthStore" },
  ),
);
