import { Router } from "express";
import { getAllInvites } from "./invitesController";
import { isAuthenticated } from "../../middleware/auth";

const router = Router();

router.get("/", isAuthenticated, getAllInvites);
export default router;