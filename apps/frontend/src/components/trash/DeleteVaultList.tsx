import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import moment from "moment";
import { VaultActions } from "./vault-actions";
import { serverFetch } from "@/lib/serverFetch";

export const DeletedVaultList = async () => {

  const {vaults} = await serverFetch("/trash/vaults"); 
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
        {vaults.map((vault:any) => {
          const deletedDate = new Date(vault.deletedAt);
          const daysLeft = 30 - Math.floor((Date.now() - deletedDate.getTime()) / (1000 * 60 * 60 * 24));

          return (
            <TableRow key={vault.id}>
              <TableCell>{vault.name}</TableCell>
              <TableCell>{moment(deletedDate).format('MMM dd, yyyy')}</TableCell>
              <TableCell>{daysLeft} days</TableCell>
              <TableCell className="text-right space-x-2">
                <VaultActions vaultId={vault.id} />
              </TableCell>
            </TableRow>
          )}
        )}
      </TableBody>
    </Table>
  );
};
