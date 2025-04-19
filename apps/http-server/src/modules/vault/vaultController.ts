import { Request, Response } from 'express';
import prisma from '@secret-vault/db/client';
import { CustomRequest } from '../../middleware/auth';
import { sendInviteEmail } from '@secret-vault/backend-common/emailTemplates';
import { checkVaultAccess } from '../secret/secretController';
import { config } from '@secret-vault/backend-common/config';


export async function checkVaultOwnership(userId: string, vaultId: string): Promise<any> {
  const vault = await prisma.vault.findUnique({
    where: { id: vaultId },
  });

  if (!vault) throw new Error('Vault not found');
  if (vault.ownerId !== userId) throw new Error('Unauthorized access to this vault');

  return vault;
}


export async function createVault(req: CustomRequest, res: Response): Promise<any> {
  try {
    const { name, description, icon, encryptedVaultKeyBase64 } = req.body;
    const ownerId = req.user?.id;


    // 1. Create the vault
    const vault = await prisma.vault.create({
      data: {
        name,
        description,
        icon,
        ownerId: ownerId!,
        vaultKeys: {
          create: {
            userId: ownerId!,
            encryptedKey: encryptedVaultKeyBase64,
          },
        },
      },
      include: {
        vaultKeys: true, // Optional: if you want to return the key with the response
      },
    });


    res.status(201).json(vault);
  } catch (err: any) {
    res.status(500).json({ message: 'Failed to create vault', error: err.message });
  }
}


export async function updateVault(req: CustomRequest, res: Response): Promise<any> {
  try {
    const { name, description, icon } = req.body;
    const { vaultId } = req.params as { vaultId: string };
    const userId = req.user?.id;

    if (!userId) {
      res.status(401).json({ message: 'Unauthorized' });
      return;
    }

    const vault = await checkVaultOwnership(userId!, vaultId);

    if (!vault) {
      res.status(404).json({ message: 'Vault not found' });
      return;
    }

    const updatedVault = await prisma.vault.update({
      where: { id: vaultId },
      data: {
        name,
        description,
        icon,
      },
    });

    res.status(200).json({ vault: updatedVault });
  } catch (err: any) {
    res.status(500).json({ message: 'Failed to update vault', error: err.message });
  }
}


export async function deleteVault(req: CustomRequest, res: Response): Promise<any> {
  try {
    const { vaultId } = req.params as { vaultId: string };
    const userId = req.user?.id;

    if (!userId) {
      res.status(401).json({ message: 'Unauthorized' });
      return;
    }

    const vault = await checkVaultOwnership(userId!, vaultId);

    if (!vault) {
      res.status(404).json({ message: 'Vault not found' });
      return;
    }

    await prisma.vault.update({
      where: { id: vaultId },
      data: {
        isDeleted: true,
      },
    });

    res.status(200).json({ message: 'Vault deleted successfully' });
  } catch (err: any) {
    res.status(500).json({ message: 'Failed to delete vault', error: err.message });
  }
}


export async function getVault(req: CustomRequest, res: Response): Promise<any> {
  try {
    const vaultId = req.params.vaultId;
    const userId = req.user?.id;

    if (!vaultId) {
      res.status(400).json({ message: 'Vault ID is required' });
      return;
    }

    if (!userId) {
      res.status(401).json({ message: 'Unauthorized' });
      return;
    }

    const { isOwner, collaborator } = await checkVaultAccess(userId!, vaultId);

    if (!isOwner && !collaborator) {
      res.status(403).json({ message: 'You are not authorized to access this vault' });
      return;
    }



    const vault = await prisma.vault.findFirst({
      where: {
        id: vaultId, vaultKeys: {
          some: {
            userId,
          },
        },
        isDeleted: false,
      },
      include: {
        secrets: {
          where: {
            isDeleted: false,
          },
        },
        collaborators: {
          where: {
            userId
          },
          select: {
            canAdd: true,
            canDelete: true,
            canEdit: true,
            canView: true,
            hasSecretAccess: true,
          }
        }
      },
    });


    let updatedVault;
    if (vault?.ownerId !== userId) {
      updatedVault = {
        ...vault,
        permissions: {
          canAdd: vault?.collaborators[0]?.canAdd,
          canDelete: vault?.collaborators[0]?.canDelete,
          canEdit: vault?.collaborators[0]?.canEdit,
          canView: vault?.collaborators[0]?.canView,
        },
        collaborators: {
          hasSecretAccess: vault?.collaborators[0]?.hasSecretAccess,
        },
      }

      return res.status(200).json({
        vault: updatedVault,
        message: "Vault fetched successfully",
      });
    }


    res.status(200).json({
      vault: vault,
      message: "Vault fetched successfully",
    });

  } catch (err: any) {
    res.status(403).json({ message: 'Access denied', error: err.message });
  }
}


