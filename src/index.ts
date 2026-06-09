import express, { Application, Request, Response } from "express";
import cors from "cors";

import { connectDatabase } from "./database/mongodb";
import authRoutes from "./routes/auth.route";

const app: Application = express();

//  CORS (must be before routes)
app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  })
);

// Middleware (use built-in parsers)
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//  Routes
app.use("/api/auth", authRoutes);

// Test route
app.get("/", (req: Request, res: Response) => {
  return res.status(200).json({
    success: true,
    message: "Welcome to the API",
  });
});

//  Server start
async function startServer() {
  await connectDatabase();

  const PORT = process.env.PORT || 5000;

  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}

startServer();