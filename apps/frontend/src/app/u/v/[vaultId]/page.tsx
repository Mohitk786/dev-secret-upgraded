import VaultDetail from '@/components/vault/VaultDetailHelper'
import { serverFetch } from '@/lib/serverFetch';
import React from 'react'

export default async function Page({ params }: { params: Promise<{ vaultId: string }> }) {
  const { vaultId } = await params;

  const [userRes, vaultRes] = await Promise.all([
    serverFetch("/me"),
    serverFetch(`/vaults/${vaultId}`)
  ]);

  if (!userRes.success || !vaultRes.success) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-red-500 font-semibold">
          {userRes.error || vaultRes.error || "Something went wrong"}
        </p>
      </div>
    );
  }

  return (
    <VaultDetail
      isSharedVault={false}
      vaultId={vaultId}
      user={userRes.data?.user}
      vault={vaultRes.data?.vault}
    />
  )
}

