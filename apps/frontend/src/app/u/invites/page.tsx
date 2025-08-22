import FilterInvites from "@/components/invite-table/filter-invites";
import InvitePage from "@/components/invite-table";
import { serverFetch } from "@/lib/serverFetch";


const Invites = async ({searchParams}: {searchParams: Promise<{status: string, type: string}>  }) => {
  const {status, type} = await searchParams;
  const {invites} = await serverFetch(`/invites?type=${type || "sent"}&status=${status || "ALL"}`)

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-primary text-3xl font-bold">Vault Invitations</h1>
        <p className="text-muted-foreground">Manage your vault collaboration invites</p>
      </div>

      <FilterInvites />
      <InvitePage invitesData={invites}/>
     
    </div>
  );
};

export default Invites;
