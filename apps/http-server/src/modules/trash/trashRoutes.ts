import { Router } from "express";
import { getDeletedVaults, getDeletedSecrets, restoreVault, restoreSecret, permanentDeleteVault, permanentDeleteSecret, emptyTrash   } from "./controller";
import { isAuthenticated } from "../../middleware/auth";        

const router = Router();

router.get("/vaults", isAuthenticated, getDeletedVaults);
router.get("/secrets", isAuthenticated, getDeletedSecrets);
router.post("/vaults/:vaultId/restore", isAuthenticated, restoreVault); 
router.post("/secrets/:secretId/restore", isAuthenticated, restoreSecret);
router.delete("/vaults/:vaultId", isAuthenticated, permanentDeleteVault);
router.delete("/secrets/:secretId", isAuthenticated, permanentDeleteSecret);
router.delete("/empty", isAuthenticated, emptyTrash);


export default router;