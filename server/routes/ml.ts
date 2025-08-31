import type { RequestHandler } from "express";
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

// Types for ML requests and responses
interface CarbonEstimateRequest {
  areaHa: number;
  system: "Agroforestry" | "Rice";
  soilSOC: number;
  treeCover: number;
  rainfall: number;
  latitude?: number;
  longitude?: number;
  historicalData?: any[];
}

interface CarbonEstimateResponse {
  yearly: number;
  current: number;
  projection: { year: number; credits: number; confidence: number }[];
  confidence: number;
  modelVersion: string;
  featureImportance: { [key: string]: number };
  recommendations: string[];
}

interface SoilHealthRequest {
  latitude: number;
  longitude: number;
  soilType: string;
  crops: string;
  practices: string;
  historicalSOC?: number;
}

interface SoilHealthResponse {
  predictedSOC: number;
  confidence: number;
  soilHealthScore: number;
  recommendations: string[];
  samplingPoints: {
    lat: number;
    lng: number;
    priority: "high" | "medium" | "low";
  }[];
}

interface AnomalyCheckRequest {
  userId: string;
  activityLogs: any[];
  timeWindow: string;
}

interface AnomalyCheckResponse {
  riskScore: number;
  anomalies: {
    type: string;
    severity: "low" | "medium" | "high";
    description: string;
  }[];
  recommendations: string[];
}

// Enhanced Carbon Credit Estimation with ML
export const carbonEstimate: RequestHandler = async (req, res) => {
  try {
    const input = req.body as CarbonEstimateRequest;

    // Validate input
    if (
      !input.areaHa ||
      !input.system ||
      !input.soilSOC ||
      !input.treeCover ||
      !input.rainfall
    ) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    // Enhanced ML-based estimation
    const response = await enhancedCarbonEstimation(input);
    res.json(response);
  } catch (error: any) {
    console.error("Carbon estimation error:", error);
    res.status(500).json({ error: error.message || "Estimation failed" });
  }
};

// Soil Health Prediction
export const soilHealthPredict: RequestHandler = async (req, res) => {
  try {
    const user = requireUser(req);
    if (!user) return res.status(401).json({ error: "Unauthorized" });

    const input = req.body as SoilHealthRequest;

    if (!input.latitude || !input.longitude || !input.soilType) {
      return res
        .status(400)
        .json({ error: "Missing required location or soil data" });
    }

    const response = await predictSoilHealth(input);
    res.json(response);
  } catch (error: any) {
    console.error("Soil health prediction error:", error);
    res.status(500).json({ error: error.message || "Prediction failed" });
  }
};

// Anomaly Detection for Fraud Prevention
export const anomalyCheck: RequestHandler = async (req, res) => {
  try {
    const user = requireUser(req);
    if (!user) return res.status(401).json({ error: "Unauthorized" });

    const input = req.body as AnomalyCheckRequest;
    input.userId = user.id;

    if (!input.activityLogs || !Array.isArray(input.activityLogs)) {
      return res.status(400).json({ error: "Activity logs required" });
    }

    const response = await detectAnomalies(input);
    res.json(response);
  } catch (error: any) {
    console.error("Anomaly detection error:", error);
    res.status(500).json({ error: error.message || "Detection failed" });
  }
};

