import { Router } from "express";
import { getDeletedVaults, getDeletedSecrets } from "./controller";
import { isAuthenticated } from "../../middleware/auth";        

const router = Router();

router.get("/vaults", isAuthenticated, getDeletedVaults);
router.get("/secrets", isAuthenticated, getDeletedSecrets);


export default router;