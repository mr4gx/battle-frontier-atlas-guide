
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "@/context/auth-context";
import { TrainerProvider } from "@/context/trainer-context";
import { BattleLockProvider } from "@/hooks/use-battle-lock";

// Pages
import SplashScreen from "@/pages/SplashScreen";
import LoginPage from "@/pages/LoginPage";
import RegisterPage from "@/pages/RegisterPage";
import DashboardPage from "@/pages/DashboardPage";
import ProfilePage from "@/pages/ProfilePage";
import PassportPage from "@/pages/PassportPage";
import BattleAreasMapPage from "@/pages/BattleAreasMapPage"; // Renamed from FacilitiesMapPage
import BattleAreaDetailPage from "@/pages/BattleAreaDetailPage"; // Renamed from FacilityDetailPage
import BattleSetupPage from "@/pages/BattleSetupPage";
import BattleResultsPage from "@/pages/BattleResultsPage";
import QRScannerPage from "@/pages/QRScannerPage";
import LeaderboardPage from "@/pages/LeaderboardPage";
import TeamManagementPage from "@/pages/TeamManagementPage";
import BattleHistoryPage from "@/pages/BattleHistoryPage";
import NotificationsPage from "@/pages/NotificationsPage";
import BattleBulletinPage from "@/pages/BattleBulletinPage";
import BattlesPage from "@/pages/BattlesPage"; // Add the new BattlesPage
import NotFound from "@/pages/NotFound";
import Index from "@/pages/Index";

// Protected Route component
import ProtectedRoute from "@/components/protected-route";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <BrowserRouter>
      <AuthProvider>
        <TrainerProvider>
          <BattleLockProvider>
            <Toaster />
            <Sonner />
            <Routes>
              {/* Public routes */}
              <Route path="/" element={<Index />} />
              <Route path="/splash" element={<SplashScreen />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />

              {/* Protected routes */}
              <Route element={<ProtectedRoute />}>
                <Route path="/dashboard" element={<DashboardPage />} />
                <Route path="/profile" element={<ProfilePage />} />
                <Route path="/passport" element={<PassportPage />} />
                <Route path="/battle-areas" element={<BattleAreasMapPage />} /> {/* Updated route */}
                <Route path="/battle-area/:id" element={<BattleAreaDetailPage />} /> {/* Updated route */}
                <Route path="/battle/setup" element={<BattleSetupPage />} />
                <Route path="/battle/results" element={<BattleResultsPage />} />
                <Route path="/scanner" element={<QRScannerPage />} />
                <Route path="/leaderboard" element={<LeaderboardPage />} />
                <Route path="/team" element={<TeamManagementPage />} />
                <Route path="/battles" element={<BattlesPage />} /> {/* New route */}
                <Route path="/battles/history" element={<BattleHistoryPage />} />
                <Route path="/notifications" element={<NotificationsPage />} />
                <Route path="/bulletin" element={<BattleBulletinPage />} />
              </Route>

              {/* Fallback routes */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BattleLockProvider>
        </TrainerProvider>
      </AuthProvider>
    </BrowserRouter>
  </QueryClientProvider>
);

export default App;