export async function getVaults(req: CustomRequest, res: Response): Promise<any> {
  try {
    const userId = req.user?.id;

    if (!userId) {
      res.status(401).json({ message: 'Unauthorized' });
      return;
    }


    const vaults = await prisma.vault.findMany({
      where: {
        ownerId: userId,
        isDeleted: false,
      },
      include: {
        collaborators: true,
      },
    });

    res.status(200).json({
      vaults: vaults,
      message: "Vaults fetched successfully",
    });

  } catch (err: any) {
    res.status(500).json({ message: 'Failed to get vaults', error: err.message });
  }
}


export async function sentInvite(req: CustomRequest, res: Response): Promise<any> {
  try {
    const { vaultId, email, canEdit, canDelete, canView, canAdd } = req.body;
    const userId = req.user?.id;

    const vault = await checkVaultOwnership(userId!, vaultId);

    if (!vault) {
      res.status(404).json({ message: 'You are not the owner of this vault' });
      return;
    }

    const user = await prisma.user.findUnique({
      where: {
        email,
      },
    });

    if (!user) {
      res.status(404).json({ message: `User with email ${email} not found` });
      return;
    }


    const existingInvite = await prisma.invite.findFirst({
      where: {
        inviteeEmail: email,
        vaultId,
      },
    });

    if (existingInvite) {
      //try after the reamiing time from 24 hours
      const remainingTime = new Date(existingInvite.expiresAt).getTime() - Date.now();
      const remainingTimeInHours = remainingTime / (1000 * 60 * 60);
      res.status(400).json({ message: `Invite already sent to this email, Try after ${remainingTimeInHours} hours ` });
      return;
    }


    const invite = await prisma.invite.create({
      data: {
        vaultId,
        inviterId: userId!,
        inviteeEmail: email,
        canEdit,
        canDelete,
        canView,
        canAdd,
        expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000), // 1 day from now
      },
    });

    const inviteLink = `${config.REACT_URL}/invites/${invite.id}`;
    await sendInviteEmail(email, userId!, vault, inviteLink);

    res.status(200).json({
      message: 'Invite sent successfully',
      invite,
    });

  } catch (err: any) {
    res.status(500).json({ message: 'Failed to send invite', error: err.message });
  }
}


export async function acceptInvite(req: CustomRequest, res: Response): Promise<any> {
  try {
    const { inviteId } = req.params;
    const userId = req.user?.id;

    if (!userId) {
      res.status(401).json({ message: 'Unauthorized' });
      return;
    }

    const invite = await prisma.invite.findUnique({
      where: {
        id: inviteId,
      },
    });

    if (!invite) {
      res.status(404).json({ message: 'Invite Not Found' });
      return;
    }

    if (invite.inviteeId === userId) {
      res.status(400).json({ message: 'You are already a member of this vault' });
      return;
    }

    if (invite.expiresAt < new Date()) {
      res.status(400).json({ message: 'Invite expired' });
      return;
    }

    if (invite.status !== 'PENDING') {
      res.status(400).json({ message: 'Invite already accepted' });
      return;
    }


    const vault = await prisma.vault.findUnique({
      where: {
        id: invite.vaultId,
      },
    });

    if (!vault) {
      res.status(404).json({ message: 'Vault not found or Deleted by Owner' });
      return;
    }

    const collaborator = await prisma.collaborator.create({
      data: {
        vaultId: invite.vaultId,
        userId: userId!,
        canEdit: invite.canEdit,
        canDelete: invite.canDelete,
        canView: invite.canView,
        canAdd: invite.canAdd,
      },
    });

    await prisma.invite.update({
      where: { id: inviteId },
      data: {
        status: 'ACCEPTED',
      },
    });

    res.status(200).json({
      message: 'Invite accepted successfully',
      collaborator,
    });

  } catch (err: any) {
    res.status(500).json({ message: 'Failed to accept invite', error: err.message });
  }
}


