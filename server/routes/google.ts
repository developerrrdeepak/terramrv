import { RequestHandler } from "express";
import { OAuth2Client } from "google-auth-library";
import { getDb } from "../db";
import jwt from "jsonwebtoken";

function client() {
  const cid = process.env.GOOGLE_CLIENT_ID!;
  const secret = process.env.GOOGLE_CLIENT_SECRET!;
  const redirect = process.env.GOOGLE_REDIRECT_URI!;
  return new OAuth2Client({ clientId: cid, clientSecret: secret, redirectUri: redirect });
}
function signToken(payload: any) {
  const secret = process.env.JWT_SECRET || "dev-secret";
  return jwt.sign(payload, secret, { expiresIn: "7d" });
}

export const start: RequestHandler = async (req, res) => {
  const c = client();
  const url = c.generateAuthUrl({
    scope: ["openid", "email", "profile"],
    access_type: "offline",
    prompt: "consent",
  });
  res.redirect(url);
};

export const callback: RequestHandler = async (req, res) => {
  const code = req.query.code as string;
  const c = client();
  const { tokens } = await c.getToken(code);
  const ticket = await c.verifyIdToken({ idToken: tokens.id_token!, audience: process.env.GOOGLE_CLIENT_ID });
  const payload = ticket.getPayload();
  const email = payload?.email as string;
  const name = payload?.name || email.split("@")[0];
  const db = await getDb();
  const users = db.collection("users");
  let user = await users.findOne<{ _id: any; email: string; name?: string; role?: string }>({ email });
  if (!user) {
    const r = await users.insertOne({ email, name, role: "farmer", createdAt: new Date() });
    user = { _id: r.insertedId, email, name, role: "farmer" } as any;
  }
  const token = signToken({ _id: String((user as any)._id), email, role: user.role || "farmer" });
  // redirect back to client with token in hash fragment
  const clientUrl = process.env.CLIENT_URL || "/";
  const target = `${clientUrl}#token=${encodeURIComponent(token)}`;
  res.redirect(target);
};
