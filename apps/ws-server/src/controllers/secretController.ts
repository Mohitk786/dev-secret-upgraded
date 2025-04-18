import { Response } from "express";
import prisma from "@secret-vault/db/client";
import { CreateSecretData, DeleteSecretData, GetSecretsData, UpdateSecretData } from "../types/types";


async function checkVaultAccess(userId: string, vaultId: string) {

    const vault = await prisma.vault.findUnique({
        where: { id: vaultId }, include: {
            owner: true
        }
    });

    if (!vault) throw new Error("Vault not found");
    if (vault.ownerId === userId) return { owner: vault.owner };

    const collaborator = await prisma.collaborator.findFirst({
        where: { userId, vaultId },
        include: {
            user: true
        }
    });

    if (!collaborator) throw new Error("Access denied");
    return { owner: null, collaborator: collaborator };
}

export const createSecret = async (data: CreateSecretData, userId: string) => {
    try {
        if (!data.encryptedSecret || !data.vaultId)
            throw new Error("Missing required fields")

        const { owner, collaborator } = await checkVaultAccess(userId, data.vaultId)

        if (!owner && !collaborator?.canAdd)
            throw new Error("Access denied")

        const secret = await prisma.secret.create({
            data: {
                encryptedSecret: data.encryptedSecret,
                vaultId: data.vaultId,
                createdById: userId,
            }
        })

        await prisma.auditLog.create({
            data: {
                vaultId: data.vaultId,
                actorId: userId,
                action: "secret_created",
                description: `${owner?.name || collaborator?.user?.name} created a secret`,
            },
        });

        return { message: `${owner?.name || collaborator?.user?.name} created a secret`, secret };

    } catch (error) {
        console.error(error)
        throw new Error("Failed to create secret")
    }
}


export const getSecrets = async (data: GetSecretsData, userId: string) => {
    try {
        const { owner, collaborator } = await checkVaultAccess(userId, data.vaultId)
        if (!owner && !collaborator)
            throw new Error("Access denied")

        const secrets = await prisma.secret.findMany({
            where: { vaultId: data.vaultId }
        })
        return secrets

    } catch (error) {
        console.error(error)
        throw new Error("Failed to get secrets")
    }
}


export const deleteSecret = async (data: DeleteSecretData, userId: string) => {
    try {
        const secretId = data.secretId

        const secret = await prisma.secret.findUnique({ where: { id: secretId } });
        if (!secret) throw new Error("Secret not found")

        const { owner, collaborator } = await checkVaultAccess(userId, secret.vaultId);

        if (!owner && !collaborator?.canDelete)
            throw new Error("Access denied")



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

        return { message: `${owner?.name || collaborator?.user?.name} deleted a secret` , secretId };

    } catch (error) {
        console.error(error)
        throw new Error("Failed to delete secret")
    }
}


export const updateSecret = async (data: UpdateSecretData, userId: string) => {
    try {
        const secretId = data.secretId

        const secret = await prisma.secret.findUnique({ where: { id: secretId } });
        if (!secret) throw new Error("Secret not found")

        const { owner, collaborator } = await checkVaultAccess(userId, secret.vaultId);

        if (!owner && !collaborator?.canEdit)
            throw new Error("Access denied")

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

        return { message: `${owner?.name || collaborator?.user?.name} updated a Secret`, encryptedSecret: updated };

    } catch (error) {
        console.error(error)
        throw new Error("Failed to update secret")
    }
}