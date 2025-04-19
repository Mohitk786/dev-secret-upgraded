import { Collaborator } from "@/types/types";
import { getVaultKey } from "@/services/vaultServices";
import { encryptVaultKeyWithRSA } from "../encryption";

import { decryptVaultKeyWithPrivateKey } from "../decryption";

export const accessToAll = async (vaultId: string, collaborators: Collaborator[]) => {
    const vaultKey = await getVaultKey(vaultId);
    const decryptedVaultKey = await decryptVaultKeyWithPrivateKey(vaultKey);

    //vault key is encrypted by the publick key of all the collaborators
    const finalData = await Promise.all(collaborators.map(async (collaborator)=>{
        const encryptedVaultKey = await encryptVaultKeyWithRSA(collaborator.user?.publicKey, decryptedVaultKey);
        return {
            userId: collaborator.userId,
            encryptedKey: encryptedVaultKey,
            vaultId: vaultId,
        }   
    }))

    
    return finalData;
}                   