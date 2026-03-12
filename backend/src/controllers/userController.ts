import { Response } from "express";
import { AuthRequest } from "../types/express";
import { prisma } from "../lib/prisma";

export const getProfile = async (req: AuthRequest, res: Response) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.userId! },
      select: {
        id: true,
        name: true,
        email: true,
        createdAt: true,
      },
    });

    res.json(user);
  } catch {
    res.status(500).json({
      message: "Failed to fetch profile",
    });
  }
};
export const updateProfile = async (req: AuthRequest, res: Response) => {
  try {
    const { name } = req.body;

    const user = await prisma.user.update({
      where: { id: req.userId! },
      data: { name },
    });

    res.json(user);
  } catch {
    res.status(500).json({
      message: "Failed to update profile",
    });
  }
};