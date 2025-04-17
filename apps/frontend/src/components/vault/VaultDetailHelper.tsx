
import React, { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import AddSecretPopup from "@/components/vault/AddSecretPopup";
import EditSecretPopup from "@/components/vault/EditSecretPopup";
import { useGetSharedVaultQuery } from "@/hooks/queries/useCollabQuery";
import { useGetVaultQuery } from "@/hooks/queries/useVaultQuery";

import VaultHeader from "@/components/vault/VaultHeader";
import SecretList from "@/components/vault/SecretList";
import VaultDetailSkeleton from "@/components/vault/VaultDetailSkeleton";
import VaultDetailError from "@/components/vault/VaultDetailError";
import { decryptData, getPrivateKey } from "@/lib/rsaKeyGen";

const VaultDetail = ({isSharedVault}:{isSharedVault:boolean}) => {
  const { id } = useParams<{ id: string }>();
  const [searchQuery, setSearchQuery] = useState("");
  const [visibleSecrets, setVisibleSecrets] = useState<string[]>([]);
  const [isAddSecretOpen, setIsAddSecretOpen] = useState(false);
  const [editingSecret, setEditingSecret] = useState<any>(null);
  const [isEditSecretOpen, setIsEditSecretOpen] = useState(false);
  
  const { data: vault, isLoading, error } = isSharedVault ? useGetSharedVaultQuery(id || "") : useGetVaultQuery(id || "");


  const toggleSecretVisibility = (secretId: string) => {
    setVisibleSecrets(prevVisible => 
      prevVisible.includes(secretId) 
        ? prevVisible.filter(id => id !== secretId) 
        : [...prevVisible, secretId]
    );
  };

  const handleEditSecret = async (secret: any) => {
    console.log("hii mai hu nobita", secret)
    const privateKey = await getPrivateKey();
    let decryptedKey;
    let decryptedValue;

   if(isSharedVault){
     decryptedKey = await decryptData(secret.encryptedSecrets[0].key, privateKey);
     decryptedValue = await decryptData(secret.encryptedSecrets[0].value, privateKey);
   }else{
     decryptedKey = await decryptData(secret.key, privateKey);
     decryptedValue = await decryptData(secret.value, privateKey);
   }


    console.log(decryptedKey, decryptedValue);

    setEditingSecret(()=>{
      return {
        ...secret,
        key: decryptedKey,
        value: decryptedValue
      }
    });
    setIsEditSecretOpen(true);
  };

  if (isLoading) {
    return <VaultDetailSkeleton />;
  }

  if (error || !vault) {
    return <VaultDetailError error={error} />;
  }


  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center gap-2 text-muted-foreground">
        <Link to={`/vaults${isSharedVault ? "/shared-with-me" : ""}`}>
          <Button variant="ghost" size="sm" className="gap-1">
            <ArrowLeft className="h-4 w-4" /> Back to Vaults
          </Button>
        </Link>
      </div>

      <VaultHeader 
        vault={vault} 
        setIsAddSecretOpen={setIsAddSecretOpen}
        isSharedVault={isSharedVault}
      />
      
      {(vault?.vault?.secrets) ? <SecretList
        isSharedVault={isSharedVault}
        vault={vault || []}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        visibleSecrets={visibleSecrets}
        toggleSecretVisibility={toggleSecretVisibility}
        onEditSecret={handleEditSecret}
        setIsAddSecretOpen={setIsAddSecretOpen}
      /> : <div className="text-center py-8">
        <p className="text-muted-foreground">
          You no longer have access to the Secrets in this Vault
        </p>
      </div>}

      {!isSharedVault && <AddSecretPopup 
        open={isAddSecretOpen}
        onOpenChange={setIsAddSecretOpen}
        vaultId={id || ""}
      />}
      
      {editingSecret && (
        <EditSecretPopup 
          open={isEditSecretOpen}
          onOpenChange={setIsEditSecretOpen}
          secret={editingSecret}
        />
      )}
    </div>
  );
};

export default VaultDetail;
