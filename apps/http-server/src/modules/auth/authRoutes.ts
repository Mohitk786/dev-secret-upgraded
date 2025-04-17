import express from "express";
import { signInUser, signUpUser } from "./authController";

const router = express.Router();


router.post("/signup", signUpUser);
router.post("/login", signInUser);

export default router;