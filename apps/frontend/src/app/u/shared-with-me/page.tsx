

import VaultPage from "@/components/vault/vaultPage";
import { serverFetch } from "@/lib/serverFetch";


const SharedWithMe = async () => {

    const { user } = await serverFetch("/me");
    const data = await serverFetch("/collab/shared-with-me");
    const vaults = data?.vaults;

    console.log("shareed vaults", vaults)

    if (!vaults) return <div>Loading...</div>;

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
