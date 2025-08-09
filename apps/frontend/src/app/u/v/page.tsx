
import VaultPage from "@/components/vault/vaultPage";
import { serverFetch } from "@/lib/serverFetch";

const VaultList = async() => {


 const data = await serverFetch("/vaults/all");
 const vaults = data?.vaults;


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
