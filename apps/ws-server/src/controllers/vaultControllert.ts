import prisma from '@secret-vault/db/client';
import { AcceptInviteData, InviteCollaboratorData, VaultDeletedData, VaultUpdatedData } from '../types/types';
import { config } from '@secret-vault/backend-common/config';
import { sendAcceptanceEmail, sendInviteEmail } from '@secret-vault/backend-common/emailTemplates';

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


export const deleteVault = async (data: VaultDeletedData, userId: string) => {
    try {

        const { vaultId } = data;
        if (!vaultId) {
            throw new Error('Vault ID is required');
        }

        await checkVaultOwnership(userId, vaultId);
        await prisma.vault.delete({ where: { id: vaultId } });

        await prisma.auditLog.create({
            data: {
                vaultId,
                actorId: userId,
                action: 'vault_deleted',
                description: 'Vault was deleted by owner',
            },
        });
        return { message: 'Vault deleted successfully' };

    } catch (error) {
        console.error(error);
        throw new Error('Failed to delete vault');
    }
}

export const inviteCollaborator = async (data: InviteCollaboratorData, userId: string) => {
    try {
        const { email, vaultId, canView, canEdit, canDelete, canAdd } = data;
        const inviterId = userId;

        if (!email || !vaultId) {
            throw new Error('Email and Vault ID are required');
        }

        const receiver = await prisma.user.findUnique({
            where: { email }
        });

        if (!receiver) {
            throw new Error('Receiver not found');
        }

        const vault = await checkVaultOwnership(inviterId, vaultId);

        const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000);
        const invite = await prisma.invite.create({
            data: {
                vaultId,
                inviterId,
                inviteeEmail: email,
                status: 'PENDING',
                expiresAt,
                canEdit: canEdit as boolean,
                canDelete: canDelete as boolean,
                canView: canView as boolean,
                canAdd: canAdd as boolean,
            },
        });

        const inviteLink = `${config.REACT_URL}/invites/${invite.id}`;
        await sendInviteEmail(email, inviterId, vault, inviteLink);

        await prisma.auditLog.create({
            data: {
                vaultId,
                actorId: inviterId,
                action: 'invite_sent',
                description: `Invitation sent to ${email}`,
            },
        });

        return { message: 'Invitation sent successfully', invite, receiver };

    } catch (error) {
        console.error(error);
        throw new Error('Failed to invite collaborator');
    }
}

export const acceptInvite = async (data: AcceptInviteData, userId: string) => {
    try {
        const { inviteId } = data;

        const invite = await prisma.invite.findUnique({
            where: { id: inviteId }
        });

        if (!invite) {
            throw new Error('Invite not found or Expired');
        }

        if (invite.inviteeEmail !== userId) {
            throw new Error('Unauthorized to accept this invite');
        }

        if (invite.status !== "PENDING") {
            throw new Error('Invite is not pending');
        }

        if (invite.expiresAt < new Date()) {
            throw new Error('Invite has expired');
        }

        if (invite.inviteeId !== userId) {
            throw new Error('Unauthorized to accept this invite');
        }

        if (invite.inviteeId === userId) {
            throw new Error('You are already a collaborator');
        }

        await prisma.collaborator.create({
            data: {
                vaultId: invite.vaultId,
                userId: invite.inviteeId,
                canEdit: invite.canEdit,
                canDelete: invite.canDelete,
                canView: invite.canView,
                canAdd: invite.canAdd,
            },
        });

        const updatedInvite = await prisma.invite.update({
            where: { id: inviteId },
            data: { status: 'ACCEPTED' }
        });

        const inviter = await prisma.user.findUnique({
            where: { id: invite.inviterId }
        });

        if (inviter) {
            const vault = await prisma.vault.findUnique({
                where: { id: invite.vaultId }
            });

            const inviteLink = `${config.REACT_URL}/invites/${invite.id}`
            await sendAcceptanceEmail(inviter, vault, inviteLink);
        }

        return { message: 'Invite accepted successfully', updatedInvite };


    } catch (error) {
        console.error(error);
        throw new Error('Failed to accept invite');
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