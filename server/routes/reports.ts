import type { RequestHandler } from "express";
import { getDb } from "../db";
import jwt from "jsonwebtoken";

function requireUser(req: any): { id: string } | null {
  const auth = req.headers.authorization || "";
  const token = auth.startsWith("Bearer ") ? auth.slice(7) : null;
  if (!token) return null;
  const secret = process.env.JWT_SECRET || "dev-secret";
  try {
    const payload = jwt.verify(token, secret) as any;
    return { id: String(payload._id) };
  } catch {
    return null;
  }
}

export const farmerReport: RequestHandler = async (req, res) => {
  const user = requireUser(req);
  if (!user) return res.status(401).json({ error: "Unauthorized" });
  const db = await getDb();
  const logs = await (
    await (db as any).collection("activity_logs").find({ userId: user.id })
  ).toArray();
  const byMonth: Record<string, { emissions: number; savings: number }> = {};
  for (const l of logs) {
    const k = String(l.date).slice(0, 7);
    const qty = l.quantity ?? 1;
    const type = String(l.type);
    const isEmission = [
      "plowing",
      "seeding",
      "harvesting",
      "fertilizer",
      "pesticide",
      "irrigation",
      "machinery",
    ].includes(type);
    const value = isNaN(Number(qty)) ? 1 : Number(qty);
    const v = (byMonth[k] ||= { emissions: 0, savings: 0 });
    if (isEmission) v.emissions += value;
    else v.savings += value;
  }
  res.json({ byMonth });
};

export const adminRegionReport: RequestHandler = async (_req, res) => {
  const db = await getDb();
  const users = await (
    await (db as any).collection("users").find({})
  ).toArray();
  const regions: Record<string, number> = {};
  for (const u of users) {
    const lat = parseFloat(u.lat || 0);
    const lng = parseFloat(u.lng || 0);
    const key = `${Math.round(lat * 10) / 10},${Math.round(lng * 10) / 10}`;
    regions[key] = (regions[key] || 0) + 1;
  }
  res.json({ regions });
};
