"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";

import Sidebar from "@/components/user/sidebar";
import ProfileDropdownClient from "@/components/profile/profile-dropdown";
import { ThemeToggle } from "@/components/utils/ThemeToggle";
import { DevHumorDrawer } from "@/components/utils/DevHumor";
import AppBranding from "@/components/ui/AppName";
import UploadPrivateKey from "@/components/Auth/UploadPrivateKey";
import { User } from "@/types/types";

interface LayoutProps {
  children: React.ReactNode;
  user: User; 
}

export default function LayoutClient({ children, user }: LayoutProps) {
  const [hasPrivateKey, setHasPrivateKey] = useState<boolean | null>(null);

  useEffect(() => {
    const checkPrivateKey = () => {
      const key = localStorage.getItem("PRIVATE_KEY");
      setHasPrivateKey(!!key);
    };

    checkPrivateKey();
    const handleStorage = (e: StorageEvent) => {
      if (e.key === "PRIVATE_KEY") checkPrivateKey();
    };

    window.addEventListener("storage", handleStorage);
    const interval = setInterval(checkPrivateKey, 1500);

    return () => {
      window.removeEventListener("storage", handleStorage);
      clearInterval(interval);
    };
  }, []);

  if (!hasPrivateKey) return <UploadPrivateKey />;

  return (
    <div className="flex h-screen bg-background overflow-hidden">
      <Sidebar />
      <div className="flex flex-col flex-1 h-full overflow-hidden">
        <header className="border-b h-16 flex items-center justify-between px-4 sticky top-0 bg-background/95 backdrop-blur-sm z-10">
          <Link href="/" className="flex items-center gap-2 font-semibold">
            <AppBranding />
          </Link>
          <div className="flex items-center space-x-3">
            <ThemeToggle />
            <ProfileDropdownClient user={user} />
          </div>
        </header>
        <main className="h-[calc(100vh-4rem)] overflow-y-auto md:p-8">
          {children}
          <DevHumorDrawer />
        </main>
      </div>
    </div>
  );
}
