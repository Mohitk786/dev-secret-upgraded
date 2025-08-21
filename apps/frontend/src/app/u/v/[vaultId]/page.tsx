import VaultDetail from '@/components/vault/VaultDetailHelper'
import { serverFetch } from '@/lib/serverFetch'
import React from 'react'

const Page = async ({ params }: { params: { vaultId: string } }) => {
  const { vaultId } = await params
  const { user } = await serverFetch("/me")
  const { vault } = await serverFetch(`/vaults/${vaultId}`)

  return (
    <VaultDetail 
      isSharedVault={false}
      user={user}
      vaultId={vaultId}
      vault={vault}
    />
  )
}

export default Page
