import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Mail,
  MapPin,
  Calendar,
  Camera,
} from "lucide-react";
import { useProfile } from "@/hooks/useUser";
import PersonalTab from "./profileTabs/PersonalTab";
import { profileSchema, type ProfileForm } from "@/types/user.types";
import AccountTab from "./profileTabs/AccountTab";
import SecurityTab from "./profileTabs/SecurityTab";
import NotificationsTab from "./profileTabs/NotificationsTab";
const ProfileSkeleton = () => (
  <div className="flex items-center justify-center flex-col">
    <div className="container max-w-5xl py-8 space-y-6">
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center gap-6">
            <Skeleton className="size-24 rounded-full" />
            <div className="space-y-2">
              <Skeleton className="h-6 w-48" />
              <Skeleton className="h-4 w-64" />
              <Skeleton className="h-4 w-32" />
            </div>
          </div>
        </CardContent>
      </Card>

      <Skeleton className="h-11 w-full  " />
      <Skeleton className="h-90 w-full " />
    </div>
  </div>
);
const Profile = () => {
  const [isEditing, setIsEditing] = useState(false);
  const { data: user, isLoading, error } = useProfile();
  const form = useForm<ProfileForm>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
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
        phone: user.phone || "",
        street: user.street || "",
        city: user.city || "",
        state: user.state || "",
        zipcode: user.zipcode || "",

        location: user.location || "",
      });
    }
  }, [user, form]);
  if (isLoading) return <ProfileSkeleton />;
  if (error) {
    return (
      <div className="container max-w-5xl py-8">
        <Card>
          <CardContent className="py-12 text-center text-red-500">
            Error: {error.message}
          </CardContent>
        </Card>
      </div>
    );
  }
  if (!user) {
    return (
      <div className="container max-w-5xl py-8">
        <Card>
          <CardContent className="py-12 text-center">
            No user data found. Please log in again.
          </CardContent>
        </Card>
      </div>
    );
  }
  const initials =
    `${user.firstName?.[0] || ""}${user.lastName?.[0] || ""}`.toUpperCase();
  const fullAddress = [user.city, user.state].filter(Boolean).join(", ");
  return (
    <div className="flex items-center justify-center flex-col">
      <div className="container max-w-5xl py-8 space-y-6">
        <Card>
          <CardContent className="pt-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
              <div className="relative">
                <Avatar className="size-24">
                  <AvatarImage src={user.avatar || ""} alt={user.firstName} />
                  <AvatarFallback className="bg-gray-200 text-2xl text-gray-600">
                    {initials}
                  </AvatarFallback>
                </Avatar>
                <button
                  className="absolute bottom-0 right-0 bg-white border rounded-full p-1.5 hover:bg-gray-50"
                  aria-label="Change photo"
                >
                  <Camera className="size-3.5 text-gray-600" />
                </button>
              </div>

              <div className="flex-1 space-y-2">
                <div className="flex items-center gap-3 flex-wrap">
                  <h1 className="text-2xl font-bold">
                    {user.firstName} {user.lastName}
                  </h1>
                  <Badge variant="secondary" className="text-xs">
                    Pro Member
                  </Badge>
                </div>

                <div className="flex flex-wrap gap-x-6 gap-y-1 text-sm text-gray-600 mt-2">
                  <div className="flex items-center gap-1.5">
                    <Mail className="size-3.5" />
                    <span>{user.email}</span>
                  </div>
                  {fullAddress && (
                    <div className="flex items-center gap-1.5">
                      <MapPin className="size-3.5" />
                      <span>{fullAddress}</span>
                    </div>
                  )}
                  <div className="flex items-center gap-1.5">
                    <Calendar className="size-3.5" />
                    <span>
                      Joined{" "}
                      {new Date(user.createdAt).toLocaleDateString("en-US", {
                        month: "long",
                        year: "numeric",
                      })}
                    </span>
                  </div>
                </div>
              </div>

              <Button
                onClick={() => {
                  if (isEditing) form.reset(); // Reset on cancel
                  setIsEditing(!isEditing);
                }}
                className="bg-black text-white hover:bg-gray-800"
              >
                {isEditing ? "Cancel" : "Edit Profile"}
              </Button>
            </div>
          </CardContent>
        </Card>
        <Tabs defaultValue="personal" className="w-full">
          <TabsList className="grid w-full grid-cols-4 bg-gray-100 h-11">
            <TabsTrigger value="personal">Personal</TabsTrigger>
            <TabsTrigger value="account">Account</TabsTrigger>
            <TabsTrigger value="security">Security</TabsTrigger>
            <TabsTrigger value="notifications">Notifications</TabsTrigger>
          </TabsList>
          <TabsContent value="personal">
            <PersonalTab
              isEditing={isEditing}
              onCancel={() => setIsEditing(false)}
              onSaved={() => setIsEditing(false)}
            />
          </TabsContent>
          <TabsContent value="account" className="space-y-6">
            <AccountTab />
          </TabsContent>
          <TabsContent value="security">
            <SecurityTab />
          </TabsContent>
          <TabsContent value="notifications">
            <NotificationsTab />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Profile;
