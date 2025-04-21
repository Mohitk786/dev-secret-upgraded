import { Response } from "express";
import { CustomRequest } from "../../middleware/auth";
import prisma from "@secret-vault/db/client";


export const dashboardStats = async (req: CustomRequest, res: Response): Promise<any> => {
    try {
        const userId = req.user?.id;
        if (!userId) {
            return res.status(401).json({ message: "Unauthorized" });
        }

        const vaultCount = await prisma.vault.count({
            where: {
                ownerId: userId
            }
        })

        const secretsCount = await prisma.secret.count({
            where: {
                vault: {

                }
            }
        })

        const vaults = await prisma.vault.findMany({
            where: {
                ownerId: userId
            },
            include: {
                _count: {
                    select: {
                        secrets: true,
                    },
                }
            },
            take: 4
        })

        const allVaults = await prisma.vault.findMany({
            where: {
                ownerId: userId
            },
            include: {
                collaborators: {
                    select: {
                        user: true
                    }
                }
            }
        })

        const allCollaborators = allVaults.flatMap(vault =>
            vault.collaborators.map(c => c.user)
        );

        // Remove duplicates by user id
        const uniqueCollaborators = Array.from(
            new Map(allCollaborators.map(user => [user.id, user])).values()
        );

        const data = {
            vaultCount,
            collaboratorCount: uniqueCollaborators.length,
            secretsCount,
            vaults
        }

        return res.status(200).json(data);

    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Internal Server Error" });
    }
}