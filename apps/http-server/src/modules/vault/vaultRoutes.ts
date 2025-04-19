import { Router } from "express";
import { createVault, getVault, getVaults, getAllCollaborators, sentInvite, acceptInvite, getSharedWithMeVaults, getVaultKey, confirmAccess, getVaultLogs, updateVault, deleteVault } from "./vaultController";
import { isAuthenticated } from "../../middleware/auth";


const router = Router();

router.get("/vaults/all", isAuthenticated, getVaults);
router.post("/vaults/create", isAuthenticated, createVault);
router.get("/vaults/:vaultId", isAuthenticated, getVault);
router.put("/vaults/:vaultId", isAuthenticated, updateVault);
router.delete("/vaults/:vaultId", isAuthenticated, deleteVault);
router.get("/collab/vault-collaborators/:vaultId", isAuthenticated, getAllCollaborators);
router.post("/collab/invite", isAuthenticated, sentInvite);
router.get("/collab/accept-invite/:inviteId", isAuthenticated, acceptInvite);
router.get("/collab/shared-with-me", isAuthenticated, getSharedWithMeVaults);
router.get("/vaults/:vaultId/vault-key", isAuthenticated, getVaultKey);
router.post("/collab/confirm-access/:vaultId", isAuthenticated, confirmAccess);
router.get("/vaults/:vaultId/logs", isAuthenticated, getVaultLogs);


export default router;  