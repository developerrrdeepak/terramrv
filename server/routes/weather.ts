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

// Types for weather data
interface WeatherRequest {
  latitude: number;
  longitude: number;
  startDate?: string;
  endDate?: string;
  includeHourly?: boolean;
}

interface WeatherData {
  date: string;
  temperature: {
    min: number;
    max: number;
    avg: number;
  };
  humidity: number;
  precipitation: number;
  windSpeed: number;
  pressure: number;
  solarRadiation: number;
  cloudCover: number;
  dewPoint: number;
}

interface WeatherForecast {
  date: string;
  temperature: {
    min: number;
    max: number;
  };
  precipitation: number;
  humidity: number;
  windSpeed: number;
  conditions: string;
  confidence: number;
}

interface ClimateAnalysis {
  averageTemperature: number;
  totalPrecipitation: number;
  growingDegreeDays: number;
  frostRisk: number;
  droughtIndex: number;
  heatStressRisk: number;
  optimalPlantingWindow: {
    start: string;
    end: string;
  };
  recommendations: string[];
}

// Get historical weather data
export const getHistoricalWeather: RequestHandler = async (req, res) => {
  try {
    const user = requireUser(req);
    if (!user) return res.status(401).json({ error: "Unauthorized" });

    const { latitude, longitude, startDate, endDate, includeHourly = false } = req.body as WeatherRequest;

    if (!latitude || !longitude) {
      return res.status(400).json({ error: "Latitude and longitude required" });
    }

    const start = startDate ? new Date(startDate) : new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
    const end = endDate ? new Date(endDate) : new Date();

    // Fetch historical weather data (simulate API call)
    const weatherData = await fetchHistoricalWeatherData(latitude, longitude, start, end, includeHourly);
    
    // Store in database for caching
    const db = await getDb();
    await (db as any).collection("weather_data").insertMany(
      weatherData.map(data => ({
        ...data,
        userId: user.id,
        location: { type: "Point", coordinates: [longitude, latitude] },
        createdAt: new Date(),
      }))
    );

    res.json({ success: true, data: weatherData });
  } catch (error: any) {
    console.error("Weather data fetch error:", error);
    res.status(500).json({ error: error.message || "Failed to fetch weather data" });
  }
};

// Get weather forecast
export const getWeatherForecast: RequestHandler = async (req, res) => {
  try {
    const user = requireUser(req);
    if (!user) return res.status(401).json({ error: "Unauthorized" });

    const { latitude, longitude } = req.body;

    if (!latitude || !longitude) {
      return res.status(400).json({ error: "Latitude and longitude required" });
    }

    // Generate weather forecast (simulate API call)
    const forecast = await generateWeatherForecast(latitude, longitude);
    
    res.json({ success: true, forecast });
  } catch (error: any) {
    console.error("Weather forecast error:", error);
    res.status(500).json({ error: error.message || "Failed to get weather forecast" });
  }
};

// Analyze climate for agriculture
export const analyzeClimate: RequestHandler = async (req, res) => {
  try {
    const user = requireUser(req);
    if (!user) return res.status(401).json({ error: "Unauthorized" });

    const { latitude, longitude, cropType, timeRange = "1y" } = req.body;

    if (!latitude || !longitude) {
      return res.status(400).json({ error: "Latitude and longitude required" });
    }

    // Get historical weather data for analysis
    const endDate = new Date();
    const startDate = new Date();
    if (timeRange === "1y") {
      startDate.setFullYear(endDate.getFullYear() - 1);
    } else if (timeRange === "6m") {
      startDate.setMonth(endDate.getMonth() - 6);
    } else {
      startDate.setMonth(endDate.getMonth() - 3);
    }

    const historicalData = await fetchHistoricalWeatherData(latitude, longitude, startDate, endDate, false);
    
    // Perform climate analysis
    const analysis = await performClimateAnalysis(historicalData, cropType || "Rice", latitude);
    
    // Store analysis results
    const db = await getDb();
    await (db as any).collection("climate_analysis").insertOne({
      userId: user.id,
      location: { type: "Point", coordinates: [longitude, latitude] },
      cropType: cropType || "Rice",
      timeRange,
      analysis,
      createdAt: new Date(),
    });

    res.json(analysis);
  } catch (error: any) {
    console.error("Climate analysis error:", error);
    res.status(500).json({ error: error.message || "Climate analysis failed" });
  }
};

