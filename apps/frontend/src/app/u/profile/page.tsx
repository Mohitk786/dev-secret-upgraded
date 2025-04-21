"use client"

import React from "react";
import ProfileDetailCard from "@/components/profile/ProfileCard";
import { useAuth } from "@/hooks/queries/authQueries";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

import { APP_ROUTES } from "@/constants/data";
const Profile = () => {
  const { user } = useAuth();
  const router = useRouter();

 
  const demoUser = {
    name: "Anonymous",
    email: "anonymous@email.com",
    avatarUrl: "",
  };
  const currentUser = user || demoUser;

  return (
    <div className="flex items-center justify-center  p-4">
      <div className="w-full max-w-2xl mx-auto animate-fade-in">
        <ProfileDetailCard user={currentUser} />
        <div className="flex flex-col md:flex-row gap-4 mt-8 justify-center">
          <Button variant="outline" size="lg" onClick={() => router.push(APP_ROUTES.SETTINGS)}>
            Edit Profile
          </Button>
          <Button variant="default" size="lg" onClick={() => router.push(APP_ROUTES.SETTINGS)}>
            Account Settings
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Profile;