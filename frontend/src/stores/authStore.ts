import { create } from "zustand";
import api, { setAccessToken } from "../lib/axios";
import { devtools } from "zustand/middleware";
import type { AuthState } from "@/types/user.types";

export const useAuthStore = create<AuthState>()(
  devtools(
    (set) => ({
      token: "",
      setToken: (token: string) => {
        setAccessToken(token);
        set({ token });
      },
      sessionLoading: true,
      restoreSession: async () => {
        try {
          const { data } = await api.post(
            "/api/user/refresh",
            {},
            { withCredentials: true },
          );
          if (data.success) {
            set({ token: data.token });
            setAccessToken(data.token);
          }
        } catch {
          // Refresh token expired or doesn't exist — user needs to log in
          set({ token: "" });
        } finally {
          set({ sessionLoading: false });
        }
      },
      logout: async () => {
        try {
          await api.post("/api/user/logout");
        } catch (error) {
          console.log(error);
        } finally {
          setAccessToken("");
          set({ token: "" });
          setAccessToken("");
          set({ token: "", sessionLoading: false });
        }
      },
    }),
    { name: "AuthStore" },
  ),
);
