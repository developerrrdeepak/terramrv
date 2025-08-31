import { useState, useEffect } from "react";
import {
  Bell,
  X,
  CheckCircle,
  AlertTriangle,
  Info,
  Settings,
  Filter,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface Notification {
  id: string;
  title: string;
  message: string;
  type: "success" | "warning" | "error" | "info";
  timestamp: string;
  read: boolean;
  actionable: boolean;
  category: string;
  priority: "low" | "medium" | "high";
  metadata?: any;
}

interface NotificationCenterProps {
  position?: "top-right" | "top-left" | "bottom-right" | "bottom-left";
  autoHide?: boolean;
  maxNotifications?: number;
}

export function NotificationCenter({
  position = "top-right",
  autoHide = true,
  maxNotifications = 50,
}: NotificationCenterProps) {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [filter, setFilter] = useState("all");
  const [selectedCategory, setSelectedCategory] = useState("all");

  useEffect(() => {
    // Load initial notifications
    loadNotifications();

    // Set up real-time notification polling
    const interval = setInterval(pollNotifications, 30000); // Poll every 30 seconds

    return () => clearInterval(interval);
  }, []);

  const loadNotifications = () => {
    // Simulate loading notifications from API
    const mockNotifications: Notification[] = [
      {
        id: "1",
        title: "Carbon Credits Verified",
        message:
          "Your Q4 2024 carbon credits (12.5 tCO2e) have been successfully verified and approved.",
        type: "success",
        timestamp: new Date(Date.now() - 30 * 60 * 1000).toISOString(), // 30 minutes ago
        read: false,
        actionable: true,
        category: "verification",
        priority: "medium",
        metadata: { credits: 12.5, period: "Q4 2024" },
      },
      {
        id: "2",
        title: "Weather Alert",
        message:
          "Heavy rainfall expected in your area within 24 hours. Consider protecting sensitive crops.",
        type: "warning",
        timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(), // 2 hours ago
        read: false,
        actionable: true,
        category: "weather",
        priority: "high",
        metadata: { location: "Plot 1", rainfall: 45 },
      },
      {
        id: "3",
        title: "Payout Processed",
        message:
          "Your monthly payout of ₹2,850 has been processed and will arrive in 2-3 business days.",
        type: "success",
        timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(), // 1 day ago
        read: true,
        actionable: false,
        category: "finance",
        priority: "medium",
        metadata: { amount: 2850, currency: "INR" },
      },
      {
        id: "4",
        title: "ML Model Update",
        message:
          "Your soil health prediction model has been updated with latest satellite data.",
        type: "info",
        timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(), // 6 hours ago
        read: false,
        actionable: false,
        category: "system",
        priority: "low",
        metadata: { model: "soil_health_v2.1" },
      },
      {
        id: "5",
        title: "Training Available",
        message:
          "New sustainable farming workshop: 'Advanced Agroforestry Techniques' is now available.",
        type: "info",
        timestamp: new Date(Date.now() - 48 * 60 * 60 * 1000).toISOString(), // 2 days ago
        read: false,
        actionable: true,
        category: "education",
        priority: "low",
        metadata: { course: "agroforestry_advanced", duration: "2 hours" },
      },
    ];

    setNotifications(mockNotifications);
  };

  const pollNotifications = async () => {
    // Simulate real-time notification polling
    try {
      // In a real app, this would be an API call
      // const response = await fetch('/api/notifications/poll');
      // const newNotifications = await response.json();

      // For demo, occasionally add a new notification
      if (Math.random() < 0.1) {
        // 10% chance
        const newNotification: Notification = {
          id: Date.now().toString(),
          title: "Soil Moisture Alert",
          message:
            "Soil moisture in Plot 2 has dropped below optimal levels. Consider irrigation.",
          type: "warning",
          timestamp: new Date().toISOString(),
          read: false,
          actionable: true,
          category: "monitoring",
          priority: "medium",
          metadata: { plot: "Plot 2", moisture: 32 },
        };

        setNotifications((prev) => [
          newNotification,
          ...prev.slice(0, maxNotifications - 1),
        ]);
      }
    } catch (error) {
      console.error("Failed to poll notifications:", error);
    }
  };

  const markAsRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n)),
    );
  };

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const removeNotification = (id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  };

  const getFilteredNotifications = () => {
    let filtered = notifications;

    if (filter !== "all") {
      filtered = filtered.filter((n) => {
        switch (filter) {
          case "unread":
            return !n.read;
          case "actionable":
            return n.actionable;
          case "high-priority":
            return n.priority === "high";
          default:
            return true;
        }
      });
    }

    if (selectedCategory !== "all") {
      filtered = filtered.filter((n) => n.category === selectedCategory);
    }

    return filtered;
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case "success":
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case "warning":
        return <AlertTriangle className="h-4 w-4 text-amber-600" />;
      case "error":
        return <AlertTriangle className="h-4 w-4 text-red-600" />;
      case "info":
        return <Info className="h-4 w-4 text-blue-600" />;
      default:
        return <Bell className="h-4 w-4" />;
    }
  };

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return "Just now";
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return date.toLocaleDateString();
  };

  const unreadCount = notifications.filter((n) => !n.read).length;
  const categories = [...new Set(notifications.map((n) => n.category))];

  return (
    <div className="relative">
      {/* Notification Bell */}
      <Button
        variant="outline"
        size="sm"
        onClick={() => setIsOpen(!isOpen)}
        className="relative"
      >
        <Bell className="h-4 w-4" />
        {unreadCount > 0 && (
          <Badge
            variant="destructive"
            className="absolute -top-2 -right-2 h-5 w-5 rounded-full p-0 text-xs flex items-center justify-center"
          >
            {unreadCount > 99 ? "99+" : unreadCount}
          </Badge>
        )}
      </Button>

      {/* Notification Panel */}
      {isOpen && (
        <div className="absolute right-0 top-12 z-50 w-96 max-h-96 bg-background border rounded-lg shadow-lg overflow-hidden">
          <div className="border-b p-4">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-semibold">Notifications</h3>
              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={markAllAsRead}
                  disabled={unreadCount === 0}
                >
                  Mark all read
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsOpen(false)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Filters */}
            <div className="flex items-center gap-2 text-sm">
              <select
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                className="rounded border bg-background px-2 py-1 text-xs"
              >
                <option value="all">All</option>
                <option value="unread">Unread</option>
                <option value="actionable">Actionable</option>
                <option value="high-priority">High Priority</option>
              </select>

              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="rounded border bg-background px-2 py-1 text-xs"
              >
                <option value="all">All Categories</option>
                {categories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat.charAt(0).toUpperCase() + cat.slice(1)}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Notifications List */}
          <div className="max-h-80 overflow-y-auto">
            {getFilteredNotifications().length === 0 ? (
              <div className="p-8 text-center text-muted-foreground">
                <Bell className="h-8 w-8 mx-auto mb-2 opacity-50" />
                <p>No notifications found</p>
              </div>
            ) : (
              getFilteredNotifications().map((notification) => (
                <div
                  key={notification.id}
                  className={`border-b p-4 hover:bg-muted cursor-pointer ${
                    !notification.read ? "bg-blue-50" : ""
                  }`}
                  onClick={() => markAsRead(notification.id)}
                >
                  <div className="flex items-start gap-3">
                    <div className="mt-1">
                      {getNotificationIcon(notification.type)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <h4 className="font-medium text-sm">
                          {notification.title}
                        </h4>
                        <div className="flex items-center gap-2">
                          <Badge
                            variant={
                              notification.priority === "high"
                                ? "destructive"
                                : "secondary"
                            }
                            className="text-xs"
                          >
                            {notification.priority}
                          </Badge>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              removeNotification(notification.id);
                            }}
                            className="text-muted-foreground hover:text-foreground"
                          >
                            <X className="h-3 w-3" />
                          </button>
                        </div>
                      </div>
                      <p className="text-sm text-muted-foreground mb-2">
                        {notification.message}
                      </p>
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-muted-foreground">
                          {formatTimestamp(notification.timestamp)}
                        </span>
                        {notification.actionable && (
                          <Button
                            size="sm"
                            variant="outline"
                            className="text-xs h-6"
                          >
                            Take Action
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer */}
          <div className="border-t p-3 bg-muted/50">
            <Button variant="ghost" size="sm" className="w-full text-xs">
              <Settings className="h-3 w-3 mr-2" />
              Notification Settings
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}

// Real-time notification hook for use in other components
export function useNotifications() {
  const [notifications, setNotifications] = useState<Notification[]>([]);

  useEffect(() => {
    // Set up WebSocket or Server-Sent Events for real-time notifications
    // This is a simplified polling implementation
    const interval = setInterval(async () => {
      try {
        // In a real app, this would connect to a WebSocket or SSE endpoint
        // const eventSource = new EventSource('/api/notifications/stream');
        // eventSource.onmessage = (event) => {
        //   const notification = JSON.parse(event.data);
        //   setNotifications(prev => [notification, ...prev]);
        // };
      } catch (error) {
        console.error("Failed to connect to notification stream:", error);
      }
    }, 30000);

    return () => clearInterval(interval);
  }, []);

  const addNotification = (
    notification: Omit<Notification, "id" | "timestamp">,
  ) => {
    const newNotification: Notification = {
      ...notification,
      id: Date.now().toString(),
      timestamp: new Date().toISOString(),
    };
    setNotifications((prev) => [newNotification, ...prev]);
  };

  const removeNotification = (id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  };

  return {
    notifications,
    addNotification,
    removeNotification,
  };
}

// Toast notification component for immediate alerts
export function ToastNotification({
  notification,
  onClose,
}: {
  notification: Notification;
  onClose: () => void;
}) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 5000); // Auto-dismiss after 5 seconds

    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div
      className={`fixed top-4 right-4 z-50 p-4 rounded-lg shadow-lg border max-w-sm ${
        notification.type === "success"
          ? "bg-green-50 border-green-200"
          : notification.type === "warning"
            ? "bg-amber-50 border-amber-200"
            : notification.type === "error"
              ? "bg-red-50 border-red-200"
              : "bg-blue-50 border-blue-200"
      }`}
    >
      <div className="flex items-start gap-3">
        {getNotificationIcon(notification.type)}
        <div className="flex-1">
          <h4 className="font-medium text-sm">{notification.title}</h4>
          <p className="text-sm text-muted-foreground mt-1">
            {notification.message}
          </p>
        </div>
        <button
          onClick={onClose}
          className="text-muted-foreground hover:text-foreground"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}

function getNotificationIcon(type: string) {
  switch (type) {
    case "success":
      return <CheckCircle className="h-4 w-4 text-green-600" />;
    case "warning":
      return <AlertTriangle className="h-4 w-4 text-amber-600" />;
    case "error":
      return <AlertTriangle className="h-4 w-4 text-red-600" />;
    case "info":
      return <Info className="h-4 w-4 text-blue-600" />;
    default:
      return <Bell className="h-4 w-4" />;
  }
}
