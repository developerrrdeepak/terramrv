import { useEffect, useState } from "react";
import { useAuth } from "@/context/auth";
import { api } from "@/lib/auth";
import { RealTimeAnalytics } from "@/components/analytics/RealTimeAnalytics";
import {
  Users,
  ShieldCheck,
  AlertTriangle,
  TrendingUp,
  DollarSign,
  MapPin,
  Brain,
  Activity,
  Bell,
  Settings,
  Download,
  Search,
  Filter,
  Plus,
  Edit,
  Trash2,
  CheckCircle,
  XCircle,
  Clock,
  BarChart3,
  PieChart,
  LineChart,
  Globe,
  Database,
  Zap,
  Target,
  Award,
  FileText,
  Mail,
  Phone,
  Calendar,
  Eye,
} from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  LineChart as RechartsLineChart,
  Line,
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart as RechartsPieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

export default function Admin() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [adminData, setAdminData] = useState<any>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedFilter, setSelectedFilter] = useState("all");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (user?.role === "admin") {
      loadAdminData();
    }
  }, [user]);

  const loadAdminData = async () => {
    setLoading(true);
    try {
      // Simulate comprehensive admin data loading
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      setAdminData({
        overview: {
          totalUsers: 1247,
          activeFarmers: 892,
          totalCredits: 45231.7,
          pendingVerifications: 23,
          flaggedTransactions: 5,
          systemHealth: 98,
          monthlyGrowth: 12,
          revenue: 2456789,
        },
        userManagement: generateUserData(),
        financialData: generateFinancialData(),
        verificationQueue: generateVerificationQueue(),
        fraudAlerts: generateFraudAlerts(),
        regionalData: generateRegionalData(),
        systemMetrics: generateSystemMetrics(),
        mlPerformance: generateMLPerformance(),
        recentActivity: generateRecentActivity(),
      });
    } catch (err) {
      setError("Failed to load admin data");
    } finally {
      setLoading(false);
    }
  };

  if (!user || user.role !== "admin") {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <div className="rounded-lg border bg-card p-8">
          <ShieldCheck className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
          <h2 className="text-xl font-semibold mb-2">Admin Access Required</h2>
          <p className="text-muted-foreground mb-4">
            You need administrator privileges to access this dashboard.
          </p>
          <Button variant="outline" onClick={() => window.location.href = "/"}>
            Return to Home
          </Button>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent mx-auto mb-4" />
            <p className="text-muted-foreground">Loading admin dashboard...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="rounded-lg bg-red-50 border border-red-200 p-4">
          <AlertTriangle className="h-5 w-5 text-red-600 inline mr-2" />
          {error}
        </div>
      </div>
    );
  }

  const { overview, userManagement, financialData, verificationQueue, fraudAlerts, regionalData, systemMetrics, mlPerformance, recentActivity } = adminData;

  return (
    <div className="container mx-auto px-4 py-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Admin Dashboard</h1>
          <p className="text-muted-foreground">System overview and management</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">
            <Bell className="h-4 w-4 mr-2" />
            Alerts ({fraudAlerts.length})
          </Button>
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Export Report
          </Button>
          <Button variant="outline" size="sm">
            <Settings className="h-4 w-4 mr-2" />
            Settings
          </Button>
        </div>
      </div>

      {/* Critical Alerts */}
      {fraudAlerts.filter((alert: any) => alert.severity === "high").length > 0 && (
        <div className="rounded-lg bg-red-50 border border-red-200 p-4">
          <div className="flex items-center gap-2 mb-2">
            <AlertTriangle className="h-5 w-5 text-red-600" />
            <h3 className="font-semibold text-red-900">Critical Security Alerts</h3>
          </div>
          {fraudAlerts.filter((alert: any) => alert.severity === "high").map((alert: any, i: number) => (
            <p key={i} className="text-sm text-red-800">{alert.message}</p>
          ))}
        </div>
      )}

      {/* System Overview Metrics */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <MetricCard
          title="Total Users"
          value={overview.totalUsers.toLocaleString()}
          icon={<Users className="h-5 w-5" />}
          trend={`+${overview.monthlyGrowth}%`}
          trendUp={true}
          color="blue"
        />
        <MetricCard
          title="Active Farmers"
          value={overview.activeFarmers.toLocaleString()}
          icon={<Target className="h-5 w-5" />}
          trend={`${Math.round((overview.activeFarmers / overview.totalUsers) * 100)}%`}
          trendUp={null}
          color="green"
        />
        <MetricCard
          title="Total Credits"
          value={`${overview.totalCredits.toLocaleString()} tCO2e`}
          icon={<Award className="h-5 w-5" />}
          trend="+18%"
          trendUp={true}
          color="emerald"
        />
        <MetricCard
          title="System Health"
          value={`${overview.systemHealth}%`}
          icon={<Activity className="h-5 w-5" />}
          trend="Excellent"
          trendUp={null}
          color="purple"
        />
      </div>

      {/* Main Dashboard Tabs */}
      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList className="grid w-full grid-cols-8">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="users">Users</TabsTrigger>
          <TabsTrigger value="verification">Verification</TabsTrigger>
          <TabsTrigger value="financial">Financial</TabsTrigger>
          <TabsTrigger value="security">Security</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          <TabsTrigger value="realtime">Real-Time</TabsTrigger>
          <TabsTrigger value="system">System</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6">
          <div className="grid gap-6 lg:grid-cols-2">
            {/* Recent Activity */}
            <div className="rounded-lg border bg-card p-6">
              <h3 className="font-semibold mb-4 flex items-center gap-2">
                <Activity className="h-5 w-5" />
                Recent System Activity
              </h3>
              <div className="space-y-3">
                {recentActivity.map((activity: any, i: number) => (
                  <div key={i} className="flex items-start gap-3">
                    <div className={`rounded-full p-1 ${
                      activity.type === 'success' ? 'bg-green-100' : 
                      activity.type === 'warning' ? 'bg-amber-100' : 'bg-blue-100'
                    }`}>
                      <activity.icon className={`h-3 w-3 ${
                        activity.type === 'success' ? 'text-green-600' : 
                        activity.type === 'warning' ? 'text-amber-600' : 'text-blue-600'
                      }`} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium">{activity.title}</p>
                      <p className="text-xs text-muted-foreground">{activity.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* System Status */}
            <div className="rounded-lg border bg-card p-6">
              <h3 className="font-semibold mb-4 flex items-center gap-2">
                <Database className="h-5 w-5" />
                System Status
              </h3>
              <div className="space-y-4">
                {systemMetrics.services.map((service: any, i: number) => (
                  <div key={i} className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className={`rounded-full w-2 h-2 ${
                        service.status === 'operational' ? 'bg-green-500' :
                        service.status === 'degraded' ? 'bg-amber-500' : 'bg-red-500'
                      }`} />
                      <span className="text-sm font-medium">{service.name}</span>
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {service.uptime}% uptime
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Regional Overview */}
          <div className="rounded-lg border bg-card p-6">
            <h3 className="font-semibold mb-4 flex items-center gap-2">
              <Globe className="h-5 w-5" />
              Regional Distribution
            </h3>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              {regionalData.map((region: any, i: number) => (
                <div key={i} className="text-center">
                  <div className="text-2xl font-bold">{region.farmers}</div>
                  <div className="text-sm text-muted-foreground">{region.name}</div>
                  <div className="text-xs text-muted-foreground">{region.credits} tCO2e</div>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Actions */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Button variant="outline" className="h-20 flex-col">
              <Plus className="h-5 w-5 mb-2" />
              Add User
            </Button>
            <Button variant="outline" className="h-20 flex-col">
              <FileText className="h-5 w-5 mb-2" />
              Generate Report
            </Button>
            <Button variant="outline" className="h-20 flex-col">
              <Settings className="h-5 w-5 mb-2" />
              System Config
            </Button>
            <Button variant="outline" className="h-20 flex-col">
              <Bell className="h-5 w-5 mb-2" />
              Send Notification
            </Button>
          </div>
        </TabsContent>

        {/* Users Tab */}
        <TabsContent value="users" className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold">User Management</h2>
            <div className="flex items-center gap-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search users..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 w-64"
                />
              </div>
              <select 
                value={selectedFilter}
                onChange={(e) => setSelectedFilter(e.target.value)}
                className="rounded-md border bg-background px-3 py-2 text-sm"
              >
                <option value="all">All Users</option>
                <option value="farmers">Farmers</option>
                <option value="admins">Admins</option>
                <option value="verifiers">Verifiers</option>
              </select>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Add User
              </Button>
            </div>
          </div>

          <div className="rounded-lg border bg-card">
            <div className="p-4 border-b">
              <h3 className="font-semibold">User Directory</h3>
            </div>
            <div className="divide-y">
              {userManagement.users.filter((user: any) => 
                user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                user.email.toLowerCase().includes(searchTerm.toLowerCase())
              ).map((user: any, i: number) => (
                <div key={i} className="p-4 flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="rounded-full bg-primary/10 p-2">
                      <Users className="h-4 w-4 text-primary" />
                    </div>
                    <div>
                      <div className="font-medium">{user.name}</div>
                      <div className="text-sm text-muted-foreground">{user.email}</div>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge variant="outline">{user.role}</Badge>
                        <Badge variant={user.status === 'active' ? 'default' : 'secondary'}>
                          {user.status}
                        </Badge>
                        {user.verified && <Badge variant="outline">Verified</Badge>}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm">
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button variant="outline" size="sm">
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button variant="outline" size="sm">
                      <Mail className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </TabsContent>

        {/* Verification Tab */}
        <TabsContent value="verification" className="space-y-6">
          <h2 className="text-xl font-semibold">Verification Management</h2>
          
          <div className="grid gap-6 lg:grid-cols-2">
            {/* Verification Queue */}
            <div className="rounded-lg border bg-card p-6">
              <h3 className="font-semibold mb-4 flex items-center gap-2">
                <Clock className="h-5 w-5" />
                Pending Verifications
                <Badge variant="secondary">{verificationQueue.length}</Badge>
              </h3>
              <div className="space-y-3">
                {verificationQueue.map((item: any, i: number) => (
                  <div key={i} className="border rounded-lg p-3">
                    <div className="flex items-center justify-between mb-2">
                      <div className="font-medium">{item.farmerName}</div>
                      <Badge variant={item.priority === 'high' ? 'destructive' : 'secondary'}>
                        {item.priority}
                      </Badge>
                    </div>
                    <div className="text-sm text-muted-foreground mb-2">
                      {item.type} • {item.credits} tCO2e • {item.submittedDate}
                    </div>
                    <div className="flex items-center gap-2">
                      <Button size="sm" variant="outline">
                        <CheckCircle className="h-4 w-4 mr-1" />
                        Approve
                      </Button>
                      <Button size="sm" variant="outline">
                        <XCircle className="h-4 w-4 mr-1" />
                        Reject
                      </Button>
                      <Button size="sm" variant="outline">
                        <Eye className="h-4 w-4 mr-1" />
                        Review
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Verification Statistics */}
            <div className="rounded-lg border bg-card p-6">
              <h3 className="font-semibold mb-4">Verification Statistics</h3>
              <div className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-sm">Pending Reviews</span>
                  <span className="font-medium">{verificationQueue.length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">Approved This Month</span>
                  <span className="font-medium">156</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">Rejected This Month</span>
                  <span className="font-medium">8</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">Average Processing Time</span>
                  <span className="font-medium">2.3 days</span>
                </div>
                <div className="mt-4">
                  <div className="flex justify-between text-sm mb-2">
                    <span>Approval Rate</span>
                    <span>95%</span>
                  </div>
                  <Progress value={95} />
                </div>
              </div>
            </div>
          </div>
        </TabsContent>

        {/* Financial Tab */}
        <TabsContent value="financial" className="space-y-6">
          <h2 className="text-xl font-semibold">Financial Overview</h2>
          
          <div className="grid gap-6 lg:grid-cols-2">
            <div className="rounded-lg border bg-card p-6">
              <h3 className="font-semibold mb-4">Revenue Trends</h3>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={financialData.revenue}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Area
                      type="monotone"
                      dataKey="amount"
                      stroke="hsl(var(--primary))"
                      fill="hsl(var(--primary))"
                      fillOpacity={0.3}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="rounded-lg border bg-card p-6">
              <h3 className="font-semibold mb-4">Payout Summary</h3>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-600">₹{financialData.payouts.total.toLocaleString()}</div>
                    <div className="text-sm text-muted-foreground">Total Paid</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-600">₹{financialData.payouts.pending.toLocaleString()}</div>
                    <div className="text-sm text-muted-foreground">Pending</div>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>This Month</span>
                    <span>₹{financialData.payouts.thisMonth.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Last Month</span>
                    <span>₹{financialData.payouts.lastMonth.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Average Per Farmer</span>
                    <span>₹{financialData.payouts.avgPerFarmer.toLocaleString()}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="grid gap-6 lg:grid-cols-3">
            <div className="rounded-lg border bg-card p-6">
              <h3 className="font-semibold mb-2">Platform Revenue</h3>
              <div className="text-3xl font-bold text-green-600">₹{overview.revenue.toLocaleString()}</div>
              <p className="text-sm text-muted-foreground">+22% from last month</p>
            </div>
            <div className="rounded-lg border bg-card p-6">
              <h3 className="font-semibold mb-2">Transaction Volume</h3>
              <div className="text-3xl font-bold text-blue-600">2,847</div>
              <p className="text-sm text-muted-foreground">This month</p>
            </div>
            <div className="rounded-lg border bg-card p-6">
              <h3 className="font-semibold mb-2">Credit Price</h3>
              <div className="text-3xl font-bold text-purple-600">₹275</div>
              <p className="text-sm text-muted-foreground">per tCO2e</p>
            </div>
          </div>
        </TabsContent>

        {/* Security Tab */}
        <TabsContent value="security" className="space-y-6">
          <h2 className="text-xl font-semibold">Security & Fraud Detection</h2>
          
          <div className="grid gap-6">
            {/* Fraud Alerts */}
            <div className="rounded-lg border bg-card p-6">
              <h3 className="font-semibold mb-4 flex items-center gap-2">
                <ShieldCheck className="h-5 w-5" />
                Security Alerts
                <Badge variant="destructive">{fraudAlerts.filter((a: any) => a.severity === 'high').length}</Badge>
              </h3>
              <div className="space-y-3">
                {fraudAlerts.map((alert: any, i: number) => (
                  <div key={i} className={`border rounded-lg p-3 ${
                    alert.severity === 'high' ? 'border-red-200 bg-red-50' :
                    alert.severity === 'medium' ? 'border-amber-200 bg-amber-50' :
                    'border-gray-200'
                  }`}>
                    <div className="flex items-center justify-between mb-2">
                      <div className="font-medium">{alert.title}</div>
                      <Badge variant={
                        alert.severity === 'high' ? 'destructive' :
                        alert.severity === 'medium' ? 'default' : 'secondary'
                      }>
                        {alert.severity}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mb-2">{alert.description}</p>
                    <div className="flex items-center gap-2">
                      <Button size="sm" variant="outline">Investigate</Button>
                      <Button size="sm" variant="outline">Dismiss</Button>
                      <span className="text-xs text-muted-foreground ml-auto">{alert.timestamp}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* ML Performance */}
            <div className="rounded-lg border bg-card p-6">
              <h3 className="font-semibold mb-4 flex items-center gap-2">
                <Brain className="h-5 w-5" />
                ML Model Performance
              </h3>
              <div className="grid gap-4 md:grid-cols-3">
                {mlPerformance.map((model: any, i: number) => (
                  <div key={i} className="border rounded-lg p-4">
                    <div className="font-medium mb-2">{model.name}</div>
                    <div className="text-2xl font-bold mb-1">{model.accuracy}%</div>
                    <div className="text-sm text-muted-foreground mb-2">Accuracy</div>
                    <div className="text-xs text-muted-foreground">
                      Last updated: {model.lastUpdated}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </TabsContent>

        {/* Analytics Tab */}
        <TabsContent value="analytics" className="space-y-6">
          <h2 className="text-xl font-semibold">Advanced Analytics</h2>
          
          <div className="grid gap-6 lg:grid-cols-2">
            <div className="rounded-lg border bg-card p-6">
              <h3 className="font-semibold mb-4">User Growth</h3>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <RechartsLineChart data={financialData.userGrowth}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Line type="monotone" dataKey="users" stroke="hsl(var(--primary))" strokeWidth={2} />
                  </RechartsLineChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="rounded-lg border bg-card p-6">
              <h3 className="font-semibold mb-4">Credit Distribution</h3>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <RechartsPieChart>
                    <Pie
                      data={financialData.creditDistribution}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {financialData.creditDistribution.map((entry: any, index: number) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </RechartsPieChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        </TabsContent>

        {/* Real-Time Tab */}
        <TabsContent value="realtime" className="space-y-6">
          <RealTimeAnalytics />
        </TabsContent>

        {/* System Tab */}
        <TabsContent value="system" className="space-y-6">
          <h2 className="text-xl font-semibold">System Health</h2>
          
          <div className="grid gap-6 lg:grid-cols-2">
            <div className="rounded-lg border bg-card p-6">
              <h3 className="font-semibold mb-4">Server Metrics</h3>
              <div className="space-y-4">
                {systemMetrics.servers.map((server: any, i: number) => (
                  <div key={i} className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>{server.name}</span>
                      <span>{server.usage}%</span>
                    </div>
                    <Progress value={server.usage} />
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-lg border bg-card p-6">
              <h3 className="font-semibold mb-4">Database Status</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-sm">Total Records</span>
                  <span className="font-medium">2.4M</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">Storage Used</span>
                  <span className="font-medium">1.2TB</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">Query Performance</span>
                  <span className="font-medium">45ms avg</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">Backup Status</span>
                  <span className="font-medium text-green-600">Current</span>
                </div>
              </div>
            </div>
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
        <div className={`rounded-lg p-2 ${colorClasses[color as keyof typeof colorClasses]}`}>
          {icon}
        </div>
        {trendUp !== null && (
          <div className={`flex items-center gap-1 text-sm ${trendUp ? 'text-green-600' : 'text-red-600'}`}>
            <TrendingUp className={`h-4 w-4 ${!trendUp && 'rotate-180'}`} />
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
function generateUserData() {
  return {
    users: [
      { name: "Rajesh Kumar", email: "rajesh@farmer.com", role: "farmer", status: "active", verified: true, joinDate: "2024-01-15" },
      { name: "Priya Sharma", email: "priya@farmer.com", role: "farmer", status: "active", verified: true, joinDate: "2024-02-20" },
      { name: "Dr. Amit Singh", email: "amit@verifier.com", role: "verifier", status: "active", verified: true, joinDate: "2024-01-10" },
      { name: "Sarah Johnson", email: "sarah@admin.com", role: "admin", status: "active", verified: true, joinDate: "2023-12-01" },
      { name: "Ram Prasad", email: "ram@farmer.com", role: "farmer", status: "pending", verified: false, joinDate: "2024-12-01" },
    ]
  };
}

function generateFinancialData() {
  return {
    revenue: Array.from({ length: 12 }, (_, i) => ({
      month: new Date(2024, i).toLocaleDateString('en', { month: 'short' }),
      amount: 150000 + Math.random() * 100000,
    })),
    userGrowth: Array.from({ length: 12 }, (_, i) => ({
      month: new Date(2024, i).toLocaleDateString('en', { month: 'short' }),
      users: 100 + i * 95 + Math.random() * 50,
    })),
    creditDistribution: [
      { name: 'Agroforestry', value: 45, color: '#8884d8' },
      { name: 'Rice', value: 30, color: '#82ca9d' },
      { name: 'Wheat', value: 15, color: '#ffc658' },
      { name: 'Other', value: 10, color: '#ff7300' },
    ],
    payouts: {
      total: 2450000,
      pending: 350000,
      thisMonth: 280000,
      lastMonth: 245000,
      avgPerFarmer: 2850,
    }
  };
}

function generateVerificationQueue() {
  return [
    { farmerName: "Rajesh Kumar", type: "Carbon Credits", credits: 12.5, priority: "high", submittedDate: "2024-12-08" },
    { farmerName: "Priya Sharma", type: "Soil Analysis", credits: 8.2, priority: "medium", submittedDate: "2024-12-07" },
    { farmerName: "Ram Prasad", type: "Activity Logs", credits: 15.3, priority: "low", submittedDate: "2024-12-06" },
    { farmerName: "Sunita Devi", type: "Carbon Credits", credits: 22.1, priority: "high", submittedDate: "2024-12-05" },
  ];
}

function generateFraudAlerts() {
  return [
    {
      title: "Suspicious Activity Pattern",
      description: "User ID 2847 has submitted unusually high credit claims in a short period.",
      severity: "high",
      timestamp: "2 hours ago"
    },
    {
      title: "Duplicate Submissions",
      description: "Multiple farmers from same location submitting identical data.",
      severity: "medium",
      timestamp: "5 hours ago"
    },
    {
      title: "Anomalous GPS Coordinates",
      description: "Farm coordinates don't match satellite imagery analysis.",
      severity: "medium",
      timestamp: "1 day ago"
    }
  ];
}

function generateRegionalData() {
  return [
    { name: "Punjab", farmers: 234, credits: 2847.5 },
    { name: "Haryana", farmers: 189, credits: 2156.3 },
    { name: "UP", farmers: 312, credits: 3421.7 },
    { name: "Bihar", farmers: 157, credits: 1678.9 },
  ];
}

function generateSystemMetrics() {
  return {
    services: [
      { name: "API Gateway", status: "operational", uptime: 99.9 },
      { name: "Database", status: "operational", uptime: 99.8 },
      { name: "ML Pipeline", status: "operational", uptime: 98.5 },
      { name: "Payment System", status: "degraded", uptime: 97.2 },
    ],
    servers: [
      { name: "CPU Usage", usage: 45 },
      { name: "Memory Usage", usage: 68 },
      { name: "Disk Usage", usage: 32 },
      { name: "Network I/O", usage: 23 },
    ]
  };
}

function generateMLPerformance() {
  return [
    { name: "Carbon Estimator", accuracy: 92, lastUpdated: "2 hours ago" },
    { name: "Fraud Detection", accuracy: 87, lastUpdated: "4 hours ago" },
    { name: "Soil Health", accuracy: 89, lastUpdated: "6 hours ago" },
  ];
}

function generateRecentActivity() {
  return [
    { title: "New farmer registration approved", time: "5 minutes ago", icon: Users, type: "success" },
    { title: "ML model retrained successfully", time: "2 hours ago", icon: Brain, type: "success" },
    { title: "Security alert triggered", time: "3 hours ago", icon: AlertTriangle, type: "warning" },
    { title: "Batch payout processed", time: "5 hours ago", icon: DollarSign, type: "success" },
    { title: "System backup completed", time: "8 hours ago", icon: Database, type: "info" },
  ];
}
