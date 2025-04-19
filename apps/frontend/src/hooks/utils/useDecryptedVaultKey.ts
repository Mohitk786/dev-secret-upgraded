import { useEffect, useState } from "react";
import { decryptVaultKeyWithPrivateKey } from "@/E2E/decryption";
import { Secret } from "@/types/types";
import { useGetSharedVaultQuery, useGetVaultKeyQuery } from "@/hooks/queries/useCollabQuery";
import { useGetVaultQuery } from "@/hooks/queries/useVaultQuery";
import useToast from "@/hooks/utils/useToast";
import { decryptSecret } from "@/E2E/decryption";

export const useDecryptedVaultKey = (
  vaultId: string,
  isSharedVault: boolean
) => {
  const [decryptedVaultKey, setDecryptedVaultKey] = useState<CryptoKey | null>(null);
  const [decryptedSecrets, setDecryptedSecrets] = useState<Secret[]>([]);
  const { showToast } = useToast();

  const { data: vaultKey } = useGetVaultKeyQuery(vaultId);
  const { data: vault, isLoading, error } = isSharedVault
    ? useGetSharedVaultQuery(vaultId)
    : useGetVaultQuery(vaultId);


  useEffect(() => {
    if (!vaultKey) return;

    const decryptVaultKey = async () => {
      try {
        const key = await decryptVaultKeyWithPrivateKey(vaultKey);
        setDecryptedVaultKey(key);
        const secrets = await Promise.all(
          vault?.secrets.map((secret: Secret) =>
            decryptSecret(secret, key)
          ) || []
        );
        setDecryptedSecrets(secrets);
      } catch (err: any) {
        showToast({
          type: "error",
          message: `Error decrypting vault key: ${err?.message}`,
        });
      }
    };

    decryptVaultKey();
  }, [vaultKey]);

  return {
    decryptedVaultKey,
    decryptedSecrets,
    isLoading,
    error,
    vault,
    setDecryptedSecrets
  };
};
