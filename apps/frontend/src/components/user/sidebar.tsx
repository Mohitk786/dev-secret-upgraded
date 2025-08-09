"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { Menu } from "lucide-react";

import { useIsMobile } from "@/hooks/utils/useMobile";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { cn } from "@/lib/utils";
import { NavItem } from "@/types/types";
import { mainNavItems, pricingNavItems } from "@/constants/data";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

const Sidebar = () => {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);
  const isMobile = useIsMobile();

  const toggleSidebar = () => setCollapsed(!collapsed);

  const renderNavItems = (items: NavItem[], collapsed?: boolean) =>
    items.map((item) => {
      const isActive = pathname.includes(item.href);
      const isRecycleBin = item.title === "Recycle Bin";

      const linkClasses = cn(
        "group relative flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-all duration-300",
        collapsed && "justify-center px-0",
        isRecycleBin
          ? isActive
            ? "bg-destructive/10 text-destructive"
            : "text-muted-foreground hover:bg-destructive/5 hover:text-destructive"
          : isActive
          ? "bg-primary/10 text-gray-200 shadow"
          : "text-muted-foreground hover:bg-primary/5 hover:text-gray-200"
      );

      const iconClasses = cn(
        "h-5 w-5 transition-transform duration-200 group-hover:scale-110",
        collapsed && "h-6 w-6"
      );

      return (
        <TooltipProvider key={item.href}>
          <Tooltip delayDuration={300}>
            <TooltipTrigger asChild>
              <Link href={item.href} className={linkClasses} aria-label={item.title}>
                <item.icon className={iconClasses} />
                {!collapsed && (
                  <span className="truncate transition-all group-hover:translate-x-0.5">
                    {item.title}
                  </span>
                )}
              </Link>
            </TooltipTrigger>
            {collapsed && <TooltipContent side="right">{item.title}</TooltipContent>}
          </Tooltip>
        </TooltipProvider>
      );
    });

  if (isMobile) {
    return (
      <Sheet>
        <SheetTrigger asChild>
          <Button variant="ghost" size="icon" className="ml-1 mt-2">
            <Menu className="h-5 w-5" />
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="p-0 pt-6 overflow-y-auto">
          <div className="flex flex-col gap-2 px-3">
            <div>
              <p className="px-2 pb-1 text-xs font-medium text-muted-foreground uppercase">
                Main
              </p>
              {renderNavItems(mainNavItems)}
            </div>
            <div className="border-t border-muted/20 my-2" />
            <div>
              <p className="px-2 pb-1 text-xs font-medium text-muted-foreground uppercase">
                Pricing
              </p>
              {renderNavItems(pricingNavItems)}
            </div>
          </div>
        </SheetContent>
      </Sheet>
    );
  }

  return (
    <aside
      className={cn(
        "flex h-full flex-col px-2 py-4 transition-all duration-300 ease-in-out",
        collapsed ? "w-20" : "w-64",
        "border-r border-sidebar-border"
      )}
    >
      {/* Header */}
      <div className="mb-4 flex items-center px-2">
        <Button
          variant="ghost"
          size="icon"
          onClick={toggleSidebar}
          className="text-muted-foreground"
          aria-label="Toggle sidebar"
        >
          <Menu className="h-6 w-6" />
        </Button>
      </div>

      {/* Navigation Sections */}
      <nav className="flex-1 space-y-2 overflow-y-auto">
        <div>
          {!collapsed && (
            <p className="px-3 pb-1 text-xs font-semibold text-muted-foreground uppercase">
              Main
            </p>
          )}
          {renderNavItems(mainNavItems, collapsed)}
        </div>

        <div>
          {!collapsed && (
            <p className="px-3 pt-4 pb-1 text-xs font-semibold text-muted-foreground uppercase">
              Pricing
            </p>
          )}
          {renderNavItems(pricingNavItems, collapsed)}
        </div>
      </nav>
    </aside>
  );
};

export default Sidebar;
