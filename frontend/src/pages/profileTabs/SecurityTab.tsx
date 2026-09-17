import ChangePasswordDialog from "@/components/changePasswordDialog";
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
import { Switch } from "@/components/ui/switch";
import { KeyRound, Monitor } from "lucide-react";
import { useState } from "react";

const SecurityTab = () => {
  const [loginNotifications, setLoginNotifications] = useState(true);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Security Settings</CardTitle>
        <CardDescription>
          Manage your account security and authentication.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Password */}
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <p className="text-sm font-medium">Password</p>
            <p className="text-sm text-gray-500">Last changed 3 months ago</p>
          </div>
          <ChangePasswordDialog />
        </div>

        <Separator />

        {/* Two-Factor */}
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <p className="text-sm font-medium">Two-Factor Authentication</p>
            <p className="text-sm text-gray-500">
              Add an extra layer of security to your account
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Badge
              variant="outline"
              className="bg-green-50 text-green-700 border-green-200"
            >
              Enabled
            </Badge>
            <Button variant="outline">Configure</Button>
          </div>
        </div>

        <Separator />

        {/* Login Notifications */}
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <p className="text-sm font-medium">Login Notifications</p>
            <p className="text-sm text-gray-500">
              Get notified when someone logs into your account
            </p>
          </div>
          <Switch
            checked={loginNotifications}
            onCheckedChange={setLoginNotifications}
          />
        </div>

        <Separator />

        {/* Active Sessions */}
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <p className="text-sm font-medium">Active Sessions</p>
            <p className="text-sm text-gray-500">
              Manage devices that are logged into your account
            </p>
          </div>
          <Button variant="outline">
            <Monitor className="size-4" />
            View Sessions
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default SecurityTab;
