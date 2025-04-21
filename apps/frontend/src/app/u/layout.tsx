"use client"

import React from "react";
import Sidebar from "@/components/user/sidebar";
import { usePathname } from "next/navigation";
import ProfileDropdown from "@/components/user/ProfileDropdown";
import { ThemeToggle } from "@/components/utils/ThemeToggle";
import { KeyRound } from "lucide-react";
import Link from "next/link";
import { DevHumorDrawer } from "@/components/utils/DevHumor";

interface LayoutProps {
  children: React.ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  const pathname = usePathname();
  const isAuthPage = pathname === "/login" || pathname === "/register";

  if (isAuthPage) {
    return <div className="bg-background">{children}</div>;
  }

  return (
    <div className="flex h-screen bg-background overflow-hidden">
      <div className="">
        <Sidebar />
      </div>

      <div className="flex flex-col flex-1 h-full overflow-hidden">
        <header className="border-b h-16 flex items-center justify-between px-4 sticky top-0 bg-background/95 backdrop-blur-sm z-10">
          <Link href="/" className="flex items-center gap-2 font-semibold text-primary">
            <KeyRound className="h-8 w-8 text-primary" />
            <span className="hidden md:block text-lg font-semibold">KeyVault</span>
          </Link>

          <div className="flex items-center space-x-3">
            <ThemeToggle />
            <ProfileDropdown />
          </div>
        </header>

        <main className="h-[calc(100vh-16px)] overflow-y-auto md:p-8">
          {children}
          <DevHumorDrawer />
        </main>

      </div>
    </div>
  );
};

export default Layout;
