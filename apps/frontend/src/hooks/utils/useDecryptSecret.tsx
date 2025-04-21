import { useState, useEffect } from "react";
import { decryptData } from "@/E2E/rsaKeyGen";
import { getPrivateKey } from "@/E2E/rsaKeyGen";
import  useToast  from "@/hooks/utils/useToast";

export const DecryptSecret = ({key, value}: { key: string; value: string }) => {
    
  const [decryptedKey, setDecryptedKey] = useState<string | null>(null);
    const [decryptedValue, setDecryptedValue] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const {showToast} = useToast();
  
    useEffect(() => {
      const fetchSecret = async () => {
        try {
          const privateKey = getPrivateKey(); 
          if(!privateKey){
            showToast({
              type: "error",
              message: "Please enter your private key to decrypt the secret"
            });
            return;
          }
          const decryptedKey = await decryptData(key, privateKey); // Decrypt key
          const decryptedValue = await decryptData(value, privateKey); // Decrypt value
         
          setDecryptedKey(decryptedKey);
          setDecryptedValue(decryptedValue);

        } catch (error: any) {
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
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [key, value]);
  
    return {
      decryptedKey,
      decryptedValue,
      loading,
      error,
    };
  };