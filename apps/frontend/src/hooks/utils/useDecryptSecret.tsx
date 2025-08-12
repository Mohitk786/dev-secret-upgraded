import { useState, useEffect } from "react";
import { decryptData, getPrivateKey } from "@/E2E/rsaKeyGen";
import useToast from "@/hooks/utils/useToast";

export const useDecryptSecret = (key: string, value: string) => {
  const [decryptedKey, setDecryptedKey] = useState<string | null>(null);
  const [decryptedValue, setDecryptedValue] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const { showToast } = useToast();

  useEffect(() => {
    const fetchSecret = async () => {
      try {
        const privateKey = getPrivateKey();
        if (!privateKey) {
          showToast({
            type: "error",
            message: "Please enter your private key to decrypt the secret",
          });
          return;
        }
        const dKey = await decryptData(key, privateKey);
        const dValue = await decryptData(value, privateKey);

        setDecryptedKey(dKey);
        setDecryptedValue(dValue);
      } catch {
        setError("Failed to decrypt the secret");
        showToast({
          type: "error",
          message: "Failed to decrypt the secret",
        });
      } finally {
        setLoading(false);
      }
    };

    if (key && value) {
      fetchSecret();
    }
  }, [key, showToast, value]);

  return { decryptedKey, decryptedValue, loading, error };
};
