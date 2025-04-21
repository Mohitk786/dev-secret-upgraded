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
  const firstLetter =
    user.name?.charAt(0)?.toUpperCase() ||
    user.email?.charAt(0)?.toUpperCase() ||
    "U";

  const fallbackImage =
    "https://images.unsplash.com/photo-1518495973542-4542c06a5843?auto=format&fit=facearea&w=256&h=256&q=80";

  return (
    <div className="mt-4 relative rounded-3xl bg-white/70 dark:bg-card/40 backdrop-blur-md border border-border shadow-xl p-8 pb-6 flex flex-col items-center text-center transition-all duration-300">
      {/* Avatar */}
      <div
        className="absolute -top-14 left-1/2 -translate-x-1/2 p-[3px] rounded-full"
        style={{ background: gradient }}
      >
        <Avatar className="h-28 w-28 border-2 border-white/30 shadow-md">
          <AvatarImage
            src={user.avatarUrl || fallbackImage}
            alt={user.name || user.email}
            className="object-cover"
          />
          <AvatarFallback className="bg-primary/20 text-primary font-semibold text-2xl">
            {firstLetter}
          </AvatarFallback>
        </Avatar>
      </div>

      {/* Spacer below avatar */}
      <div className="h-16" />

      {/* Name */}
      <h2 className="text-2xl font-semibold text-foreground dark:text-white mb-1 tracking-tight">
        {user.name || "Anonymous"}
      </h2>

      {/* Email */}
      <p className="text-muted-foreground text-sm mb-3">
        {user.email || "Not available"}
      </p>

      {/* Status Badges */}
      <div className="flex flex-wrap justify-center gap-2 mt-2">
        <span className="inline-block px-4 py-1.5 rounded-full bg-violet-100 dark:bg-violet-800/80 text-violet-700 dark:text-violet-200 text-xs font-medium shadow-sm">
          Premium User
        </span>
        <span className="inline-block px-3 py-1.5 rounded-full bg-muted text-muted-foreground text-xs">
          Active
        </span>
      </div>
    </div>
  );
};

export default ProfileDetailCard;
