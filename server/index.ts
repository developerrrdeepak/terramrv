import "dotenv/config";
import express from "express";
import cors from "cors";
import { handleDemo } from "./routes/demo";
import { register, login, me } from "./routes/auth";
import { summary as adminSummary } from "./routes/admin";

export function createServer() {
  const app = express();

  // Middleware
  app.use(cors());
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  // Example API routes
  app.get("/api/ping", (_req, res) => {
    const ping = process.env.PING_MESSAGE ?? "ping";
    res.json({ message: ping });
  });

  app.get("/api/demo", handleDemo);

  // Auth
  app.post("/api/auth/register", register);
  app.post("/api/auth/login", login);
  app.get("/api/auth/me", me);

  // OTP Email
  app.post("/api/auth/otp/start", (await import("./routes/otp")).start);
  app.post("/api/auth/otp/verify", (await import("./routes/otp")).verify);

  // Google OAuth
  app.get("/api/auth/social/google/start", (await import("./routes/google")).start);
  app.get("/api/auth/social/google/callback", (await import("./routes/google")).callback);

  // Admin
  app.get("/api/admin/summary", adminSummary);

  // Seed admin (non-blocking)
  import("./seed").then(m => m.ensureAdmin?.()).catch(() => {});

  return app;
}
