import express from "express";
import {
  
    getSecrets,
    getUser,
} from "./secretController";

const router = express.Router();



router.get("/me", getUser);
router.get("/:vaultId", getSecrets);

export default router;
