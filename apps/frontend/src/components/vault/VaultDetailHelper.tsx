"use client"

import React, { useEffect, useRef, useState } from "react";
import { useParams } from "next/navigation";
import AddSecretPopup from "@/components/vault/AddSecretPopup";
import EditSecretPopup from "@/components/vault/EditSecretPopup";
import { useGetSharedVaultQuery, useGetVaultKeyQuery } from "@/hooks/queries/useCollabQuery";
import { useGetVaultQuery } from "@/hooks/queries/useVaultQuery";

import VaultHeader from "@/components/vault/VaultHeader";
import SecretList from "@/components/vault/SecretList";

import { decryptData, getPrivateKey } from "@/E2E/rsaKeyGen";
import  useToast  from "@/hooks/utils/useToast";
import { socketInstance } from "@/lib/scoketInstance";
import { Secret } from "@/types/types";
import VaultDetailError from "./VaultDetailError";
import VaultDetailSkeleton from "./VaultDetailSkeleton";
import { encryptSecret } from "@/E2E/encryption";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { decryptSecret, decryptVaultKeyWithPrivateKey } from "@/E2E/decryption";
import { z } from "zod";
import { Socket } from "socket.io-client";
import useSocket from "@/hooks/utils/useSocket";

export const formSchema = z.object({
  key: z.string().min(1, { message: "Secret name is required" }),
  value: z.string().min(1, { message: "Secret value is required" }),
  environment: z.enum(["DEVELOPMENT", "STAGING", "PRODUCTION"]),
  type: z.enum(["GENERIC", "PASSWORD", "API_KEY", "ENV_VARIABLE", "SSH_KEY", "DATABASE_CREDENTIAL", "TOKEN"]),
});

export type AddSecretFormValues = z.infer<typeof formSchema>;



const decryptEachSecret = async (secret: Secret, decryptedVaultKey: CryptoKey):Promise<Secret> => {
  const decryptedSecret = await decryptSecret(secret.encryptedSecret, decryptedVaultKey);
  return decryptedSecret;
}

const VaultDetail = ({isSharedVault}:{isSharedVault:boolean}) => {
  const { vaultId } = useParams<{ vaultId: string }>();
  const [searchQuery, setSearchQuery] = useState("");
  const [visibleSecrets, setVisibleSecrets] = useState<string[]>([]);
  const [isAddSecretOpen, setIsAddSecretOpen] = useState(false);
  const [editingSecret, setEditingSecret] = useState<any>(null);
  const [isEditSecretOpen, setIsEditSecretOpen] = useState(false);
  const  {showToast}  = useToast();
  const [decryptedSecrets, setDecryptedSecrets] = useState<Secret[]>([]);
  const [decryptedVaultKey, setDecryptedVaultKey] = useState<CryptoKey | null>(null);
  const form = useForm<AddSecretFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      key: "",
      value: "",
      environment: "DEVELOPMENT",
      type: "GENERIC",
    },
  });

  const socket = useSocket();  
 
  const {data: vaultKey} = useGetVaultKeyQuery(vaultId || "");
  const { data: vault, isLoading, error } = isSharedVault ? useGetSharedVaultQuery(vaultId || "") : useGetVaultQuery(vaultId || "");
  


  useEffect(() => {
    if (!vaultKey) return;
    const decryptVaultKey = async () => {
      try {
        const decryptedVaultKey = await decryptVaultKeyWithPrivateKey(vaultKey);
        setDecryptedVaultKey(decryptedVaultKey);
        const decryptedSecrets = await Promise.all(vault?.secrets.map((secret: Secret) => decryptEachSecret(secret, decryptedVaultKey)) || []);
        setDecryptedSecrets(decryptedSecrets);
      } catch (error:any) {
        showToast({
          type: "error",
          message: `Error decrypting vault key: ${error?.message}`,
        });
      }
    }

    decryptVaultKey();
  }, [vaultKey]);

  useEffect(() => {
  
    socket.emit("join-vault", vaultId);
      
    const onSecretCreated = async (data: Secret) => {
        if(!decryptedVaultKey) return;
        const decryptedSecret = await decryptEachSecret(data, decryptedVaultKey);
        
        showToast({
          type: "info",
          message: `New secret created! 🔐`,
        });

        // Add logic to update UI state if needed
        setDecryptedSecrets(prev => [...prev, decryptedSecret]);

    };
    
    socket.on("secret-created", onSecretCreated);
  
    return () => {
      socket.off("secret-created", onSecretCreated);
      socket.disconnect();
    };
  }, [vaultId,decryptedVaultKey]);

  

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



    setEditingSecret(()=>{
      return {
        ...secret,
        key: decryptedKey,
        value: decryptedValue
      }
    });
    setIsEditSecretOpen(true);
  };

  const onSubmit = async (data: AddSecretFormValues) => {
    try {

      const encryptedSecret = await encryptSecret(data, vaultId);

      socketInstance.emit('create-secret', {
        vaultId: vaultId,
        encryptedSecret: encryptedSecret,
      });
     
      form.reset();
      setIsAddSecretOpen(false);

    } catch (error:any) {
      console.log("error", error);
      showToast({
        type: "error",
        message: error.message,
      });
    }
  };

  if (isLoading) {
    return <VaultDetailSkeleton />;
  }

  if (error || !vault) {
    return <VaultDetailError error={error} />;
  } 


 

  return (
    <div className="space-y-6 animate-fade-in">
      

      <VaultHeader 
        vault={vault} 
        setIsAddSecretOpen={setIsAddSecretOpen}
        isSharedVault={isSharedVault}
      />
      
     { decryptedSecrets.length > 0 && <SecretList
        isSharedVault={isSharedVault}
        secrets={decryptedSecrets}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        visibleSecrets={visibleSecrets}
        toggleSecretVisibility={toggleSecretVisibility}
        onEditSecret={handleEditSecret}
        setIsAddSecretOpen={setIsAddSecretOpen}
      /> }
      {/* : <div className="text-center py-8">
        <p className="text-muted-foreground">
          You no longer have access to the Secrets in this Vault
        </p>
      </div>} */}

      {!isSharedVault && <AddSecretPopup 
        form={form}
        onSubmit={onSubmit}
        open={isAddSecretOpen}
        onOpenChange={setIsAddSecretOpen}
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
