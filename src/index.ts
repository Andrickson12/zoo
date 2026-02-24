import express from "express";
import "dotenv/config";
import rateLimit from "express-rate-limit";
import connectDB from "./config/db";
import authRoutes from "./routes/auth.routes";
import pandaRoutes from "./routes/panda.routes";
import { errorHandler } from "./middleware/error.middleware";
import helmet from "helmet";
import cors from "cors"

const app = express();

app.use(helmet())
app.use(cors({ origin: "*" })) // or whatever port your frontend runs on
app.use(express.json());

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 100,
  message: { message: "Too many requests, slow down" },
});

app.use(limiter)
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/pandas", pandaRoutes);
app.use(errorHandler);

// Connect to db
connectDB().then(() => {
  app.listen(process.env.PORT, () =>
    console.log(`Server running on port ${process.env.PORT}`),
  );
});
