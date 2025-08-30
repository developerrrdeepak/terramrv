import { RequestHandler } from "express";
import jwt from "jsonwebtoken";
import { getDb } from "../db";

function requireAdmin(req: any): string | null {
  const auth = req.headers.authorization || "";
  const token = auth.startsWith("Bearer ") ? auth.slice(7) : null;
  if (!token) return null;
  const secret = process.env.JWT_SECRET || "dev-secret";
  try {
    const payload = jwt.verify(token, secret) as any;
    return payload?.role === "admin" ? payload._id : null;
  } catch {
    return null;
  }
}

export const summary: RequestHandler = async (req, res) => {
  const adminId = requireAdmin(req);
  if (!adminId) return res.status(401).json({ error: "Unauthorized" });
  const db = await getDb();
  const users = await db.collection("users").countDocuments();
  res.json({ users });
};
