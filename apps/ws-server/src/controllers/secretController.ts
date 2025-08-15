import prisma from "@secret-vault/db/client";
import { 
    CreateSecretData, 
    DeleteSecretData, 
    GetSecretsData, 
    UpdateSecretData,
    VaultAccessResponse,
    SecretResponse,
    SecretsResponse
} from "../types/types";

export async function checkVaultAccess(userId: string, vaultId: string): Promise<VaultAccessResponse> {
    try {
        const vault = await prisma.vault.findUnique({
            where: { id: vaultId }, 
            include: {
                owner: true
            }
        });

        if (!vault) {
            return { success: false, message: "Vault not found" };
        }
        
        if (vault.ownerId === userId) {
            return { success: true, owner: vault.owner, collaborator: null };
        }

        const collaborator = await prisma.collaborator.findFirst({
            where: { userId, vaultId },
            include: {
                user: true
            }
        });

        if (!collaborator) {
            return { success: false, message: "Access denied" };
        }
        
        return { success: true, owner: null, collaborator: collaborator };
    } catch (error) {
        console.error("Error checking vault access:", error);
        return { success: false, message: "Failed to check vault access" };
    }
}

export const createSecret = async (data: CreateSecretData, userId: string): Promise<SecretResponse> => {
    try {
        if (!data.encryptedSecret || !data.vaultId) {
            return { success: false, message: "Missing required fields" };
        }

        const accessCheck = await checkVaultAccess(userId, data.vaultId);
        if (!accessCheck.success) {
            return accessCheck;
        }

        const { owner, collaborator } = accessCheck;

        if (!owner && !collaborator?.canAdd) {
            return { success: false, message: "Access denied" };
        }

        const secret = await prisma.secret.create({
            data: {
                encryptedSecret: data.encryptedSecret,
                vaultId: data.vaultId,
                createdById: userId,
            }
        });

        await prisma.auditLog.create({
            data: {
                vaultId: data.vaultId,
                actorId: userId,
                action: "secret_created",
                description: `${owner?.name || collaborator?.user?.name} Encrypted & Saved a secret 🔒`,
            },
        });

        return { 
            success: true, 
            message: `${owner?.name || collaborator?.user?.name} Encrypted & Saved a secret 🔒`, 
            secret 
        };

    } catch (error) {
        console.error("Error creating secret:", error);
        return { success: false, message: "Failed to create secret" };
    }
}

export const getSecrets = async (data: GetSecretsData, userId: string): Promise<SecretsResponse> => {
    try {
        const accessCheck = await checkVaultAccess(userId, data.vaultId);
        if (!accessCheck.success) {
            return accessCheck;
        }

        const { owner, collaborator } = accessCheck;
        if (!owner && !collaborator) {
            return { success: false, message: "Access denied" };
        }

        const secrets = await prisma.secret.findMany({
            where: { vaultId: data.vaultId }
        });
        
        return { success: true, secrets };

    } catch (error) {
        console.error("Error getting secrets:", error);
        return { success: false, message: "Failed to get secrets" };
    }
}

export const deleteSecret = async (data: DeleteSecretData, userId: string): Promise<SecretResponse> => {
    try {
        const secretId = data.secretId;

        const secret = await prisma.secret.findUnique({ where: { id: secretId } });
        if (!secret) {
            return { success: false, message: "Secret not found" };
        }

        const accessCheck = await checkVaultAccess(userId, secret.vaultId);
        if (!accessCheck.success) {
            return accessCheck;
        }

        const { owner, collaborator } = accessCheck;

        if (!owner && !collaborator?.canDelete) {
            return { success: false, message: "Access denied" };
        }

        await prisma.secret.update({
            where: { id: secretId },
            data: { isDeleted: true, deletedAt: new Date() },
        });

        await prisma.auditLog.create({
            data: {
                vaultId: secret.vaultId,
                actorId: userId,
                action: "secret_deleted",
                description: `${owner?.name || collaborator?.user?.name} deleted a secret`,
            },
        });

        return { 
            success: true, 
            message: `${owner?.name || collaborator?.user?.name} deleted a secret`, 
            secretId 
        };

    } catch (error) {
        console.error("Error deleting secret:", error);
        return { success: false, message: "Failed to delete secret" };
    }
}

export const updateSecret = async (data: UpdateSecretData, userId: string): Promise<SecretResponse> => {
    try {
        const secretId = data.secretId;

        const secret = await prisma.secret.findUnique({ where: { id: secretId } });
        if (!secret) {
            return { success: false, message: "Secret not found" };
        }

        const accessCheck = await checkVaultAccess(userId, secret.vaultId);
        if (!accessCheck.success) {
            return accessCheck;
        }

        const { owner, collaborator } = accessCheck;

        if (!owner && !collaborator?.canEdit) {
            return { success: false, message: "Access denied" };
        }

        const updated = await prisma.secret.update({
            where: { id: secretId },
            data: { encryptedSecret: data.encryptedSecret },
        });

        await prisma.auditLog.create({
            data: {
                vaultId: secret.vaultId,
                actorId: userId,
                action: "secret_updated",
                description: `${owner?.name || collaborator?.user?.name} updated a secret`,
            },
        });

        return { 
            success: true, 
            message: `${owner?.name || collaborator?.user?.name} updated a Secret`, 
            encryptedSecret: updated 
        };

    } catch (error) {
        console.error("Error updating secret:", error);
        return { success: false, message: "Failed to update secret" };
    }
}