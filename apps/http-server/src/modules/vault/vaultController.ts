

import { Request, Response } from 'express';
import  prisma  from '@secret-vault/db/client'; 
import { CustomRequest } from '../../middleware/auth';


async function checkVaultOwnership(userId: string, vaultId: string) {
  const vault = await prisma.vault.findUnique({
    where: { id: vaultId },
  });

  if (!vault) throw new Error('Vault not found');
  if (vault.ownerId !== userId) throw new Error('Unauthorized access to this vault');

  return vault;
}

// API: Create a vault
export async function createVault(req: CustomRequest, res: Response) {
  try {
    const { name, description, icon } = req.body;
    const ownerId = req.user?.id;

    const vault = await prisma.vault.create({
      data: {
        name,
        description,
        icon,
        ownerId: ownerId as string,
      },
    });

    res.status(201).json(vault);
  } catch (err:any) {
    res.status(500).json({ message: 'Failed to create vault', error: err.message });
  }
}

// API: Get vault details with secrets (for owner)
export async function getVault(req: CustomRequest, res: Response) {
  try {
    const vaultId = req.params.vaultId;
    const userId = req.user?.id;

    if(!vaultId) {
      return res.status(400).json({ message: 'Vault ID is required' });
    }

    await checkVaultOwnership(userId!, vaultId);

    const vault = await prisma.vault.findUnique({
      where: { id: vaultId },
      include: {
        secrets: true,
        collaborators: {
          include: {
            user: true,
          },
        },
      },
    });

    res.json(vault);
  } catch (err:any) {
    res.status(403).json({ message: 'Access denied', error: err.message });
  }
}






