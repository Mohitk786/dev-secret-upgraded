import { Secret } from "@/types/types";
import { getPublicKey } from "./rsaKeyGen";
import { getVaultKey } from "@/services/vaultServices";
import { decryptVaultKeyWithPrivateKey } from "./decryption";

export const generateVaultKey = async () => {
  return await crypto.subtle.generateKey(
    { name: "AES-GCM", length: 256 },
    true,
    ["encrypt", "decrypt"]
  );
};

export const encryptSecret = async (secret: Secret, vaultId: string) => {


  const vaultKey = await getVaultKey(vaultId);
  console.log("vaultKey", vaultKey);
  const decryptedVaultKey = await decryptVaultKeyWithPrivateKey(vaultKey);

  console.log("decryptedVaultKey", decryptedVaultKey);

  if(!decryptedVaultKey) {
    throw new Error("Vault key not found");
  }
  
 const secretDataToEncrypt = JSON.stringify(secret)


  const iv = crypto.getRandomValues(new Uint8Array(12));
  const encoded = new TextEncoder().encode(secretDataToEncrypt);
  const encrypted = await crypto.subtle.encrypt(
    { name: "AES-GCM", iv },
    decryptedVaultKey,
    encoded
  );

  const combined = new Uint8Array(iv.byteLength + encrypted.byteLength);
  combined.set(iv, 0);
  combined.set(new Uint8Array(encrypted), iv.byteLength);

  const encryptedSecretBase64 = btoa(String.fromCharCode(...combined));
  return encryptedSecretBase64;
};

export const encryptVaultKeyWithRSA = async () => {

  const publicKeyBase64 =await getPublicKey();


  if(!publicKeyBase64) {
    throw new Error("Public key not found");
  }

  const vaultKey = await generateVaultKey();

  const rawKey = await crypto.subtle.exportKey("raw", vaultKey);
  const rsaKeyBuffer = Uint8Array.from(atob(publicKeyBase64), c => c.charCodeAt(0)).buffer;

  const rsaKey = await crypto.subtle.importKey(
    "spki",
    rsaKeyBuffer,
    { name: "RSA-OAEP", hash: "SHA-256" },
    true,
    ["encrypt"]
  );

  const encryptedVaultKey = await crypto.subtle.encrypt(
    { name: "RSA-OAEP" },
    rsaKey,
    rawKey
  );

 return  btoa(String.fromCharCode(...new Uint8Array(encryptedVaultKey)));
};



