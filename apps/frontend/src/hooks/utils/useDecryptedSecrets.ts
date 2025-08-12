import { useEffect, useState } from "react";
import { decryptVaultKeyWithPrivateKey } from "@/E2E/decryption";
import { Secret, } from "@/types/types";
import { useGetVaultKeyQuery } from "@/hooks/queries/useCollabQuery";
import useToast from "@/hooks/utils/useToast";
import { DecryptSecret } from "@/E2E/decryption";

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
    let cancelled = false;
  
    const decryptVaultKey = async () => {
      try {
        const key = await decryptVaultKeyWithPrivateKey(vaultKey);
        if (cancelled) return;
  
        setDecryptedVaultKey(key);
  
        const secrets = await Promise.all(
          encryptedSecrets.length > 0
            ? encryptedSecrets.map(secret => DecryptSecret(secret, key))
            : []
        );
  
        if (!cancelled) setDecryptedSecrets(secrets);
  
      } catch (err: any) {
        showToast({
          type: "error",
          message: `Error decrypting vault key: ${err?.message}`,
        });
      }
    };
  
    decryptVaultKey();
  
    return () => { cancelled = true; };
  }, [vaultKey, showToast, encryptedSecrets]);
  

  return {
    decryptedVaultKey,
    decryptedSecrets,
    // isLoading,
    // error,
    // vault,
    setDecryptedSecrets
  };
};
