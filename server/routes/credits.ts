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

function coeffFor(type: string) {
  // Positive = savings, negative = emissions (tCO2e per unit)
  const map: Record<string, number> = {
    plowing: -0.01,
    seeding: -0.002,
    harvesting: -0.005,
    fertilizer: -0.001,
    pesticide: -0.0005,
    irrigation: -0.0008,
    machinery: -0.02,
    tree_planting: 0.1,
    cover_cropping: 0.02,
  };
  return map[type] ?? 0;
}

export const getCredits: RequestHandler = async (req, res) => {
  const user = requireUser(req);
  if (!user) return res.status(401).json({ error: "Unauthorized" });
  const db = await getDb();
  const logsCursor = await (db as any)
    .collection("activity_logs")
    .find({ userId: user.id });
  const logs = await (logsCursor as any).toArray();
  const monthly: Record<string, number> = {};
  let total = 0;
  for (const l of logs) {
    const k = String(l.date).slice(0, 7); // YYYY-MM
    const qty = l.quantity ?? 1;
    const c = coeffFor(l.type) * (isNaN(Number(qty)) ? 1 : Number(qty));
    monthly[k] = (monthly[k] || 0) + c;
    total += c;
  }
  // payouts
  const payoutsCursor = await (db as any)
    .collection("payouts")
    .find({ userId: user.id });
  const payouts = await (payoutsCursor as any).toArray();
  const paid = payouts.reduce((s: number, p: any) => s + (p.amount || 0), 0);
  const balance = total - paid;
  res.json({ balance, total, paid, monthly, payouts });
};

export const requestPayout: RequestHandler = async (req, res) => {
  const user = requireUser(req);
  if (!user) return res.status(401).json({ error: "Unauthorized" });
  const { amount } = req.body as any;
  const a = Number(amount);
  if (!a || a <= 0) return res.status(400).json({ error: "Invalid amount" });

  const db = await getDb();

  // Get activity logs for fraud detection
  const logsCursor = await (db as any)
    .collection("activity_logs")
    .find({ userId: user.id });
  const logs = await (logsCursor as any).toArray();

  // Perform anomaly detection
  try {
    const anomalyCheck = await performAnomalyCheck(user.id, logs, a);

    let status = "requested";
    let flagged = false;

    if (anomalyCheck.riskScore > 0.7) {
      status = "flagged_high_risk";
      flagged = true;
    } else if (anomalyCheck.riskScore > 0.4) {
      status = "pending_review";
      flagged = true;
    }

    await (db as any).collection("payouts").insertOne({
      userId: user.id,
      amount: a,
      status,
      flagged,
      riskScore: anomalyCheck.riskScore,
      anomalies: anomalyCheck.anomalies,
      mlRecommendations: anomalyCheck.recommendations,
      createdAt: new Date(),
    });

    res.json({
      ok: true,
      status,
      flagged,
      message: flagged
        ? "Request submitted for review due to unusual activity patterns"
        : "Payout requested successfully",
    });
  } catch (error) {
    console.error("Anomaly detection failed:", error);
    // Fallback to manual review if ML fails
    await (db as any).collection("payouts").insertOne({
      userId: user.id,
      amount: a,
      status: "pending_review",
      flagged: true,
      notes: "ML anomaly detection unavailable - manual review required",
      createdAt: new Date(),
    });

    res.json({
      ok: true,
      status: "pending_review",
      flagged: true,
      message: "Request submitted for manual review",
    });
  }
};

// Internal function to call ML anomaly detection
async function performAnomalyCheck(
  userId: string,
  activityLogs: any[],
  requestedAmount: number,
) {
  const response = await fetch(
    `${process.env.API_BASE_URL || "http://localhost:8080"}/api/ml/anomaly-check`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${generateInternalToken(userId)}`, // Internal service token
      },
      body: JSON.stringify({
        userId,
        activityLogs,
        timeWindow: "30d",
        requestedAmount,
      }),
    },
  );

  if (!response.ok) {
    throw new Error(`Anomaly check failed: ${response.status}`);
  }

  return await response.json();
}

function generateInternalToken(userId: string): string {
  const secret = process.env.JWT_SECRET || "dev-secret";
  return jwt.sign({ _id: userId, internal: true }, secret, { expiresIn: "5m" });
}