// Enhanced Carbon Estimation Model
async function enhancedCarbonEstimation(
  input: CarbonEstimateRequest,
): Promise<CarbonEstimateResponse> {
  const { areaHa, system, soilSOC, treeCover, rainfall, latitude, longitude } =
    input;

  // Feature engineering
  const features = {
    area: areaHa,
    systemFactor: system === "Agroforestry" ? 1.0 : 0.6,
    soilCarbon: soilSOC,
    canopyCover: treeCover / 100,
    precipitation: rainfall,
    climateZone: getClimateZone(latitude, longitude),
    soilQuality: calculateSoilQuality(soilSOC),
    vegetationIndex: estimateVegetationIndex(treeCover, system),
  };

  // ML Model simulation (replace with actual model inference)
  const baseSequestration = await calculateEnhancedSequestration(features);
  const uncertainty = calculateUncertainty(features);
  const yearly = baseSequestration * areaHa;

  // Generate 5-year projection with uncertainty
  const projection = Array.from({ length: 6 }).map((_, i) => {
    const growthFactor = Math.min(1, 0.15 + i * 0.17);
    const seasonalVariation = 1 + 0.1 * Math.sin((i * Math.PI) / 3);
    const credits =
      Math.round(yearly * growthFactor * seasonalVariation * 10) / 10;
    const confidence = Math.max(0.6, 0.95 - i * 0.05 - uncertainty);

    return { year: i, credits, confidence };
  });

  const featureImportance = {
    soilSOC: 0.25,
    treeCover: 0.22,
    rainfall: 0.18,
    system: 0.15,
    areaHa: 0.12,
    climate: 0.08,
  };

  const recommendations = generateRecommendations(features, projection);

  return {
    yearly,
    current: projection[projection.length - 1].credits,
    projection,
    confidence: 0.85 - uncertainty,
    modelVersion: "v2.1.0",
    featureImportance,
    recommendations,
  };
}

// Soil Health Prediction Model
async function predictSoilHealth(
  input: SoilHealthRequest,
): Promise<SoilHealthResponse> {
  const { latitude, longitude, soilType, crops, practices } = input;

  // Simulate ML prediction
  const climateData = await getClimateData(latitude, longitude);
  const landUseHistory = analyzeLandUse(crops, practices);

  const predictedSOC = calculatePredictedSOC(
    soilType,
    climateData,
    landUseHistory,
  );
  const confidence = 0.82;
  const soilHealthScore = Math.min(100, (predictedSOC / 40) * 100);

  const recommendations = generateSoilRecommendations(
    predictedSOC,
    soilType,
    practices,
  );
  const samplingPoints = generateSamplingPoints(
    latitude,
    longitude,
    soilHealthScore,
  );

  return {
    predictedSOC,
    confidence,
    soilHealthScore,
    recommendations,
    samplingPoints,
  };
}

// Anomaly Detection Model
async function detectAnomalies(
  input: AnomalyCheckRequest,
): Promise<AnomalyCheckResponse> {
  const { userId, activityLogs, timeWindow } = input;

  // Analyze patterns in activity logs
  const patterns = analyzeActivityPatterns(activityLogs);
  const temporalAnomalies = detectTemporalAnomalies(activityLogs, timeWindow);
  const volumeAnomalies = detectVolumeAnomalies(activityLogs);

  const riskScore = calculateRiskScore(
    patterns,
    temporalAnomalies,
    volumeAnomalies,
  );

  const anomalies = [...temporalAnomalies, ...volumeAnomalies].map(
    (anomaly) => ({
      type: anomaly.type,
      severity:
        anomaly.score > 0.8
          ? "high"
          : anomaly.score > 0.5
            ? "medium"
            : ("low" as const),
      description: anomaly.description,
    }),
  );

  const recommendations = generateAnomalyRecommendations(riskScore, anomalies);

  return {
    riskScore,
    anomalies,
    recommendations,
  };
}

// Helper functions (ML model simulation)
async function calculateEnhancedSequestration(features: any): Promise<number> {
  // Simulate advanced ML model with multiple factors
  const {
    systemFactor,
    soilCarbon,
    canopyCover,
    precipitation,
    climateZone,
    soilQuality,
    vegetationIndex,
  } = features;

  const baseRate = 0.8;
  const climateMultiplier = Math.min(1.3, Math.max(0.7, precipitation / 1000));
  const soilMultiplier = Math.min(1.2, soilQuality);
  const vegetationMultiplier = Math.min(1.4, vegetationIndex);
  const zoneMultiplier =
    climateZone === "tropical" ? 1.2 : climateZone === "temperate" ? 1.0 : 0.8;

  return (
    baseRate *
    systemFactor *
    climateMultiplier *
    soilMultiplier *
    vegetationMultiplier *
    zoneMultiplier
  );
}

