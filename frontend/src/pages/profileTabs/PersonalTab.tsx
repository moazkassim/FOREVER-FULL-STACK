import { useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { useProfile, useUpdateProfile } from "@/hooks/useUser";
import {
  profileSchema,
  type PersonalTabProps,
  type ProfileForm,
} from "@/types/user.types";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const PersonalTab = ({ isEditing, onCancel, onSaved }: PersonalTabProps) => {
  const { data: user } = useProfile();
  const updateProfile = useUpdateProfile();

  const form = useForm<ProfileForm>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      street: "",
      city: "",
      state: "",
      zipcode: "",
  
      location: "",
    },
  });

  useEffect(() => {
    if (user) {
      form.reset({
        firstName: user.firstName || "",
        lastName: user.lastName || "",
        email: user.email || "",
        phone: user.phone || "",
        street: user.street || "",
        city: user.city || "",
        state: user.state || "",
        zipcode: user.zipcode || "",
       
        location: user.location || "",
      });
    }
  }, [user, form]);

  const onSubmit = (data: ProfileForm) => {
    const { email, ...updateData } = data;
    updateProfile.mutate(updateData, {
      onSuccess: () => onSaved(),
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Personal Information</CardTitle>
        <CardDescription>
          Update your personal details and profile information.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          {/* Row 1: First / Last Name */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <Controller
              name="firstName"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="firstName">First Name</FieldLabel>
                  <Input
                    {...field}
                    id="firstName"
                    placeholder="John"
                    disabled={!isEditing}
                  />
                  {fieldState.invalid && (
                    <FieldError>{fieldState.error?.message}</FieldError>
                  )}
                </Field>
              )}
            />
            <Controller
              name="lastName"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="lastName">Last Name</FieldLabel>
                  <Input
                    {...field}
                    id="lastName"
                    placeholder="Doe"
                    disabled={!isEditing}
                  />
                  {fieldState.invalid && (
                    <FieldError>{fieldState.error?.message}</FieldError>
                  )}
                </Field>
              )}
            />
          </div>

          {/* Row 2: Email / Phone */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <Controller
              name="email"
              control={form.control}
              render={({ field }) => (
                <Field>
                  <FieldLabel htmlFor="email">Email</FieldLabel>
                  <Input
                    {...field}
                    id="email"
                    type="email"
                    placeholder="john.doe@example.com"
                    disabled // ✅ Always disabled — not editable
                  />
                </Field>
              )}
            />
            <Controller
              name="phone"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="phone">Phone</FieldLabel>
                  <Input
                    {...field}
                    id="phone"
                    type="tel"
                    placeholder="+1 (555) 123-4567"
                    disabled={!isEditing}
                  />
                  {fieldState.invalid && (
                    <FieldError>{fieldState.error?.message}</FieldError>
                  )}
                </Field>
              )}
            />
          </div>

          {/* Row 3: Street / City */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <Controller
              name="street"
              control={form.control}
              render={({ field }) => (
                <Field>
                  <FieldLabel htmlFor="street">Street</FieldLabel>
                  <Input
                    {...field}
                    id="street"
                    placeholder="123 Main St"
                    disabled={!isEditing}
                  />
                </Field>
              )}
            />
            <Controller
              name="city"
              control={form.control}
              render={({ field }) => (
                <Field>
                  <FieldLabel htmlFor="city">City</FieldLabel>
                  <Input
                    {...field}
                    id="city"
                    placeholder="San Francisco"
                    disabled={!isEditing}
                  />
                </Field>
              )}
            />
          </div>

          {/* Row 4: State / Zipcode */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <Controller
              name="state"
              control={form.control}
              render={({ field }) => (
                <Field>
                  <FieldLabel htmlFor="state">State</FieldLabel>
                  <Input
                    {...field}
                    id="state"
                    placeholder="CA"
                    disabled={!isEditing}
                  />
                </Field>
              )}
            />
            <Controller
              name="zipcode"
              control={form.control}
              render={({ field }) => (
                <Field>
                  <FieldLabel htmlFor="zipcode">Zipcode</FieldLabel>
                  <Input
                    {...field}
                    id="zipcode"
                    placeholder="94105"
                    disabled={!isEditing}
                  />
                </Field>
              )}
            />
          </div>

          {/* Location (full width) */}
          <Controller
            name="location"
            control={form.control}
            render={({ field }) => (
              <Field>
                <FieldLabel htmlFor="location">Location</FieldLabel>
                <Input
                  {...field}
                  id="location"
                  placeholder="San Francisco, CA"
                  disabled={!isEditing}
                />
              </Field>
            )}
          />

          {/* Save/Cancel buttons */}
          {isEditing && (
            <div className="flex justify-end gap-3 pt-4">
              <Button type="button" variant="outline" onClick={onCancel}>
                Cancel
              </Button>
              <Button
                type="submit"
                className="bg-black text-white hover:bg-gray-800"
                disabled={updateProfile.isPending}
              >
                {updateProfile.isPending ? "Saving..." : "Save Changes"}
              </Button>
            </div>
          )}
        </form>
      </CardContent>
    </Card>
  );
};

export default PersonalTab;
