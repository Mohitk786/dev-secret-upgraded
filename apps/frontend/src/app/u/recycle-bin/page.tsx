import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DeletedVaultList } from "@/components/trash/DeleteVaultList";
import { DeletedSecretList } from "@/components/trash/DeletedSecretList";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { ClockIcon } from "lucide-react";
import { Suspense } from "react";

const RecycleBin = () => {

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
             <Suspense fallback={<div>Loading...</div>}>
              <DeletedVaultList />
             </Suspense>
            </TabsContent>
            <TabsContent value="secrets">
              <Suspense fallback={<div>Loading...</div>}>
                <DeletedSecretList />
              </Suspense>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default RecycleBin;