function calculateUncertainty(features: any): number {
  // Higher uncertainty for extreme values or missing data
  let uncertainty = 0.1;

  if (features.soilCarbon < 10 || features.soilCarbon > 60) uncertainty += 0.1;
  if (features.precipitation < 300 || features.precipitation > 2000)
    uncertainty += 0.1;
  if (!features.climateZone) uncertainty += 0.05;

  return Math.min(0.3, uncertainty);
}

function getClimateZone(lat?: number, lng?: number): string {
  if (!lat) return "unknown";

  if (Math.abs(lat) < 23.5) return "tropical";
  if (Math.abs(lat) < 35) return "subtropical";
  if (Math.abs(lat) < 50) return "temperate";
  return "cold";
}

function calculateSoilQuality(soc: number): number {
  // Normalize SOC to quality score (0-1)
  return Math.min(1, Math.max(0.3, soc / 40));
}

function estimateVegetationIndex(treeCover: number, system: string): number {
  const baseCover = treeCover / 100;
  const systemBonus = system === "Agroforestry" ? 0.3 : 0;
  return Math.min(1.5, baseCover + systemBonus);
}

function generateRecommendations(features: any, projection: any[]): string[] {
  const recommendations = [];

  if (features.soilCarbon < 25) {
    recommendations.push(
      "Consider adding organic matter through composting or cover crops to improve soil carbon",
    );
  }

  if (features.canopyCover < 0.3) {
    recommendations.push(
      "Increase tree cover to enhance carbon sequestration potential",
    );
  }

  if (features.precipitation < 600) {
    recommendations.push(
      "Implement water conservation techniques for better plant growth",
    );
  }

  const avgConfidence =
    projection.reduce((sum, p) => sum + p.confidence, 0) / projection.length;
  if (avgConfidence < 0.8) {
    recommendations.push(
      "Consider additional monitoring and verification to increase confidence in estimates",
    );
  }

  return recommendations;
}

async function getClimateData(lat: number, lng: number): Promise<any> {
  // Simulate climate data retrieval
  return {
    temperature: 25 + Math.random() * 10,
    humidity: 60 + Math.random() * 30,
    seasonalVariation: Math.random() * 0.3,
  };
}

function analyzeLandUse(crops: string, practices: string): any {
  return {
    diversity: crops?.split(",").length || 1,
    sustainabilityScore: practices?.includes("organic") ? 0.8 : 0.5,
    rotationBenefit: practices?.includes("rotation") ? 0.3 : 0,
  };
}

function calculatePredictedSOC(
  soilType: string,
  climate: any,
  landUse: any,
): number {
  let baseSOC = 30; // Default baseline

  // Soil type adjustments
  if (soilType?.includes("clay")) baseSOC += 5;
  if (soilType?.includes("sandy")) baseSOC -= 3;
  if (soilType?.includes("loam")) baseSOC += 2;

  // Climate adjustments
  baseSOC += climate.humidity * 0.1;
  baseSOC += (climate.temperature - 25) * 0.2;

  // Land use adjustments
  baseSOC += landUse.sustainabilityScore * 10;
  baseSOC += landUse.rotationBenefit * 5;

  return Math.max(10, Math.min(60, baseSOC));
}

function generateSoilRecommendations(
  soc: number,
  soilType: string,
  practices: string,
): string[] {
  const recommendations = [];

  if (soc < 25) {
    recommendations.push(
      "Increase organic matter input through composting and crop residues",
    );
    recommendations.push("Consider cover cropping during fallow periods");
  }

  if (soilType?.includes("sandy")) {
    recommendations.push(
      "Add clay amendments to improve water and nutrient retention",
    );
  }

  if (!practices?.includes("rotation")) {
    recommendations.push("Implement crop rotation to improve soil health");
  }

  if (soc > 40) {
    recommendations.push(
      "Excellent soil carbon levels - maintain current practices",
    );
  }

  return recommendations;
}

