import { useState, useEffect } from "react";
import { Activity, TrendingUp, Users, Zap, Database, Globe, AlertTriangle, CheckCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
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

interface RealTimeMetric {
  id: string;
  name: string;
  value: number;
  unit: string;
  change: number;
  status: "up" | "down" | "stable";
  alert?: boolean;
}

interface SystemStatus {
  service: string;
  status: "operational" | "degraded" | "down";
  uptime: number;
  responseTime: number;
  lastCheck: string;
}

interface LiveData {
  timestamp: string;
  activeUsers: number;
  apiCalls: number;
  errorRate: number;
  avgResponseTime: number;
  cpuUsage: number;
  memoryUsage: number;
}

export function RealTimeAnalytics() {
  const [metrics, setMetrics] = useState<RealTimeMetric[]>([]);
  const [systemStatus, setSystemStatus] = useState<SystemStatus[]>([]);
  const [liveData, setLiveData] = useState<LiveData[]>([]);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    // Initialize real-time monitoring
    initializeRealTimeData();
    
    // Set up real-time data stream
    const interval = setInterval(updateRealTimeData, 5000); // Update every 5 seconds
    
    setIsConnected(true);
    
    return () => {
      clearInterval(interval);
      setIsConnected(false);
    };
  }, []);

  const initializeRealTimeData = () => {
    // Initialize metrics
    setMetrics([
      {
        id: "active_users",
        name: "Active Users",
        value: 247,
        unit: "",
        change: 12,
        status: "up",
      },
      {
        id: "api_requests",
        name: "API Requests/min",
        value: 1250,
        unit: "/min",
        change: -3,
        status: "down",
      },
      {
        id: "error_rate",
        name: "Error Rate",
        value: 0.2,
        unit: "%",
        change: -15,
        status: "up",
        alert: true,
      },
      {
        id: "response_time",
        name: "Avg Response Time",
        value: 145,
        unit: "ms",
        change: 8,
        status: "down",
      },
      {
        id: "carbon_credits",
        name: "Credits Processed",
        value: 45.7,
        unit: "tCO2e",
        change: 22,
        status: "up",
      },
      {
        id: "farmer_registrations",
        name: "New Farmers Today",
        value: 12,
        unit: "",
        change: 150,
        status: "up",
      },
    ]);

    // Initialize system status
    setSystemStatus([
      {
        service: "API Gateway",
        status: "operational",
        uptime: 99.9,
        responseTime: 45,
        lastCheck: new Date().toISOString(),
      },
      {
        service: "Database",
        status: "operational",
        uptime: 99.8,
        responseTime: 23,
        lastCheck: new Date().toISOString(),
      },
      {
        service: "ML Pipeline",
        status: "degraded",
        uptime: 97.2,
        responseTime: 234,
        lastCheck: new Date().toISOString(),
      },
      {
        service: "Payment System",
        status: "operational",
        uptime: 99.5,
        responseTime: 89,
        lastCheck: new Date().toISOString(),
      },
      {
        service: "Satellite API",
        status: "operational",
        uptime: 98.7,
        responseTime: 156,
        lastCheck: new Date().toISOString(),
      },
    ]);

    // Initialize historical data for charts
    const now = new Date();
    const initialData = Array.from({ length: 20 }, (_, i) => ({
      timestamp: new Date(now.getTime() - (19 - i) * 60000).toLocaleTimeString(),
      activeUsers: 200 + Math.floor(Math.random() * 100),
      apiCalls: 1000 + Math.floor(Math.random() * 500),
      errorRate: Math.random() * 2,
      avgResponseTime: 100 + Math.floor(Math.random() * 100),
      cpuUsage: 40 + Math.floor(Math.random() * 30),
      memoryUsage: 50 + Math.floor(Math.random() * 25),
    }));
    
    setLiveData(initialData);
  };

  const updateRealTimeData = () => {
    // Update metrics with realistic fluctuations
    setMetrics(prev => prev.map(metric => {
      let newValue = metric.value;
      let change = 0;
      
      switch (metric.id) {
        case "active_users":
          change = (Math.random() - 0.5) * 10;
          newValue = Math.max(0, metric.value + change);
          break;
        case "api_requests":
          change = (Math.random() - 0.5) * 100;
          newValue = Math.max(0, metric.value + change);
          break;
        case "error_rate":
          change = (Math.random() - 0.5) * 0.1;
          newValue = Math.max(0, Math.min(5, metric.value + change));
          break;
        case "response_time":
          change = (Math.random() - 0.5) * 20;
          newValue = Math.max(10, metric.value + change);
          break;
        default:
          change = (Math.random() - 0.5) * 2;
          newValue = Math.max(0, metric.value + change);
      }
      
      const percentChange = metric.value > 0 ? ((change / metric.value) * 100) : 0;
      
      return {
        ...metric,
        value: Number(newValue.toFixed(metric.unit === "%" ? 2 : 1)),
        change: Number(percentChange.toFixed(1)),
        status: change > 0 ? "up" : change < 0 ? "down" : "stable" as const,
        alert: metric.id === "error_rate" && newValue > 1,
      };
    }));

    // Update live data for charts
    setLiveData(prev => {
      const now = new Date();
      const newDataPoint: LiveData = {
        timestamp: now.toLocaleTimeString(),
        activeUsers: 200 + Math.floor(Math.random() * 100),
        apiCalls: 1000 + Math.floor(Math.random() * 500),
        errorRate: Math.random() * 2,
        avgResponseTime: 100 + Math.floor(Math.random() * 100),
        cpuUsage: 40 + Math.floor(Math.random() * 30),
        memoryUsage: 50 + Math.floor(Math.random() * 25),
      };
      
      return [...prev.slice(1), newDataPoint]; // Keep last 20 data points
    });

    // Update system status
    setSystemStatus(prev => prev.map(service => ({
      ...service,
      responseTime: Math.max(10, service.responseTime + (Math.random() - 0.5) * 20),
      lastCheck: new Date().toISOString(),
      status: Math.random() > 0.95 ? "degraded" : service.status, // Random degradation
    })));
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "operational": return "text-green-600 bg-green-100";
      case "degraded": return "text-amber-600 bg-amber-100";
      case "down": return "text-red-600 bg-red-100";
      default: return "text-gray-600 bg-gray-100";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "operational": return <CheckCircle className="h-4 w-4" />;
      case "degraded": return <AlertTriangle className="h-4 w-4" />;
      case "down": return <AlertTriangle className="h-4 w-4" />;
      default: return <Activity className="h-4 w-4" />;
    }
  };

  const getMetricIcon = (id: string) => {
    switch (id) {
      case "active_users": return <Users className="h-5 w-5" />;
      case "api_requests": return <Zap className="h-5 w-5" />;
      case "error_rate": return <AlertTriangle className="h-5 w-5" />;
      case "response_time": return <Activity className="h-5 w-5" />;
      case "carbon_credits": return <Globe className="h-5 w-5" />;
      case "farmer_registrations": return <TrendingUp className="h-5 w-5" />;
      default: return <Database className="h-5 w-5" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Connection Status */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Real-Time Analytics</h2>
        <div className="flex items-center gap-2">
          <div className={`w-2 h-2 rounded-full ${isConnected ? 'bg-green-500' : 'bg-red-500'}`} />
          <span className="text-sm text-muted-foreground">
            {isConnected ? 'Live' : 'Disconnected'}
          </span>
        </div>
      </div>

      {/* Key Metrics Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {metrics.map((metric) => (
          <div key={metric.id} className="rounded-lg border bg-card p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                {getMetricIcon(metric.id)}
                <span className="text-sm font-medium">{metric.name}</span>
              </div>
              {metric.alert && (
                <Badge variant="destructive" className="text-xs">Alert</Badge>
              )}
            </div>
            <div className="mt-2">
              <div className="text-2xl font-bold">
                {metric.value.toLocaleString()}{metric.unit}
              </div>
              <div className={`flex items-center gap-1 text-sm ${
                metric.status === 'up' ? 'text-green-600' : 
                metric.status === 'down' ? 'text-red-600' : 'text-gray-600'
              }`}>
                <TrendingUp className={`h-4 w-4 ${metric.status === 'down' && 'rotate-180'}`} />
                {Math.abs(metric.change)}% {metric.status === 'up' ? 'increase' : metric.status === 'down' ? 'decrease' : 'stable'}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Live Charts */}
      <div className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-lg border bg-card p-6">
          <h3 className="font-semibold mb-4">Active Users</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={liveData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="timestamp" />
                <YAxis />
                <Tooltip />
                <Line 
                  type="monotone" 
                  dataKey="activeUsers" 
                  stroke="hsl(var(--primary))" 
                  strokeWidth={2}
                  dot={false}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="rounded-lg border bg-card p-6">
          <h3 className="font-semibold mb-4">API Performance</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={liveData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="timestamp" />
                <YAxis />
                <Tooltip />
                <Area
                  type="monotone"
                  dataKey="apiCalls"
                  stroke="hsl(var(--primary))"
                  fill="hsl(var(--primary))"
                  fillOpacity={0.3}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* System Status */}
      <div className="rounded-lg border bg-card p-6">
        <h3 className="font-semibold mb-4">System Status</h3>
        <div className="space-y-3">
          {systemStatus.map((service, i) => (
            <div key={i} className="flex items-center justify-between p-3 border rounded">
              <div className="flex items-center gap-3">
                <div className={`rounded-full p-1 ${getStatusColor(service.status)}`}>
                  {getStatusIcon(service.status)}
                </div>
                <div>
                  <div className="font-medium">{service.service}</div>
                  <div className="text-sm text-muted-foreground">
                    {service.uptime}% uptime • {service.responseTime}ms response
                  </div>
                </div>
              </div>
              <Badge variant={service.status === 'operational' ? 'default' : 'secondary'}>
                {service.status}
              </Badge>
            </div>
          ))}
        </div>
      </div>

      {/* Resource Usage */}
      <div className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-lg border bg-card p-6">
          <h3 className="font-semibold mb-4">Server Resources</h3>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span>CPU Usage</span>
                <span>{liveData[liveData.length - 1]?.cpuUsage || 0}%</span>
              </div>
              <Progress value={liveData[liveData.length - 1]?.cpuUsage || 0} />
            </div>
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span>Memory Usage</span>
                <span>{liveData[liveData.length - 1]?.memoryUsage || 0}%</span>
              </div>
              <Progress value={liveData[liveData.length - 1]?.memoryUsage || 0} />
            </div>
          </div>
        </div>

        <div className="rounded-lg border bg-card p-6">
          <h3 className="font-semibold mb-4">Error Rate Trend</h3>
          <div className="h-32">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={liveData}>
                <XAxis dataKey="timestamp" hide />
                <YAxis hide />
                <Tooltip />
                <Line 
                  type="monotone" 
                  dataKey="errorRate" 
                  stroke="hsl(var(--destructive))" 
                  strokeWidth={2}
                  dot={false}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}

// Hook for real-time data in other components
export function useRealTimeData() {
  const [data, setData] = useState<any>(null);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    // In a real app, this would establish a WebSocket connection
    // const ws = new WebSocket('ws://localhost:8080/realtime');
    // ws.onopen = () => setIsConnected(true);
    // ws.onclose = () => setIsConnected(false);
    // ws.onmessage = (event) => setData(JSON.parse(event.data));
    
    // Simulation for demo
    const interval = setInterval(() => {
      setData({
        timestamp: new Date(),
        activeUsers: 200 + Math.floor(Math.random() * 100),
        systemLoad: Math.random() * 100,
        errorRate: Math.random() * 2,
      });
    }, 5000);

    setIsConnected(true);
    
    return () => {
      clearInterval(interval);
      setIsConnected(false);
    };
  }, []);

  return { data, isConnected };
}
