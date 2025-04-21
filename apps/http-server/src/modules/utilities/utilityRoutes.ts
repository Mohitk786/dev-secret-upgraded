import express from "express";
import { dashboardStats } from "./utilitiesController";

const router = express.Router();

router.get("/dashboard-stats", dashboardStats);

export default router;