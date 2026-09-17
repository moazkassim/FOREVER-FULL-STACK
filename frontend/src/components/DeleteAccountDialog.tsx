import { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { Trash2 } from "lucide-react";
import { useDeleteAccount } from "@/hooks/useUser";
import { Input } from "./ui/input";

// ============================================
// Zod Schema — with .refine() instead of .literal()
// ============================================
const deleteAccountSchema = z.object({
  password: z.string().min(1, "Password is required"),
  confirmText: z
    .string()
    .refine((val) => val === "DELETE", {
      message: 'Type "DELETE" to confirm',
    })
    .transform((val) => val as string),
});

type DeleteAccountForm = z.infer<typeof deleteAccountSchema>;

// ============================================
// Component
// ============================================
const DeleteAccountDialog = () => {
  const [open, setOpen] = useState(false);
  const deleteAccount = useDeleteAccount();

  const form = useForm<DeleteAccountForm>({
    resolver: zodResolver(deleteAccountSchema),
    defaultValues: {
      password: "",
      confirmText: "",
    },
    mode: "onBlur",
  });

  const handleOpenChange = (newOpen: boolean) => {
    setOpen(newOpen);
    if (!newOpen) form.reset();
  };

  const onSubmit = (data: DeleteAccountForm) => {
    deleteAccount.mutate(data.password, {
      onSuccess: () => {
        setOpen(false);
        form.reset();
      },
    });
  };

  return (
    <AlertDialog open={open} onOpenChange={handleOpenChange}>
      <AlertDialogTrigger asChild>
        <Button
          variant="destructive"
          className="bg-red-100 text-red-600 hover:bg-red-200"
        >
          <Trash2 className="size-4" />
          Delete Account
        </Button>
      </AlertDialogTrigger>

      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle className="text-red-600">
            Are you absolutely sure?
          </AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete your
            account and remove all your data from our servers.
          </AlertDialogDescription>
        </AlertDialogHeader>

        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-4 py-4"
          noValidate
        >
          <Controller
            name="password"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor="delete-password">
                  Enter your password
                </FieldLabel>
                <Input
                  {...field}
                  id="delete-password"
                  type="password"
                  placeholder="Your current password"
                  disabled={deleteAccount.isPending}
                />
                {fieldState.invalid && (
                  <FieldError>{fieldState.error?.message}</FieldError>
                )}
              </Field>
            )}
          />

          <Controller
            name="confirmText"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor="confirm-delete">
                  Type <span className="font-bold text-red-600">DELETE</span> to
                  confirm
                </FieldLabel>
                <Input
                  {...field}
                  id="confirm-delete"
                  placeholder="DELETE"
                  disabled={deleteAccount.isPending}
                />
                {fieldState.invalid && (
                  <FieldError>{fieldState.error?.message}</FieldError>
                )}
              </Field>
            )}
          />

          <AlertDialogFooter>
            <AlertDialogCancel disabled={deleteAccount.isPending}>
              Cancel
            </AlertDialogCancel>
            <Button
              className=" text-white cursor-pointer"
              type="submit"
              variant="destructive"
              disabled={deleteAccount.isPending}
            >
              {deleteAccount.isPending ? "Deleting..." : "Delete Account"}
            </Button>
          </AlertDialogFooter>
        </form>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default DeleteAccountDialog;
