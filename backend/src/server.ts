import express from "express"
import cors from "cors"
import dotenv from "dotenv"
import userRoutes from "./routes/userRoutes"
import authRoutes from "./auth/authRoutes"
import productRoutes from "./routes/productRoutes"

dotenv.config()

const app = express()

app.use(cors())
app.use(express.json())

app.use("/api/auth", authRoutes)
app.use("/api/user", userRoutes)
app.use("/api/products", productRoutes)

app.get("/", (req, res) => {
  res.send("Ecommerce API Running")
})

const PORT = process.env.PORT || 5000

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
