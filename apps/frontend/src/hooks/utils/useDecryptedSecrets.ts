import React, { useEffect, useState } from "react";
import { decryptVaultKeyWithPrivateKey } from "@/E2E/decryption";
import { Secret, } from "@/types/types";
import { useGetVaultKeyQuery } from "@/hooks/queries/useCollabQuery";
import useToast from "@/hooks/utils/useToast";
import { DecryptSecret } from "@/E2E/decryption";

export const useDecryptedSecrets = (
  vaultId: string,
  encryptedSecrets: Secret[]
) => {
  const { showToast } = useToast();
  const { data: vaultKey } = useGetVaultKeyQuery(vaultId);
  const [decryptedVaultKey, setDecryptedVaultKey] = useState<CryptoKey | null>(null);
  const [decryptedSecrets, setDecryptedSecrets] = useState<Secret[]>([]);
  
  const memoizedEncryptedSecrets = React.useMemo(
    () => encryptedSecrets ?? [],
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );


  useEffect(() => {
    if (!vaultKey) return;
  
    const decryptVaultKey = async () => {
      try {
        const key = await decryptVaultKeyWithPrivateKey(vaultKey);
  
        setDecryptedVaultKey(key);
  
        const secrets = await Promise.all(
          memoizedEncryptedSecrets.length > 0
            ? memoizedEncryptedSecrets.map(secret => DecryptSecret(secret, key))
            : []
        );
  
        console.log("decrypted secrets in hook", secrets)

          setDecryptedSecrets(prev => {
            if (JSON.stringify(prev) === JSON.stringify(secrets)) {
              return prev; 
            }
            return secrets;
          });
  
      } catch (err: any) {
        showToast({
          type: "error",
          message: `Error decrypting vault key: ${err?.message}`,
        });
      }
    };
  
    decryptVaultKey();
  
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [vaultKey, memoizedEncryptedSecrets]); 
  

  return {
    decryptedVaultKey,
    decryptedSecrets,
    // isLoading,
    // error,
    vaultKey,
    setDecryptedSecrets
  };
};
