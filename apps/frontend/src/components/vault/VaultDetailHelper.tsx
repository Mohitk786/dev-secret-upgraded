"use client"

import React, { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import AddSecretPopup from "@/components/vault/AddSecretPopup";
import VaultHeader from "@/components/vault/VaultHeader";
import SecretList from "@/components/vault/SecretList";
import useToast from "@/hooks/utils/useToast";
import { Secret, User} from "@/types/types";
import { DecryptSecret } from "@/E2E/decryption";
import useSocket from "@/hooks/utils/useSocket";
import { useDecryptedSecrets } from "@/hooks/utils/useDecryptedSecrets";
import { APP_ROUTES } from "@/constants/data";

const decryptEachSecret = async (secret: Secret, decryptedVaultKey: CryptoKey): Promise<Secret> => {
  const decryptedSecret = await DecryptSecret(secret, decryptedVaultKey)
  return {
    ...decryptedSecret,
    id: secret.id,
    vaultId: secret.vaultId,
  }
}

const VaultDetail = ({
  isSharedVault,
  user,
  vault,
  vaultId,
}: { isSharedVault: boolean; user: User; vault: any; vaultId: string }) => {
  const [searchQuery, setSearchQuery] = useState("")
  const [visibleSecrets, setVisibleSecrets] = useState<string[]>([])
  const [isAddSecretOpen, setIsAddSecretOpen] = useState(false)
  const { showToast } = useToast()
  const router = useRouter()

  const socket = useSocket()

  const { decryptedVaultKey, decryptedSecrets, setDecryptedSecrets } = useDecryptedSecrets(vaultId, vault?.secrets)

  const [hasAccess, setHasAccess] = useState<boolean>(false)

  useEffect(() => {
    if (vault?.ownerId === user?.id) {
      setHasAccess(true)
    } else {
      setHasAccess(vault?.collaborators?.hasSecretAccess)
    }
  }, [vault, user?.id])

  const onSecretDeleted = useCallback(
    async (data: { message: string; secretId: string }) => {
      setDecryptedSecrets((prev) => {
        const filtered = prev.filter((secret) => secret.id !== data?.secretId)
        if (filtered.length === prev.length) {
          return prev
        }
        return filtered
      })
      showToast({
        type: "success",
        message: data?.message,
      })
    },
    [setDecryptedSecrets, showToast],
  )

  const onSecretUpdated = useCallback(
    async (data: { message: string; encryptedSecret: Secret }) => {
      if (!decryptedVaultKey) return
      const decryptedSecret = await decryptEachSecret(data.encryptedSecret, decryptedVaultKey)
      setDecryptedSecrets((prev) => {
        const updated = prev.map((secret) => (secret.id === decryptedSecret.id ? decryptedSecret : secret))
        if (JSON.stringify(prev) === JSON.stringify(updated)) {
          return prev
        }
        return updated
      })
      showToast({
        type: "success",
        message: `${data?.message}🔐`,
      })
    },
    [decryptedVaultKey, setDecryptedSecrets, showToast],
  )

  const onAccessToggled = useCallback(
    async (data: { message: string; hasSecretAccess: boolean }) => {
      showToast({
        type: "success",
        message: data?.message,
      })
      setHasAccess(data?.hasSecretAccess)
    },
    [showToast],
  )

  const onVaultDeleted = useCallback(
    async (data: { message: string; vaultId: string }) => {
      if (vault?.ownerId === user?.id) {
        router.push(APP_ROUTES.VAULTS)
      } else {
        router.push(APP_ROUTES.SHARED_WITH_ME)
      }

      showToast({
        type: "success",
        message: data?.message,
      })
    },
    [vault?.ownerId, user?.id, router, showToast],
  )

  const onSecretCreated = useCallback(
    async (data: { message: string; secrets: Secret[] }) => {
      if (!decryptedVaultKey) return

      try {
        const decrypted = await Promise.all(data.secrets.map((secret) => decryptEachSecret(secret, decryptedVaultKey)))

        setDecryptedSecrets((prev) => [...prev, ...decrypted])

        showToast({
          type: "info",
          message: `New secret created! 🔐`,
        })
      } catch (error) {
        console.error("Error decrypting new secrets:", error)
        showToast({
          type: "error",
          message: "Failed to decrypt new secrets",
        })
      }
    },
    [decryptedVaultKey, setDecryptedSecrets, showToast],
  )

  useEffect(() => {
    if (!user?.id || !vaultId) return

    // socket.emit("authenticate", user?.id)
    // socket.emit("join-vault", vaultId)

    socket.on("vault-deleted", onVaultDeleted)
    socket.on("access-toggled", onAccessToggled)
    socket.on("secret-created", onSecretCreated)
    socket.on("secret-deleted", onSecretDeleted)
    socket.on("secret-updated", onSecretUpdated)

    return () => {
      socket.off("secret-created", onSecretCreated)
      socket.off("secret-deleted", onSecretDeleted)
      socket.off("secret-updated", onSecretUpdated)
      socket.off("access-toggled", onAccessToggled)
      socket.off("vault-deleted", onVaultDeleted)
    }
  }, [vaultId, user?.id, socket, onSecretCreated, onSecretDeleted, onSecretUpdated, onAccessToggled, onVaultDeleted])

  const toggleSecretVisibility = (secretId: string) => {
    setVisibleSecrets((prevVisible) =>
      prevVisible.includes(secretId) ? prevVisible.filter((id) => id !== secretId) : [...prevVisible, secretId],
    )
  }


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
