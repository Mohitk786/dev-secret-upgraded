import prisma from '@secret-vault/db/client';
import {  VaultDeletedData, VaultKey, VaultUpdatedData } from '../types/types';

async function checkVaultOwnership(userId: string, vaultId: string) {
    const vault = await prisma.vault.findUnique({
        where: { id: vaultId },
    });

    if (!vault) throw new Error('Vault not found');
    if (vault.ownerId !== userId) throw new Error('Unauthorized access to this vault');

    return vault;
}

export const updateVault = async (data: VaultUpdatedData, userId: string) => {

    try {
        const { vaultId, name, description, icon } = data;

        if (!name || !vaultId) throw new Error('Name and vaultId are required');

        await checkVaultOwnership(userId, vaultId);
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

        return updated;

    } catch (error) {
        console.error(error);
        throw new Error('Failed to update vault');
    }
}


export async function deleteVault(data: VaultDeletedData, userId: string) {
    try {
      const { vaultId } = data;
  
      if (!userId) {
        throw new Error('Unauthorized');
      }
  
      const vault = await checkVaultOwnership(userId!, vaultId);
  
      if (!vault) {
        throw new Error('Vault not found');
      }
  
      await prisma.vault.update({
        where: { id: vaultId },
        data: {
          isDeleted: true,
        },
      });

     //delete all collaborators
     await prisma.collaborator.deleteMany({
        where: {
            vaultId,
        },
     });

      //remove all vault keys except the owner
      await prisma.vaultKey.deleteMany({
        where: {
            vaultId,
            userId: {
                not: userId,
            },
        },
      });

      return { message: 'Vault deleted successfully',  vaultId, };

    } catch (err: any) {
        console.error(err);
        throw new Error('Failed to delete vault');
    }
  }

export const revokeCollaboratorAccess = async (userId: string, vaultId: string, collaboratorId: string) => {
    try {

        const vault = await checkVaultOwnership(userId, vaultId);
        if (!vault) {
            throw new Error('Vault not found');
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
            throw new Error('Collaborator not found');
        }

        await prisma.collaborator.delete({
            where: {
                userId_vaultId: {
                    vaultId,
                    userId: collaboratorId,
                },
            },
        });


        await prisma.auditLog.create({
            data: {
                vaultId,
                actorId: userId,
                action: 'collaborator_revoked',
                description: `Collaborator ${collaboratorId} access has been revoked.`,
            },
        });

        return true;

    } catch (error) {
        console.error(error);
        throw new Error('Failed to revoke collaborator access');
    }
}

export const allowAllCollaborators = async (userId: string, vaultId: string, collaborators: VaultKey[]) => {
    try {
        const vault = await checkVaultOwnership(userId, vaultId);
        if (!vault) {
            throw new Error('You are not the owner of this vault');
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

        return allowed;

    } catch (error) {
        console.error(error);
        throw new Error('Failed to allow all collaborators');
    }
}

export const toggleCollaboratorAccess = async (userId: string, vaultId: string, collaboratorId: string) => {
    try {
        const vault = await checkVaultOwnership(userId, vaultId);
        if (!vault) {
            throw new Error('You are not the owner of this vault');
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
            throw new Error('Collaborator not found');
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
        return {message: `Your access to this vault has been ${collaborator.hasSecretAccess ? 'Revoked' : 'Enabled'}. by owner`, updatedCollaborator};

    } catch (error:any) {
        console.error(error);
        return {message: error?.message}
    }
}

export const removeCollaborator = async (userId: string, vaultId: string, collaboratorId: string) => {
    try {
        const vault = await checkVaultOwnership(userId, vaultId);
        if (!vault) {
            throw new Error('You are not the owner of this vault');
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
            throw new Error('Collaborator not found');
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
            throw new Error('Collaborator user not found');
        }

        await prisma.auditLog.create({
            data: {
                vaultId,
                actorId: userId,
                action: 'collaborator_removed',
                description: `Collaborator ${collaboratorUser?.name} has been removed from the vault.`,
            },  
        });

        return {message: `Collaborator ${collaboratorUser?.name} has been removed from the vault.`, collaborator: collaborator};

    } catch (error:any) {
        console.error(error);
        throw new Error('Failed to remove collaborator');
    }
}   