"use client"

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {  Store, Trash2 } from "lucide-react";
import { useRestoreSecretMutation, usePermanentDeleteSecretMutation } from "@/hooks/mutations/useTrashMutations";
import moment from "moment";


interface DeletedSecretListProps {
  secrets: any[];
  isLoading: boolean;
}

export const DeletedSecretList = ({ secrets, isLoading }: DeletedSecretListProps) => {
  const restoreSecret = useRestoreSecretMutation();
  const permanentDelete = usePermanentDeleteSecretMutation();

  if (isLoading) {
    return <div className="text-center py-8">Loading...</div>;
  }

  if (!secrets?.length) {
    return <div className="text-center py-8 text-muted-foreground">No deleted secrets found</div>;
  }

  // const { decryptedVaultKey, decryptedSecrets, setDecryptedSecrets} = useDecryptedSecrets(vaultId, vault?.secrets);
 
  //  const decryptedSecrets = secrets.map(async (secret:any)=>{

  //   const decryptedVaultKey = await decryptVaultKeyWithPrivateKey(secret.vaultKey);
  //   const decryptedSecret = await decryptSecret(secret, decryptedVaultKey);
  //   return decryptedSecret;
  //  })
 

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Key</TableHead>
          <TableHead>Vault</TableHead>
          <TableHead>Type</TableHead>
          <TableHead>Deleted On</TableHead>
          <TableHead>Days Left</TableHead>
          <TableHead className="text-right">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {secrets.map((secret) => {
          const deletedDate = new Date(secret.deletedAt);
          const daysLeft = 30 - Math.floor((Date.now() - deletedDate.getTime()) / (1000 * 60 * 60 * 24));

          return (
            <TableRow key={secret.id}>
              <TableCell>{secret.key || "..."}</TableCell>
              <TableCell>{secret.vault.name}</TableCell>
              <TableCell>
                <Badge variant="secondary">{secret.type || "..."}</Badge>
              </TableCell>
              <TableCell>{moment(deletedDate).format('MMM dd, yyyy')}</TableCell>
              <TableCell>{daysLeft} days</TableCell>
              <TableCell className="text-right space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => restoreSecret.mutate(secret.id)}
                >
                  <Store className="h-4 w-4 mr-1" />
                  Restore
                </Button>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => permanentDelete.mutate(secret.id)}
                >
                  <Trash2 className="h-4 w-4 mr-1" />
                  Delete
                </Button>
              </TableCell>
            </TableRow>
          )}
        )}
      </TableBody>
    </Table>
  );
};