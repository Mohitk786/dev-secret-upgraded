"use client"


import { useSharedVaults } from "@/hooks/queries/useCollabQuery";
import VaultPage from "@/components/vault/vaultPage";


const SharedWithMe = () => {

    const { data: vaults, isLoading, error } = useSharedVaults();
      if (isLoading) return <div>Loading...</div>;
      if (error) return <div>Error: {error.message}</div>;

    return (
        <div className="space-y-6 animate-fade-in">

            <VaultPage
                title="Shared with me"
                description="Collaborate with others on shared vaults and make your work easier."
                icon="📂"

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
