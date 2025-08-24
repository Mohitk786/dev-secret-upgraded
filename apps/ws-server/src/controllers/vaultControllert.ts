import prisma from '@secret-vault/db/client';
import {  
    VaultDeletedData, 
    VaultKey, 
    VaultUpdatedData,
    VaultResponse,
    VaultOwnershipResponse,
    CollaboratorResponse
} from '../types/types';

async function checkVaultOwnership(userId: string, vaultId: string): Promise<VaultOwnershipResponse> {
    try {
        const vault = await prisma.vault.findUnique({
            where: { id: vaultId },
        });

        if (!vault) {
            return { success: false, message: 'Vault not found' };
        }
        
        if (vault.ownerId !== userId) {
            return { success: false, message: 'Unauthorized access to this vault' };
        }

        return { success: true, vault };
    } catch (error) {
        console.error("Error checking vault ownership:", error);
        return { success: false, message: 'Failed to check vault ownership' };
    }
}

export const updateVault = async (data: VaultUpdatedData, userId: string): Promise<VaultResponse> => {
    try {
        const { vaultId, name, description, icon } = data;

        if (!name || !vaultId) {
            return { success: false, message: 'Name and vaultId are required' };
        }

        const ownershipCheck = await checkVaultOwnership(userId, vaultId);
        if (!ownershipCheck.success) {
            return ownershipCheck;
        }

        const updated = await prisma.vault.update({
            where: { id: vaultId },
            data: { name, description, icon },
        });

        await prisma.auditLog.create({
            data: {
                vaultId,
                actorId: userId,
                action: 'vault_updated',
                description: `Vault name updated to ${name}`,
            },
        });

        return { success: true, vault: updated };
    } catch (error) {
        console.error("Error updating vault:", error);
        return { success: false, message: 'Failed to update vault' };
    }
}

export async function deleteVault(data: VaultDeletedData, userId: string): Promise<VaultResponse> {
    try {
        const { vaultId } = data;

        if (!userId) {
            return { success: false, message: 'Unauthorized' };
        }

        const ownershipCheck = await checkVaultOwnership(userId, vaultId);
        if (!ownershipCheck.success) {
            return ownershipCheck;
        }

        const vault = ownershipCheck.vault;

        await prisma.vault.update({
            where: { id: vaultId },
            data: {
                isDeleted: true,
            },
        });

        // Delete all collaborators
        await prisma.collaborator.deleteMany({
            where: {
                vaultId,
            },
        });

        // Remove all vault keys except the owner
        await prisma.vaultKey.deleteMany({
            where: {
                vaultId,
                userId: {
                    not: userId,
                },
            },
        });

        return { 
            success: true, 
            message: 'Vault deleted successfully',  
            vaultId 
        };
    } catch (error) {
        console.error("Error deleting vault:", error);
        return { success: false, message: 'Failed to delete vault' };
    }
}



export const allowAllCollaborators = async (userId: string, vaultId: string, collaborators: VaultKey[]): Promise<VaultResponse> => {
    try {
        const ownershipCheck = await checkVaultOwnership(userId, vaultId);
        if (!ownershipCheck.success) {
            return ownershipCheck;
        }
        
        const allowed = await prisma.vault.update({
            where: { id: vaultId },
            data:{
                vaultKeys: {
                    createMany: {
                        data: collaborators,
                    },
                },
            },
        });
        
        await prisma.auditLog.create({
            data: {
                vaultId,
                actorId: userId,
                action: 'all_collaborator_allowed',
                description: `All collaborators have been allowed to access the vault.`,
            },
        });

        return { success: true, vault: allowed };
    } catch (error) {
        console.error("Error allowing all collaborators:", error);
        return { success: false, message: 'Failed to allow all collaborators' };
    }
}

export const toggleCollaboratorAccess = async (userId: string, vaultId: string, collaboratorId: string): Promise<CollaboratorResponse> => {
    try {
        const ownershipCheck = await checkVaultOwnership(userId, vaultId);
        if (!ownershipCheck.success) {
            return ownershipCheck;
        }

        const collaborator = await prisma.collaborator.findUnique({
            where: {
                userId_vaultId: {
                    vaultId,
                    userId: collaboratorId,
                },
            },
        });
        
        if (!collaborator) {
            return { success: false, message: 'Collaborator not found' };
        }

        const updatedCollaborator = await prisma.collaborator.update({
            where: { id: collaborator.id },
            data: {
                hasSecretAccess: !collaborator.hasSecretAccess,
            },
            include: {
                user: {
                    select: {
                        name: true,
                    },
                },
            },
        });
        
        return {
            success: true,
            message: `Your access to this vault has been ${collaborator.hasSecretAccess ? 'Revoked' : 'Enabled'} by owner`, 
            updatedCollaborator
        };
    } catch (error) {
        console.error("Error toggling collaborator access:", error);
        return { success: false, message: 'Failed to toggle collaborator access' };
    }
}

export const removeCollaborator = async (userId: string, vaultId: string, collaboratorId: string): Promise<CollaboratorResponse> => {
    try {
        const ownershipCheck = await checkVaultOwnership(userId, vaultId);
        if (!ownershipCheck.success) {
            return ownershipCheck;
        }

        const collaborator = await prisma.collaborator.findUnique({
            where: {
                userId_vaultId: {
                    vaultId,
                    userId: collaboratorId,
                },
            },
            include: {
                user: {
                    select: {
                        name: true,
                    },
                },
            },
        });

        if (!collaborator) {
            return { success: false, message: 'Collaborator not found' };
        }

        await prisma.collaborator.delete({
            where: { id: collaborator.id, vaultId },
        });

        await prisma.vaultKey.delete({
            where: {        
                vaultId_userId: {
                    vaultId,
                    userId: collaborator.userId,
                },
            },
        });

        const collaboratorUser = await prisma.user.findUnique({
            where: { id: collaborator.userId },
            select: {
                name: true,
            },
        });

        if (!collaboratorUser) {
            return { success: false, message: 'Collaborator user not found' };
        }

        await prisma.auditLog.create({
            data: {
                vaultId,
                actorId: userId,
                action: 'collaborator_removed',
                description: `Collaborator ${collaboratorUser?.name} has been removed from the vault.`,
            },  
        });

        return {
            success: true,
            message: `Collaborator ${collaboratorUser?.name} has been removed from the vault.`, 
            collaborator: collaborator
        };
    } catch (error) {
        console.error("Error removing collaborator:", error);
        return { success: false, message: 'Failed to remove collaborator' };
    }
}   