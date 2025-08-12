// components/LayoutClient.tsx  <-- client
"use client";

import React, { useEffect, useMemo, useState } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";

import Sidebar from "@/components/user/sidebar";
import ProfileDropdownClient from "@/components/profile/profile-dropdown";
import { ThemeToggle } from "@/components/utils/ThemeToggle";
import { DevHumorDrawer } from "@/components/utils/DevHumor";
import AppBranding from "@/components/ui/AppName";
import UploadPrivateKey from "@/components/Auth/UploadPrivateKey";

interface LayoutProps {
  children: React.ReactNode;
  user: any; 
}

export default function LayoutClient({ children, user }: LayoutProps) {
  const pathname = usePathname();
  const isAuthPage = useMemo(() => pathname === "/login" || pathname === "/register", [pathname]);
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

  if (isAuthPage) return <div className="bg-background">{children}</div>;
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
