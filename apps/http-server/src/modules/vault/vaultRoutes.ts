import { Router } from "express";
import { createVault, getVault, getVaults, getAllCollaborators, sentInvite, acceptInvite, getSharedWithMeVaults, getVaultKey } from "./vaultController";
import { isAuthenticated } from "../../middleware/auth";


const router = Router();

router.get("/vaults/all", isAuthenticated, getVaults);
router.post("/vaults/create", isAuthenticated, createVault);
router.get("/vaults/:vaultId", isAuthenticated, getVault);
router.get("/collab/vault-collaborators/:vaultId", isAuthenticated, getAllCollaborators);
router.post("/collab/invite", isAuthenticated, sentInvite);
router.get("/collab/accept-invite/:inviteId", isAuthenticated, acceptInvite);
router.get("/collab/shared-with-me", isAuthenticated, getSharedWithMeVaults);
router.get("/vaults/:vaultId/vault-key", isAuthenticated, getVaultKey);

export default router;  