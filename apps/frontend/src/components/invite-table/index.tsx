"use client"

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useEffect } from "react";
import InviteTable, { InviteProps } from "./invite-table";
import { usePathname, useSearchParams, useRouter } from "next/navigation";


const InvitePage = ({invitesData}: {invitesData: InviteProps[]}) => {

    const pathname = usePathname();
    const searchParams = useSearchParams();
    const { replace } = useRouter();
  
    const handleTabChange = ({ value = "received" }: { value?: string }) => {
      const params = new URLSearchParams(searchParams);
      params.set("type", value);
      replace(`${pathname}?${params.toString()}`);
    };
  
  
    
    useEffect(() => {
        if (!searchParams.get("type")) {
        handleTabChange({ value: "received" });
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [searchParams]);
  
      return (
          <Tabs value={searchParams.get("type") || "received"} onValueChange={(value) => handleTabChange({value})} className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="received">Received Invites</TabsTrigger>
            <TabsTrigger value="sent">Sent Invites</TabsTrigger>
          </TabsList>
          <TabsContent value="received">
              <InviteTable
                activeTab={searchParams.get("type") || "received"}
                invites={invitesData|| []}
                showActions={true}
              />
          </TabsContent>
  
          <TabsContent value="sent">
              <InviteTable 
                activeTab={searchParams.get("type") || "sent"}
                invites={invitesData || []}
                showActions={true}
              />
            
          </TabsContent>
        </Tabs>
      )
  }


  export default InvitePage;