// Get agricultural weather alerts
export const getWeatherAlerts: RequestHandler = async (req, res) => {
  try {
    const user = requireUser(req);
    if (!user) return res.status(401).json({ error: "Unauthorized" });

    const { latitude, longitude, cropType } = req.body;

    if (!latitude || !longitude) {
      return res.status(400).json({ error: "Latitude and longitude required" });
    }

    // Generate weather alerts based on forecast and crop needs
    const alerts = await generateWeatherAlerts(latitude, longitude, cropType || "Rice");
    
    res.json({ alerts });
  } catch (error: any) {
    console.error("Weather alerts error:", error);
    res.status(500).json({ error: error.message || "Failed to get weather alerts" });
  }
};

// Helper functions

async function fetchHistoricalWeatherData(
  lat: number,
  lng: number,
  startDate: Date,
  endDate: Date,
  includeHourly: boolean
): Promise<WeatherData[]> {
  const data: WeatherData[] = [];
  const daysDiff = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));
  
  for (let i = 0; i <= daysDiff; i++) {
    const date = new Date(startDate.getTime() + i * 24 * 60 * 60 * 1000);
    const dayOfYear = Math.floor((date.getTime() - new Date(date.getFullYear(), 0, 0).getTime()) / (1000 * 60 * 60 * 24));
    
    // Simulate seasonal temperature patterns
    const seasonalTemp = 25 + 10 * Math.sin((dayOfYear / 365) * 2 * Math.PI - Math.PI / 2);
    const latitudeAdjustment = (90 - Math.abs(lat)) / 90 * 15;
    const dailyVariation = (Math.random() - 0.5) * 8;
    
    const avgTemp = seasonalTemp + latitudeAdjustment + dailyVariation;
    const tempRange = 8 + Math.random() * 4;
    
    // Simulate precipitation patterns
    const seasonalPrecip = Math.max(0, 50 + 40 * Math.sin((dayOfYear / 365) * 2 * Math.PI));
    const precipitation = Math.random() < 0.3 ? seasonalPrecip * (0.5 + Math.random()) : 0;
    
    data.push({
      date: date.toISOString().split('T')[0],
      temperature: {
        min: Number((avgTemp - tempRange / 2).toFixed(1)),
        max: Number((avgTemp + tempRange / 2).toFixed(1)),
        avg: Number(avgTemp.toFixed(1)),
      },
      humidity: Number((60 + Math.random() * 30).toFixed(1)),
      precipitation: Number(precipitation.toFixed(1)),
      windSpeed: Number((5 + Math.random() * 10).toFixed(1)),
      pressure: Number((1013 + (Math.random() - 0.5) * 20).toFixed(1)),
      solarRadiation: Number((15 + Math.random() * 10).toFixed(1)),
      cloudCover: Number((Math.random() * 100).toFixed(0)),
      dewPoint: Number((avgTemp - 5 - Math.random() * 5).toFixed(1)),
    });
  }
  
  return data;
}

