"use client";

import React, { useEffect, useState } from "react";
import Sidebar from "@/components/user/sidebar";
import { usePathname } from "next/navigation";
import ProfileDropdown from "@/components/user/ProfileDropdown";
import { ThemeToggle } from "@/components/utils/ThemeToggle";
import Link from "next/link";
import { DevHumorDrawer } from "@/components/utils/DevHumor";
import AppBranding from "@/components/ui/AppName";
import UploadPrivateKey from "@/components/Auth/UploadPrivateKey";

interface LayoutProps {
  children: React.ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  const pathname = usePathname();
  const isAuthPage = pathname === "/login" || pathname === "/register";

  const [hasPrivateKey, setHasPrivateKey] = useState<boolean | null>(null);

  useEffect(() => {
    const checkPrivateKey = () => {
      const key = localStorage.getItem("PRIVATE_KEY");
      setHasPrivateKey(!!key);
    };

    checkPrivateKey(); 

    const handleStorage = (e: StorageEvent) => {
      if (e.key === "PRIVATE_KEY") {
        checkPrivateKey();
      }
    };

    window.addEventListener("storage", handleStorage);
    const interval = setInterval(checkPrivateKey, 1000); 

    return () => {
      window.removeEventListener("storage", handleStorage);
      clearInterval(interval);
    };
  }, []);

  if (isAuthPage) {
    return <div className="bg-background">{children}</div>;
  }

  if (hasPrivateKey === null) return null;

  return (
    <div className="flex h-screen bg-background overflow-hidden">
      <div>
        <Sidebar />
      </div>

      <div className="flex flex-col flex-1 h-full overflow-hidden">
        <header className="border-b h-16 flex items-center justify-between px-4 sticky top-0 bg-background/95 backdrop-blur-sm z-10">
          <Link href="/" className="flex items-center gap-2 font-semibold text-primary">
            <AppBranding />
          </Link>

          <div className="flex items-center space-x-3">
            <ThemeToggle />
            <ProfileDropdown />
          </div>
        </header>

        <main className="h-[calc(100vh-16px)] overflow-y-auto md:p-8">
          {hasPrivateKey ? children : <UploadPrivateKey />}
          <DevHumorDrawer />
        </main>
      </div>
    </div>
  );
};

export default Layout;
