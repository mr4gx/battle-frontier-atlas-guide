
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Bell, ChevronRight, Award, ExternalLink } from "lucide-react";
import { BottomNavigation } from "@/components/bottom-navigation";
import { TokenDisplay } from "@/components/token-display";
import { Progress } from "@/components/ui/progress";
import { mockFacilities, mockNotifications } from "@/data/mock-data";
import { useTrainer } from "@/context/trainer-context";
import { FacilityCard } from "@/components/ui/facility-card";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";

const DashboardPage = () => {
  const { trainer, isLoading } = useTrainer();
  const [progress, setProgress] = useState(0);
  
  // Calculate progress percentage based on badges obtained
  useEffect(() => {
    if (trainer) {
      const obtained = trainer.badges.filter(badge => badge.obtained).length;
      const total = trainer.badges.length;
      setProgress(Math.round((obtained / total) * 100));
    }
  }, [trainer]);

  // Get recent battles
  const upcomingMatches = mockNotifications
    .filter(notif => notif.type === "battle" && !notif.read)
    .slice(0, 3);

  if (isLoading || !trainer) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    );
  }

  return (
    <div className="min-h-screen pb-20">
      {/* Header */}
      <header className="bg-white px-4 py-4 border-b border-gray-200 sticky top-0 z-10">
        <div className="flex justify-between items-center">
          <h1 className="text-xl font-bold text-atl-dark-purple">Dashboard</h1>
          <div className="flex items-center space-x-2">
            <TokenDisplay count={trainer.tokens} showAddButton />
            <Link to="/notifications" className="relative">
              <Bell className="h-6 w-6 text-atl-dark-purple" />
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
        {/* Welcome Section */}
        <section className="mb-6">
          <div className="flex justify-between items-center mb-2">
            <h2 className="text-lg font-semibold">
              Welcome, {trainer.name}!
            </h2>
            <span className="text-sm text-gray-500">ID: {trainer.id}</span>
          </div>

          <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium">Championship Qualification</span>
              <span className="text-sm text-gray-500">{progress}%</span>
            </div>
            <Progress value={progress} className="h-2 mb-2" />
            <div className="flex justify-between text-xs text-gray-500">
              <span>{trainer.badges.filter(b => b.obtained).length} of {trainer.badges.length} Badges</span>
              <Link to="/passport" className="text-atl-primary-purple">View Passport</Link>
            </div>
          </div>
        </section>

        {/* Battle Facilities */}
        <section className="mb-6">
          <div className="flex justify-between items-center mb-3">
            <h2 className="text-lg font-semibold">Battle Facilities</h2>
            <Link 
              to="/facilities" 
              className="text-atl-primary-purple text-sm flex items-center"
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

        {/* Upcoming Battles */}
        <section className="mb-6">
          <div className="flex justify-between items-center mb-3">
            <h2 className="text-lg font-semibold">Upcoming Battles</h2>
            <Link 
              to="/battles" 
              className="text-atl-primary-purple text-sm flex items-center"
            >
              History <ChevronRight className="h-4 w-4" />
            </Link>
          </div>

          {upcomingMatches.length > 0 ? (
            <div className="space-y-3">
              {upcomingMatches.map((match) => (
                <div 
                  key={match.id} 
                  className="bg-white p-3 rounded-lg shadow-sm border border-gray-100 flex justify-between items-center"
                >
                  <div>
                    <h3 className="font-medium text-sm">{match.title}</h3>
                    <p className="text-xs text-gray-500">{match.message}</p>
                  </div>
                  <Link 
                    to={match.actionPath || "#"} 
                    className="text-atl-primary-purple"
                  >
                    <ExternalLink className="h-4 w-4" />
                  </Link>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100 text-center">
              <p className="text-gray-500 text-sm">No upcoming battles</p>
              <Link 
                to="/battle/setup" 
                className="text-atl-primary-purple text-sm font-medium mt-2 inline-block"
              >
                Set up a battle
              </Link>
            </div>
          )}
        </section>

        {/* Event Updates */}
        <section>
          <div className="flex justify-between items-center mb-3">
            <h2 className="text-lg font-semibold">Event Updates</h2>
          </div>

          <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
            <div className="flex items-center gap-3">
              <div className="bg-atl-soft-blue p-2 rounded-lg">
                <Award className="h-6 w-6 text-atl-bright-blue" />
              </div>
              <div>
                <h3 className="font-medium text-sm">Championship brackets updated!</h3>
                <p className="text-xs text-gray-500">Check your upcoming matches</p>
              </div>
            </div>
            
            <div className="mt-3 flex gap-2">
              <Badge className="bg-atl-soft-blue text-atl-dark-purple hover:bg-atl-soft-blue">
                <Link to="/brackets">View Brackets</Link>
              </Badge>
              <Badge variant="outline" className="text-atl-dark-purple">
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
