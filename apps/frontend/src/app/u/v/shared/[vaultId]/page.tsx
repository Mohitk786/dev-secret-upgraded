import VaultDetail from '@/components/vault/VaultDetailHelper'
import { serverFetch } from '@/lib/serverFetch';
import React from 'react'

const page = async ({params}:{params:{vaultId:string}}) => {
  const {user} = await serverFetch("/me");
  const {vaultId} = await params;
  const {vault} = await serverFetch(`/vaults/${vaultId}`);


  return (
    <VaultDetail 
        isSharedVault={true}
        vaultId={vaultId}
        user={user}
        vault={vault}
    />
  )
}

export default page