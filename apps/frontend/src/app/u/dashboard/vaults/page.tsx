"use client"

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Plus, Search } from "lucide-react";
import VaultCard from "@/components/vault/VaultCard";
import { useGetVaultsQuery } from "@/hooks/queries/useVaultQuery";

const VaultList = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const { data: vaults, isLoading, error } = useGetVaultsQuery();
  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  const filteredVaults = Array.isArray(vaults) && vaults?.filter((vault: any) =>
    vault?.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    vault?.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
    vault?.type.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
            <span className="text-primary">📂</span> Vaults
          </h1>
          <p className="text-muted-foreground mt-1">
            Manage your secure vaults for different projects and purposes.
          </p>
        </div>
        <Link href="/vaults/new">
          <Button className="flex items-center gap-2 bg-primary hover:bg-primary/90">
            <Plus className="h-4 w-4" />
            New Vault
          </Button>
        </Link>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Search vaults..."
          className="pl-10"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>


      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {filteredVaults && filteredVaults.map(vault => (
          <VaultCard isSharedVault={false} key={vault?.id} vault={vault} />
        ))}

        <Link href="/vaults/new">
          <Card className="h-full overflow-hidden transition-all border-dashed border-primary/30 hover:border-primary/70 flex items-center justify-center">
            <CardContent className="p-6 text-center flex flex-col items-center justify-center h-full">
              <div className="rounded-full bg-primary/10 p-4 mb-4">
                <Plus className="h-8 w-8 text-primary" />
              </div>
              <h3 className="font-semibold text-lg text-primary">Create New Vault</h3>
              <p className="text-sm text-muted-foreground mt-1">
                Add a new secure vault for your secrets
              </p>
            </CardContent>
          </Card>
        </Link>
      </div>
    </div>
  );
};

export default VaultList;
