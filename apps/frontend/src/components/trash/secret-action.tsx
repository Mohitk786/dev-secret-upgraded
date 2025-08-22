"use client"

import { Store, Trash2 } from 'lucide-react'
import React from 'react'
import { Button } from '../ui/button'
import { useRestoreSecretMutation, usePermanentDeleteSecretMutation } from '@/hooks/mutations/useTrashMutations'

const SecretActions = ({secretId}: {secretId: string}) => {

    const restoreSecret = useRestoreSecretMutation();
    const permanentDelete = usePermanentDeleteSecretMutation();

  return (
   <>
             <Button
                  variant="outline"
                  size="sm"
                  onClick={() => restoreSecret.mutate(secretId)}
                >
                  <Store className="h-4 w-4 mr-1" />
                  Restore
                </Button>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => permanentDelete.mutate(secretId)}
                >
                  <Trash2 className="h-4 w-4 mr-1" />
                  Delete
                </Button>
   </>
  )
}

export default SecretActions