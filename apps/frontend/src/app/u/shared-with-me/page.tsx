

import VaultPage from "@/components/vault/vaultPage";
import { serverFetch } from "@/lib/serverFetch";


const SharedWithMe = async () => {

    const [userRes, vaultsRes] = await Promise.all([
        serverFetch("/me"),
        serverFetch("/collab/shared-with-me")
    ])


    if (!userRes.success || !vaultsRes.success) {
        return (
            <div className="flex items-center justify-center h-screen">
                <p className="text-red-500 font-semibold">
                    {userRes.error || vaultsRes.error || "Something went wrong"}
                </p>
            </div>
        );
    }


    const user = userRes.data?.user;
    const vaults = vaultsRes.data?.vaults;

    return (
        <div className="space-y-6 animate-fade-in">

            <VaultPage
                title="Shared with me"
                description="Collaborate with others on shared vaults and make your work easier."
                icon="📂"
                user={user}
                vaults={vaults}
                isSharedVault={true}
            />

            {vaults.length > 0 ? <></> :
                <div className="flex justify-center items-center h-full">
                    <p className="text-muted-foreground">No vaults Shared With You</p>
                </div>
            }
            
        </div>
    );
};

export default SharedWithMe;
