
import React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface ProfileDetailCardProps {
  user: {
    name?: string;
    email?: string;
    avatarUrl?: string;
  };
}

const gradient = "linear-gradient(90deg, #9b87f5 0%, #6E59A5 100%)";

const ProfileDetailCard: React.FC<ProfileDetailCardProps> = ({ user }) => {
  const firstLetter = user.name?.charAt(0)?.toUpperCase() || user.email?.charAt(0)?.toUpperCase() || "U";
  
  // Example background image if avatarUrl missing
  const fallbackImage =
    "https://images.unsplash.com/photo-1518495973542-4542c06a5843?auto=format&fit=facearea&w=256&h=256&q=80";
    
  return (
    <div className="relative bg-white/90 dark:bg-zinc-700/90 rounded-3xl p-8 pb-7 shadow-xl flex flex-col items-center mx-2">
      <div
        className="absolute -top-8 left-1/2 -translate-x-1/2 rounded-full p-[3px] bg-gradient-to-tr"
        style={{ background: gradient }}
      >
        <Avatar className="h-32 w-32 shadow-xl border-2 border-primary/60">
          <AvatarImage
            src={user.avatarUrl || fallbackImage}
            alt={user.name || user.email}
            className="object-cover"
          />
          <AvatarFallback className="bg-primary/20 text-primary font-bold text-3xl">
            {firstLetter}
          </AvatarFallback>
        </Avatar>
      </div>
      <div className="h-20" /> {/* Spacer for avatar overlapping */}
      <h2 className="text-3xl font-bold text-primary dark:text-white drop-shadow mb-1 tracking-tight text-center">
        {user.name || "Anonymous"}
      </h2>
      <p className="text-zinc-700 dark:text-zinc-300 text-center mb-2">
        {user.email}
      </p>
      <div className="flex justify-center gap-2 mt-3">
        <span className="inline-block px-4 py-1 rounded-full bg-violet-100 dark:bg-violet-800/80 text-violet-700 text-sm font-medium shadow animate-pulse-slow">
          Premium User
        </span>
        <span className="inline-block px-3 py-1 rounded-full bg-muted text-muted-foreground text-xs">
          Active
        </span>
      </div>
    </div>
  );
};

export default ProfileDetailCard;