import express from "express";
import {
    getUser,
} from "./secretController";
import { isAuthenticated } from "../../middleware/auth";

const router = express.Router();

router.get("/me", isAuthenticated, getUser);

export default router;
