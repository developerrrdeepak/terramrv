import { RequestHandler } from "express";
import { getDb } from "../db";
import crypto from "crypto";
import { sendOtp } from "../mailer";
import jwt from "jsonwebtoken";

function signToken(payload: any) {
  const secret = process.env.JWT_SECRET || "dev-secret";
  return jwt.sign(payload, secret, { expiresIn: "7d" });
}

export const start: RequestHandler = async (req, res) => {
  const { email } = req.body as { email: string };
  if (!email) return res.status(400).json({ error: "Email required" });
  const db = await getDb();
  const code = String(Math.floor(100000 + Math.random() * 900000));
  const hash = crypto.createHash("sha256").update(code).digest("hex");
  const expiresAt = new Date(Date.now() + 10 * 60 * 1000);
  await db
    .collection("otps")
    .insertOne({ email, hash, expiresAt, used: false, createdAt: new Date() });
  await sendOtp(email, code);
  res.json({ ok: true });
};

export const verify: RequestHandler = async (req, res) => {
  const { email, code } = req.body as { email: string; code: string };
  if (!email || !code)
    return res.status(400).json({ error: "Email and code required" });
  const db = await getDb();
  const hash = crypto.createHash("sha256").update(code).digest("hex");
  const doc = await db
    .collection("otps")
    .findOne({ email, hash, used: false, expiresAt: { $gt: new Date() } });
  if (!doc) return res.status(400).json({ error: "Invalid or expired code" });
  await db
    .collection("otps")
    .updateOne({ _id: doc._id }, { $set: { used: true } });

  // Ensure user exists
  const users = db.collection("users");
  let user = await users.findOne<{
    _id: any;
    email: string;
    name?: string;
    role?: string;
  }>({ email });
  if (!user) {
    const r = await users.insertOne({
      email,
      name: email.split("@")[0],
      role: "farmer",
      createdAt: new Date(),
    });
    user = {
      _id: r.insertedId,
      email,
      name: email.split("@")[0],
      role: "farmer",
    } as any;
  }
  const token = signToken({
    _id: String((user as any)._id),
    email,
    role: user.role || "farmer",
  });
  res.json({
    token,
    user: {
      id: String((user as any)._id),
      email,
      name: user.name || email.split("@")[0],
      role: user.role || "farmer",
    },
  });
};
