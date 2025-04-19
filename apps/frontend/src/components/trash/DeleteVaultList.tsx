import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Store, Trash2 } from "lucide-react";
import { useRestoreVaultMutation, usePermanentDeleteVaultMutation } from "@/hooks/mutations/useTrashMutations";
import moment from "moment";

interface DeletedVaultListProps {
  vaults: any[];
  isLoading: boolean;
}

export const DeletedVaultList = ({ vaults, isLoading }: DeletedVaultListProps) => {
  const restoreVault = useRestoreVaultMutation();
  const permanentDelete = usePermanentDeleteVaultMutation();

  if (isLoading) {
    return <div className="text-center py-8">Loading...</div>;
  }

  if (!vaults?.length) {
    return <div className="text-center py-8 text-muted-foreground">No deleted vaults found</div>;
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Name</TableHead>
          <TableHead>Deleted On</TableHead>
          <TableHead>Days Left</TableHead>
          <TableHead className="text-right">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {vaults.map((vault) => {
          const deletedDate = new Date(vault.deletedAt);
          const daysLeft = 30 - Math.floor((Date.now() - deletedDate.getTime()) / (1000 * 60 * 60 * 24));

          return (
            <TableRow key={vault.id}>
              <TableCell>{vault.name}</TableCell>
              <TableCell>{moment(deletedDate).format('MMM dd, yyyy')}</TableCell>
              <TableCell>{daysLeft} days</TableCell>
              <TableCell className="text-right space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => restoreVault.mutate(vault.id)}
                >
                  <Store className="h-4 w-4 mr-1" />
                  Restore
                </Button>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => permanentDelete.mutate(vault.id)}
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
