"use client";

import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { getDeletedVaults, getDeletedSecrets } from "@/services/trashServices";
import { DeletedVaultList } from "@/components/trash/DeleteVaultList";
import { DeletedSecretList } from "@/components/trash/DeletedSecretList";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { ClockIcon } from "lucide-react";

const RecycleBin = () => {
  const { data: deletedVaults, isLoading: vaultsLoading } = useQuery({
    queryKey: ["deletedVaults"],
    queryFn: getDeletedVaults,
  });

  const { data: deletedSecrets, isLoading: secretsLoading } = useQuery({
    queryKey: ["deletedSecrets"],
    queryFn: getDeletedSecrets,
  });


  console.log("deletedVaults", deletedVaults);
  console.log("deletedSecrets", deletedSecrets);

 
  return (
    <div className="container max-w-6xl mx-auto space-y-6 p-6">
      <Card>
        <CardHeader>
          <CardTitle>Recycle Bin</CardTitle>
          <CardDescription>
            Manage your deleted vaults and secrets. Items are kept for 30 days before permanent deletion.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Alert className="mb-6">
            <ClockIcon className="h-4 w-4" />
            <AlertDescription>
              Items in the recycle bin will be permanently deleted after 30 days.
            </AlertDescription>
          </Alert>

          <Tabs defaultValue="vaults">
            <TabsList className="grid w-full max-w-[400px] grid-cols-2">
              <TabsTrigger value="vaults">Vaults</TabsTrigger>
              <TabsTrigger value="secrets">Secrets</TabsTrigger>
            </TabsList>
            <TabsContent value="vaults">
              <DeletedVaultList 
                vaults={deletedVaults} 
                isLoading={vaultsLoading} 
              />
            </TabsContent>
            <TabsContent value="secrets">
              <DeletedSecretList 
                secrets={deletedSecrets} 
                isLoading={secretsLoading} 
              />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default RecycleBin;