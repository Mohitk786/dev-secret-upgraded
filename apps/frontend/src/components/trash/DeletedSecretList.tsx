
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import moment from "moment";
import SecretActions from "./secret-action";
import { serverFetch } from "@/lib/serverFetch";



export const DeletedSecretList = async () => {
 
  const secretsRes = await serverFetch("/trash/secrets");
  if (!secretsRes.success) {
    return <div>Error: {secretsRes.error}</div>;
  }

  const secrets = secretsRes.data?.secrets;

  if (!secrets?.length) {
    return <div className="text-center py-8 text-muted-foreground">No deleted secrets found</div>;
  }


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
        {secrets.map((secret:any) => {
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
                <SecretActions secretId={secret.id}/>
              </TableCell>
            </TableRow>
          )}
        )}
      </TableBody>
    </Table>
  );
};