"use client"

import React from 'react'
import { Button } from '../ui/button'
import { usePermanentDeleteVaultMutation, useRestoreVaultMutation } from '@/hooks/mutations/useTrashMutations';
import { Store, Trash2 } from 'lucide-react';

export const VaultActions = ({ vaultId }: { vaultId: string }) => {

    const restoreVault = useRestoreVaultMutation();
    const permanentDelete = usePermanentDeleteVaultMutation();  

  return (
   <>
        <Button
                variant="outline"
                size="sm"
                onClick={() => restoreVault.mutate(vaultId)}
            >
                <Store className="h-4 w-4 mr-1" />
                Restore
        </Button>
        <Button
                variant="destructive"
                size="sm"
                onClick={() => permanentDelete.mutate(vaultId)}
            >
                <Trash2 className="h-4 w-4 mr-1" />
                Delete
        </Button>
   </>
  )
}
