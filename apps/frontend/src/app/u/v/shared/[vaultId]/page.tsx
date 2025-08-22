import VaultDetail from '@/components/vault/VaultDetailHelper'
import { serverFetch } from '@/lib/serverFetch';
import React from 'react'

export default async  function Page({params}:{params:Promise<{vaultId:string}>}) {

  const {vaultId} = await params;
  
  const result = await Promise.all([
      serverFetch("/me"),
      serverFetch(`/vaults/${vaultId}`)
    ])

  const [userDetail, vaultDetail] = result;

  return (
    <VaultDetail 
        isSharedVault={true}
        vaultId={vaultId}
        user={userDetail?.user}
        vault={vaultDetail?.vault}
    />
  )
}
