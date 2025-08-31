import { useEffect, useState } from "react";
import { useAuth } from "@/context/auth";
import { SignInForm } from "@/components/auth/SignInForm";
import { CropMonitor } from "@/components/crops/CropMonitor";
import {
  Sprout,
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  DollarSign,
  Target,
  Calendar,
  MapPin,
  Brain,
  Droplets,
  Thermometer,
  Zap,
  FileText,
  Bell,
  Settings,
  BarChart3,
  Leaf,
  Coins,
  Activity,
  Users,
  ShieldCheck,
  Award,
  BookOpen,
  Play,
  Download,
} from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

export default function Dashboard() {
  const { user } = useAuth();
  const [greeting, setGreeting] = useState("");
  const [loading, setLoading] = useState(true);
  const [dashboardData, setDashboardData] = useState<any>(null);
  const [selectedTimeRange, setSelectedTimeRange] = useState("30d");

  useEffect(() => {
    const h = new Date().getHours();
    setGreeting(
      h < 12 ? "Good morning" : h < 18 ? "Good afternoon" : "Good evening",
    );

    if (user) {
      loadDashboardData();
    }
  }, [user, selectedTimeRange]);

  const loadDashboardData = async () => {
    setLoading(true);
    try {
      // Simulate API calls to load dashboard data
      await new Promise((resolve) => setTimeout(resolve, 1000));

      setDashboardData({
        overview: {
          carbonCredits: 45.7,
          totalIncome: 12450,
          farmHealth: 87,
          nextPayout: 2850,
          verificationStatus: "verified",
          activePlots: 4,
          pendingClaims: 2,
        },
        recentActivity: generateRecentActivity(),
        weatherAlerts: generateWeatherAlerts(),
        financialData: generateFinancialData(),
        farmMetrics: generateFarmMetrics(),
        mlInsights: generateMLInsights(),
        notifications: generateNotifications(),
        quickActions: getQuickActions(),
      });
    } catch (error) {
      console.error("Failed to load dashboard data:", error);
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return (
      <div className="container mx-auto px-4 py-8">
        <SignInForm />
      </div>
    );
  }

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent mx-auto mb-4" />
            <p className="text-muted-foreground">Loading your dashboard...</p>
          </div>
        </div>
      </div>
    );
  }

  const {
    overview,
    recentActivity,
    weatherAlerts,
    financialData,
    farmMetrics,
    mlInsights,
    notifications,
    quickActions,
  } = dashboardData;

  return (
    <div className="container mx-auto px-4 py-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <div className="text-sm text-muted-foreground">{greeting}</div>
          <h1 className="text-3xl font-bold">
            Welcome back, {user?.name || user?.email?.split("@")[0]}
          </h1>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Export Data
          </Button>
          <Button variant="outline" size="sm">
            <Settings className="h-4 w-4 mr-2" />
            Settings
          </Button>
        </div>
      </div>

      {/* Critical Alerts */}
      {weatherAlerts.critical.length > 0 && (
        <div className="rounded-lg bg-red-50 border border-red-200 p-4">
          <div className="flex items-center gap-2 mb-2">
            <AlertTriangle className="h-5 w-5 text-red-600" />
            <h3 className="font-semibold text-red-900">
              Critical Weather Alert
            </h3>
          </div>
          {weatherAlerts.critical.map((alert: any, i: number) => (
            <p key={i} className="text-sm text-red-800">
              {alert.message}
            </p>
          ))}
        </div>
      )}

      {/* Key Metrics Overview */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <MetricCard
          title="Carbon Credits"
          value={`${overview.carbonCredits} tCO2e`}
          icon={<Leaf className="h-5 w-5" />}
          trend="+12%"
          trendUp={true}
          color="green"
        />
        <MetricCard
          title="Total Income"
          value={`₹${overview.totalIncome.toLocaleString()}`}
          icon={<DollarSign className="h-5 w-5" />}
          trend="+8%"
          trendUp={true}
          color="blue"
        />
        <MetricCard
          title="Farm Health Score"
          value={`${overview.farmHealth}/100`}
          icon={<Target className="h-5 w-5" />}
          trend="+5%"
          trendUp={true}
          color="emerald"
        />
        <MetricCard
          title="Next Payout"
          value={`₹${overview.nextPayout.toLocaleString()}`}
          icon={<Coins className="h-5 w-5" />}
          trend="In 5 days"
          trendUp={null}
          color="purple"
        />
      </div>

      {/* Main Dashboard Tabs */}
      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          <TabsTrigger value="farm">Farm Health</TabsTrigger>
          <TabsTrigger value="financial">Financial</TabsTrigger>
          <TabsTrigger value="insights">AI Insights</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6">
          <div className="grid gap-6 lg:grid-cols-3">
            {/* Quick Actions */}
            <div className="rounded-lg border bg-card p-6">
              <h3 className="font-semibold mb-4 flex items-center gap-2">
                <Zap className="h-5 w-5" />
                Quick Actions
              </h3>
              <div className="space-y-3">
                {quickActions.map((action: any, i: number) => (
                  <Button
                    key={i}
                    variant="outline"
                    className="w-full justify-start"
                    size="sm"
                  >
                    <action.icon className="h-4 w-4 mr-2" />
                    {action.label}
                  </Button>
                ))}
              </div>
            </div>

            {/* Recent Activity */}
            <div className="rounded-lg border bg-card p-6">
              <h3 className="font-semibold mb-4 flex items-center gap-2">
                <Activity className="h-5 w-5" />
                Recent Activity
              </h3>
              <div className="space-y-3">
                {recentActivity.map((activity: any, i: number) => (
                  <div key={i} className="flex items-start gap-3">
                    <div className="rounded-full bg-primary/10 p-1">
                      <activity.icon className="h-3 w-3 text-primary" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium">{activity.title}</p>
                      <p className="text-xs text-muted-foreground">
                        {activity.time}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Notifications */}
            <div className="rounded-lg border bg-card p-6">
              <h3 className="font-semibold mb-4 flex items-center gap-2">
                <Bell className="h-5 w-5" />
                Notifications
                <Badge variant="secondary">{notifications.length}</Badge>
              </h3>
              <div className="space-y-3">
                {notifications.map((notification: any, i: number) => (
                  <div
                    key={i}
                    className={`rounded-lg p-3 text-sm ${
                      notification.type === "warning"
                        ? "bg-amber-50 text-amber-800"
                        : notification.type === "success"
                          ? "bg-green-50 text-green-800"
                          : "bg-blue-50 text-blue-800"
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      {notification.type === "warning" && (
                        <AlertTriangle className="h-4 w-4" />
                      )}
                      {notification.type === "success" && (
                        <CheckCircle className="h-4 w-4" />
                      )}
                      {notification.type === "info" && (
                        <Bell className="h-4 w-4" />
                      )}
                      <span className="font-medium">{notification.title}</span>
                    </div>
                    <p className="mt-1 text-xs">{notification.message}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Farm Status Overview */}
          <div className="grid gap-6 lg:grid-cols-2">
            <div className="rounded-lg border bg-card p-6">
              <h3 className="font-semibold mb-4">Farm Plots Status</h3>
              <div className="space-y-4">
                {[1, 2, 3, 4].map((plot) => (
                  <div key={plot} className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="rounded-full bg-green-100 p-2">
                        <MapPin className="h-4 w-4 text-green-600" />
                      </div>
                      <div>
                        <p className="font-medium">Plot {plot}</p>
                        <p className="text-sm text-muted-foreground">
                          2.5 hectares • Rice
                        </p>
                      </div>
                    </div>
                    <Badge variant={plot <= 2 ? "default" : "secondary"}>
                      {plot <= 2 ? "Active" : "Fallow"}
                    </Badge>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-lg border bg-card p-6">
              <h3 className="font-semibold mb-4">Verification Progress</h3>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span>Overall Progress</span>
                    <span>85%</span>
                  </div>
                  <Progress value={85} />
                </div>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <span>Data Collection</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <span>Satellite Verification</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Activity className="h-4 w-4 text-blue-600" />
                    <span>Field Audit</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <AlertTriangle className="h-4 w-4 text-amber-600" />
                    <span>Final Review</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </TabsContent>

        {/* Analytics Tab */}
        <TabsContent value="analytics" className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold">Performance Analytics</h2>
            <select
              value={selectedTimeRange}
              onChange={(e) => setSelectedTimeRange(e.target.value)}
              className="rounded-md border bg-background px-3 py-2 text-sm"
            >
              <option value="7d">Last 7 days</option>
              <option value="30d">Last 30 days</option>
              <option value="90d">Last 3 months</option>
              <option value="1y">Last year</option>
            </select>
          </div>

          <div className="grid gap-6 lg:grid-cols-2">
            <div className="rounded-lg border bg-card p-6">
              <h3 className="font-semibold mb-4">Carbon Credits Over Time</h3>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={financialData.creditHistory}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Area
                      type="monotone"
                      dataKey="credits"
                      stroke="hsl(var(--primary))"
                      fill="hsl(var(--primary))"
                      fillOpacity={0.3}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="rounded-lg border bg-card p-6">
              <h3 className="font-semibold mb-4">Income Breakdown</h3>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={financialData.incomeBreakdown}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) =>
                        `${name} ${(percent * 100).toFixed(0)}%`
                      }
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {financialData.incomeBreakdown.map(
                        (entry: any, index: number) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ),
                      )}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          <div className="rounded-lg border bg-card p-6">
            <h3 className="font-semibold mb-4">Farm Health Metrics</h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={farmMetrics.healthHistory}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="soilHealth"
                    stroke="#8884d8"
                    name="Soil Health"
                  />
                  <Line
                    type="monotone"
                    dataKey="cropHealth"
                    stroke="#82ca9d"
                    name="Crop Health"
                  />
                  <Line
                    type="monotone"
                    dataKey="biodiversity"
                    stroke="#ffc658"
                    name="Biodiversity"
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </TabsContent>

        {/* Farm Health Tab */}
        <TabsContent value="farm" className="space-y-6">
          <h2 className="text-xl font-semibold">Farm Health Monitoring</h2>

          <div className="grid gap-6 lg:grid-cols-3">
            <div className="rounded-lg border bg-card p-6">
              <h3 className="font-semibold mb-4 flex items-center gap-2">
                <Thermometer className="h-5 w-5" />
                Weather Conditions
              </h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-sm">Temperature</span>
                  <span className="font-medium">28°C</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">Humidity</span>
                  <span className="font-medium">68%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">Rainfall (24h)</span>
                  <span className="font-medium">5mm</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">Wind Speed</span>
                  <span className="font-medium">12 km/h</span>
                </div>
              </div>
            </div>

            <div className="rounded-lg border bg-card p-6">
              <h3 className="font-semibold mb-4 flex items-center gap-2">
                <Droplets className="h-5 w-5" />
                Soil Conditions
              </h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-sm">Moisture Level</span>
                  <span className="font-medium">72%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">pH Level</span>
                  <span className="font-medium">6.8</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">Organic Carbon</span>
                  <span className="font-medium">2.4%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">Nitrogen</span>
                  <span className="font-medium">Medium</span>
                </div>
              </div>
            </div>

            <div className="rounded-lg border bg-card p-6">
              <h3 className="font-semibold mb-4 flex items-center gap-2">
                <Sprout className="h-5 w-5" />
                Crop Status
              </h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-sm">Growth Stage</span>
                  <span className="font-medium">Flowering</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">Health Score</span>
                  <span className="font-medium">89/100</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">Pest Risk</span>
                  <span className="font-medium text-green-600">Low</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">Disease Risk</span>
                  <span className="font-medium text-amber-600">Medium</span>
                </div>
              </div>
            </div>
          </div>

          <div className="rounded-lg border bg-card p-6">
            <h3 className="font-semibold mb-4">Satellite Analysis</h3>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">0.78</div>
                <div className="text-sm text-muted-foreground">NDVI Index</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">0.65</div>
                <div className="text-sm text-muted-foreground">EVI Index</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-600">0.42</div>
                <div className="text-sm text-muted-foreground">NDWI Index</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-orange-600">85%</div>
                <div className="text-sm text-muted-foreground">Tree Cover</div>
              </div>
            </div>
          </div>

          <div className="mt-8">
            <CropMonitor />
          </div>
        </TabsContent>

        {/* Financial Tab */}
        <TabsContent value="financial" className="space-y-6">
          <h2 className="text-xl font-semibold">Financial Overview</h2>

          <div className="grid gap-6 lg:grid-cols-2">
            <div className="rounded-lg border bg-card p-6">
              <h3 className="font-semibold mb-4">Monthly Income</h3>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={financialData.monthlyIncome}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="amount" fill="hsl(var(--primary))" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="rounded-lg border bg-card p-6">
              <h3 className="font-semibold mb-4">Payout History</h3>
              <div className="space-y-3">
                {financialData.payouts.map((payout: any, i: number) => (
                  <div
                    key={i}
                    className="flex items-center justify-between border-b pb-2"
                  >
                    <div>
                      <p className="font-medium">
                        ₹{payout.amount.toLocaleString()}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {payout.date}
                      </p>
                    </div>
                    <Badge
                      variant={
                        payout.status === "completed" ? "default" : "secondary"
                      }
                    >
                      {payout.status}
                    </Badge>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="grid gap-6 lg:grid-cols-3">
            <div className="rounded-lg border bg-card p-6">
              <h3 className="font-semibold mb-2">Total Earnings</h3>
              <div className="text-3xl font-bold text-green-600">
                ₹{overview.totalIncome.toLocaleString()}
              </div>
              <p className="text-sm text-muted-foreground">
                +15% from last month
              </p>
            </div>
            <div className="rounded-lg border bg-card p-6">
              <h3 className="font-semibold mb-2">Pending Credits</h3>
              <div className="text-3xl font-bold text-blue-600">
                {overview.pendingClaims}
              </div>
              <p className="text-sm text-muted-foreground">
                Under verification
              </p>
            </div>
            <div className="rounded-lg border bg-card p-6">
              <h3 className="font-semibold mb-2">Credit Price</h3>
              <div className="text-3xl font-bold text-purple-600">₹275</div>
              <p className="text-sm text-muted-foreground">per tCO2e</p>
            </div>
          </div>
        </TabsContent>

        {/* AI Insights Tab */}
        <TabsContent value="insights" className="space-y-6">
          <h2 className="text-xl font-semibold flex items-center gap-2">
            <Brain className="h-5 w-5" />
            AI-Powered Insights
          </h2>

          <div className="grid gap-6">
            {mlInsights.map((insight: any, i: number) => (
              <div key={i} className="rounded-lg border bg-card p-6">
                <div className="flex items-start gap-4">
                  <div className="rounded-full bg-primary/10 p-3">
                    <insight.icon className="h-6 w-6 text-primary" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold mb-2">{insight.title}</h3>
                    <p className="text-muted-foreground mb-4">
                      {insight.description}
                    </p>
                    <div className="flex items-center gap-2 mb-4">
                      <Badge variant="secondary">
                        Confidence: {insight.confidence}%
                      </Badge>
                      <Badge variant="outline">{insight.category}</Badge>
                    </div>
                    <div className="space-y-2">
                      <h4 className="font-medium">Recommendations:</h4>
                      <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                        {insight.recommendations.map(
                          (rec: string, j: number) => (
                            <li key={j}>{rec}</li>
                          ),
                        )}
                      </ul>
                    </div>
                    {insight.actionable && (
                      <Button size="sm" className="mt-4">
                        <Play className="h-4 w-4 mr-2" />
                        Take Action
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}

// Helper Components
function MetricCard({ title, value, icon, trend, trendUp, color }: any) {
  const colorClasses = {
    green: "text-green-600 bg-green-50",
    blue: "text-blue-600 bg-blue-50",
    emerald: "text-emerald-600 bg-emerald-50",
    purple: "text-purple-600 bg-purple-50",
  };

  return (
    <div className="rounded-lg border bg-card p-6">
      <div className="flex items-center justify-between">
        <div
          className={`rounded-lg p-2 ${colorClasses[color as keyof typeof colorClasses]}`}
        >
          {icon}
        </div>
        {trendUp !== null && (
          <div
            className={`flex items-center gap-1 text-sm ${trendUp ? "text-green-600" : "text-red-600"}`}
          >
            <TrendingUp className={`h-4 w-4 ${!trendUp && "rotate-180"}`} />
            {trend}
          </div>
        )}
        {trendUp === null && (
          <div className="text-sm text-muted-foreground">{trend}</div>
        )}
      </div>
      <div className="mt-4">
        <div className="text-2xl font-bold">{value}</div>
        <div className="text-sm text-muted-foreground">{title}</div>
      </div>
    </div>
  );
}

// Data Generation Functions
function generateRecentActivity() {
  return [
    { title: "Soil analysis completed", time: "2 hours ago", icon: Droplets },
    {
      title: "Carbon credits verified",
      time: "5 hours ago",
      icon: CheckCircle,
    },
    { title: "Weather alert received", time: "1 day ago", icon: AlertTriangle },
    { title: "Activity log updated", time: "2 days ago", icon: FileText },
    { title: "Payout processed", time: "3 days ago", icon: DollarSign },
  ];
}

function generateWeatherAlerts() {
  return {
    critical:
      Math.random() > 0.7
        ? [
            {
              message:
                "Heavy rainfall expected in next 24 hours. Ensure proper drainage.",
            },
          ]
        : [],
    warnings: [
      { message: "High humidity may increase disease risk", type: "warning" },
    ],
  };
}

function generateFinancialData() {
  return {
    creditHistory: Array.from({ length: 12 }, (_, i) => ({
      month: new Date(2024, i).toLocaleDateString("en", { month: "short" }),
      credits: 20 + Math.random() * 30,
    })),
    incomeBreakdown: [
      { name: "Carbon Credits", value: 8500, color: "#8884d8" },
      { name: "Crop Sales", value: 3200, color: "#82ca9d" },
      { name: "Subsidies", value: 750, color: "#ffc658" },
    ],
    monthlyIncome: Array.from({ length: 6 }, (_, i) => ({
      month: new Date(2024, i + 6).toLocaleDateString("en", { month: "short" }),
      amount: 1000 + Math.random() * 2000,
    })),
    payouts: [
      { amount: 2850, date: "Dec 15, 2024", status: "completed" },
      { amount: 3200, date: "Nov 15, 2024", status: "completed" },
      { amount: 1800, date: "Oct 15, 2024", status: "pending" },
    ],
  };
}

function generateFarmMetrics() {
  return {
    healthHistory: Array.from({ length: 30 }, (_, i) => ({
      date: new Date(
        Date.now() - (29 - i) * 24 * 60 * 60 * 1000,
      ).toLocaleDateString(),
      soilHealth: 70 + Math.random() * 20,
      cropHealth: 75 + Math.random() * 20,
      biodiversity: 65 + Math.random() * 25,
    })),
  };
}

function generateMLInsights() {
  return [
    {
      title: "Optimal Irrigation Timing",
      description:
        "AI analysis suggests adjusting irrigation schedule based on weather patterns and soil moisture data.",
      confidence: 92,
      category: "Water Management",
      icon: Droplets,
      actionable: true,
      recommendations: [
        "Reduce irrigation frequency by 15% in the next week",
        "Schedule deep watering sessions on Tuesday and Friday",
        "Monitor soil moisture levels daily",
      ],
    },
    {
      title: "Yield Prediction Update",
      description:
        "Based on current growth patterns and weather data, yield forecast has been updated.",
      confidence: 87,
      category: "Yield Forecasting",
      icon: TrendingUp,
      actionable: false,
      recommendations: [
        "Expected yield: 4.8 tons/hectare (+8% from initial estimate)",
        "Continue current fertilization schedule",
        "Monitor for pest activity in next 2 weeks",
      ],
    },
    {
      title: "Carbon Sequestration Opportunity",
      description:
        "Analysis shows potential for increased carbon credits through enhanced practices.",
      confidence: 85,
      category: "Carbon Credits",
      icon: Leaf,
      actionable: true,
      recommendations: [
        "Plant cover crops in fallow areas",
        "Implement no-till practices in Plot 3",
        "Consider agroforestry integration",
      ],
    },
  ];
}

function generateNotifications() {
  return [
    {
      title: "Verification Complete",
      message: "Your Q4 carbon credits have been verified and approved.",
      type: "success",
    },
    {
      title: "Weather Alert",
      message: "Heavy rainfall expected tomorrow. Check drainage systems.",
      type: "warning",
    },
    {
      title: "Training Available",
      message: "New sustainable farming workshop available online.",
      type: "info",
    },
  ];
}

function getQuickActions() {
  return [
    { label: "Log Farm Activity", icon: FileText },
    { label: "Request Payout", icon: DollarSign },
    { label: "View Satellite Data", icon: MapPin },
    { label: "Run Soil Analysis", icon: Droplets },
    { label: "Contact Support", icon: Users },
    { label: "Download Reports", icon: Download },
  ];
}
