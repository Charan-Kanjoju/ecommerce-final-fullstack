
import { prisma } from "../../lib/prisma"
import { hashPassword, comparePassword } from "../utils/hash"

export const registerUser = async (
  name: string,
  email: string,
  password: string
) => {

  const existingUser = await prisma.user.findUnique({
    where: { email }
  })

  if (existingUser) {
    throw new Error("User already exists")
  }

  const hashedPassword = await hashPassword(password)

  const user = await prisma.user.create({
    data: {
      name,
      email,
      password: hashedPassword
    }
  })

  return user
}

export const loginUser = async (
  email: string,
  password: string
) => {

  const user = await prisma.user.findUnique({
    where: { email }
  })

  if (!user) {
    throw new Error("Invalid credentials")
  }

  const isMatch = await comparePassword(
    password,
    user.password
  )

  if (!isMatch) {
    throw new Error("Invalid credentials")
  }

  return user
}