function generateSamplingPoints(
  lat: number,
  lng: number,
  healthScore: number,
): any[] {
  const points = [];
  const radius = 0.01; // ~1km

  // Generate sampling points based on health score
  const numPoints = healthScore < 60 ? 8 : healthScore < 80 ? 5 : 3;

  for (let i = 0; i < numPoints; i++) {
    const angle = (2 * Math.PI * i) / numPoints;
    const distance = radius * (0.5 + Math.random() * 0.5);

    points.push({
      lat: lat + distance * Math.cos(angle),
      lng: lng + distance * Math.sin(angle),
      priority:
        healthScore < 60
          ? "high"
          : healthScore < 80
            ? "medium"
            : ("low" as const),
    });
  }

  return points;
}

function analyzeActivityPatterns(logs: any[]): any {
  const patterns = {
    frequency: logs.length,
    types: [...new Set(logs.map((l) => l.type))],
    quantities: logs.map((l) => l.quantity || 1),
    timeDistribution: {},
  };

  return patterns;
}

function detectTemporalAnomalies(logs: any[], timeWindow: string): any[] {
  const anomalies = [];

  // Check for sudden spikes in activity
  const recentLogs = logs.filter((l) => {
    const logDate = new Date(l.date || l.createdAt);
    const cutoff = new Date();
    cutoff.setDate(cutoff.getDate() - 30);
    return logDate > cutoff;
  });

  if (recentLogs.length > logs.length * 0.8) {
    anomalies.push({
      type: "temporal_spike",
      score: 0.7,
      description: "Unusual concentration of recent activities",
    });
  }

  return anomalies;
}

function detectVolumeAnomalies(logs: any[]): any[] {
  const anomalies = [];

  // Check for unusually large quantities
  const quantities = logs.map((l) => Number(l.quantity) || 1);
  const avgQuantity = quantities.reduce((a, b) => a + b, 0) / quantities.length;
  const maxQuantity = Math.max(...quantities);

  if (maxQuantity > avgQuantity * 5) {
    anomalies.push({
      type: "volume_spike",
      score: 0.6,
      description: "Unusually large quantity reported in single entry",
    });
  }

  return anomalies;
}

function calculateRiskScore(
  patterns: any,
  temporalAnomalies: any[],
  volumeAnomalies: any[],
): number {
  let risk = 0;

  // Base risk from patterns
  if (patterns.frequency > 50) risk += 0.2;
  if (patterns.types.length < 3) risk += 0.1;

  // Risk from anomalies
  temporalAnomalies.forEach((a) => (risk += a.score * 0.3));
  volumeAnomalies.forEach((a) => (risk += a.score * 0.4));

  return Math.min(1, risk);
}

function generateAnomalyRecommendations(
  riskScore: number,
  anomalies: any[],
): string[] {
  const recommendations = [];

  if (riskScore > 0.7) {
    recommendations.push("High risk detected - manual review recommended");
    recommendations.push(
      "Verify large quantity entries with supporting documentation",
    );
  } else if (riskScore > 0.4) {
    recommendations.push("Medium risk - additional verification may be needed");
  } else {
    recommendations.push("Low risk - normal activity pattern detected");
  }

  if (anomalies.some((a) => a.type === "temporal_spike")) {
    recommendations.push(
      "Recent activity spike detected - verify timing and authenticity",
    );
  }

  if (anomalies.some((a) => a.type === "volume_spike")) {
    recommendations.push(
      "Large quantity entries detected - verify measurements and methods",
    );
  }

  return recommendations;
}
