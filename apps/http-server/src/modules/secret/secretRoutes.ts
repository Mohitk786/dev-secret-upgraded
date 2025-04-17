import express from "express";
import {
  
    getSecrets,
} from "./secretController";

const router = express.Router();



router.get("/:vaultId", getSecrets);

export default router;
