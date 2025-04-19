"use client"

import { useState } from "react";
import { usePathname } from "next/navigation";
import { useIsMobile } from "@/hooks/utils/useMobile";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { cn } from "@/lib/utils";
import {  Menu } from "lucide-react";
import { NavItem } from "@/types/types";
import { mainNavItems, pricingNavItems } from "@/constants/data";
import Link from "next/link";

const Sidebar = () => {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);
  const isMobile = useIsMobile();

  const toggleSidebar = () => {
    setCollapsed(!collapsed);
  };

  const renderNavItems = (items: NavItem[], collapsed?: boolean) => {
    return items.map((item) => {
      const isActive = pathname === item.href;
      const isRecycleBin = item.title === "Recycle Bin";
  
      return (
        <Link
          key={item.href}
          href={item.href}
          className={cn(
            "group relative flex items-center gap-3 rounded-xl px-3 py-2 font-medium transition-all duration-300",
            collapsed && "justify-center px-0",
            isRecycleBin
              ? isActive
                ? "bg-destructive/10 text-destructive"
                : "text-muted-foreground hover:bg-destructive/5 hover:text-destructive"
              : isActive
              ? "bg-primary/10 text-primary shadow-sm"
              : "text-muted-foreground hover:bg-primary/5 hover:text-primary"
          )}
        >
          <item.icon
            className={cn(
              "h-5 w-5 transition-transform duration-200 group-hover:scale-110",
              collapsed && "h-6 w-6"
            )}
          />
          {!collapsed && (
            <span className="truncate transition-all duration-200 group-hover:translate-x-0.5">
              {item.title}
            </span>
          )}
        </Link>
      );
    });
  };

  if (isMobile) {
    return (
      <Sheet>
        <SheetTrigger asChild>
          <Button variant="ghost" size="icon">
            <Menu className="h-5 w-5" />
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="p-0 pt-6">
          <div className="flex flex-col gap-2">
            {renderNavItems(mainNavItems)}
          </div>
        </SheetContent>
      </Sheet>
    );
  }

  return (
    <div
      className={cn(
        "flex flex-col h-full bg-secondary/5 py-4 transition-all",
        collapsed ? "w-20" : "w-60",
        "border-r border-r-muted-foreground/10"
      )}
    >
      {/* Sidebar Header */}
      <div className={`flex cursor-pointer items-center px-3  ${collapsed ? "justify-center" : "ml-2"}`}>
        <Menu className="h-6 w-6 text-muted-foreground" onClick={toggleSidebar} />
      </div>

      {/* Navigation Items */}
      <div className="flex-1 space-y-1 px-3">
        {renderNavItems(mainNavItems, collapsed)}
      </div>

      <div className="border-t border-muted-foreground/20" />

      {/* Pricing and Plans Links Section */}
      <div className="space-y-1">
        {pricingNavItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "flex items-center gap-3 rounded-lg px-3 py-2 transition-all hover:text-primary",
              pathname === item.href
                ? "bg-primary/10 text-primary"
                : "text-muted-foreground hover:bg-primary/5",
              collapsed && "justify-center px-0"
            )}
          >
            <item.icon className={cn("h-5 w-5", collapsed && "h-6 w-6")} />
            {!collapsed && <span>{item.title}</span>}
          </Link>
        ))}
      </div>
    </div>
  );
};

export default Sidebar;
