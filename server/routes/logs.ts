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

export const listLogs: RequestHandler = async (req, res) => {
  const user = requireUser(req);
  if (!user) return res.status(401).json({ error: "Unauthorized" });
  const db = await getDb();
  const cursor = await (db as any)
    .collection("activity_logs")
    .find({ userId: user.id }) as any;
  const logs = await cursor.toArray();
  res.json({ logs });
};

export const addLog: RequestHandler = async (req, res) => {
  const user = requireUser(req);
  if (!user) return res.status(401).json({ error: "Unauthorized" });
  const { type, date, quantity, unit, notes } = req.body as any;
  if (!type || !date) return res.status(400).json({ error: "type and date required" });
  const db = await getDb();
  const doc = {
    userId: user.id,
    type,
    date,
    quantity: quantity ?? null,
    unit: unit ?? null,
    notes: notes ?? "",
    createdAt: new Date(),
  };
  const r = await (db as any).collection("activity_logs").insertOne(doc);
  res.json({ id: String((r as any).insertedId), ...doc });
};

export const deleteLog: RequestHandler = async (req, res) => {
  const user = requireUser(req);
  if (!user) return res.status(401).json({ error: "Unauthorized" });
  const { id } = req.params as any;
  const db = await getDb();
  try {
    const { ObjectId } = await import("mongodb");
    const r = await (db as any)
      .collection("activity_logs")
      .deleteOne({ _id: new ObjectId(id) as any, userId: user.id });
    if ((r as any).deletedCount === 0) throw new Error("notfound");
    return res.json({ ok: true });
  } catch {
    const r = await (db as any)
      .collection("activity_logs")
      .deleteOne({ _id: id as any, userId: user.id });
    if ((r as any).deletedCount === 0) return res.status(404).json({ error: "Not found" });
    return res.json({ ok: true });
  }
};
