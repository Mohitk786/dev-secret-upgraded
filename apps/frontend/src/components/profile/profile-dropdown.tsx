"use client";

import { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { User, Settings, LogOut } from "lucide-react";
import { APP_ROUTES } from "@/constants/data";
import { useRouter } from "next/navigation";
import ConfirmAccess, { ModalData } from "../utils/ConfirmAccess";
import { config } from "@secret-vault/backend-common/config";

export default function ProfileDropdownClient({ user }: { user: any }) {
  const [open, setOpen] = useState(false);
  const [handleModalOpen, setHandleModalOpen] = useState(false);
  const router = useRouter();

  const handleLogout = async () => {
    const res = await fetch(`${config.BASE_URL}/logout`, {
      method: "POST",
      credentials: "include",
    });
    if (res.ok) {
      localStorage.removeItem("PRIVATE_KEY");
      router.push(APP_ROUTES.LOGIN);
    }
  };

  const modalData: ModalData = {
    title: "Logout",
    description1: "Are you sure you want to logout?",
    description2: "This will delete your private key from the browser and you will need to upload it again.",
    buttonText: "Logout",
    onConfirm: handleLogout,
  };

  if (!user) {
    return <div>Loading...</div>; 
  }

  return (
    <>
      <DropdownMenu open={open} onOpenChange={setOpen}>
        <DropdownMenuTrigger asChild>
          <button className="outline-none">
            <Avatar className="h-9 w-9 border-2 border-primary/30 hover:border-primary transition-colors cursor-pointer">
              <AvatarImage src="" alt="User" />
              <AvatarFallback className="bg-primary/10 text-gray-200 font-medium">
                {user?.name?.charAt(0).toUpperCase() || user?.email?.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-56 mt-1">
          <div className="flex items-center justify-start gap-2 p-2">
            <div className="rounded-full bg-primary/10 p-1">
              <User className="h-4 w-4 text-gray-200" />
            </div>
            <div className="flex flex-col space-y-0.5">
              <p className="text-sm font-medium">{user?.name || "Anonymous"}</p>
              <p className="text-xs text-muted-foreground">{user?.email}</p>
            </div>
          </div>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={() => router.push(APP_ROUTES.PROFILE)}>
            <User className="h-4 w-4" /> Profile
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => router.push(APP_ROUTES.SETTINGS)}>
            <Settings className="h-4 w-4" /> Settings
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            className="text-destructive focus:text-destructive"
            onClick={() => setHandleModalOpen(true)}
          >
            <LogOut className="h-4 w-4" /> Logout
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <ConfirmAccess open={handleModalOpen} onOpenChange={setHandleModalOpen} modalData={modalData} />
    </>
  );
}
