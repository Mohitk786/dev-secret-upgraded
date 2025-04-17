import { Response } from "express";
import prisma from "@secret-vault/db/client";
import { CustomRequest } from "../../middleware/auth";

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

export async function getSecrets(req: CustomRequest, res: Response):Promise<any> {
  try {
    const vaultId = req.params.vaultId;
    const userId = req.user?.id;

    if(!vaultId){
        return res.status(400).json({ message: "Vault ID is required" });
    }

    const {isOwner, collaborator} = await checkVaultAccess(userId!, vaultId);
    if(!isOwner && !collaborator)
      return res.status(403).json({ message: "You can't view this vault" });

    const secrets = await prisma.secret.findMany({
      where: { vaultId },
    });

    res.json(secrets);

  } catch (err:any) {
    res.status(403).json({ message: "Access denied", error: err.message });
  }
}


export const getUser = async (req: CustomRequest, res: Response): Promise<void> => {
  const user_id = req.user?.id;
  console.log("user_id", user_id);

  const user = await prisma.user.findUnique({
      where: {
          id: user_id
      }
  })

  if (!user) res.status(401).json({ message: "Not logged in" });
  res.status(200).json(user);
};