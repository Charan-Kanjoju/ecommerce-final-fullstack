import { prisma } from "../lib/prisma";
import { comparePassword, hashPassword } from "../utils/hash";
import crypto from "crypto";
import {
  generateAccessToken,
  generateRefreshToken,
  hashToken,
  verifyRefreshToken,
} from "../utils/jwt";

const REFRESH_TOKEN_TTL_MS = 7 * 24 * 60 * 60 * 1000;
const refreshTokenModel = (prisma as any).refreshToken;
const hasRefreshTokenStore = Boolean(refreshTokenModel);

type SafeUser = {
  id: string;
  name: string;
  email: string;
  createdAt: Date;
};

const toSafeUser = (user: {
  id: string;
  name: string;
  email: string;
  createdAt: Date;
}): SafeUser => ({
  id: user.id,
  name: user.name,
  email: user.email,
  createdAt: user.createdAt,
});

export const registerUser = async (name: string, email: string, password: string) => {
  const existingUser = await prisma.user.findUnique({
    where: { email },
  });

  if (existingUser) {
    throw new Error("User already exists");
  }

  const hashedPassword = await hashPassword(password);

  const user = await prisma.user.create({
    data: {
      name,
      email,
      password: hashedPassword,
    },
  });

  return toSafeUser(user);
};

export const loginUser = async (email: string, password: string) => {
  const user = await prisma.user.findUnique({
    where: { email },
  });

  if (!user) {
    throw new Error("Invalid credentials");
  }

  const isMatch = await comparePassword(password, user.password);
  if (!isMatch) {
    throw new Error("Invalid credentials");
  }

  return toSafeUser(user);
};

export const createSessionTokens = async (userId: string) => {
  const accessToken = generateAccessToken(userId);

  if (!hasRefreshTokenStore) {
    return { accessToken, refreshToken: null as string | null };
  }

  const tokenRecord = await refreshTokenModel.create({
    data: {
      userId,
      tokenHash: crypto.randomBytes(32).toString("hex"),
      expiresAt: new Date(Date.now() + REFRESH_TOKEN_TTL_MS),
    },
  });

  const refreshToken = generateRefreshToken(userId, tokenRecord.id);
  const tokenHash = hashToken(refreshToken);

  await refreshTokenModel.update({
    where: { id: tokenRecord.id },
    data: { tokenHash },
  });

  return { accessToken, refreshToken };
};

export const rotateRefreshToken = async (incomingRefreshToken: string) => {
  if (!hasRefreshTokenStore) {
    throw new Error("Refresh token store is not configured");
  }

  const decoded = verifyRefreshToken(incomingRefreshToken);
  const incomingHash = hashToken(incomingRefreshToken);

  const storedToken = await refreshTokenModel.findUnique({
    where: { tokenHash: incomingHash },
  });

  if (!storedToken || storedToken.id !== decoded.tokenId || storedToken.userId !== decoded.userId) {
    throw new Error("Invalid refresh token");
  }

  if (storedToken.revokedAt) {
    throw new Error("Refresh token revoked");
  }

  if (storedToken.expiresAt.getTime() <= Date.now()) {
    throw new Error("Refresh token expired");
  }

  await refreshTokenModel.update({
    where: { id: storedToken.id },
    data: { revokedAt: new Date() },
  });

  return createSessionTokens(storedToken.userId);
};

export const revokeRefreshToken = async (token: string | undefined) => {
  if (!hasRefreshTokenStore) return;
  if (!token) return;
  const tokenHash = hashToken(token);
  await refreshTokenModel.updateMany({
    where: {
      tokenHash,
      revokedAt: null,
    },
    data: {
      revokedAt: new Date(),
    },
  });
};
