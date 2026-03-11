
import { Request } from "express"

export interface AuthRequest<P = any> extends Request<P> {
  userId?: string
}