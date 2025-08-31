import "dotenv/config";
import express from "express";
import cors from "cors";
import * as Sentry from "@sentry/node";
import { handleDemo } from "./routes/demo";
import { register, login, me, profileGet, profileUpdate } from "./routes/auth";
import {
  summary as adminSummary,
  listFarmers,
  addFarmer,
  removeFarmer,
  listRegistrations,
  approveRegistration,
  setUserRole,
} from "./routes/admin";
import { start as otpStart, verify as otpVerify } from "./routes/otp";
import {
  start as googleStart,
  callback as googleCallback,
} from "./routes/google";
import { listLogs, addLog, deleteLog } from "./routes/logs";
import { getCredits, requestPayout } from "./routes/credits";
import { farmerReport, adminRegionReport } from "./routes/reports";
import { submitSupport } from "./routes/support";
import { chat as assistantChat, stt as assistantStt } from "./routes/assistant";
import { carbonEstimate, soilHealthPredict, anomalyCheck } from "./routes/ml";
import {
  fetchImagery,
  analyzeVegetation,
  classifyLandCover,
  detectChanges,
} from "./routes/satellite";
import {
  getHistoricalWeather,
  getWeatherForecast,
  analyzeClimate,
  getWeatherAlerts,
} from "./routes/weather";

export function createServer() {
  const app = express();

  const dsn = process.env.SENTRY_DSN;
  if (dsn) {
    Sentry.init({
      dsn,
      environment: process.env.NODE_ENV,
      tracesSampleRate: 0.2,
    });
    const anySentry: any = Sentry as any;
    if (anySentry?.Handlers?.requestHandler) {
      app.use(anySentry.Handlers.requestHandler());
    }
  }

  // Middleware
  app.use(cors());
  app.use(express.json({ limit: "25mb" }));
  app.use(express.urlencoded({ extended: true, limit: "25mb" }));

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
  app.get("/api/profile", profileGet);
  app.put("/api/profile", profileUpdate);

  // OTP Email
  app.post("/api/auth/otp/start", otpStart);
  app.post("/api/auth/otp/verify", otpVerify);

  // Google OAuth
  app.get("/api/auth/social/google/start", googleStart);
  app.get("/api/auth/social/google/callback", googleCallback);

  // Activity logs (farmer)
  app.get("/api/logs", listLogs);
  app.post("/api/logs", addLog);
  app.delete("/api/logs/:id", deleteLog);

  // Credits
  app.get("/api/credits", getCredits);
  app.post("/api/credits/payouts", requestPayout);

  // Reports
  app.get("/api/reports/farmer", farmerReport);
  app.get("/api/admin/reports/regions", adminRegionReport);

  // Support
  app.post("/api/support", submitSupport);

  // Assistant
  app.post("/api/assistant/chat", assistantChat);
  app.post("/api/assistant/stt", assistantStt);

  // ML Models
  app.post("/api/ml/carbon-estimate", carbonEstimate);
  app.post("/api/ml/soil-health", soilHealthPredict);
  app.post("/api/ml/anomaly-check", anomalyCheck);

  // Satellite Data & Remote Sensing
  app.post("/api/satellite/fetch", fetchImagery);
  app.post("/api/satellite/analyze-vegetation", analyzeVegetation);
  app.post("/api/satellite/classify-land-cover", classifyLandCover);
  app.post("/api/satellite/detect-changes", detectChanges);

  // Weather Data & Climate Analysis
  app.post("/api/weather/historical", getHistoricalWeather);
  app.post("/api/weather/forecast", getWeatherForecast);
  app.post("/api/weather/climate-analysis", analyzeClimate);
  app.post("/api/weather/alerts", getWeatherAlerts);

  // Admin
  app.get("/api/admin/summary", adminSummary);
  app.get("/api/admin/farmers", listFarmers);
  app.post("/api/admin/farmers", addFarmer);
  app.delete("/api/admin/farmers/:id", removeFarmer);
  app.get("/api/admin/registrations", listRegistrations);
  app.post("/api/admin/registrations/:id/approve", approveRegistration);
  app.post("/api/admin/users/:id/role", setUserRole);

  if (dsn) {
    const anySentry: any = Sentry as any;
    if (anySentry?.Handlers?.errorHandler) {
      app.use(anySentry.Handlers.errorHandler());
    }
  }

  // Seed admin (non-blocking)
  import("./seed").then((m) => m.ensureAdmin?.()).catch(() => {});

  return app;
}
