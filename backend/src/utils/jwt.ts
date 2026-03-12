import crypto from "crypto";
import jwt from "jsonwebtoken";

const ACCESS_TOKEN_EXPIRES_IN = "15m";
const REFRESH_TOKEN_EXPIRES_IN = "7d";

const getAccessSecret = () =>
  process.env.ACCESS_TOKEN_SECRET || process.env.JWT_SECRET || "dev_access_secret";

const getRefreshSecret = () =>
  process.env.REFRESH_TOKEN_SECRET || process.env.JWT_SECRET || "dev_refresh_secret";

export const generateAccessToken = (userId: string) =>
  jwt.sign({ userId }, getAccessSecret(), {
    expiresIn: ACCESS_TOKEN_EXPIRES_IN,
  });

export const generateRefreshToken = (userId: string, tokenId: string) =>
  jwt.sign({ userId, tokenId }, getRefreshSecret(), {
    expiresIn: REFRESH_TOKEN_EXPIRES_IN,
  });

export const verifyAccessToken = (token: string) =>
  jwt.verify(token, getAccessSecret()) as { userId: string };

export const verifyRefreshToken = (token: string) =>
  jwt.verify(token, getRefreshSecret()) as { userId: string; tokenId: string };

export const hashToken = (token: string) =>
  crypto.createHash("sha256").update(token).digest("hex");
