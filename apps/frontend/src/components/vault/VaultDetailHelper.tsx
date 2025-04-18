"use client"

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import AddSecretPopup from "@/components/vault/AddSecretPopup";
import EditSecretPopup from "@/components/vault/EditSecretPopup";
import { useGetSharedVaultQuery } from "@/hooks/queries/useCollabQuery";
import { useGetVaultQuery } from "@/hooks/queries/useVaultQuery";

import VaultHeader from "@/components/vault/VaultHeader";
import SecretList from "@/components/vault/SecretList";

import { decryptData, getPrivateKey } from "@/E2E/rsaKeyGen";
import  useToast  from "@/hooks/utils/useToast";
import { socketInstance } from "@/lib/scoketInstance";
import { Secret } from "@/types/types";

const VaultDetail = ({isSharedVault}:{isSharedVault:boolean}) => {
  const { vaultId } = useParams<{ vaultId: string }>();
  const [searchQuery, setSearchQuery] = useState("");
  const [visibleSecrets, setVisibleSecrets] = useState<string[]>([]);
  const [isAddSecretOpen, setIsAddSecretOpen] = useState(false);
  const [editingSecret, setEditingSecret] = useState<any>(null);
  const [isEditSecretOpen, setIsEditSecretOpen] = useState(false);
  const  {showToast}  = useToast();
  const { data: vault, isLoading, error } = isSharedVault ? useGetSharedVaultQuery(vaultId || "") : useGetVaultQuery(vaultId || "");

  const toggleSecretVisibility = (secretId: string) => {
    setVisibleSecrets(prevVisible => 
      prevVisible.includes(secretId) 
        ? prevVisible.filter(id => id !== secretId) 
        : [...prevVisible, secretId]
    );
  };

  const handleEditSecret = async (secret: any) => {
    const privateKey = await getPrivateKey();
    
    if(!privateKey){
      showToast({
        type: "error",
        message: "Please enter your private key to edit the secret"
      })
      return;
    }
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

  // if (isLoading) {
  //   return <VaultDetailSkeleton />;
  // }

  // if (error || !vault) {
  //   return <VaultDetailError error={error} />;
  // }


//  useEffect(()=>{
//   socketInstance.connect();
//   socketInstance.on("secret-created", (data: Secret) => {
//     console.log("secret-created", data);
//   }); 

//   return ()=>{
//     socketInstance.disconnect();
//   } 
//  },[])


  return (
    <div className="space-y-6 animate-fade-in">
      

      <VaultHeader 
        vault={vault} 
        setIsAddSecretOpen={setIsAddSecretOpen}
        isSharedVault={isSharedVault}
      />
      
      <SecretList
        isSharedVault={isSharedVault}
        vault={ []}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        visibleSecrets={visibleSecrets}
        toggleSecretVisibility={toggleSecretVisibility}
        onEditSecret={handleEditSecret}
        setIsAddSecretOpen={setIsAddSecretOpen}
      /> 
      {/* : <div className="text-center py-8">
        <p className="text-muted-foreground">
          You no longer have access to the Secrets in this Vault
        </p>
      </div>} */}

      {!isSharedVault && <AddSecretPopup 
        open={isAddSecretOpen}
        onOpenChange={setIsAddSecretOpen}
        vaultId={vaultId || ""}
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
