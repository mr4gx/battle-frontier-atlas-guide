
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Bell, ChevronRight, Award, ExternalLink, Sword } from "lucide-react";
import { BottomNavigation } from "@/components/bottom-navigation";
import { TokenDisplay } from "@/components/token-display";
import { Progress } from "@/components/ui/progress";
import { mockFacilities, mockNotifications } from "@/data/mock-data";
import { useTrainer } from "@/context/trainer-context";
import { FacilityCard } from "@/components/ui/facility-card";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { ReturnToBattleButton } from "@/components/return-to-battle-button";

const MAX_TOKENS_TO_QUALIFY = 25;

const DashboardPage = () => {
  const { trainer, isLoading } = useTrainer();
  const [progress, setProgress] = useState(0);
  
  useEffect(() => {
    if (trainer) {
      const obtained = trainer.badges.filter(badge => badge.obtained).length;
      const total = trainer.badges.length;
      setProgress(Math.round((obtained / total) * 100));
    }
  }, [trainer]);

  const upcomingMatches = mockNotifications
    .filter(notif => notif.type === "battle" && !notif.read)
    .slice(0, 3);

  if (isLoading || !trainer) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-b from-atl-dark-purple to-atl-secondary-purple">
        <span className="loading loading-spinner loading-lg text-white"></span>
      </div>
    );
  }

  return (
    <div className="min-h-screen pb-20 bg-gradient-to-b from-atl-dark-purple to-atl-secondary-purple text-white">
      <header className="px-4 py-4 border-b border-white/10 sticky top-0 z-10 backdrop-blur-md bg-atl-dark-purple/70">
        <div className="flex justify-between items-center">
          <h1 className="text-xl font-bold text-white">Dashboard</h1>
          <div className="flex items-center space-x-3">
            <ReturnToBattleButton />
            <TokenDisplay count={trainer.tokens} showAddButton />
            <Link to="/notifications" className="relative">
              <Bell className="h-6 w-6 text-white" />
              {mockNotifications.filter(n => !n.read).length > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
                  {mockNotifications.filter(n => !n.read).length}
                </span>
              )}
            </Link>
          </div>
        </div>
      </header>

      <main className="p-4">
        <section className="mb-6">
          <div className="atl-glass-card p-4 bg-white/10 backdrop-blur-sm border border-white/20">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium">Championship Qualification</span>
              <span className="text-sm text-white/70">{progress}%</span>
            </div>
            <Progress value={progress} className="h-2 mb-2 bg-white/20" />
            <div className="flex justify-between text-xs text-white/70">
              <span>{trainer.badges.filter(b => b.obtained).length} of {trainer.badges.length} Badges</span>
              <Link to="/passport" className="text-white/90 underline">View Passport</Link>
            </div>
            <div className="text-xs text-white/70 mt-2">
              Tokens Earned: {trainer.tokens} / {MAX_TOKENS_TO_QUALIFY}
            </div>
          </div>
        </section>

        <section className="mb-6">
          <div className="flex justify-between items-center mb-3">
            <h2 className="text-lg font-semibold text-white">Battle Areas</h2>
            <Link 
              to="/battle-areas" 
              className="text-white/90 text-sm flex items-center"
            >
              View All <ChevronRight className="h-4 w-4" />
            </Link>
          </div>
          <div className="flex overflow-x-auto pb-2 -mx-1 gap-3 hide-scrollbar">
            {mockFacilities.map((facility) => (
              <div key={facility.id} className="w-32 flex-shrink-0">
                <Link to={`/facility/${facility.id}`}>
                  <FacilityCard
                    name={facility.name}
                    image={facility.image}
                    badgeObtained={trainer.badges.find(b => b.facilityId === facility.id)?.obtained || false}
                    status={facility.status}
                  />
                </Link>
              </div>
            ))}
          </div>
        </section>

        <section className="mb-6">
          <div className="flex justify-between items-center mb-3">
            <h2 className="text-lg font-semibold text-white">Upcoming Battles</h2>
            <Link 
              to="/battles" 
              className="text-white/90 text-sm flex items-center"
            >
              <Sword className="h-4 w-4 mr-1" /> Battles <ChevronRight className="h-4 w-4" />
            </Link>
          </div>
          {upcomingMatches.length > 0 ? (
            <div className="space-y-3">
              {upcomingMatches.map((match) => (
                <div 
                  key={match.id} 
                  className="bg-white/10 backdrop-blur-sm p-3 flex justify-between items-center rounded-lg border border-white/20"
                >
                  <div>
                    <h3 className="font-medium text-sm">{match.title}</h3>
                    <p className="text-xs text-white/70">{match.message}</p>
                  </div>
                  <Link 
                    to={match.actionPath || "#"} 
                    className="text-white"
                  >
                    <ExternalLink className="h-4 w-4" />
                  </Link>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-white/10 backdrop-blur-sm p-4 text-center rounded-lg border border-white/20">
              <p className="text-white/70 text-sm">No upcoming battles</p>
              <Link 
                to="/battle/setup" 
                className="text-white text-sm font-medium mt-2 inline-block underline"
              >
                Set up a battle
              </Link>
            </div>
          )}
        </section>

        <section>
          <div className="bg-white/10 backdrop-blur-sm p-4 rounded-lg border border-white/20">
            <div className="flex items-center gap-3">
              <div className="bg-white/20 p-2 rounded-lg">
                <Award className="h-6 w-6 text-white" />
              </div>
              <div>
                <h3 className="font-medium text-sm">Championship leaderboard updated!</h3>
                <p className="text-xs text-white/70">Check your ranking</p>
              </div>
            </div>
            
            <div className="mt-3 flex gap-2">
              <Badge className="bg-white/20 text-white hover:bg-white/30">
                <Link to="/leaderboard">View Leaderboard</Link>
              </Badge>
              <Badge variant="outline" className="text-white border-white/30 hover:bg-white/10">
                <Link to="/notifications">All Updates</Link>
              </Badge>
            </div>
          </div>
        </section>
      </main>

      <BottomNavigation />
    </div>
  );
};

export default DashboardPage;
