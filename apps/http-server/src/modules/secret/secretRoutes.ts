import express from "express";
import {
  
    getSecrets,
    getUser,
} from "./secretController";
import { isAuthenticated } from "../../middleware/auth";

const router = express.Router();



router.get("/me", isAuthenticated, getUser);
router.get("/:vaultId", getSecrets);

export default router;
