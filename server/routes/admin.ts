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

export const listFarmers: RequestHandler = async (req, res) => {
  const adminId = requireAdmin(req);
  if (!adminId) return res.status(401).json({ error: "Unauthorized" });
  const db = await getDb();
  const cursor = await (db as any).collection("users").find({});
  const users = await (cursor as any).toArray();
  res.json({ users: users.map((u: any) => ({ id: String(u._id), email: u.email, name: u.name, role: u.role })) });
};

export const addFarmer: RequestHandler = async (req, res) => {
  const adminId = requireAdmin(req);
  if (!adminId) return res.status(401).json({ error: "Unauthorized" });
  const { email, name = "Farmer", role = "farmer" } = req.body as any;
  if (!email) return res.status(400).json({ error: "Email required" });
  const db = await getDb();
  const existing = await (db as any).collection("users").findOne({ email });
  if (existing) return res.status(409).json({ error: "Email already exists" });
  const r = await (db as any).collection("users").insertOne({ email, name, role, createdAt: new Date() });
  res.json({ id: String((r as any).insertedId), email, name, role });
};

export const removeFarmer: RequestHandler = async (req, res) => {
  const adminId = requireAdmin(req);
  if (!adminId) return res.status(401).json({ error: "Unauthorized" });
  const { id } = req.params as any;
  const db = await getDb();
  try {
    const { ObjectId } = await import("mongodb");
    const r = await (db as any).collection("users").deleteOne({ _id: new ObjectId(id) as any });
    if ((r as any).deletedCount === 0) throw new Error("notfound");
    return res.json({ ok: true });
  } catch {
    const r = await (db as any).collection("users").deleteOne({ _id: id as any });
    if ((r as any).deletedCount === 0) return res.status(404).json({ error: "Not found" });
    return res.json({ ok: true });
  }
};
