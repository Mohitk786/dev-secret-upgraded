import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { serverFetch } from "@/lib/serverFetch";
import DeleteAccount from "./delete-account";

const Profile = async () => {
  const userRes = await serverFetch("/me");

  if (!userRes.success) {
    return <div>Error: {userRes.error}</div>;
  }

  const user = userRes.data?.user;

    return (
      <div className="space-y-6">
            {/* Account Information */}
            <Card>
              <CardHeader>
                <CardTitle>Account Information</CardTitle>
                <CardDescription>
                  Manage your personal information and basic details.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label>Email</Label>
                    <div className="mt-1.5 text-sm bg-muted/50 p-2 rounded">
                      {user?.email || "N/A"}
                    </div>
                  </div>
                  <div>
                    <Label>Username</Label>
                    <div className="mt-1.5 text-sm bg-muted/50 p-2 rounded">
                      {user?.username || "N/A"}
                    </div>
                  </div>
                  <div>
                    <Label>Role</Label>
                    <div className="mt-1.5 text-sm bg-muted/50 p-2 rounded">
                      {user?.role || "Developer"}
                    </div>
                  </div>
                  <div>
                    <Label>Status</Label>
                    <div className="mt-1.5 text-sm bg-muted/50 p-2 rounded">
                      Active
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Preferences */}
            <Card>
              <CardHeader>
                <CardTitle>Preferences</CardTitle>
                <CardDescription>
                  Customize your experience.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <Label>Theme</Label>
                    <select className="mt-1.5 w-full p-2 rounded bg-muted/50 text-sm">
                      <option>System</option>
                      <option>Dark</option>
                      <option>Light</option>
                    </select>
                  </div>
                  <div>
                    <Label>Notifications</Label>
                    <select className="mt-1.5 w-full p-2 rounded bg-muted/50 text-sm">
                      <option>Enabled</option>
                      <option>Disabled</option>
                    </select>
                  </div>
                </div>
              </CardContent>
            </Card>


            {/* Danger Zone */}
          <DeleteAccount />             
      </div>        
    )
}

export default Profile