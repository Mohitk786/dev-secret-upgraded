"use client"
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import useToast from "@/hooks/utils/useToast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Profile from "./Profile";

const Settings = () => {
  const { showToast } = useToast();

  const handleExportData = () => {
    showToast({
      type: "info",
      message: "Exporting data... This may take a moment."
    })
    // Mock implementation - in a real app, this would connect to a backend API
    setTimeout(() => {
      showToast({
        type: "success",
        message: "Data exported successfully"
      })
    }, 1500);
  };

  // const handleDeleteAccount = () => {
  //   showToast({
  //     type: "error",
  //     message: "This feature is not yet implemented"
  //   })
  // };

 

  return (
    <div className="">
      <h1 className="text-3xl font-bold mb-8">Settings</h1>

      <Tabs defaultValue="account">
        <TabsList className="mb-6">
          <TabsTrigger value="account">Account</TabsTrigger>
          <TabsTrigger value="security">Security</TabsTrigger>
          <TabsTrigger value="advanced">Advanced</TabsTrigger>
        </TabsList>

        <TabsContent value="account">
          <Profile />
        </TabsContent>


        <TabsContent value="security">
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Security Settings</CardTitle>
                <CardDescription>
                  Manage your security preferences
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label htmlFor="auto-lock">Auto-lock after inactivity</Label>
                  <Switch id="auto-lock" defaultChecked />
                </div>
                <div className="flex items-center justify-between">
                  <Label htmlFor="biometric">Enable biometric authentication</Label>
                  <Switch id="biometric" />
                </div>
                <div className="flex items-center justify-between">
                  <Label htmlFor="2fa">Two-factor authentication</Label>
                  <Switch id="2fa" defaultChecked />
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="advanced">
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Data Management</CardTitle>
                <CardDescription>
                  Export or sync your data
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Button onClick={handleExportData}>
                  Export Data
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Settings;
