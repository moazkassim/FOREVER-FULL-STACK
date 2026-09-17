import DeleteAccountDialog from "@/components/DeleteAccountDialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useUserLogout } from "@/hooks/useUser";
import { cn } from "@/lib/utils";
import { useAuthStore } from "@/stores/authStore";

import { useShallow } from "zustand/shallow";

const AccountTab = () => {
  const logoutMutation = useUserLogout();
  const { isAuthenticated } = useAuthStore(
    useShallow((state) => ({
      isAuthenticated: state.isAuthenticated,
    })),
  );
  return (
    <>
      <Card 
      >
        <CardHeader>
          <CardTitle>Account Settings</CardTitle>
          <CardDescription>
            Manage your account preferences and subscription.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Account Status */}
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <p className="text-sm font-medium">Account Status</p>
              <p className="text-sm text-gray-500">
                Your account is currently
                {isAuthenticated ? " active" : " inactive"}
              </p>
            </div>
            <Badge
              variant="outline"
              className={cn(
                "font-medium",
                isAuthenticated
                  ? "bg-green-50 border-green-200 text-green-700"
                  : "bg-red-50 border-red-200 text-red-600",
              )}
            >
              {isAuthenticated ? "Active" : "Inactive"}
            </Badge>
          </div>

          <Separator />

          {/* Subscription Plan */}
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <p className="text-sm font-medium">Subscription Plan</p>
              <p className="text-sm text-gray-500">Pro Plan - $29/month</p>
            </div>
            <Button variant="outline">Manage Subscription</Button>
          </div>

          <Separator />

          <div className="flex items-center justify-between">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <p className="text-sm font-medium">Account Visibility</p>
                <p className="text-sm text-gray-500">
                  Make your profile visible to other users
                </p>
              </div>
            </div>
            <Badge
              variant="outline"
              className={cn(
                "font-medium",
                isAuthenticated
                  ? "bg-green-50 border-green-200 text-green-700"
                  : "bg-red-50 border-red-200 text-red-600",
              )}
            >
              {isAuthenticated ? "Visible" : "Not Visible"}
            </Badge>
          </div>
          <Separator />
          <div className="flex items-center justify-between">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <p className="text-sm font-medium">Logout </p>
                <p className="text-sm text-gray-500">Logout from the Account</p>
              </div>
            </div>
            <Button
              className="bg-black text-white hover:bg-gray-800"

              onClick={() => logoutMutation.mutate()}
              variant="destructive"
              disabled={logoutMutation.isPending}
            >
              {logoutMutation.isPending ? "Logout..." : "Logout"}
            </Button>
          </div>
        </CardContent>
      </Card>
      {/* Danger Zone */}
      <Card className="border-red-200">
        <CardHeader>
          <CardTitle className="text-red-500">Danger Zone</CardTitle>
          <CardDescription>
            Irreversible and destructive actions
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <p className="text-sm font-medium">Delete Account</p>
              <p className="text-sm text-gray-500">
                Permanently delete your account and all data
              </p>
            </div>
            <DeleteAccountDialog />
          </div>
        </CardContent>
      </Card>
    </>
  );
};

export default AccountTab;
