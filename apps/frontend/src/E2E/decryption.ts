import { getPrivateKey, getPublicKey } from "./rsaKeyGen";

export const decryptVaultKeyWithPrivateKey = async (encryptedBase64: string) => {
   
  const privateKeyBase64 =await getPrivateKey()

    if (!privateKeyBase64) throw new Error("Private key missing!");
    const encrypted = Uint8Array.from(atob(encryptedBase64), c => c.charCodeAt(0));
    const privKeyBuffer = Uint8Array.from(atob(privateKeyBase64), c => c.charCodeAt(0)).buffer;
  
    const privateKey = await crypto.subtle.importKey(
      "pkcs8",
      privKeyBuffer,
      { name: "RSA-OAEP", hash: "SHA-256" },
      true,
      ["decrypt"]
    );
  
    const decryptedVaultKeyBuffer = await crypto.subtle.decrypt(
      { name: "RSA-OAEP" },
      privateKey,
      encrypted
    );
  
    return await crypto.subtle.importKey(
      "raw",
      decryptedVaultKeyBuffer,
      { name: "AES-GCM" },
      true,
      ["encrypt", "decrypt"]
    );
  };


export const decryptSecret = async (encryptedBase64: string, vaultKey: CryptoKey) => {
  const data = Uint8Array.from(atob(encryptedBase64), c => c.charCodeAt(0));
  const iv = data.slice(0, 12);
  const encrypted = data.slice(12);

  const decrypted = await crypto.subtle.decrypt(
    { name: "AES-GCM", iv },
    vaultKey,
    encrypted
  );

  return JSON.parse(new TextDecoder().decode(decrypted));
};
  
  