
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ChevronLeft, Info } from "lucide-react";
import { BottomNavigation } from "@/components/bottom-navigation";
import { BadgeIcon } from "@/components/ui/badge-icon";
import { Button } from "@/components/ui/button";
import { mockFacilities } from "@/data/mock-data";
import { useTrainer } from "@/context/trainer-context";
import { cn } from "@/lib/utils";

const BattleAreasMapPage = () => {
  const { trainer } = useTrainer();
  const navigate = useNavigate();
  const [showLegend, setShowLegend] = useState(false);
  
  if (!trainer) return null;

  const handleBattleAreaClick = (battleAreaId: string) => {
    navigate(`/battle-area/${battleAreaId}`);
  };

  return (
    <div className="min-h-screen pb-20">
      {/* Header */}
      <header className="bg-white px-4 py-4 border-b border-gray-200 sticky top-0 z-10">
        <div className="flex justify-between items-center">
          <div className="flex items-center">
            <Link to="/dashboard" className="mr-2">
              <ChevronLeft className="h-5 w-5" />
            </Link>
            <h1 className="text-xl font-bold text-atl-dark-purple">Battle Areas</h1>
          </div>
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => setShowLegend(!showLegend)}
          >
            <Info className="h-5 w-5" />
          </Button>
        </div>
      </header>

      <main className="p-4">
        {/* Legend (conditionally shown) */}
        {showLegend && (
          <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100 mb-4">
            <h2 className="font-medium text-sm mb-2">Map Legend</h2>
            <div className="space-y-2">
              <div className="flex items-center">
                <div className="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
                <span className="text-xs">Completed</span>
              </div>
              <div className="flex items-center">
                <div className="w-3 h-3 bg-atl-primary-purple rounded-full mr-2"></div>
                <span className="text-xs">Available</span>
              </div>
              <div className="flex items-center">
                <div className="w-3 h-3 bg-gray-400 rounded-full mr-2"></div>
                <span className="text-xs">Locked</span>
              </div>
            </div>
          </div>
        )}

        {/* Interactive Map */}
        <div className="relative w-full aspect-square bg-atl-soft-blue rounded-lg overflow-hidden border border-atl-light-purple mb-4">
          {/* Map Background */}
          <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1501854140801-50d01698950b?auto=format&fit=crop&w=600&h=600')] bg-cover bg-center opacity-20"></div>
          
          {/* Battle Areas as nodes on the map */}
          {mockFacilities.map((facility, index) => {
            const badge = trainer.badges.find(b => b.facilityId === facility.id);
            const statusColors = {
              completed: "bg-green-500 border-green-600",
              available: "bg-atl-primary-purple border-atl-secondary-purple",
              locked: "bg-gray-400 border-gray-500"
            };
            
            // Calculate position based on index (a simple layout algorithm)
            const positions = [
              "top-1/4 left-1/4",        // Area 1
              "top-1/2 right-1/4",       // Area 2
              "bottom-1/4 left-1/3"      // Area 3
            ];
            
            return (
              <div 
                key={facility.id}
                className={cn(
                  "absolute w-12 h-12 rounded-full flex items-center justify-center cursor-pointer",
                  positions[index],
                  facility.status === "locked" ? "opacity-60" : "opacity-100"
                )}
                onClick={() => handleBattleAreaClick(facility.id)}
              >
                <div 
                  className={cn(
                    "w-10 h-10 rounded-full border-2 flex items-center justify-center text-white font-bold",
                    statusColors[facility.status]
                  )}
                >
                  {facility.name.charAt(0)}
                </div>
                
                {/* Battle Area name tooltip */}
                <div className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 bg-white px-2 py-0.5 rounded text-xs whitespace-nowrap">
                  {facility.name}
                </div>
                
                {/* Badge indicator if obtained */}
                {badge?.obtained && (
                  <div className="absolute -top-1 -right-1">
                    <BadgeIcon name={facility.name} obtained size="sm" className="w-6 h-6" />
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Battle Area List */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
          <h2 className="font-medium text-sm p-3 border-b border-gray-100">All Battle Areas</h2>
          <div className="divide-y divide-gray-100">
            {mockFacilities.map((facility) => {
              const badge = trainer.badges.find(b => b.facilityId === facility.id);
              
              return (
                <div 
                  key={facility.id}
                  className={cn(
                    "p-3 flex justify-between items-center cursor-pointer hover:bg-gray-50",
                    facility.status === "locked" ? "opacity-70" : "opacity-100"
                  )}
                  onClick={() => handleBattleAreaClick(facility.id)}
                >
                  <div className="flex items-center">
                    <div 
                      className={cn(
                        "w-8 h-8 rounded-full flex items-center justify-center mr-3",
                        facility.status === "completed" ? "bg-green-100 text-green-700" :
                        facility.status === "available" ? "bg-atl-light-purple text-atl-dark-purple" :
                        "bg-gray-200 text-gray-500"
                      )}
                    >
                      {facility.name.charAt(0)}
                    </div>
                    <div>
                      <h3 className="font-medium text-sm">{facility.name}</h3>
                      <p className="text-xs text-gray-500">
                        {facility.status === "completed" ? "Completed" : 
                         facility.status === "available" ? "Available" : 
                         "Locked"}
                      </p>
                    </div>
                  </div>
                  
                  <BadgeIcon 
                    name={facility.name}
                    obtained={badge?.obtained || false}
                    size="sm"
                  />
                </div>
              );
            })}
          </div>
        </div>
      </main>

      <BottomNavigation />
    </div>
  );
};

export default BattleAreasMapPage;