async function generateWeatherForecast(lat: number, lng: number): Promise<WeatherForecast[]> {
  const forecast: WeatherForecast[] = [];
  const today = new Date();
  
  for (let i = 0; i < 14; i++) {
    const date = new Date(today.getTime() + i * 24 * 60 * 60 * 1000);
    const dayOfYear = Math.floor((date.getTime() - new Date(date.getFullYear(), 0, 0).getTime()) / (1000 * 60 * 60 * 24));
    
    // Simulate forecast with decreasing confidence
    const confidence = Math.max(0.5, 0.95 - i * 0.03);
    
    const seasonalTemp = 25 + 10 * Math.sin((dayOfYear / 365) * 2 * Math.PI - Math.PI / 2);
    const latitudeAdjustment = (90 - Math.abs(lat)) / 90 * 15;
    const avgTemp = seasonalTemp + latitudeAdjustment + (Math.random() - 0.5) * 5;
    
    const precipChance = Math.random();
    const precipitation = precipChance < 0.3 ? Math.random() * 20 : 0;
    
    const conditions = precipitation > 10 ? "Rainy" : 
                      precipitation > 2 ? "Light Rain" :
                      Math.random() > 0.7 ? "Cloudy" : "Sunny";
    
    forecast.push({
      date: date.toISOString().split('T')[0],
      temperature: {
        min: Number((avgTemp - 6).toFixed(1)),
        max: Number((avgTemp + 6).toFixed(1)),
      },
      precipitation: Number(precipitation.toFixed(1)),
      humidity: Number((60 + Math.random() * 25).toFixed(1)),
      windSpeed: Number((5 + Math.random() * 8).toFixed(1)),
      conditions,
      confidence: Number(confidence.toFixed(2)),
    });
  }
  
  return forecast;
}

async function performClimateAnalysis(
  weatherData: WeatherData[],
  cropType: string,
  latitude: number
): Promise<ClimateAnalysis> {
  // Calculate climate metrics
  const temperatures = weatherData.map(d => d.temperature.avg);
  const precipitations = weatherData.map(d => d.precipitation);
  
  const averageTemperature = temperatures.reduce((a, b) => a + b, 0) / temperatures.length;
  const totalPrecipitation = precipitations.reduce((a, b) => a + b, 0);
  
  // Growing Degree Days (base temperature varies by crop)
  const baseTemp = getBaseTemperature(cropType);
  const growingDegreeDays = temperatures
    .map(temp => Math.max(0, temp - baseTemp))
    .reduce((a, b) => a + b, 0);
  
  // Risk assessments
  const frostRisk = temperatures.filter(temp => temp < 2).length / temperatures.length * 100;
  const droughtIndex = Math.max(0, 100 - totalPrecipitation / 10);
  const heatStressRisk = temperatures.filter(temp => temp > 35).length / temperatures.length * 100;
  
  // Optimal planting window (simplified)
  const plantingWindow = getOptimalPlantingWindow(cropType, latitude);
  
  // Generate recommendations
  const recommendations = generateClimateRecommendations(
    averageTemperature,
    totalPrecipitation,
    frostRisk,
    droughtIndex,
    heatStressRisk,
    cropType
  );
  
  return {
    averageTemperature: Number(averageTemperature.toFixed(1)),
    totalPrecipitation: Number(totalPrecipitation.toFixed(1)),
    growingDegreeDays: Number(growingDegreeDays.toFixed(0)),
    frostRisk: Number(frostRisk.toFixed(1)),
    droughtIndex: Number(droughtIndex.toFixed(1)),
    heatStressRisk: Number(heatStressRisk.toFixed(1)),
    optimalPlantingWindow: plantingWindow,
    recommendations,
  };
}

function getBaseTemperature(cropType: string): number {
  const baseTemps: Record<string, number> = {
    "Rice": 10,
    "Wheat": 0,
    "Maize": 10,
    "Cotton": 15,
    "Soybean": 10,
    "Sugarcane": 18,
  };
  
  return baseTemps[cropType] || 10;
}