export async function getAllCollaborators(req: CustomRequest, res: Response): Promise<any> {
  try {
    const vaultId = req.params.vaultId as string;
    const userId = req.user?.id;

    const { isOwner, collaborator } = await checkVaultAccess(userId!, vaultId);

    if (!isOwner && !collaborator) {
      res.status(403).json({ message: 'You are not authorized to access this vault' });
      return;
    }

    const collaborators = await prisma.collaborator.findMany({
      where: { vaultId },
      include: {
        user: {
          select: {
            id: true,
            email: true,
            name: true,
            avatarUrl: true,
            publicKey: true,
          }
        },
      },
    });

    res.status(200).json({
      collaborators,
    });

  } catch (err: any) {
    res.status(500).json({ message: 'Failed to get collaborators', error: err.message });
  }
}


export async function getSharedWithMeVaults(req: CustomRequest, res: Response): Promise<any> {
  try {
    const userId = req.user?.id;

    const collaborators = await prisma.collaborator.findMany({
      where: {
        userId,
        vault: {
          isDeleted: false,
        },
      },
      include: {
        vault: true,
      },
    });


    if (collaborators.length === 0) {
      res.status(200).json({
        vaults: [],
      });
      return;
    }

    res.status(200).json({
      vaults: collaborators.map((collaborator) => collaborator.vault),
    });

  } catch (err: any) {
    res.status(500).json({ message: 'Failed to get shared with me vaults', error: err.message });
  }
}


export async function getVaultKey(req: CustomRequest, res: Response): Promise<any> {
  try {
    const vaultId = req.params.vaultId;
    const userId = req.user?.id;



    if (!vaultId) {
      res.status(400).json({ message: 'Vault ID is required' });
      return;
    }

    if (!userId) {
      res.status(401).json({ message: 'Unauthorized' });
      return;
    }

    const { isOwner, collaborator } = await checkVaultAccess(userId!, vaultId);

    if (!isOwner && !collaborator) {
      res.status(403).json({ message: 'You are not authorized to access this vault' });
      return;
    }

    const vaultKey = await prisma.vaultKey.findFirst({
      where: {
        vaultId,
        userId,
      },
    });

    if (!vaultKey) {
      res.status(404).json({ message: 'Vault key not found' });
      return;
    }

    res.status(200).json({
      vaultKey: vaultKey?.encryptedKey,
    });

  } catch (err: any) {
    res.status(500).json({ message: 'Failed to get vault key', error: err.message });
  }
}


export async function confirmAccess(req: CustomRequest, res: Response): Promise<any> {
  try {

    const userId = req.user?.id;

    if (!userId) {
      res.status(401).json({ message: 'Unauthorized' });
      return;
    }

    const vaultId = req.params.vaultId;
    const { encryptedVaultKeys } = req.body;

    if (!vaultId) {
      res.status(400).json({ message: 'Vault ID is required' });
      return;
    }

    const vault = await checkVaultOwnership(userId!, vaultId);

    if (!vault) {
      res.status(404).json({ message: 'You are not authorized to allow access to this vault' });
      return;
    }

    await prisma.vaultKey.createMany({
      data: encryptedVaultKeys,
      skipDuplicates: true,
    })

    await prisma.collaborator.updateMany({
      where: {
        vaultId,
      },
      data: {
        hasSecretAccess: true,
      }
    })



    return res.status(200).json({
      message: 'All the Users have access to secrets of this vault',
    });




  } catch (err: any) {
    res.status(500).json({ message: 'Failed to confirm access', error: err.message });
  }
}

export async function getVaultLogs(req: CustomRequest, res: Response): Promise<any> {
  try {
    const vaultId = req.params.vaultId;
    const userId = req.user?.id;
    const { limit, offset } = req.query;

    if (!vaultId) {
      res.status(400).json({ message: 'Vault ID is required' });
      return;
    }

    if (!userId) {
      res.status(401).json({ message: 'Unauthorized' });
      return;
    }

    const vault = await checkVaultAccess(userId!, vaultId);

    if (!vault) {
      res.status(404).json({ message: 'You are not authorized to access this vault' });
      return;
    }




    const logs = await prisma.auditLog.findMany({
      where: {
        vaultId,
      },
      orderBy: {
        createdAt: 'desc',
      },

      select: {
        id: true,
        action: true,
        description: true,
        createdAt: true,
        actor: {
          select: {
            name: true,
            email: true,
            avatarUrl: true,
          },
        },
      },
      take: limit ? parseInt(limit as string) : 20,
      skip: offset ? parseInt(offset as string) : 0,
    });

    res.status(200).json({
      logs,
      message: "Vault logs fetched successfully",
    });

  } catch (err: any) {
    res.status(500).json({ message: 'Failed to get vault logs', error: err.message });
  }
}



