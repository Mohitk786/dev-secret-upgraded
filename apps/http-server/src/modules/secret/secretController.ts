import { Response } from "express";
import prisma from "@secret-vault/db/client";
import { CustomRequest } from "../../middleware/auth";
export
  async function checkVaultAccess(userId: string, vaultId: string) {
  const vault = await prisma.vault.findUnique({ where: { id: vaultId } });
  if (!vault) throw new Error("Vault not found");
  if (vault.ownerId === userId) return { isOwner: true };
  const collaborator = await prisma.collaborator.findFirst({
    where: { userId, vaultId },
  });
  if (!collaborator) throw new Error("Access denied");
  // if(!collaborator.hasSecretAccess) throw new Error("Your access is revoked by the owner");

  return { isOwner: false, collaborator };
}



export const getUser = async (req: CustomRequest, res: Response): Promise<void> => {
  const user_id = req.user?.id;

  const user = await prisma.user.findFirst({
    where: {
      id: user_id
    }
  })

  if (!user) res.status(401).json({ message: "Not logged in" });
  res.status(200).json(user);
};