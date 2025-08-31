import "./global.css";
import "./lib/sentry";
// Ensure HMR client in dev only
if (import.meta && (import.meta as any).hot) {
  import("/@vite/client");
}

import { Toaster } from "@/components/ui/toaster";
import { createRoot } from "react-dom/client";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { I18nProvider } from "@/context/i18n";
import { AuthProvider } from "@/context/auth";
import { ThemeProvider } from "@/context/theme";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Dashboard from "./pages/Dashboard";
import Admin from "./pages/Admin";
import Profile from "./pages/Profile";
import Credits from "./pages/Credits";
import Reports from "./pages/Reports";
import LearningHub from "./pages/LearningHub";
import Support from "./pages/Support";
import MapPage from "./pages/Map";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { FloatingAssistant } from "@/components/chat/FloatingAssistant";

const queryClient = new QueryClient();

import { ErrorBoundary } from "@sentry/react";

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider defaultTheme="system" storageKey="terramrv-theme">
      <I18nProvider>
        <AuthProvider>
          <TooltipProvider>
            <Toaster />
            <Sonner />
            <ErrorBoundary fallback={<div className="p-4 text-red-500">Something went wrong loading the app. Please refresh.</div>}>
              <BrowserRouter>
              <div className="min-h-screen md:grid md:grid-cols-[260px_1fr]">
                <Header />
                <div className="flex min-h-screen flex-col">
                  <main className="flex-1">
                    <Routes>
                      <Route path="/" element={<Index />} />
                      <Route path="/dashboard" element={<Dashboard />} />
                      <Route path="/admin" element={<Admin />} />
                      <Route path="/profile" element={<Profile />} />
                      <Route path="/credits" element={<Credits />} />
                      <Route path="/reports" element={<Reports />} />
                      <Route path="/learn" element={<LearningHub />} />
                      <Route path="/support" element={<Support />} />
                      <Route path="/map" element={<MapPage />} />
                      {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
                      <Route path="*" element={<NotFound />} />
                    </Routes>
                  </main>
                  <Footer />
                </div>
              </div>
              <FloatingAssistant />
            </BrowserRouter>
            </ErrorBoundary>
          </TooltipProvider>
        </AuthProvider>
      </I18nProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

const container = document.getElementById("root")!;
const existing = (window as any).__app_root;
const root = existing || createRoot(container);
(window as any).__app_root = root;
root.render(<App />);
