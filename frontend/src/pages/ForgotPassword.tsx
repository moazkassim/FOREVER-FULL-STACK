import { useForm } from "react-hook-form";
import { z } from "zod";
import { Link } from "react-router-dom";
import { useForgotPassword } from "@/hooks/useUser";
import { zodResolver } from "@hookform/resolvers/zod";
import Title from "@/components/Title";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const forgotSchema = z.object({
  email: z.string().email("Please enter a valid email"),
});

type ForgotForm = z.infer<typeof forgotSchema>;

const ForgotPassword = () => {
  const forgotMutation = useForgotPassword();

  const form = useForm<ForgotForm>({
    resolver: zodResolver(forgotSchema),
    defaultValues: { email: "" },
  });

  const onSubmit = (data: ForgotForm) => {
    forgotMutation.mutate(data.email);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Title text1="FORGOT" text2="PASSWORD" />
          <p className="text-sm text-gray-500 mt-2">
            Enter your email and we'll send you a reset link
          </p>
        </div>

        {forgotMutation.isSuccess ? (
          <div className="text-center p-6 border rounded-lg bg-green-50">
            <p className="text-green-700">
              If that email exists, a reset link has been sent!
            </p>
            <p className="text-sm text-gray-500 mt-2">
              Check your inbox and spam folder.
            </p>
            <Link to="/login" className="text-blue-500 underline mt-4 block">
              Back to login
            </Link>
          </div>
        ) : (
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <Field data-invalid={!!form.formState.errors.email}>
              <FieldLabel htmlFor="email">Email</FieldLabel>
              <Input
                id="email"
                type="email"
                placeholder="Enter your email"
                {...form.register("email")}
                disabled={forgotMutation.isPending}
              />
              {form.formState.errors.email && (
                <FieldError>{form.formState.errors.email.message}</FieldError>
              )}
            </Field>

            <Button
              type="submit"
              disabled={forgotMutation.isPending}
              className="w-full bg-black text-white"
            >
              {forgotMutation.isPending ? "Sending..." : "Send Reset Link"}
            </Button>

            <Link
              to="/login"
              className="text-sm text-blue-500 underline block text-center mt-4"
            >
              Back to login
            </Link>
          </form>
        )}
      </div>
    </div>
  );
};

export default ForgotPassword;
