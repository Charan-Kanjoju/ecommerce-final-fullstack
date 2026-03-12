import express from "express";
import { authMiddleware } from "../middleware/authMiddleware";

import { getProfile, updateProfile } from "../controllers/userController";

const router = express.Router();

router.get("/profile", authMiddleware, getProfile);

router.put("/profile", authMiddleware, updateProfile);

export default router;
