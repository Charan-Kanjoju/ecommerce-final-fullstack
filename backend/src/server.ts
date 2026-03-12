import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import userRoutes from "./routes/userRoutes";
import authRoutes from "./auth/authRoutes";
import productRoutes from "./routes/productRoutes";
import cartRoutes from "./routes/cartRoutes";
import orderRoutes from "./routes/orderRoutes";

dotenv.config();

const app = express();

const allowedOrigins = ["https://ecommerce-final-fullstack.vercel.app"];

app.use(
  cors({
    origin: (origin, callback) => {
      if (
        !origin ||
        origin.startsWith("http://localhost") ||
        origin.startsWith("http://127.0.0.1") ||
        allowedOrigins.includes(origin)
      ) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
  }),
);

app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/user", userRoutes);
app.use("/api/products", productRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/orders", orderRoutes);

app.get("/", (req, res) => {
  res.send("Ecommerce API Running Successfully");
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
