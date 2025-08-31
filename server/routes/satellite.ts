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

// Types for satellite data
interface SatelliteRequest {
  latitude: number;
  longitude: number;
  startDate: string;
  endDate: string;
  cloudCover?: number;
  resolution?: number;
}

interface SatelliteImagery {
  id: string;
  date: string;
  cloudCover: number;
  bands: {
    red: string;
    green: string;
    blue: string;
    nir: string;
    swir1: string;
    swir2: string;
  };
  indices: {
    ndvi: number;
    evi: number;
    savi: number;
    ndwi: number;
  };
  metadata: {
    satellite: string;
    resolution: number;
    quality: number;
  };
}

interface VegetationAnalysis {
  trend: "increasing" | "decreasing" | "stable";
  seasonality: number;
  anomalies: { date: string; severity: number; type: string }[];
  summary: {
    avgNDVI: number;
    maxNDVI: number;
    minNDVI: number;
    biomassChange: number;
    healthScore: number;
  };
}

// Fetch satellite imagery for a location
export const fetchImagery: RequestHandler = async (req, res) => {
  try {
    const user = requireUser(req);
    if (!user) return res.status(401).json({ error: "Unauthorized" });

    const { latitude, longitude, startDate, endDate, cloudCover = 20, resolution = 10 } = req.body as SatelliteRequest;

    if (!latitude || !longitude || !startDate || !endDate) {
      return res.status(400).json({ error: "Missing required parameters" });
    }

    // Simulate satellite data fetching (in production, integrate with APIs like Google Earth Engine, Planet, etc.)
    const imagery = await fetchSatelliteData(latitude, longitude, startDate, endDate, cloudCover, resolution);
    
    // Store in database
    const db = await getDb();
    await (db as any).collection("satellite_imagery").insertMany(
      imagery.map(img => ({
        ...img,
        userId: user.id,
        location: { type: "Point", coordinates: [longitude, latitude] },
        createdAt: new Date(),
      }))
    );

    res.json({ success: true, count: imagery.length, imagery });
  } catch (error: any) {
    console.error("Satellite fetch error:", error);
    res.status(500).json({ error: error.message || "Failed to fetch satellite data" });
  }
};

// Analyze vegetation trends
export const analyzeVegetation: RequestHandler = async (req, res) => {
  try {
    const user = requireUser(req);
    if (!user) return res.status(401).json({ error: "Unauthorized" });

    const { latitude, longitude, timeRange = "1y" } = req.body;

    if (!latitude || !longitude) {
      return res.status(400).json({ error: "Location coordinates required" });
    }

    const db = await getDb();
    
    // Fetch stored imagery
    const cursor = await (db as any).collection("satellite_imagery").find({
      userId: user.id,
      location: {
        $near: {
          $geometry: { type: "Point", coordinates: [longitude, latitude] },
          $maxDistance: 1000 // 1km radius
        }
      }
    }).sort({ date: 1 });
    
    const imagery = await cursor.toArray();

    if (imagery.length === 0) {
      return res.status(404).json({ error: "No satellite data found for this location" });
    }

    // Perform vegetation analysis
    const analysis = await performVegetationAnalysis(imagery);
    
    // Store analysis results
    await (db as any).collection("vegetation_analysis").insertOne({
      userId: user.id,
      location: { type: "Point", coordinates: [longitude, latitude] },
      timeRange,
      analysis,
      createdAt: new Date(),
    });

    res.json(analysis);
  } catch (error: any) {
    console.error("Vegetation analysis error:", error);
    res.status(500).json({ error: error.message || "Analysis failed" });
  }
};

// Get land cover classification
export const classifyLandCover: RequestHandler = async (req, res) => {
  try {
    const user = requireUser(req);
    if (!user) return res.status(401).json({ error: "Unauthorized" });

    const { latitude, longitude, date } = req.body;

    if (!latitude || !longitude) {
      return res.status(400).json({ error: "Location coordinates required" });
    }

    // Simulate land cover classification (integrate with ML models)
    const classification = await classifyLandCoverML(latitude, longitude, date);
    
    const db = await getDb();
    await (db as any).collection("land_cover").insertOne({
      userId: user.id,
      location: { type: "Point", coordinates: [longitude, latitude] },
      date: date || new Date().toISOString(),
      classification,
      createdAt: new Date(),
    });

    res.json(classification);
  } catch (error: any) {
    console.error("Land cover classification error:", error);
    res.status(500).json({ error: error.message || "Classification failed" });
  }
};

