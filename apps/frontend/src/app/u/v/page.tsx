"use client"


import { useGetVaultsQuery } from "@/hooks/queries/useVaultQuery";
import VaultPage from "@/components/vault/vaultPage";

const VaultList = () => {


  const { data: vaults, isLoading, error } = useGetVaultsQuery();

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;


  console.log("vaults", vaults)


  return (
    <div className="space-y-6 animate-fade-in">

      <VaultPage
        title="Vaults"
        description="Manage your secure vaults for different projects and purposes."
        icon="📂"
        vaults={vaults}
        isSharedVault={false}
      />


    </div>
  );
};

export default VaultList;
