import { Request, Response } from "express";
import {
  createSessionTokens,
  loginUser,
  registerUser,
  revokeRefreshToken,
  rotateRefreshToken,
} from "./authService";

const REFRESH_COOKIE_NAME = "refreshToken";
const isProduction = process.env.NODE_ENV === "production";
const refreshCookieOptions = {
  httpOnly: true,
  secure: isProduction,
  sameSite: (isProduction ? "none" : "lax") as "none" | "lax",
  maxAge: 7 * 24 * 60 * 60 * 1000,
  path: "/api/auth",
};

const parseCookies = (req: Request) => {
  const raw = req.headers.cookie;
  if (!raw) return {} as Record<string, string>;
  return raw.split(";").reduce<Record<string, string>>((acc, part) => {
    const [key, ...value] = part.trim().split("=");
    acc[key] = decodeURIComponent(value.join("="));
    return acc;
  }, {});
};

const setRefreshCookie = (res: Response, refreshToken: string) => {
  res.cookie(REFRESH_COOKIE_NAME, refreshToken, refreshCookieOptions);
};

const clearRefreshCookie = (res: Response) => {
  res.clearCookie(REFRESH_COOKIE_NAME, refreshCookieOptions);
};

export const register = async (req: Request, res: Response) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({ message: "Name, email and password are required" });
    }

    const user = await registerUser(name, email, password);
    const { accessToken, refreshToken } = await createSessionTokens(user.id);

    if (refreshToken) {
      setRefreshCookie(res, refreshToken);
    }

    res.status(201).json({
      user,
      accessToken,
    });
  } catch (error: any) {
    res.status(400).json({
      message: error.message || "Registration failed",
    });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required" });
    }

    const user = await loginUser(email, password);
    const { accessToken, refreshToken } = await createSessionTokens(user.id);

    if (refreshToken) {
      setRefreshCookie(res, refreshToken);
    }

    res.json({
      user,
      accessToken,
    });
  } catch (error: any) {
    res.status(400).json({
      message: error.message || "Login failed",
    });
  }
};

export const refresh = async (req: Request, res: Response) => {
  try {
    const cookies = parseCookies(req);
    const incomingRefreshToken = cookies[REFRESH_COOKIE_NAME];

    if (!incomingRefreshToken) {
      return res.status(401).json({ message: "Missing refresh token" });
    }

    const { accessToken, refreshToken } = await rotateRefreshToken(incomingRefreshToken);
    if (refreshToken) {
      setRefreshCookie(res, refreshToken);
    }

    return res.json({ accessToken });
  } catch {
    clearRefreshCookie(res);
    return res.status(401).json({ message: "Refresh failed" });
  }
};

export const logout = async (req: Request, res: Response) => {
  try {
    const cookies = parseCookies(req);
    const incomingRefreshToken = cookies[REFRESH_COOKIE_NAME];
    await revokeRefreshToken(incomingRefreshToken);
    clearRefreshCookie(res);
    res.json({ message: "Logged out successfully" });
  } catch {
    res.status(500).json({ message: "Logout failed" });
  }
};
