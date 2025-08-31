import { useState, useEffect } from "react";
import { Sprout, TrendingUp, AlertTriangle, Droplets, Thermometer, Eye } from "lucide-react";
import { useAuth } from "@/context/auth";
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

interface CropData {
  cropType: string;
  plantingDate: string;
  expectedHarvest: string;
  currentStage: string;
  health: number;
  yieldForecast: number;
  riskFactors: string[];
}

interface CropMonitoringData {
  date: string;
  ndvi: number;
  evi: number;
  temperature: number;
  precipitation: number;
  soilMoisture: number;
  growthStage: string;
}

interface YieldPrediction {
  predictedYield: number;
  confidence: number;
  factors: {
    weather: number;
    soil: number;
    genetics: number;
    management: number;
  };
  recommendations: string[];
  riskAssessment: {
    drought: number;
    pest: number;
    disease: number;
    frost: number;
  };
}

const CROP_STAGES = {
  "Rice": ["Germination", "Seedling", "Tillering", "Booting", "Flowering", "Maturity"],
  "Wheat": ["Germination", "Tillering", "Jointing", "Booting", "Flowering", "Maturity"],
  "Maize": ["Germination", "V3-V6", "V9-V12", "Tasseling", "Silking", "Maturity"],
  "Cotton": ["Germination", "Squaring", "Flowering", "Boll Development", "Maturity"],
  "Soybean": ["Germination", "Vegetative", "Flowering", "Pod Fill", "Maturity"],
};