function getOptimalPlantingWindow(cropType: string, latitude: number): { start: string; end: string } {
  // Simplified planting windows (would be more complex in reality)
  const currentYear = new Date().getFullYear();
  const isNorthern = latitude > 0;
  
  const windows: Record<string, any> = {
    "Rice": isNorthern 
      ? { start: `${currentYear}-04-15`, end: `${currentYear}-06-15` }
      : { start: `${currentYear}-10-15`, end: `${currentYear}-12-15` },
    "Wheat": isNorthern 
      ? { start: `${currentYear}-09-15`, end: `${currentYear}-11-15` }
      : { start: `${currentYear}-03-15`, end: `${currentYear}-05-15` },
    "Maize": isNorthern 
      ? { start: `${currentYear}-04-01`, end: `${currentYear}-06-01` }
      : { start: `${currentYear}-10-01`, end: `${currentYear}-12-01` },
  };
  
  return windows[cropType] || windows["Rice"];
}

function generateClimateRecommendations(
  avgTemp: number,
  totalPrecip: number,
  frostRisk: number,
  droughtIndex: number,
  heatStressRisk: number,
  cropType: string
): string[] {
  const recommendations = [];
  
  if (avgTemp < 15) {
    recommendations.push("Consider cold-tolerant varieties due to low average temperatures");
  }
  
  if (avgTemp > 30) {
    recommendations.push("Select heat-resistant varieties and ensure adequate irrigation");
  }
  
  if (totalPrecip < 500) {
    recommendations.push("Implement efficient irrigation systems due to low rainfall");
    recommendations.push("Consider drought-resistant crop varieties");
  }
  
  if (totalPrecip > 1500) {
    recommendations.push("Ensure good drainage to prevent waterlogging");
    recommendations.push("Monitor for fungal diseases in high moisture conditions");
  }
  
  if (frostRisk > 20) {
    recommendations.push("Plan frost protection measures for sensitive growth stages");
  }
  
  if (droughtIndex > 60) {
    recommendations.push("Critical: Implement water conservation and drought mitigation strategies");
  }
  
  if (heatStressRisk > 30) {
    recommendations.push("Plan shade structures or adjust planting times to avoid heat stress");
  }
  
  // Crop-specific recommendations
  if (cropType === "Rice" && totalPrecip < 800) {
    recommendations.push("Rice requires consistent water supply - ensure irrigation availability");
  }
  
  if (cropType === "Wheat" && avgTemp > 25) {
    recommendations.push("High temperatures may reduce wheat yield - consider spring varieties");
  }
  
  return recommendations;
}

async function generateWeatherAlerts(lat: number, lng: number, cropType: string) {
  const forecast = await generateWeatherForecast(lat, lng);
  const alerts = [];
  
  for (let i = 0; i < Math.min(7, forecast.length); i++) {
    const day = forecast[i];
    
    // Temperature alerts
    if (day.temperature.min < 2) {
      alerts.push({
        type: "frost_warning",
        severity: "high",
        date: day.date,
        message: `Frost warning: Minimum temperature ${day.temperature.min}°C expected`,
        recommendations: ["Cover sensitive plants", "Use frost protection methods"],
      });
    }
    
    if (day.temperature.max > 40) {
      alerts.push({
        type: "heat_stress",
        severity: "high",
        date: day.date,
        message: `Extreme heat warning: Maximum temperature ${day.temperature.max}°C expected`,
        recommendations: ["Increase irrigation frequency", "Provide shade if possible"],
      });
    }
    
    // Precipitation alerts
    if (day.precipitation > 50) {
      alerts.push({
        type: "heavy_rain",
        severity: "medium",
        date: day.date,
        message: `Heavy rain expected: ${day.precipitation}mm`,
        recommendations: ["Ensure proper drainage", "Delay field operations"],
      });
    }
    
    // Crop-specific alerts
    if (cropType === "Rice" && day.temperature.min < 15) {
      alerts.push({
        type: "crop_specific",
        severity: "medium",
        date: day.date,
        message: "Cool temperatures may slow rice growth",
        recommendations: ["Monitor plant development", "Adjust fertilizer timing"],
      });
    }
  }
  
  return alerts;
}
