import { useEffect, useState } from "react";
import { decryptVaultKeyWithPrivateKey } from "@/E2E/decryption";
import { Secret, } from "@/types/types";
import { useGetVaultKeyQuery } from "@/hooks/queries/useCollabQuery";
import useToast from "@/hooks/utils/useToast";
import { decryptSecret } from "@/E2E/decryption";

export const useDecryptedSecrets = (
  vaultId: string,
  encryptedSecrets: Secret[]
) => {
  const [decryptedVaultKey, setDecryptedVaultKey] = useState<CryptoKey | null>(null);
  const [decryptedSecrets, setDecryptedSecrets] = useState<Secret[]>([]);
  const { showToast } = useToast();
  const { data: vaultKey } = useGetVaultKeyQuery(vaultId);


  useEffect(() => {
    if (!vaultKey) return;

    const decryptVaultKey = async () => {
      try {
        const key = await decryptVaultKeyWithPrivateKey(vaultKey);
        setDecryptedVaultKey(key);
        const secrets = await Promise.all(
          encryptedSecrets && encryptedSecrets.length > 0 ? encryptedSecrets.map((secret: Secret) =>
            decryptSecret(secret, key)
          ) : []
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
  }, [vaultKey, encryptedSecrets]);

  return {
    decryptedVaultKey,
    decryptedSecrets,
    // isLoading,
    // error,
    // vault,
    setDecryptedSecrets
  };
};
