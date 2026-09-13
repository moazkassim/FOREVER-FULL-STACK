import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useParams, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";

import Title from "@/components/Title";
import { useResetPassword, useVerifyResetToken } from "@/hooks/useUser";

const resetSchema = z
  .object({
    password: z.string().min(6, "Password must be at least 6 characters"),
    confirmPassword: z.string().min(6, "Please confirm your password"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

type ResetForm = z.infer<typeof resetSchema>;

const ResetPassword = () => {
  const { id, token } = useParams<{ id: string; token: string }>();
  const resetMutation = useResetPassword();

  // ✅ Verify token before showing form
  const { data: verifyData, isLoading: isVerifying } = useVerifyResetToken(
    id || "",
    token || "",
  );

  const form = useForm<ResetForm>({
    resolver: zodResolver(resetSchema),
    defaultValues: { password: "", confirmPassword: "" },
  });

  const onSubmit = (data: ResetForm) => {
    if (!id || !token) return;
    resetMutation.mutate({
      id,
      token,
      password: data.password,
    });
  };

  if (isVerifying) {
    return (
      <div className="flex items-center justify-center min-h-[80vh]">
        <p>Verifying reset link...</p>
      </div>
    );
  }

  // ✅ Show error if token invalid
  if (!verifyData?.success) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[80vh] px-4">
        <div className="w-full max-w-md text-center">
          <Title text1="INVALID" text2="LINK" />
          <p className="text-red-500 mt-4">
            {verifyData?.message || "This reset link is invalid or expired."}
          </p>
          <Link
            to="/forgot-password"
            className="text-blue-500 underline mt-4 block"
          >
            Request a new reset link
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Title text1="RESET" text2="PASSWORD" />
          <p className="text-sm text-gray-500 mt-2">
            Enter your new password below
          </p>
        </div>

        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <Field data-invalid={!!form.formState.errors.password}>
            <FieldLabel htmlFor="password">New Password</FieldLabel>
            <Input
              id="password"
              type="password"
              placeholder="Enter new password"
              {...form.register("password")}
              disabled={resetMutation.isPending}
            />
            {form.formState.errors.password && (
              <FieldError>{form.formState.errors.password.message}</FieldError>
            )}
          </Field>

          <Field data-invalid={!!form.formState.errors.confirmPassword}>
            <FieldLabel htmlFor="confirmPassword">Confirm Password</FieldLabel>
            <Input
              id="confirmPassword"
              type="password"
              placeholder="Confirm new password"
              {...form.register("confirmPassword")}
              disabled={resetMutation.isPending}
            />
            {form.formState.errors.confirmPassword && (
              <FieldError>
                {form.formState.errors.confirmPassword.message}
              </FieldError>
            )}
          </Field>

          <Button
            type="submit"
            disabled={resetMutation.isPending}
            className="w-full bg-black text-white"
          >
            {resetMutation.isPending ? "Resetting..." : "Reset Password"}
          </Button>
        </form>
      </div>
    </div>
  );
};

export default ResetPassword;
