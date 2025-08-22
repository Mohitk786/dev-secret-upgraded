
import React from "react";
import ProfileDetailCard from "@/components/profile/ProfileCard";
import { Button } from "@/components/ui/button";
import { APP_ROUTES } from "@/constants/data";
import Link from "next/link";
import { serverFetch } from "@/lib/serverFetch";

const Profile = async () => {
  const {user} = await serverFetch("/me"); 
  
  return (
    <div className="flex items-center justify-center  p-4">
      <div className="w-full max-w-2xl mx-auto animate-fade-in">
        <ProfileDetailCard user={user} />
        <div className="flex flex-col md:flex-row gap-4 mt-8 justify-center">
          <Link href={APP_ROUTES.SETTINGS}>
            <Button variant="outline" size="lg">
              Edit Profile
            </Button>
          </Link>
          <Link href={APP_ROUTES.SETTINGS}>
            <Button variant="default" size="lg">
            Account Settings
          </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Profile;