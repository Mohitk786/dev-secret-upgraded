"use client"

import { useState } from "react";
import { useInvitesQuery } from "@/hooks/queries/useCollabQuery";
import { useAcceptInvite, useRejectInvite} from "@/hooks/mutations/useCollab";
import { Button } from "@/components/ui/button";
import { Card, CardContent} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { XCircle, ShieldCheck, PenLine, Trash2 } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Loading } from "@/components/ui/Loading";

interface InviteProps {
  id: string;
  inviteeEmail?: string;
  status: string;
  createdAt: string;
  vault: {
    name: string;
    id: string;
  };
  inviter: {
    name: string;
    email: string;
    id: string;
  };
  canView: boolean;
  canEdit: boolean;
  canDelete: boolean;
}

const InviteTable = ({ invites, onAccept, onReject, showActions = false, activeTab }: { 
  invites: InviteProps[], 
  onAccept?: (id: string) => void, 
  onReject?: (id: string) => void,
  showActions?: boolean,
  activeTab: string
}) => {
  return (
   


    <div className="space-y-4">
      {invites.length === 0 ? (
        <Card>
          <CardContent className="pt-6 flex flex-col items-center justify-center min-h-[200px] text-center">
            <div className="mb-4 p-3 rounded-full bg-primary/10">
              <ShieldCheck className="h-6 w-6 text-primary" />
            </div>
            <h3 className="text-xl font-medium mb-2">No Invites Found</h3>
            <p className="text-muted-foreground max-w-md">
              There are no invites matching your current filter criteria
            </p>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardContent>
            <div className="relative w-full overflow-auto">
              <table className="w-full caption-bottom text-sm">
                <thead className="[&_tr]:border-b">
                  <tr className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                    {activeTab === "received" && <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">From</th>}
                    {activeTab === "sent" && <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">To</th>}
                    <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Vault</th>
                    <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Permissions</th>
                    <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Date</th>
                    <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Status</th>
                    {showActions && <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Actions</th>}
                  </tr>
                </thead>
                <tbody className="[&_tr:last-child]:border-0">
                  {invites.map((invite) => (
                    <tr key={invite.id} className="border-b transition-colors hover:bg-muted/50">
                      {activeTab === "received" && <td className="p-4 align-middle">{invite.inviter.name || invite.inviter.email}</td>}
                      {activeTab === "sent" && <td className="p-4 align-middle">{invite.inviteeEmail}</td>}
                      <td className="p-4 align-middle font-medium">{invite.vault.name}</td>
                      <td className="p-4 align-middle">
                        <div className="flex gap-2">
                          {invite.canView && (
                            <Badge variant="outline" className="bg-blue-500/10 text-blue-500 border-blue-500/20">
                              <ShieldCheck className="h-3 w-3 mr-1" /> View
                            </Badge>
                          )}
                          {invite.canEdit && (
                            <Badge variant="outline" className="bg-green-500/10 text-green-500 border-green-500/20">
                              <PenLine className="h-3 w-3 mr-1" /> Edit
                            </Badge>
                          )}
                          {invite.canDelete && (
                            <Badge variant="outline" className="bg-red-500/10 text-red-500 border-red-500/20">
                              <Trash2 className="h-3 w-3 mr-1" /> Delete
                            </Badge>
                          )}
                        </div>
                      </td>
                      <td className="p-4 align-middle">{new Date(invite.createdAt).toLocaleDateString()}</td>
                      <td className="p-4 align-middle">
                        <Badge
                          variant="outline"
                          className={
                            invite.status === "ACCEPTED"
                              ? "bg-green-500/10 text-green-500 border-green-500/20"
                              : invite.status === "REJECTED"
                              ? "bg-red-500/10 text-red-500 border-red-500/20"
                              : "bg-yellow-500/10 text-yellow-500 border-yellow-500/20"
                          }
                        >
                          {invite.status}
                        </Badge>
                      </td>
                      {showActions && invite.status === "PENDING" && (
                        <td className="p-4 align-middle">
                          <div className="flex space-x-2">
                            <Button
                              onClick={() => onAccept?.(invite.id)}
                              variant="outline"
                              size="sm"
                              className="flex items-center gap-1 border-green-500/20 hover:bg-green-500/10 bg-green-500/10 text-green-500"
                            >
                              <ShieldCheck className="h-4 w-4" />
                              Accept
                            </Button>
                            <Button
                              onClick={() => onReject?.(invite.id)}
                              variant="outline"
                              size="sm"
                              className="flex items-center gap-1 border-red-500/20 hover:bg-red-500/10 bg-red-500/10 text-red-500"
                            >
                              <XCircle className="h-4 w-4" />
                              Reject
                            </Button>
                          </div>
                        </td>
                      )}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

const Invites = () => {
  const [activeTab, setActiveTab] = useState("received");
  const [status, setStatus] = useState("ALL");
  const { data: invitesData, isLoading } = useInvitesQuery(activeTab, status);
  const { mutate: acceptInvite } = useAcceptInvite();
  const { mutate: rejectInvite } = useRejectInvite();
  

  const handleAcceptInvite = (inviteId: string) => {
    acceptInvite(inviteId);
  };

  const handleRejectInvite = (inviteId: string) => {
    rejectInvite(inviteId);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Vault Invitations</h1>
        <p className="text-muted-foreground">Manage your vault collaboration invites</p>
      </div>

      <div className="flex justify-end">
        <Select value={status} onValueChange={setStatus}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="ALL">All Invites</SelectItem>
            <SelectItem value="PENDING">Pending</SelectItem>
            <SelectItem value="ACCEPTED">Accepted</SelectItem>
            <SelectItem value="REJECTED">Rejected</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="received">Received Invites</TabsTrigger>
          <TabsTrigger value="sent">Sent Invites</TabsTrigger>
        </TabsList>
        <TabsContent value="received">
          {isLoading ? (
           <Loading />
          ) : (
            <InviteTable
              activeTab={activeTab}
              invites={invitesData|| []}
              onAccept={handleAcceptInvite}
              onReject={handleRejectInvite}
              showActions={true}
            />
          )}
        </TabsContent>

        <TabsContent value="sent">
          {isLoading ? (
           <Loading />
          ) : (
            <InviteTable 
              activeTab={activeTab}
              invites={invitesData || []}
              onAccept={handleAcceptInvite}
              onReject={handleRejectInvite}
              showActions={true}
            />
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Invites;
