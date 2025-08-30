import type { RequestHandler } from "express";
import { sendMail } from "../mailer";

export const submitSupport: RequestHandler = async (req, res) => {
  const { email, message } = req.body as { email: string; message: string };
  if (!email || !message)
    return res.status(400).json({ error: "email and message required" });
  const admin = process.env.SENDGRID_FROM_EMAIL || "admin@terramrv.org";
  await sendMail(admin, `Support Request from ${email}`, message);
  res.json({ ok: true });
};