export function CropMonitor() {
  const { user } = useAuth();
  const [selectedCrop, setSelectedCrop] = useState("Rice");
  const [cropData, setCropData] = useState<CropData | null>(null);
  const [monitoringData, setMonitoringData] = useState<CropMonitoringData[]>([]);
  const [yieldPrediction, setYieldPrediction] = useState<YieldPrediction | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (user) {
      loadCropData();
    }
  }, [user, selectedCrop]);

  const loadCropData = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      // Simulate loading crop data
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock crop data
      const mockCropData: CropData = {
        cropType: selectedCrop,
        plantingDate: "2024-01-15",
        expectedHarvest: "2024-06-15",
        currentStage: CROP_STAGES[selectedCrop as keyof typeof CROP_STAGES][2],
        health: 85 + Math.random() * 10,
        yieldForecast: 4.2 + Math.random() * 1.5,
        riskFactors: generateRiskFactors(selectedCrop),
      };
      
      setCropData(mockCropData);
      
      // Generate monitoring time series
      const monitoring = generateMonitoringData();
      setMonitoringData(monitoring);
      
      // Generate yield prediction
      const prediction = await generateYieldPrediction(selectedCrop, monitoring);
      setYieldPrediction(prediction);
      
    } catch (err: any) {
      setError(err.message || "Failed to load crop data");
    } finally {
      setIsLoading(false);
    }
  };

  const generateMonitoringData = (): CropMonitoringData[] => {
    const data = [];
    const startDate = new Date();
    startDate.setMonth(startDate.getMonth() - 3);
    
    for (let i = 0; i < 90; i += 7) {
      const date = new Date(startDate.getTime() + i * 24 * 60 * 60 * 1000);
      const weeksSinceStart = i / 7;
      
      // Simulate seasonal growth patterns
      const growthFactor = Math.min(1, weeksSinceStart / 12);
      const seasonality = Math.sin((weeksSinceStart / 26) * 2 * Math.PI) * 0.1;
      
      data.push({
        date: date.toISOString().split('T')[0],
        ndvi: Math.max(0.2, Math.min(0.9, 0.3 + growthFactor * 0.5 + seasonality + (Math.random() - 0.5) * 0.1)),
        evi: Math.max(0.15, Math.min(0.8, 0.25 + growthFactor * 0.45 + seasonality + (Math.random() - 0.5) * 0.08)),
        temperature: 25 + Math.sin((weeksSinceStart / 26) * 2 * Math.PI) * 8 + (Math.random() - 0.5) * 5,
        precipitation: Math.max(0, 20 + Math.sin((weeksSinceStart / 13) * 2 * Math.PI) * 15 + (Math.random() - 0.5) * 30),
        soilMoisture: Math.max(10, Math.min(90, 40 + Math.sin((weeksSinceStart / 13) * 2 * Math.PI) * 20 + (Math.random() - 0.5) * 15)),
        growthStage: CROP_STAGES[selectedCrop as keyof typeof CROP_STAGES][Math.min(5, Math.floor(weeksSinceStart / 2))],
      });
    }
    
    return data;
  };

  const generateYieldPrediction = async (crop: string, monitoring: CropMonitoringData[]): Promise<YieldPrediction> => {
    // Simulate ML-based yield prediction
    const avgNDVI = monitoring.reduce((sum, d) => sum + d.ndvi, 0) / monitoring.length;
    const avgTemp = monitoring.reduce((sum, d) => sum + d.temperature, 0) / monitoring.length;
    const totalPrecip = monitoring.reduce((sum, d) => sum + d.precipitation, 0);
    
    const baseYield = crop === "Rice" ? 5.5 : crop === "Wheat" ? 4.2 : crop === "Maize" ? 8.5 : 3.8;
    const yieldMultiplier = (avgNDVI - 0.3) * 2 + Math.min(1, totalPrecip / 500) * 0.5;
    
    const predictedYield = baseYield * (0.8 + yieldMultiplier * 0.4);
    
    return {
      predictedYield: Number(predictedYield.toFixed(1)),
      confidence: 0.78 + Math.random() * 0.15,
      factors: {
        weather: 0.85,
        soil: 0.72,
        genetics: 0.88,
        management: 0.79,
      },
      recommendations: generateYieldRecommendations(crop, avgNDVI, avgTemp),
      riskAssessment: {
        drought: Math.max(0, (1 - totalPrecip / 800) * 100),
        pest: 15 + Math.random() * 25,
        disease: avgTemp > 28 ? 30 + Math.random() * 20 : 10 + Math.random() * 15,
        frost: avgTemp < 5 ? 70 + Math.random() * 20 : 5 + Math.random() * 10,
      },
    };
  };

  const generateRiskFactors = (crop: string): string[] => {
    const risks = [];
    const random = Math.random();
    
    if (random < 0.3) risks.push("Water stress detected");
    if (random < 0.2) risks.push("Pest activity increased");
    if (random < 0.15) risks.push("Nutrient deficiency possible");
    if (random < 0.1) risks.push("Disease pressure");
    
    return risks;
  };

  const generateYieldRecommendations = (crop: string, ndvi: number, temp: number): string[] => {
    const recommendations = [];
    
    if (ndvi < 0.5) {
      recommendations.push("Consider nitrogen fertilizer application to improve vegetation health");
    }
    
    if (temp > 30) {
      recommendations.push("Monitor for heat stress and ensure adequate irrigation");
    }
    
    if (crop === "Rice" && temp < 20) {
      recommendations.push("Cold temperatures may affect growth - monitor closely");
    }
    
    recommendations.push("Continue regular monitoring for optimal harvest timing");
    
    return recommendations;
  };

  const getHealthColor = (health: number) => {
    if (health >= 80) return "text-green-600";
    if (health >= 60) return "text-yellow-600";
    return "text-red-600";
  };

  const getRiskColor = (risk: number) => {
    if (risk >= 70) return "bg-red-100 text-red-800";
    if (risk >= 40) return "bg-yellow-100 text-yellow-800";
    return "bg-green-100 text-green-800";
  };

  return (
    <section className="container mx-auto px-4 py-16">
      <div className="mb-8 text-center">
        <h2 className="text-3xl font-bold">AI Crop Monitoring</h2>
        <p className="mt-2 text-muted-foreground">
          Real-time crop health analysis and yield forecasting with satellite data and ML
        </p>
      </div>

      {/* Crop Selection */}
      <div className="mb-6 flex items-center gap-4">
        <label className="text-sm font-medium">Select Crop:</label>
        <select
          value={selectedCrop}
          onChange={(e) => setSelectedCrop(e.target.value)}
          className="rounded-md border bg-background px-3 py-2"
        >
          {Object.keys(CROP_STAGES).map(crop => (
            <option key={crop} value={crop}>{crop}</option>
          ))}
        </select>
        <button
          onClick={loadCropData}
          disabled={isLoading}
          className="flex items-center gap-2 rounded-md bg-primary px-3 py-2 text-sm font-medium text-primary-foreground"
        >
          {isLoading ? (
            <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
          ) : (
            <Eye className="h-4 w-4" />
          )}
          Monitor
        </button>
      </div>

      {error && (
        <div className="mb-6 rounded-md bg-red-50 p-4 text-red-800">
          <AlertTriangle className="h-4 w-4 inline mr-2" />
          {error}
        </div>
      )}

      {cropData && (
        <div className="grid gap-6 lg:grid-cols-3">
          {/* Crop Overview */}
          <div className="rounded-lg border bg-card p-6 shadow-sm">
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <Sprout className="h-5 w-5" />
              Crop Overview
            </h3>
            
            <div className="space-y-4">
              <div>
                <div className="text-sm text-muted-foreground">Current Stage</div>
                <div className="font-medium">{cropData.currentStage}</div>
              </div>
              
              <div>
                <div className="text-sm text-muted-foreground">Health Score</div>
                <div className={`text-2xl font-bold ${getHealthColor(cropData.health)}`}>
                  {Math.round(cropData.health)}/100
                </div>
              </div>
              
              <div>
                <div className="text-sm text-muted-foreground">Planting Date</div>
                <div className="font-medium">{new Date(cropData.plantingDate).toLocaleDateString()}</div>
              </div>
              
              <div>
                <div className="text-sm text-muted-foreground">Expected Harvest</div>
                <div className="font-medium">{new Date(cropData.expectedHarvest).toLocaleDateString()}</div>
              </div>
              
              {cropData.riskFactors.length > 0 && (
                <div>
                  <div className="text-sm text-muted-foreground mb-2">Risk Factors</div>
                  <div className="space-y-1">
                    {cropData.riskFactors.map((risk, i) => (
                      <div key={i} className="text-xs bg-amber-100 text-amber-800 px-2 py-1 rounded">
                        {risk}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Vegetation Indices Chart */}
          <div className="rounded-lg border bg-card p-6 shadow-sm lg:col-span-2">
            <h3 className="text-lg font-semibold mb-4">Vegetation Health Trends</h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={monitoringData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis
                    dataKey="date"
                    tickFormatter={(date) => new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                  />
                  <YAxis domain={[0, 1]} />
                  <Tooltip
                    labelFormatter={(date) => new Date(date).toLocaleDateString()}
                    formatter={(value: any, name) => [Number(value).toFixed(3), name.toUpperCase()]}
                  />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="ndvi"
                    stroke="hsl(var(--primary))"
                    strokeWidth={2}
                    name="NDVI"
                  />
                  <Line
                    type="monotone"
                    dataKey="evi"
                    stroke="hsl(var(--accent))"
                    strokeWidth={2}
                    name="EVI"
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Yield Prediction */}
          {yieldPrediction && (
            <div className="rounded-lg border bg-card p-6 shadow-sm">
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <TrendingUp className="h-5 w-5" />
                Yield Forecast
              </h3>
              
              <div className="space-y-4">
                <div>
                  <div className="text-sm text-muted-foreground">Predicted Yield</div>
                  <div className="text-2xl font-bold text-green-600">
                    {yieldPrediction.predictedYield} t/ha
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {Math.round(yieldPrediction.confidence * 100)}% confidence
                  </div>
                </div>
                
                <div>
                  <div className="text-sm text-muted-foreground mb-2">Yield Factors</div>
                  <div className="space-y-1 text-xs">
                    {Object.entries(yieldPrediction.factors).map(([factor, score]) => (
                      <div key={factor} className="flex justify-between">
                        <span className="capitalize">{factor}</span>
                        <span className={score > 0.8 ? "text-green-600" : score > 0.6 ? "text-yellow-600" : "text-red-600"}>
                          {Math.round(score * 100)}%
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Weather Data */}
          <div className="rounded-lg border bg-card p-6 shadow-sm">
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <Thermometer className="h-5 w-5" />
              Weather Trends
            </h3>
            <div className="h-48">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={monitoringData.slice(-8)}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis
                    dataKey="date"
                    tickFormatter={(date) => new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                  />
                  <YAxis />
                  <Tooltip />
                  <Area
                    type="monotone"
                    dataKey="temperature"
                    stroke="hsl(var(--destructive))"
                    fill="hsl(var(--destructive))"
                    fillOpacity={0.3}
                    name="Temperature (°C)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Risk Assessment */}
          {yieldPrediction && (
            <div className="rounded-lg border bg-card p-6 shadow-sm">
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <AlertTriangle className="h-5 w-5" />
                Risk Assessment
              </h3>
              
              <div className="space-y-3">
                {Object.entries(yieldPrediction.riskAssessment).map(([risk, level]) => (
                  <div key={risk} className="flex items-center justify-between">
                    <span className="text-sm capitalize">{risk}</span>
                    <span className={`px-2 py-1 rounded text-xs ${getRiskColor(level)}`}>
                      {Math.round(level)}%
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Recommendations */}
      {yieldPrediction && yieldPrediction.recommendations.length > 0 && (
        <div className="mt-8 rounded-lg bg-blue-50 p-6">
          <h3 className="font-semibold text-blue-900 mb-3">AI Recommendations</h3>
          <ul className="space-y-2 text-sm text-blue-800">
            {yieldPrediction.recommendations.map((rec, i) => (
              <li key={i} className="flex items-start gap-2">
                <span className="text-blue-500 mt-1">•</span>
                <span>{rec}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </section>
  );
}
