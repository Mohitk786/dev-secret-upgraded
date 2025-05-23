"use client"

import { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { User, Settings, LogOut, Shield } from "lucide-react";
import { useAuthQuery } from "@/hooks/queries/authQueries";
import { APP_ROUTES, BASE_URL } from "@/constants/data";
import { useRouter } from "next/navigation";
import ConfirmAccess, { ModalData } from "../utils/ConfirmAccess";

const ProfileDropdown = () => {
  const { data: user, isLoading } = useAuthQuery();
  const [open, setOpen] = useState(false);
  const [handleModalOpen, setHandleModalOpen] = useState(false);
  const router = useRouter();



  const handleLogout = () => {
    fetch(`${BASE_URL}/logout`, {
      method: "POST",
      credentials: "include",
    })
      .then((res) => res.json())
      .then(() => {
        router.push(APP_ROUTES.LOGIN);
      })
      .catch((err) => {
        console.error("Error logging out:", err);
      });
  };

  const modalData: ModalData = {
    title: "Logout",
    description1: "Are you sure you want to logout?",
    buttonText: "Logout",
    onConfirm: handleLogout,
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <DropdownMenu open={open} onOpenChange={setOpen}>
        <DropdownMenuTrigger asChild>
          <button className="outline-none">
            <Avatar className="h-9 w-9 border-2 border-primary/30 hover:border-primary transition-colors cursor-pointer">
              <AvatarImage src="" alt="User" />
              <AvatarFallback className="bg-primary/10 text-primary font-medium">
                {user?.name?.toUpperCase().charAt(0) || user?.email?.toUpperCase().charAt(0)}
              </AvatarFallback>
            </Avatar>
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-56 mt-1">
          <div className="flex items-center justify-start gap-2 p-2">
            <div className="rounded-full bg-primary/10 p-1">
              <User className="h-4 w-4 text-primary" />
            </div>
            <div className="flex flex-col space-y-0.5">
              <p className="text-sm font-medium">{user?.name || "Anonymous"}</p>
              <p className="text-xs text-muted-foreground">{user?.email}</p>
            </div>
          </div>
          <DropdownMenuSeparator />
          <DropdownMenuItem className="cursor-pointer flex items-center gap-2" onClick={() => router.push(APP_ROUTES.PROFILE)}>
            <User className="h-4 w-4" />
            <span>Profile</span>
          </DropdownMenuItem>
          <DropdownMenuItem className="cursor-pointer flex items-center gap-2" onClick={() => router.push(APP_ROUTES.SETTINGS)}>
            <Settings className="h-4 w-4" />
            <span>Settings</span>
          </DropdownMenuItem>
          {/* <DropdownMenuItem className="cursor-pointer flex items-center gap-2">
          <Shield className="h-4 w-4" />
          <span>Security</span>
        </DropdownMenuItem> */}
          <DropdownMenuSeparator />
          <DropdownMenuItem className="cursor-pointer flex items-center gap-2 text-destructive focus:text-destructive" onClick={() => setHandleModalOpen(true)}>
            <LogOut className="h-4 w-4" />
            <span>Logout</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <ConfirmAccess open={handleModalOpen} onOpenChange={setHandleModalOpen} modalData={modalData} />
    </>
  );
};

export default ProfileDropdown;
