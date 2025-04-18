
export const generateRSAKeyPair = async () => {
    const keyPair = await window.crypto.subtle.generateKey(
        {
            name: "RSA-OAEP",
            modulusLength: 2048,
            publicExponent: new Uint8Array([1, 0, 1]),
            hash: "SHA-256",
        },
        true,
        ["encrypt", "decrypt"]
    );

    // 2. Export Public & Private Keys
    const publicKey = await crypto.subtle.exportKey("spki", keyPair.publicKey);
    const privateKey = await crypto.subtle.exportKey("pkcs8", keyPair.privateKey);

    // 3. Convert to base64
    const pubKeyBase64 = btoa(String.fromCharCode(...new Uint8Array(publicKey)));
    const privKeyBase64 = btoa(String.fromCharCode(...new Uint8Array(privateKey)));

    // 4. Save Private Key to LocalStorage
    localStorage.setItem("PRIVATE_KEY", privKeyBase64);

    // 5. Download Private Key as file
    const blob = new Blob([privKeyBase64], { type: "text/plain" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "vault-private-key.txt";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    return pubKeyBase64
}

export const encryptData = async (data: string, publicKeyBase64: string) => {
    const binaryDer = Uint8Array.from(atob(publicKeyBase64), char => char.charCodeAt(0));
    const publicKey = await crypto.subtle.importKey(
        "spki",
        binaryDer.buffer,
        { name: "RSA-OAEP", hash: "SHA-256" },
        true,
        ["encrypt"]
    );

    const encrypted = await crypto.subtle.encrypt(
        { name: "RSA-OAEP" },
        publicKey,
        new TextEncoder().encode(data)
    );

    return btoa(String.fromCharCode(...new Uint8Array(encrypted)));
};


export const decryptData = async (encryptedBase64: string, privateKeyBase64: string) => {
    const binaryDer = Uint8Array.from(atob(privateKeyBase64), char => char.charCodeAt(0));
    const privateKey = await crypto.subtle.importKey(
        "pkcs8",
        binaryDer.buffer,
        { name: "RSA-OAEP", hash: "SHA-256" },
        true,
        ["decrypt"]
    );

    const decrypted = await crypto.subtle.decrypt(
        { name: "RSA-OAEP" },
        privateKey,
        Uint8Array.from(atob(encryptedBase64), c => c.charCodeAt(0))
    );

    return new TextDecoder().decode(decrypted);
};


export const getPrivateKey = () => {
    return localStorage.getItem("PRIVATE_KEY");
}


export const isValidPrivateKey =  async (keyText: string) => {
    try {
      const keyData = keyText
        .replace("-----BEGIN PRIVATE KEY-----", "")
        .replace("-----END PRIVATE KEY-----", "")
        .replace(/\s/g, "");
  
      const binaryDer = Uint8Array.from(atob(keyData), (c) => c.charCodeAt(0));
  
      await window.crypto.subtle.importKey(
        "pkcs8", 
        binaryDer.buffer,
        {
          name: "RSA-OAEP",
          hash: "SHA-256",
        },
        false,
        ["decrypt"]
      );
  
      return true;
    } catch (err) {
      console.error("Invalid private key:", err);
      return false;
    }
  };
  

export const getPublicKey = () => {
    const publicKey = localStorage.getItem("PUBLIC_KEY") ;
    if (!publicKey) {
        throw new Error("Public key not found");
    }
    return publicKey;
}