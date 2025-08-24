
import VaultPage from "@/components/vault/vaultPage";
import { serverFetch } from "@/lib/serverFetch";

const VaultList = async() => {

  const [userRes, vaultsRes] = await Promise.all([
    serverFetch("/me"),
    serverFetch("/vaults/all")
  ]);

  if (!userRes.success || !vaultsRes.success) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-red-500 font-semibold">
          {userRes.error || "Something went wrong"}
        </p>
      </div>
    );
  }

  const user = userRes.data?.user;

  return (
    <div className="space-y-6 animate-fade-in">

      <VaultPage
        title="Vaults"
        description="Manage your secure vaults for different projects and purposes."
        icon="📂"
        vaults={vaultsRes.data?.vaults}
        isSharedVault={false}
        user={user}
      />


    </div>
  );
};

export default VaultList;
