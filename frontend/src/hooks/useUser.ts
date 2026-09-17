import {
  changePassword,
  deleteUserAccount,
  fetchProfile,
  refreshSession,
  requestPasswordReset,
  resetPassword,
  updateProfile,
  userLogin,
  userLogout,
  userRegister,
  verifyResetToken,
} from "@/services/userService";
import { useAuthStore } from "@/stores/authStore";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { useShallow } from "zustand/shallow";
import { toast } from "react-toastify";
import { getErrorMessage } from "@/utils/getErrorMessage";
import type { UpdateProfileRequest } from "@/types/user.types";
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
  const setToken = useAuthStore((s) => s.setToken);
  const setUser = useAuthStore((s) => s.setUser);
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: userLogin,
    onSuccess: (data) => {
      if (data.success && data.token) {
        setToken(data.token);
        setUser(data.user);
        toast.success("Welcome back! 👋");
        queryClient.invalidateQueries({ queryKey: ["session"] });
        navigate("/", { replace: true });
      }
    },
    onError: (error: Error) => {
      toast.error(getErrorMessage(error) || "Login failed", {
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
export const useForgotPassword = () => {
  return useMutation({
    mutationFn: requestPasswordReset,
    onSuccess: (data) => {
      toast.success(data.message || "Check your email for reset link");
    },
    onError: (error: any) => {
      toast.error(getErrorMessage(error));
    },
  });
};
export const useVerifyResetToken = (id: string, token: string) => {
  return useQuery({
    queryKey: ["verify-reset-token", id, token],
    queryFn: () => verifyResetToken(id, token),
    enabled: !!id && !!token,
    retry: false,
    staleTime: Infinity,
  });
};
export const useResetPassword = () => {
  const navigate = useNavigate();

  return useMutation({
    mutationFn: resetPassword,
    onSuccess: (data) => {
      toast.success(data.message || "Password reset successfully!");
      navigate("/login");
    },
    onError: (error: any) => {
      toast.error(getErrorMessage(error));
    },
  });
};
export const useProfile = () => {
  const token = useAuthStore((s) => s.token);

  return useQuery({
    queryKey: ["profile"],
    queryFn: fetchProfile,
    enabled: !!token,
    staleTime: 5 * 60 * 1000,
    retry: false,
  });
};
export const useUpdateProfile = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: UpdateProfileRequest) => updateProfile(data),
    onMutate: async (newData) => {
      await queryClient.cancelQueries({ queryKey: ["profile"] });
      const previousProfile = queryClient.getQueryData(["profile"]);
      queryClient.setQueryData(["profile"], (old: any) => {
        if (!old) return old;
        return { ...old, ...newData };
      });
      return { previousProfile };
    },
    onSuccess: (updatedUser) => {
      queryClient.setQueryData(["profile"], updatedUser);
      toast.success("Profile updated successfully!");
    },
    onError: (error: any, variables, context) => {
      if (context?.previousProfile) {
        queryClient.setQueryData(["profile"], context.previousProfile);
      }
      toast.error(getErrorMessage(error));
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["profile"] });
    },
  });
};
export const useChangePassword = () => {
  return useMutation({
    mutationFn: changePassword,
    onSuccess: () => {
      toast.success("Password changed successfully!");
    },
    onError: (error: any) => {
      toast.error(getErrorMessage(error));
    },
  });
};
export const useDeleteAccount = () => {
  const clearAuth = useAuthStore((s) => s.clearAuth);
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteUserAccount,
    onSuccess: () => {
      clearAuth();
      queryClient.clear();
      navigate("/login");
    },
    onError: (error: any) => {
      toast.error(getErrorMessage(error));
    },
  });
};