// Detect changes over time
export const detectChanges: RequestHandler = async (req, res) => {
  try {
    const user = requireUser(req);
    if (!user) return res.status(401).json({ error: "Unauthorized" });

    const { latitude, longitude, beforeDate, afterDate } = req.body;

    if (!latitude || !longitude || !beforeDate || !afterDate) {
      return res.status(400).json({ error: "Missing required parameters for change detection" });
    }

    // Simulate change detection analysis
    const changes = await detectLandCoverChanges(latitude, longitude, beforeDate, afterDate);
    
    const db = await getDb();
    await (db as any).collection("change_detection").insertOne({
      userId: user.id,
      location: { type: "Point", coordinates: [longitude, latitude] },
      beforeDate,
      afterDate,
      changes,
      createdAt: new Date(),
    });

    res.json(changes);
  } catch (error: any) {
    console.error("Change detection error:", error);
    res.status(500).json({ error: error.message || "Change detection failed" });
  }
};

// Helper functions for satellite data processing

async function fetchSatelliteData(
  lat: number, 
  lng: number, 
  startDate: string, 
  endDate: string, 
  cloudCover: number, 
  resolution: number
): Promise<SatelliteImagery[]> {
  // Simulate fetching from satellite APIs (Sentinel-2, Landsat, etc.)
  const start = new Date(startDate);
  const end = new Date(endDate);
  const imagery: SatelliteImagery[] = [];
  
  // Generate mock imagery data points
  const daysDiff = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
  const interval = Math.max(1, Math.floor(daysDiff / 20)); // Max 20 images
  
  for (let i = 0; i < daysDiff; i += interval) {
    const date = new Date(start.getTime() + i * 24 * 60 * 60 * 1000);
    const cloudCoverForDate = Math.random() * 100;
    
    if (cloudCoverForDate <= cloudCover) {
      imagery.push({
        id: `img_${date.getTime()}`,
        date: date.toISOString().split('T')[0],
        cloudCover: cloudCoverForDate,
        bands: {
          red: `band_red_${date.getTime()}`,
          green: `band_green_${date.getTime()}`,
          blue: `band_blue_${date.getTime()}`,
          nir: `band_nir_${date.getTime()}`,
          swir1: `band_swir1_${date.getTime()}`,
          swir2: `band_swir2_${date.getTime()}`,
        },
        indices: calculateIndices(lat, lng, date),
        metadata: {
          satellite: Math.random() > 0.5 ? "Sentinel-2" : "Landsat-8",
          resolution,
          quality: Math.random() * 0.3 + 0.7, // 0.7-1.0 quality
        },
      });
    }
  }
  
  return imagery;
}

function calculateIndices(lat: number, lng: number, date: Date) {
  // Simulate vegetation indices calculation
  const seasonality = Math.sin((date.getMonth() / 12) * 2 * Math.PI) * 0.2;
  const latitudeFactor = Math.cos(lat * Math.PI / 180) * 0.1;
  const randomness = (Math.random() - 0.5) * 0.2;
  
  const baseNDVI = 0.6 + seasonality + latitudeFactor + randomness;
  const ndvi = Math.max(0, Math.min(1, baseNDVI));
  
  return {
    ndvi: Number(ndvi.toFixed(3)),
    evi: Number((ndvi * 0.8 + 0.1).toFixed(3)),
    savi: Number((ndvi * 1.2 + 0.05).toFixed(3)),
    ndwi: Number((0.3 + Math.random() * 0.4).toFixed(3)),
  };
}

async function performVegetationAnalysis(imagery: any[]): Promise<VegetationAnalysis> {
  // Extract NDVI values
  const ndviValues = imagery.map(img => img.indices.ndvi).filter(v => v !== null);
  const dates = imagery.map(img => img.date);
  
  if (ndviValues.length === 0) {
    throw new Error("No valid NDVI data available");
  }
  
  // Calculate trend
  const trend = calculateTrend(ndviValues);
  
  // Detect anomalies
  const anomalies = detectAnomalies(imagery);
  
  // Calculate summary statistics
  const avgNDVI = ndviValues.reduce((a, b) => a + b, 0) / ndviValues.length;
  const maxNDVI = Math.max(...ndviValues);
  const minNDVI = Math.min(...ndviValues);
  
  // Estimate biomass change (simplified)
  const biomassChange = (maxNDVI - minNDVI) * 100; // Percentage change
  
  // Health score based on NDVI stability and values
  const healthScore = Math.min(100, avgNDVI * 100 + (100 - (maxNDVI - minNDVI) * 100));
  
  return {
    trend,
    seasonality: 0.8, // Simplified seasonality score
    anomalies,
    summary: {
      avgNDVI: Number(avgNDVI.toFixed(3)),
      maxNDVI: Number(maxNDVI.toFixed(3)),
      minNDVI: Number(minNDVI.toFixed(3)),
      biomassChange: Number(biomassChange.toFixed(1)),
      healthScore: Number(healthScore.toFixed(0)),
    },
  };
}

