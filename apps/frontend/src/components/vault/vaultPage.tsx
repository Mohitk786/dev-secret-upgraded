"use client";

import React, { useState } from "react";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import Link from "next/link";
import { Plus } from "lucide-react";
import VaultCard from "./VaultCard";
import { APP_ROUTES } from "@/constants/data";

export interface Vault {
  id: string;
  name: string;
  description: string;
  type: string;
  icon: string;
  ownerId: string;
  isDeleted: boolean;
  deletedAt: string | null;
  createdAt: string;
  updatedAt: string;
}

interface VaultPageHeaderProps {
  title: string;
  description: string;
  icon: string;
  vaults: Vault[];
  isSharedVault: boolean;
}

const VaultPage = ({
  title,
  description,  
  icon,
  vaults,
  isSharedVault,
}: VaultPageHeaderProps) => {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredVaults = vaults?.filter((vault: Vault) => {
    return (
      vault?.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      vault?.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      vault?.type.toLowerCase().includes(searchQuery.toLowerCase())
    );
  });

  return (
    <>
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-primary text-3xl font-bold tracking-tight flex items-center gap-2">
            <span>{icon}</span> {title}
          </h1>
          <p className="text-muted-foreground mt-1">{description}</p>
        </div>
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
        {filteredVaults &&
          filteredVaults.map((vault) => (
            <VaultCard key={vault?.id} vault={vault} />
          ))}

        {isSharedVault ? (
          <></>
        ) : (
          <Link href={APP_ROUTES.VAULTS_NEW}>
            <Card className="h-full overflow-hidden transition-all border-dashed border-primary/30 hover:border-primary/70 flex items-center justify-center">
              <CardContent className="p-6 text-center flex flex-col items-center justify-center h-full">
                <div className="rounded-full bg-primary/10 p-4 mb-4">
                  <Plus className="h-8 w-8 text-gray-200" />
                </div>
                <h3 className="font-semibold text-lg text-gray-200">
                  Create New Vault
                </h3>
                <p className="text-sm text-muted-foreground mt-1">
                  Add a new secure vault for your secrets
                </p>
              </CardContent>
            </Card>
          </Link>
        )}
      </div>
    </>
  );
};

export default VaultPage;
