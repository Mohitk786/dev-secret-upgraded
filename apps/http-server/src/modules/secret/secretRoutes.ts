import express from "express";
import {
    getUser,
} from "./secretController";

const router = express.Router();

router.get("/me", getUser);

export default router;
