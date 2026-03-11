import express from "express";
import { authMiddleware } from "../middleware/authMiddleware";

const router = express.Router();

router.get("/profile", authMiddleware, (req: any, res) => {
  res.json({
    message: "Protected route accessed",
    userId: req.userId,
  });
});

export default router;
