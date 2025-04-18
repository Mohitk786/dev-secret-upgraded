
import React from "react";
import { Search, Plus, Loader2 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import SecretItem from "./SecretItem";
import { Secret } from "@/types/types";

interface SecretListProps {
  secrets: Secret[];
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  visibleSecrets: string[];
  toggleSecretVisibility: (secretId: string) => void;
  onEditSecret: (secret: any) => void;
  setIsAddSecretOpen: (value: boolean) => void;
  isLoading?: boolean;
  isSharedVault?: boolean;
}

const SecretList: React.FC<SecretListProps> = ({
  secrets,
  searchQuery,
  setSearchQuery,
  visibleSecrets,
  toggleSecretVisibility,
  onEditSecret,
  setIsAddSecretOpen,
  isLoading,
  isSharedVault,
}) => {
  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }
  
  const filteredSecrets = secrets.filter((secret: any) => 
    secret.key?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    secret.environment?.toLowerCase().includes(searchQuery.toLowerCase())
  ) || [];

 
  
  return (
    <Card>
      <CardContent className="p-6">
        <div className="relative mb-6">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search secrets..."
            className="pl-10"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        
        <div className="space-y-4">
          {filteredSecrets.length > 0 ? (
            filteredSecrets.map((secret: any, index: number) => (
              <SecretItem
                isSharedVault={isSharedVault || false}
                key={index}
                secret={secret}
                visibleSecrets={visibleSecrets}
                toggleSecretVisibility={toggleSecretVisibility}
                onEditSecret={onEditSecret}
              />
            ))
          ) : (
            
            <div className="text-center py-8">
              <p className="text-muted-foreground">
                {searchQuery ? "No secrets found matching your search." : "No secrets in this vault yet."}
              </p>
              {searchQuery && (
                <Button 
                  variant="link" 
                  onClick={() => setSearchQuery("")}
                  className="mt-2"
                >
                  Clear search
                </Button>
              )}

              {!searchQuery && !isSharedVault && (
                <Button 
                  variant="outline" 
                  className="mt-4"
                  onClick={() => setIsAddSecretOpen(true)}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add your first secret
                </Button>
              )}
              
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default SecretList;
