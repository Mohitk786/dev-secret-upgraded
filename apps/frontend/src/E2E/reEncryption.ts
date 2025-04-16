import { encryptData } from "./rsaKeyGen";

export const reEncryptData = async (decyptedSecrets: any, data: any) => {

    const encryptedSecretsByCollaborator: Record<string, { key: string, value: string, secretId: string }[]> = {};

    for (const collaborator of data) {
      const encryptedSecrets = await Promise.all(
        decyptedSecrets.length > 0 && decyptedSecrets.map(async (secret: any) => {
          const encryptedKey = await encryptData(secret.key, collaborator.user.publicKey);
          const encryptedValue = await encryptData(secret.value, collaborator.user.publicKey);
          return { key: encryptedKey, value: encryptedValue, secretId: secret.id };
        })
      );
      encryptedSecretsByCollaborator[collaborator.userId] = encryptedSecrets;
    }

    const finalData = Object.entries(encryptedSecretsByCollaborator).flatMap(([userId, secrets]) => {
      return secrets.map(secret => ({
        userId,
        key: secret.key,
        value: secret.value,
        secretId: secret.secretId
      }));
    });

    return finalData;
}