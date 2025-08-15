"use client"

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import AddSecretPopup from "@/components/vault/AddSecretPopup";

import VaultHeader from "@/components/vault/VaultHeader";
import SecretList from "@/components/vault/SecretList";

import useToast from "@/hooks/utils/useToast";
import { Secret, User} from "@/types/types";
import { DecryptSecret } from "@/E2E/decryption";
import { z } from "zod";
import useSocket from "@/hooks/utils/useSocket";
import { useDecryptedSecrets } from "@/hooks/utils/useDecryptedSecrets";
import { APP_ROUTES } from "@/constants/data";

export const formSchema = z.object({
  key: z.string().min(1, { message: "Secret name is required" }),
  value: z.string().min(1, { message: "Secret value is required" }),
  environment: z.enum(["DEVELOPMENT", "STAGING", "PRODUCTION"]),
  type: z.enum(["GENERIC", "PASSWORD", "API_KEY", "ENV_VARIABLE", "SSH_KEY", "DATABASE_CREDENTIAL", "TOKEN"]),
});

export type AddSecretFormValues = z.infer<typeof formSchema>;



const decryptEachSecret = async (secret: Secret, decryptedVaultKey: CryptoKey): Promise<Secret> => {
  const decryptedSecret = await DecryptSecret(secret, decryptedVaultKey);
  return {
    ...decryptedSecret,
    id: secret.id,
    vaultId: secret.vaultId,
  };
}

const VaultDetail = ({ isSharedVault, user, vault, vaultId }: { isSharedVault: boolean, user: User, vault: any, vaultId: string }) => {

  const [searchQuery, setSearchQuery] = useState("");
  const [visibleSecrets, setVisibleSecrets] = useState<string[]>([]);
  const [isAddSecretOpen, setIsAddSecretOpen] = useState(false);
  const { showToast } = useToast();
  const router = useRouter();

  const socket = useSocket();

  const { decryptedVaultKey, decryptedSecrets, setDecryptedSecrets} = useDecryptedSecrets(vaultId, vault?.secrets);

  const [hasAccess, setHasAccess] = useState<boolean>(false);

  useEffect(() => {
    if (vault?.ownerId === user?.id) {
      setHasAccess(true)
    } else {
      setHasAccess(vault?.collaborators?.hasSecretAccess)
    }
  }, [vault, user?.id]);



  useEffect(() => {
  
    socket.emit("authenticate", user?.id);
    socket.emit("join-vault", vaultId as string)

    const onSecretCreated = async (data: { message: string, secret: Secret }) => {

      if (!decryptedVaultKey) return;
      const decryptedSecret = await decryptEachSecret(data.secret, decryptedVaultKey);

      showToast({
        type: "info",
        message: `New secret created! 🔐`,
      });

      setDecryptedSecrets(prev => [...prev, decryptedSecret]);

    };

    const onSecretDeleted = async (data: { message: string, secretId: string }) => {
      setDecryptedSecrets(prev => prev.filter(secret => secret.id !== data?.secretId));
      showToast({
        type: "success",
        message: data?.message,
      });
    }

    const onSecretUpdated = async (data: { message: string, encryptedSecret: Secret }) => {
      if (!decryptedVaultKey) return;
      const decryptedSecret = await decryptEachSecret(data.encryptedSecret, decryptedVaultKey);
      setDecryptedSecrets(prev => prev.map(secret => secret.id === decryptedSecret.id ? decryptedSecret : secret));
      showToast({
        type: "success",
        message: `${data?.message}🔐`,
      });
    }

    const onAccessToggled = async (data: { message: string, hasSecretAccess: boolean }) => {


      showToast({
        type: "success",
        message: data?.message,
      });
      if (!data?.hasSecretAccess) {
        setDecryptedSecrets([])
        setVisibleSecrets([])
        setHasAccess(false)
      } else {
          setDecryptedSecrets(decryptedSecrets);
          setHasAccess(true)

      }
    }

    const onVaultDeleted = async (data: { message: string, vaultId: string }) => {
      if (vault?.ownerId === user?.id) {
          router.push(APP_ROUTES.VAULTS);
      } else {
        router.push(APP_ROUTES.SHARED_WITH_ME);
      }

      showToast({
        type: "success",  
        message: data?.message,
      });
    }

   
    
    socket.on("vault-deleted", onVaultDeleted);
    socket.on("access-toggled", onAccessToggled);
    socket.on("secret-created", onSecretCreated);
    socket.on("secret-deleted", onSecretDeleted);
    socket.on("secret-updated", onSecretUpdated);
    return () => {
      socket.emit("leave-vault", vaultId);
      socket.off("secret-created", onSecretCreated);
      socket.off("secret-deleted", onSecretDeleted);
      socket.off("secret-updated", onSecretUpdated);
      socket.off("access-toggled", onAccessToggled);
      socket.off("vault-deleted", onVaultDeleted);
    };
     // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [vaultId]);



  const toggleSecretVisibility = (secretId: string) => {
    setVisibleSecrets(prevVisible =>
      prevVisible.includes(secretId)
        ? prevVisible.filter(id => id !== secretId)
        : [...prevVisible, secretId]
    );
  };



  // if (error || !vault) {
  //   return <VaultDetailError error={error} />;
  // }






  return (
    <div className="space-y-6 animate-fade-in">


      <VaultHeader
        vault={vault}
        setIsAddSecretOpen={setIsAddSecretOpen}
        user={user}
      />

      {hasAccess ?
        <SecretList
          isSharedVault={isSharedVault}
          secrets={decryptedSecrets}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          visibleSecrets={visibleSecrets}
          toggleSecretVisibility={toggleSecretVisibility}
          setIsAddSecretOpen={setIsAddSecretOpen}
          isOwner={vault?.ownerId === user?.id}
        />
        : vault?.isDeleted ?
          <div className="text-center py-8">
            <p className="text-muted-foreground">
              🔒 Vault has been deleted.
            </p>
          </div>
          : <div className="text-center py-8">
            <p className="text-muted-foreground">
              🔒 Access Denied: You no longer have permission to view the secrets in this vault. Contact the owner to get access.
            </p>
          </div>
      }

      {(vault?.ownerId === user?.id || vault?.permissions?.canAdd) &&
        <AddSecretPopup
          open={isAddSecretOpen}
          onOpenChange={setIsAddSecretOpen}
        />}

    </div>
  );
};

export default VaultDetail;
