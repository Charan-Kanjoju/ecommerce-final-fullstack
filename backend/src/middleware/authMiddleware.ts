import { Response, NextFunction } from "express"
import { AuthRequest } from "../types/express"
import { verifyAccessToken } from "../utils/jwt"

export const authMiddleware = (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {

  try {

    const authHeader = req.headers.authorization

    if (!authHeader) {
      return res.status(401).json({
        message: "No token provided"
      })
    }

    const token = authHeader.split(" ")[1]

    const decoded = verifyAccessToken(token)

    req.userId = decoded.userId

    next()

  } catch (error) {

    return res.status(401).json({
      message: "Invalid or expired token"
    })

  }

}
