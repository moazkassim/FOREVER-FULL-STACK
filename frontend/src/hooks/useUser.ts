import { refreshSession, userLogin, userLogout, userRegister } from "@/services/userService";
import { useAuthStore } from "@/stores/authStore";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { useShallow } from "zustand/shallow";
import { toast } from "react-toastify";
export const useUserRegister = () => {
  const { setToken } = useAuthStore(
    useShallow((state) => ({
      setToken: state.setToken,
    })),
  );
  const navigate = useNavigate();

  return useMutation({
    mutationFn: userRegister,
    onSuccess: (data) => {
      if (data.success && data.token) {
        setToken(data.token);

        toast.success("Account created successfully! Welcome aboard! 🎉");
        navigate("/", { replace: true });
      }
    },
    onError: (error: Error) => {
      toast.error(error.message || "Register failed", {
        position: "bottom-right",
        autoClose: 3000,
      });
    },
  });
};
export const useUserLogin = () => {
  const { setToken } = useAuthStore(
    useShallow((state) => ({
      setToken: state.setToken,
    })),
  );
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: userLogin,
    onSuccess: (data) => {
      if (data.success && data.token) {
        setToken(data.token);
        toast.success("Welcome back! 👋");
        queryClient.invalidateQueries({ queryKey: ["session"] });
        navigate("/", { replace: true });
      }
    },
    onError: (error: Error) => {
      toast.error(error.message || "Login failed", {
        position: "bottom-right",
        autoClose: 3000,
      });
    },
  });
};

export const useUserLogout = () => {
  const clearAuth = useAuthStore((state) => state.clearAuth);
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: userLogout,
    onSuccess: () => {
      clearAuth();
      queryClient.clear();
      toast.success("Logged out!");
      navigate("/login");
    },
    onError: () => {
      clearAuth();
      queryClient.clear();
      navigate("/login");
    },
  });
};
export const useSessionRestore = () => {
  const setToken = useAuthStore((state) => state.setToken);
  const clearAuth = useAuthStore((state) => state.clearAuth);

  return useQuery({
    queryKey: ["session"],
    queryFn: async () => {
      try {
        const data = await refreshSession();

        if (data.success && data.token) {
          setToken(data.token);
          return data;
        }

        clearAuth();
        return null;
      } catch {
        // Expected when no refresh token exists
        clearAuth();
        return null;
      } finally {
        
      }
    },
    staleTime: Infinity, 
    retry: false, 
    refetchOnWindowFocus: false,
    refetchOnMount: false,
  });
};