function calculateTrend(values: number[]): "increasing" | "decreasing" | "stable" {
  if (values.length < 2) return "stable";
  
  const first = values.slice(0, Math.floor(values.length / 3));
  const last = values.slice(-Math.floor(values.length / 3));
  
  const firstAvg = first.reduce((a, b) => a + b, 0) / first.length;
  const lastAvg = last.reduce((a, b) => a + b, 0) / last.length;
  
  const change = lastAvg - firstAvg;
  
  if (change > 0.05) return "increasing";
  if (change < -0.05) return "decreasing";
  return "stable";
}

function detectAnomalies(imagery: any[]): { date: string; severity: number; type: string }[] {
  const anomalies = [];
  const ndviValues = imagery.map(img => img.indices.ndvi);
  const mean = ndviValues.reduce((a, b) => a + b, 0) / ndviValues.length;
  const stdDev = Math.sqrt(ndviValues.reduce((sq, n) => sq + Math.pow(n - mean, 2), 0) / ndviValues.length);
  
  for (let i = 0; i < imagery.length; i++) {
    const ndvi = imagery[i].indices.ndvi;
    const deviation = Math.abs(ndvi - mean) / stdDev;
    
    if (deviation > 2) {
      anomalies.push({
        date: imagery[i].date,
        severity: Math.min(1, deviation / 3),
        type: ndvi < mean ? "vegetation_loss" : "unusual_growth",
      });
    }
  }
  
  return anomalies;
}

async function classifyLandCoverML(lat: number, lng: number, date?: string) {
  // Simulate ML-based land cover classification
  const classes = ["forest", "agriculture", "urban", "water", "grassland", "barren"];
  const probabilities = [0.4, 0.3, 0.1, 0.05, 0.1, 0.05]; // Agricultural area bias
  
  const randomIndex = Math.floor(Math.random() * classes.length);
  const primaryClass = classes[randomIndex];
  const confidence = 0.7 + Math.random() * 0.25;
  
  return {
    primaryClass,
    confidence: Number(confidence.toFixed(2)),
    probabilities: classes.reduce((obj, cls, i) => {
      obj[cls] = Number((probabilities[i] + (Math.random() - 0.5) * 0.2).toFixed(2));
      return obj;
    }, {} as Record<string, number>),
    metadata: {
      model: "land_cover_cnn_v2.1",
      date: date || new Date().toISOString().split('T')[0],
      processingTime: Math.random() * 5 + 1, // 1-6 seconds
    },
  };
}

async function detectLandCoverChanges(lat: number, lng: number, beforeDate: string, afterDate: string) {
  // Simulate change detection between two time periods
  const changeTypes = ["deforestation", "afforestation", "urbanization", "crop_change", "no_change"];
  const probabilities = [0.1, 0.15, 0.05, 0.3, 0.4];
  
  const randomIndex = Math.floor(Math.random() * changeTypes.length);
  const changeType = changeTypes[randomIndex];
  const confidence = 0.6 + Math.random() * 0.35;
  const areaChanged = Math.random() * 100; // Percentage
  
  return {
    changeType,
    confidence: Number(confidence.toFixed(2)),
    areaChanged: Number(areaChanged.toFixed(1)),
    beforeDate,
    afterDate,
    details: {
      methodology: "supervised_classification_change_detection",
      pixelAnalysis: {
        totalPixels: 10000,
        changedPixels: Math.floor(areaChanged * 100),
        noChangePixels: Math.floor((100 - areaChanged) * 100),
      },
    },
    recommendations: generateChangeRecommendations(changeType, areaChanged),
  };
}

function generateChangeRecommendations(changeType: string, areaChanged: number): string[] {
  const recommendations = [];
  
  switch (changeType) {
    case "deforestation":
      recommendations.push("Consider reforestation to restore carbon sequestration capacity");
      recommendations.push("Implement soil conservation measures to prevent erosion");
      if (areaChanged > 20) {
        recommendations.push("Significant forest loss detected - investigate causes and implement protection measures");
      }
      break;
      
    case "afforestation":
      recommendations.push("Excellent progress on forest restoration - continue monitoring growth");
      recommendations.push("Document tree species and planting density for carbon credit calculations");
      break;
      
    case "crop_change":
      recommendations.push("Monitor soil health impacts of crop rotation");
      recommendations.push("Consider carbon-friendly crop varieties and practices");
      break;
      
    case "urbanization":
      recommendations.push("Urban expansion detected - consider sustainable development practices");
      break;
      
    default:
      recommendations.push("Continue monitoring for changes");
  }
  
  return recommendations;
}
