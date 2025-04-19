import prisma from "@secret-vault/db/client";
import { CustomRequest } from "../../middleware/auth";
import { Response } from "express";
import { checkVaultOwnership } from "../vault/vaultController";

export const getDeletedVaults = async (req: CustomRequest, res: Response):Promise<any> => {
 try{
    const userId = req.user?.id;

    if(!userId){
        return res.status(401).json({
            message: "Unauthorized",
        });
    }

    const vaults = await prisma.vault.findMany({
        where: {
            isDeleted: true,    
            ownerId: userId,
        },
    });
    res.status(200).json({
        vaults,
    }); 

 }catch(err){
    return res.status(500).json({
        message: "Internal server error",
    });
 }
};              


export const getDeletedSecrets = async (req: CustomRequest, res: Response):Promise<any> => {
    try{
        const userId = req.user?.id;

        if(!userId){
            return res.status(401).json({
                message: "Unauthorized",
            });
        }   

        const secrets = await prisma.secret.findMany({
            where: {
                isDeleted: true,
                vault: {
                    ownerId: userId,
                    isDeleted: false,
                },
            },
            include: {
                vault: {
                    select: {
                        id:true,
                        name: true,
                    },
                },
            },
        });
        res.status(200).json({
            secrets,
        });

    }catch(err){
        return res.status(500).json({
            message: "Internal server error",
        });
    }
}


export const restoreVault = async (req: CustomRequest, res: Response):Promise<any> => {
    try{
        const { vaultId } = req.params as { vaultId: string };
        const userId = req.user?.id;

        if(!userId){
            return res.status(401).json({
                message: "Unauthorized",
            });     
        }

        const vault = await checkVaultOwnership(userId, vaultId);

        if(!vault){
            return res.status(404).json({
                message: "Vault not found",
            });
        }

        await prisma.vault.update({
            where: { id: vaultId },
            data: { isDeleted: false }, 
        });

        res.status(200).json({
            message: "Vault restored successfully",
        });

    }catch(err){
        return res.status(500).json({
            message: "Internal server error",
        });
    }
}


export const restoreSecret = async (req: CustomRequest, res: Response):Promise<any> => {
    try{
        const { secretId } = req.params;
            const userId = req.user?.id;

        if(!userId){
            return res.status(401).json({
                message: "Unauthorized",
            });
            }

        const secret = await prisma.secret.findUnique({
            where: {
                id: secretId,
                vault: {
                    ownerId: userId,
                },
                },
        });

        if(!secret){
            return res.status(404).json({
                message: "Secret not found",
            });
        }

        await prisma.secret.update({
            where: { id: secretId },
            data: { isDeleted: false },
        });

        res.status(200).json({
            message: "Secret restored successfully",
        });

    }catch(err){
        return res.status(500).json({
            message: "Internal server error",
        }); 
    }
    }


export const permanentDeleteVault = async (req: CustomRequest, res: Response):Promise<any> => {
    try{
        const { vaultId } = req.params as { vaultId: string };
        const userId = req.user?.id;

        if(!userId){
            return res.status(401).json({
                message: "Unauthorized",
            });
        }

        const vault = await checkVaultOwnership(userId, vaultId);
            
        await prisma.vault.findUnique({
            where: {
                id: vaultId,
                ownerId: userId,
            },
        });

        if(!vault){
            return res.status(404).json({
                message: "Vault not found",
            });
        }

        await prisma.vault.delete({
            where: { id: vaultId },
        });


        //delete all secrets
        await prisma.secret.deleteMany({
            where: {
                vaultId: vaultId,
            },
        });




        res.status(200).json({
            message: "Vault deleted successfully",
        });
    }catch(err){
        return res.status(500).json({
            message: "Internal server error",
        });
    }
}


export const permanentDeleteSecret = async (req: CustomRequest, res: Response):Promise<any> => {
    try{
        const { secretId } = req.params;
        const userId = req.user?.id;

        if(!userId){
            return res.status(401).json({
                message: "Unauthorized",
            });
        }
        
        const secret = await prisma.secret.findUnique({
            where: {
                id: secretId,
                vault: {
                    ownerId: userId,
                },
            },  
        });

        if(!secret){
            return res.status(404).json({
                message: "Secret not found",
            });
        }

        await prisma.secret.delete({
            where: { id: secretId },
        }); 

        res.status(200).json({
            message: "Secret deleted successfully",
        });

    }catch(err){
        
    }
}

export const emptyTrash = async (req: CustomRequest, res: Response):Promise<any> => {
    try{
        const userId = req.user?.id;

        if(!userId){
            return res.status(401).json({
                message: "Unauthorized",
            });
        }   
        
        //delete the vault Key Mapping
      
        await prisma.vaultKey.deleteMany({
            where: {
                userId: userId,
                vault: {
                    isDeleted: true,
                    ownerId: userId,
                },
            },
        });

        //pehle vault k secrets delete kro
        await prisma.secret.deleteMany({
            where: {
                vault: {
                    isDeleted: true,
                    ownerId: userId,
                },
            },
        }); 

        //phir individual secrets delete kro
        await prisma.secret.deleteMany({
            where: {
                isDeleted: true,
            },
        }); 

        //phir vault ko delete kro
        await prisma.vault.deleteMany({
            where: {
                isDeleted: true,
                ownerId: userId,
            },
        }); 
        
        


        res.status(200).json({
            message: "Trash emptied successfully",
        });

    }catch(err){
        return res.status(500).json({
            message: "Internal server error",
        });
        }
}


