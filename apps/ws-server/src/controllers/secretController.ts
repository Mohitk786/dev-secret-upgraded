import { Response } from "express";
import prisma from "@secret-vault/db/client";
import { CreateSecretData, DeleteSecretData, GetSecretsData, UpdateSecretData } from "../types/types";


async function checkVaultAccess(userId: string, vaultId: string) {

    const vault = await prisma.vault.findUnique({ where: { id: vaultId } });

    if (!vault) throw new Error("Vault not found");
    if (vault.ownerId === userId) return { isOwner: true };

    const collaborator = await prisma.collaborator.findFirst({
        where: { userId, vaultId },
    });

    if (!collaborator) throw new Error("Access denied");
    return { isOwner: false, collaborator };
}

export const createSecret = async (data: CreateSecretData, userId: string) => {
    try {
        if (!data.key || !data.value || !data.environment || !data.type || !data.vaultId)
            throw new Error("Missing required fields")

        const { isOwner, collaborator } = await checkVaultAccess(userId, data.vaultId)

        if (!isOwner && !collaborator?.canAdd)
            throw new Error("Access denied")

        const secret = await prisma.secret.create({
            data: {
                key: data.key,
                value: data.value,
                environment: data.environment,
                type: data.type,
                vaultId: data.vaultId,
                createdById: userId,
            }
        })

        await prisma.auditLog.create({
            data: {
                vaultId: data.vaultId,
                actorId: userId,
                action: "secret_created",
                description: `Secret created with key ${data.key}`,
            },
        });

        return secret

    } catch (error) {
        console.error(error)
        throw new Error("Failed to create secret")
    }
}


export const getSecrets = async (data: GetSecretsData, userId: string) => {
    try {
        const { isOwner, collaborator } = await checkVaultAccess(userId, data.vaultId)
        if (!isOwner && !collaborator)
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

        const { isOwner, collaborator } = await checkVaultAccess(userId, secret.vaultId);

        if (!isOwner && !collaborator?.canDelete)
            throw new Error("Access denied")

        await prisma.secret.delete({ where: { id: secretId } });

        await prisma.auditLog.create({
            data: {
                vaultId: secret.vaultId,
                actorId: userId,
                action: "secret_deleted",
                description: `Secret ${secret.key} deleted by ${userId}`,
            },
        });

        return { message: "Secret deleted" };

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

        const { isOwner, collaborator } = await checkVaultAccess(userId, secret.vaultId);

        if (!isOwner && !collaborator?.canEdit)
            throw new Error("Access denied")

        const updated = await prisma.secret.update({
            where: { id: secretId },
            data: { key: data.key, value: data.value, environment: data.environment, type: data.type },
        });

        await prisma.auditLog.create({
            data: {
                vaultId: secret.vaultId,
                actorId: userId,
                action: "secret_updated",
                description: `Secret ${secret.key} updated`,
            },
        });

        return updated

    } catch (error) {
        console.error(error)
        throw new Error("Failed to update secret")
    }
}