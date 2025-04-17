
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "@/context/auth-context";
import { TrainerProvider } from "@/context/trainer-context";

// Pages
import SplashScreen from "@/pages/SplashScreen";
import LoginPage from "@/pages/LoginPage";
import RegisterPage from "@/pages/RegisterPage";
import DashboardPage from "@/pages/DashboardPage";
import ProfilePage from "@/pages/ProfilePage";
import PassportPage from "@/pages/PassportPage";
import FacilitiesMapPage from "@/pages/FacilitiesMapPage";
import FacilityDetailPage from "@/pages/FacilityDetailPage";
import BattleSetupPage from "@/pages/BattleSetupPage";
import BattleResultsPage from "@/pages/BattleResultsPage";
import QRScannerPage from "@/pages/QRScannerPage";
import BracketPage from "@/pages/BracketPage";
import TeamManagementPage from "@/pages/TeamManagementPage";
import BattleHistoryPage from "@/pages/BattleHistoryPage";
import NotificationsPage from "@/pages/NotificationsPage";
import BattleBulletinPage from "@/pages/BattleBulletinPage";
import NotFound from "@/pages/NotFound";

// Protected Route component
import ProtectedRoute from "@/components/protected-route";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <BrowserRouter>
        <AuthProvider>
          <TrainerProvider>
            <Toaster />
            <Sonner />
            <Routes>
              {/* Public routes */}
              <Route path="/" element={<SplashScreen />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />

              {/* Protected routes */}
              <Route element={<ProtectedRoute />}>
                <Route path="/dashboard" element={<DashboardPage />} />
                <Route path="/profile" element={<ProfilePage />} />
                <Route path="/passport" element={<PassportPage />} />
                <Route path="/facilities" element={<FacilitiesMapPage />} />
                <Route path="/facility/:id" element={<FacilityDetailPage />} />
                <Route path="/battle/setup" element={<BattleSetupPage />} />
                <Route path="/battle/results" element={<BattleResultsPage />} />
                <Route path="/scanner" element={<QRScannerPage />} />
                <Route path="/brackets" element={<BracketPage />} />
                <Route path="/team" element={<TeamManagementPage />} />
                <Route path="/battles" element={<BattleHistoryPage />} />
                <Route path="/notifications" element={<NotificationsPage />} />
                <Route path="/bulletin" element={<BattleBulletinPage />} />
              </Route>

              {/* Fallback routes */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </TrainerProvider>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
