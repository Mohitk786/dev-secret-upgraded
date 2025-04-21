import express from "express";
import { signInUser, signUpUser, logoutUser } from "./authController";

const router = express.Router();


router.post("/signup", signUpUser);
router.post("/login", signInUser);
router.post("/logout", logoutUser);

export default router;