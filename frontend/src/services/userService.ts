import api from "@/lib/axios";
import { useAuthStore } from "@/stores/authStore";
import type { LoginValues, RegisterValues } from "@/types/user.types";
import { useQuery } from "@tanstack/react-query";

export const userRegister = async ({
  name,
  email,
  password,
}: RegisterValues) => {
  const response = await api.post("/api/user/register", {
    name,
    email,
    password,
  });
  return response.data;
};
export const userLogin = async ({ email, password }: LoginValues) => {
  const response = await api.post("/api/user/login", {
    email,
    password,
  });
  return response.data;
};
export const userLogout = async () => {
  const response = await api.post("/api/user/logout");
  return response.data;
};
export const refreshSession = async () => {
  const { data } = await api.post(
    "/api/user/refresh",
    {},
    { withCredentials: true },
  );
  return data;
};

export const useSessionRestore = () => {
  const setToken = useAuthStore((state) => state.setToken);
  const setSessionLoading = useAuthStore((state) => state.setSessionLoading);
  const clearAuth = useAuthStore((state) => state.clearAuth);

  return useQuery({
    queryKey: ["session"],
    queryFn: async () => {
      setSessionLoading(true);
      try {
        const data = await refreshSession();

        if (data.success && data.token) {
          setToken(data.token);
          return data;
        }

        clearAuth();
        return null;
      } catch {
        clearAuth();
        return null;
      } finally {
        setSessionLoading(false);
      }
    },
    staleTime: Infinity,
    retry: false,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
  });
};
