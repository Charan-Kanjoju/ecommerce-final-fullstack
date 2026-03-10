import { Request, Response } from "express"

import { generateToken } from "../utils/jwt"
import { loginUser, registerUser } from "./suthService"

export const register = async (
  req: Request,
  res: Response
) => {

  try {

    const { name, email, password } = req.body

    const user = await registerUser(
      name,
      email,
      password
    )

    const token = generateToken(user.id)

    res.json({
      user,
      token
    })

  } catch (error: any) {

    res.status(400).json({
      message: error.message
    })

  }
}

export const login = async (
  req: Request,
  res: Response
) => {

  try {

    const { email, password } = req.body

    const user = await loginUser(
      email,
      password
    )

    const token = generateToken(user.id)

    res.json({
      user,
      token
    })

  } catch (error: any) {

    res.status(400).json({
      message: error.message
    })

  }
}

export const logout = async (
  req: Request,
  res: Response
) => {

  try {

    // For JWT stateless auth
    // Logout is handled on client side
    // We just return success response

    res.json({
      message: "Logged out successfully"
    })

  } catch (error) {

    res.status(500).json({
      message: "Logout failed"
    })

  }

}