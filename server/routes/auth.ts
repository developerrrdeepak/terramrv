import { RequestHandler } from "express";
import { getDb } from "../db";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

interface JWTPayload {
  _id: string;
  email: string;
  role?: string;
}

const COLLECTION = "users";

function signToken(payload: JWTPayload) {
  const secret = process.env.JWT_SECRET || "dev-secret";
  return jwt.sign(payload, secret, { expiresIn: "7d" });
}

export const register: RequestHandler = async (req, res) => {
  try {
    const { email, password, name } = req.body as {
      email: string;
      password: string;
      name?: string;
    };
    if (!email || !password)
      return res.status(400).json({ error: "Email and password required" });
    const db = await getDb();
    const existing = await db.collection(COLLECTION).findOne({ email });
    if (existing)
      return res.status(409).json({ error: "Email already registered" });
    const hash = await bcrypt.hash(password, 10);
    const doc = {
      email,
      password: hash,
      name: name || email.split("@")[0],
      role: "farmer",
      createdAt: new Date(),
    };
    const result = await db.collection(COLLECTION).insertOne(doc as any);
    const token = signToken({
      _id: String(result.insertedId),
      email,
      role: "farmer",
    });
    res.json({
      token,
      user: {
        id: String(result.insertedId),
        email,
        name: doc.name,
        role: "farmer",
      },
    });
  } catch (e: any) {
    res.status(500).json({ error: e.message || "Registration failed" });
  }
};

export const login: RequestHandler = async (req, res) => {
  try {
    const { email, password } = req.body as { email: string; password: string };
    if (!email || !password)
      return res.status(400).json({ error: "Email and password required" });
    const db = await getDb();
    const user = await db
      .collection(COLLECTION)
      .findOne<{
        _id: any;
        email: string;
        password: string;
        name?: string;
        role?: string;
      }>({ email });
    if (!user) return res.status(401).json({ error: "Invalid credentials" });
    const ok = await bcrypt.compare(password, user.password);
    if (!ok) return res.status(401).json({ error: "Invalid credentials" });
    const token = signToken({
      _id: String(user._id),
      email: user.email,
      role: user.role || "farmer",
    });
    res.json({
      token,
      user: {
        id: String(user._id),
        email: user.email,
        name: user.name || email.split("@")[0],
        role: user.role || "farmer",
      },
    });
  } catch (e: any) {
    res.status(500).json({ error: e.message || "Login failed" });
  }
};

export const me: RequestHandler = async (req, res) => {
  try {
    const auth = req.headers.authorization || "";
    const token = auth.startsWith("Bearer ") ? auth.slice(7) : null;
    if (!token) return res.status(401).json({ error: "Missing token" });
    const secret = process.env.JWT_SECRET || "dev-secret";
    const payload = jwt.verify(token, secret) as JWTPayload;
    const db = await getDb();
    try {
      const user = await db
        .collection(COLLECTION)
        .findOne<{
          _id: any;
          email: string;
          name?: string;
          role?: string;
        }>({ _id: new (await import("mongodb")).ObjectId(payload._id) });
      if (!user) throw new Error("notfound");
      return res.json({
        user: {
          id: String(user._id),
          email: user.email,
          name: user.name || user.email.split("@")[0],
          role: user.role || "farmer",
        },
      });
    } catch {
      const user = await db
        .collection(COLLECTION)
        .findOne<{
          _id: any;
          email: string;
          name?: string;
          role?: string;
        }>({ _id: (jwt.verify(token, secret) as JWTPayload)._id as any });
      if (!user) return res.status(404).json({ error: "User not found" });
      return res.json({
        user: {
          id: String((user as any)._id),
          email: (user as any).email,
          name: (user as any).name || (user as any).email.split("@")[0],
          role: (user as any).role || "farmer",
        },
      });
    }
  } catch (e: any) {
    res.status(401).json({ error: "Invalid token" });
  }
};

export const profileGet: RequestHandler = me;

export const profileUpdate: RequestHandler = async (req, res) => {
  try {
    const auth = req.headers.authorization || "";
    const token = auth.startsWith("Bearer ") ? auth.slice(7) : null;
    if (!token) return res.status(401).json({ error: "Missing token" });
    const secret = process.env.JWT_SECRET || "dev-secret";
    const payload = jwt.verify(token, secret) as JWTPayload;
    const { name } = req.body as { name?: string };
    const db = await getDb();
    await db.collection(COLLECTION).updateOne({ _id: payload._id as any }, { $set: { ...(name ? { name } : {}) } });
    const user = await db.collection(COLLECTION).findOne({ _id: payload._id as any });
    res.json({
      user: {
        id: String((user as any)._id),
        email: (user as any).email,
        name: (user as any).name || (user as any).email.split("@")[0],
        role: (user as any).role || "farmer",
      },
    });
  } catch (e: any) {
    res.status(400).json({ error: e.message || "Update failed" });
  }
};
