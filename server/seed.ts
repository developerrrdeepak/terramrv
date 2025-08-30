import bcrypt from "bcryptjs";
import { getDb } from "./db";

export async function ensureAdmin() {
  const email = process.env.ADMIN_EMAIL;
  const password = process.env.ADMIN_PASSWORD;
  if (!email || !password) return;
  const db = await getDb();
  const users = db.collection("users");
  const existing = await users.findOne({ email });
  if (existing) return;
  const hash = await bcrypt.hash(password, 10);
  await users.insertOne({
    email,
    password: hash,
    name: "Admin",
    role: "admin",
    createdAt: new Date(),
  });
}
