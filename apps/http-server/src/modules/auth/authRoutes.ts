import express from "express";
import { signInUser, signUpUser, logoutUser, uploadPublicKey } from "./authController";

const router = express.Router();


router.post("/signup", signUpUser);
router.post("/login", signInUser);
router.post("/logout", logoutUser);
router.post("/upload-public-key", uploadPublicKey);

export default router;