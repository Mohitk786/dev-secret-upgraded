
import VaultPage from "@/components/vault/vaultPage";
import { serverFetch } from "@/lib/serverFetch";

const VaultList = async() => {
 const data = await serverFetch("/vaults/all");
 const  user  = await serverFetch("/me");
 const vaults = data?.vaults;


 console.log(user);

  return (
    <div className="space-y-6 animate-fade-in">

      <VaultPage
        title="Vaults"
        description="Manage your secure vaults for different projects and purposes."
        icon="📂"
        vaults={vaults}
        isSharedVault={false}
        user={user}
      />


    </div>
  );
};

export default VaultList;
