import { Router } from "express";
import { getAllInvites } from "./invitesController";

const router = Router();

router.get("/", getAllInvites);
export default router;