import { Router } from "express";
    import { createVault, getVault, getVaults, getAllCollaborators, sentInvite, acceptInvite, rejectInvite, getSharedWithMeVaults, getVaultKey, confirmAccess, getVaultLogs, updateVault, deleteVault, getInvite, updateCollaborator         } from "./vaultController";


const router = Router();

router.get("/vaults/all",getVaults);
router.post("/vaults/create",createVault);
router.get("/vaults/:vaultId",getVault);
router.put("/vaults/:vaultId",updateVault);
router.delete("/vaults/:vaultId",deleteVault);
router.get("/collab/vault-collaborators/:vaultId",getAllCollaborators);
router.post("/collab/invite",sentInvite);
router.post("/collab/accept-invite/:inviteId",acceptInvite);
router.post("/collab/reject-invite/:inviteId",rejectInvite);
router.get("/collab/shared-with-me",getSharedWithMeVaults);
router.get("/collab/invite/:inviteId",getInvite);
router.get("/vaults/:vaultId/vault-key",getVaultKey);
router.post("/collab/confirm-access/:vaultId",confirmAccess);
router.get("/vaults/:vaultId/logs",getVaultLogs);
router.patch("/collab/vault-collaborators/:vaultId/:collaboratorId",updateCollaborator);


export default router;  