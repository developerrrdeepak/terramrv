import { useState, useEffect } from "react";
import { MapPin, Beaker, Leaf, AlertCircle, CheckCircle, Brain } from "lucide-react";
import { useAuth } from "@/context/auth";

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
  samplingPoints: { lat: number; lng: number; priority: "high" | "medium" | "low" }[];
}

const SOIL_TYPES = [
  "Clay",
  "Sandy Clay",
  "Silty Clay",
  "Clay Loam",
  "Silty Clay Loam",
  "Sandy Clay Loam",
  "Loam",
  "Silt Loam",
  "Sandy Loam",
  "Silt",
  "Loamy Sand",
  "Sand",
];

const COMMON_CROPS = [
  "Rice",
  "Wheat",
  "Maize",
  "Sugarcane",
  "Cotton",
  "Soybean",
  "Millet",
  "Barley",
  "Groundnut",
  "Pulses",
  "Mixed Cropping",
];

const FARMING_PRACTICES = [
  "Conventional",
  "Organic",
  "Conservation Tillage",
  "No-Till",
  "Crop Rotation",
  "Cover Cropping",
  "Integrated Pest Management",
  "Agroforestry",
  "Mixed Farming",
];

export function SoilHealthPredictor() {
  const { user } = useAuth();
  const [input, setInput] = useState<SoilHealthRequest>({
    latitude: 0,
    longitude: 0,
    soilType: "Loam",
    crops: "Rice",
    practices: "Conventional",
  });
  const [result, setResult] = useState<SoilHealthResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Get user's location if available
  useEffect(() => {
    if (user) {
      const userLat = parseFloat((user as any)?.lat || "0");
      const userLng = parseFloat((user as any)?.lng || "0");
      const userCrops = (user as any)?.crops || "Rice";
      const userPractices = (user as any)?.practices || "Conventional";
      
      if (userLat && userLng) {
        setInput(prev => ({
          ...prev,
          latitude: userLat,
          longitude: userLng,
          crops: userCrops,
          practices: userPractices,
        }));
      }
    }
  }, [user]);

  // Get current location
  const getCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setInput(prev => ({
            ...prev,
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          }));
        },
        (error) => {
          console.error("Location error:", error);
          setError("Could not get your location. Please enter coordinates manually.");
        }
      );
    } else {
      setError("Geolocation is not supported by this browser.");
    }
  };

  const predictSoilHealth = async () => {
    if (!input.latitude || !input.longitude) {
      setError("Please provide location coordinates");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/ml/soil-health", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify(input),
      });

      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }

      const data = await response.json();
      setResult(data);
    } catch (err: any) {
      setError(err.message || "Prediction failed");
    } finally {
      setIsLoading(false);
    }
  };

  const getHealthScoreColor = (score: number) => {
    if (score >= 80) return "text-green-600 bg-green-50";
    if (score >= 60) return "text-yellow-600 bg-yellow-50";
    return "text-red-600 bg-red-50";
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high": return "bg-red-500";
      case "medium": return "bg-yellow-500";
      case "low": return "bg-green-500";
      default: return "bg-gray-500";
    }
  };

  return (
    <section className="container mx-auto px-4 py-16">
      <div className="mb-8 text-center">
        <h2 className="text-3xl font-bold">AI Soil Health Predictor</h2>
        <p className="mt-2 text-muted-foreground">
          Get ML-powered soil organic carbon predictions and personalized recommendations
        </p>
      </div>

      <div className="grid gap-8 lg:grid-cols-2">
        {/* Input Form */}
        <div className="rounded-lg border bg-card p-6 shadow-sm">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <Beaker className="h-5 w-5" />
              Soil Analysis Input
            </h3>
            <button
              onClick={getCurrentLocation}
              className="flex items-center gap-2 rounded-md border px-3 py-2 text-sm hover:bg-muted"
            >
              <MapPin className="h-4 w-4" />
              Use My Location
            </button>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <label className="grid gap-2 text-sm">
              <span>Latitude</span>
              <input
                type="number"
                step="0.000001"
                value={input.latitude}
                onChange={(e) => setInput(prev => ({ ...prev, latitude: Number(e.target.value) }))}
                className="h-10 rounded-md border bg-background px-3"
                placeholder="e.g., 28.6139"
              />
            </label>

            <label className="grid gap-2 text-sm">
              <span>Longitude</span>
              <input
                type="number"
                step="0.000001"
                value={input.longitude}
                onChange={(e) => setInput(prev => ({ ...prev, longitude: Number(e.target.value) }))}
                className="h-10 rounded-md border bg-background px-3"
                placeholder="e.g., 77.2090"
              />
            </label>

            <label className="grid gap-2 text-sm">
              <span>Soil Type</span>
              <select
                value={input.soilType}
                onChange={(e) => setInput(prev => ({ ...prev, soilType: e.target.value }))}
                className="h-10 rounded-md border bg-background px-3"
              >
                {SOIL_TYPES.map(type => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
            </label>

            <label className="grid gap-2 text-sm">
              <span>Primary Crops</span>
              <select
                value={input.crops}
                onChange={(e) => setInput(prev => ({ ...prev, crops: e.target.value }))}
                className="h-10 rounded-md border bg-background px-3"
              >
                {COMMON_CROPS.map(crop => (
                  <option key={crop} value={crop}>{crop}</option>
                ))}
              </select>
            </label>

            <label className="grid gap-2 text-sm sm:col-span-2">
              <span>Farming Practices</span>
              <select
                value={input.practices}
                onChange={(e) => setInput(prev => ({ ...prev, practices: e.target.value }))}
                className="h-10 rounded-md border bg-background px-3"
              >
                {FARMING_PRACTICES.map(practice => (
                  <option key={practice} value={practice}>{practice}</option>
                ))}
              </select>
            </label>

            <label className="grid gap-2 text-sm sm:col-span-2">
              <span>Historical SOC (tC/ha) - Optional</span>
              <input
                type="number"
                step="0.1"
                value={input.historicalSOC || ""}
                onChange={(e) => setInput(prev => ({ 
                  ...prev, 
                  historicalSOC: e.target.value ? Number(e.target.value) : undefined 
                }))}
                className="h-10 rounded-md border bg-background px-3"
                placeholder="Leave empty if unknown"
              />
            </label>
          </div>

          <div className="mt-6">
            <button
              onClick={predictSoilHealth}
              disabled={isLoading || !input.latitude || !input.longitude}
              className="flex w-full items-center justify-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow hover:opacity-95 disabled:opacity-50"
            >
              {isLoading ? (
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
              ) : (
                <Brain className="h-4 w-4" />
              )}
              {isLoading ? "Analyzing Soil..." : "Predict Soil Health"}
            </button>
          </div>

          {error && (
            <div className="mt-4 rounded-md bg-red-50 p-3 text-sm text-red-800">
              <div className="flex items-center gap-2">
                <AlertCircle className="h-4 w-4" />
                {error}
              </div>
            </div>
          )}
        </div>

        {/* Results */}
        <div className="rounded-lg border bg-card p-6 shadow-sm">
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <Leaf className="h-5 w-5" />
            Soil Health Analysis
          </h3>

          {result ? (
            <div className="space-y-6">
              {/* Key Metrics */}
              <div className="grid grid-cols-2 gap-4">
                <div className="rounded-lg border p-4">
                  <div className="text-sm text-muted-foreground">Predicted SOC</div>
                  <div className="text-2xl font-bold">{result.predictedSOC.toFixed(1)} tC/ha</div>
                  <div className="text-xs text-muted-foreground">
                    {Math.round(result.confidence * 100)}% confidence
                  </div>
                </div>
                <div className={`rounded-lg border p-4 ${getHealthScoreColor(result.soilHealthScore)}`}>
                  <div className="text-sm">Soil Health Score</div>
                  <div className="text-2xl font-bold">{Math.round(result.soilHealthScore)}/100</div>
                  <div className="text-xs">
                    {result.soilHealthScore >= 80 ? "Excellent" : 
                     result.soilHealthScore >= 60 ? "Good" : "Needs Improvement"}
                  </div>
                </div>
              </div>

              {/* Recommendations */}
              {result.recommendations.length > 0 && (
                <div className="rounded-lg bg-blue-50 p-4">
                  <h4 className="font-medium text-blue-900 mb-2 flex items-center gap-2">
                    <Brain className="h-4 w-4" />
                    AI Recommendations
                  </h4>
                  <ul className="space-y-2 text-sm text-blue-800">
                    {result.recommendations.map((rec, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <CheckCircle className="h-4 w-4 mt-0.5 text-blue-600" />
                        <span>{rec}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Sampling Points */}
              {result.samplingPoints.length > 0 && (
                <div className="rounded-lg border p-4">
                  <h4 className="font-medium mb-3 flex items-center gap-2">
                    <MapPin className="h-4 w-4" />
                    Recommended Sampling Points ({result.samplingPoints.length})
                  </h4>
                  <div className="space-y-2 max-h-40 overflow-y-auto">
                    {result.samplingPoints.map((point, i) => (
                      <div key={i} className="flex items-center justify-between text-sm">
                        <div className="flex items-center gap-2">
                          <div className={`h-2 w-2 rounded-full ${getPriorityColor(point.priority)}`} />
                          <span>
                            {point.lat.toFixed(4)}, {point.lng.toFixed(4)}
                          </span>
                        </div>
                        <span className="text-muted-foreground capitalize">
                          {point.priority} priority
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="flex h-64 items-center justify-center text-muted-foreground">
              {isLoading ? (
                <div className="text-center">
                  <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent mx-auto mb-2" />
                  <p>Analyzing soil conditions with AI...</p>
                </div>
              ) : (
                <p>Enter your location and soil details to get AI-powered predictions</p>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Information Footer */}
      <div className="mt-8 rounded-lg bg-muted p-4 text-xs text-muted-foreground">
        <p>
          <strong>About the AI Model:</strong> Our soil health predictor uses machine learning trained on thousands of soil samples, satellite data, and climate patterns. Predictions include uncertainty estimates and should be validated with field sampling for critical decisions.
        </p>
      </div>
    </section>
  );
}
