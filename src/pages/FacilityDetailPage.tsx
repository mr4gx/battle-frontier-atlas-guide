
import { useParams, Link, useNavigate } from "react-router-dom";
import { ChevronLeft, Trophy } from "lucide-react";
import { BottomNavigation } from "@/components/bottom-navigation";
import { Button } from "@/components/ui/button";
import { BadgeIcon } from "@/components/ui/badge-icon";
import { mockFacilities } from "@/data/mock-data";
import { useTrainer } from "@/context/trainer-context";
import { TokenDisplay } from "@/components/token-display";

const FacilityDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const { trainer } = useTrainer();
  const navigate = useNavigate();
  
  if (!trainer) return null;
  
  const facility = mockFacilities.find(f => f.id === id);
  
  if (!facility) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-xl font-bold mb-2">Facility Not Found</h1>
          <Link to="/facilities" className="text-atl-primary-purple">
            Return to Facilities
          </Link>
        </div>
      </div>
    );
  }
  
  const badge = trainer.badges.find(b => b.facilityId === facility.id);
  
  const handleChallenge = () => {
    navigate("/battle/setup", { state: { facilityId: facility.id } });
  };
  
  // Check if entry requirements are met
  const canChallenge = () => {
    if (facility.status === "locked") return false;
    
    let meetsRequirements = true;
    
    for (const req of facility.entryRequirements) {
      if (req.startsWith("Min. ")) {
        // Token requirement
        const tokenReq = parseInt(req.split(" ")[1]);
        if (trainer.tokens < tokenReq) {
          meetsRequirements = false;
        }
      } else if (req.includes(" Badge")) {
        // Badge requirement
        const badgeName = req.split(" ")[0];
        const requiredBadgeId = trainer.badges.find(
          b => b.name.includes(badgeName)
        )?.id;
        
        if (requiredBadgeId) {
          const hasBadge = trainer.badges.find(
            b => b.id === requiredBadgeId && b.obtained
          );
          
          if (!hasBadge) {
            meetsRequirements = false;
          }
        }
      }
    }
    
    return meetsRequirements;
  };
  
  return (
    <div className="min-h-screen pb-20">
      {/* Header */}
      <header className="bg-white px-4 py-4 border-b border-gray-200 sticky top-0 z-10">
        <div className="flex justify-between items-center">
          <div className="flex items-center">
            <Link to="/facilities" className="mr-2">
              <ChevronLeft className="h-5 w-5" />
            </Link>
            <h1 className="text-xl font-bold text-atl-dark-purple">{facility.name}</h1>
          </div>
          {badge?.obtained && (
            <BadgeIcon name={facility.name} obtained size="md" />
          )}
        </div>
      </header>

      <main className="p-4">
        {/* Facility Image */}
        <div className="relative w-full h-48 rounded-lg overflow-hidden mb-6">
          <img 
            src={facility.image} 
            alt={facility.name} 
            className="w-full h-full object-cover"
          />
          
          {facility.status === "locked" && (
            <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
              <div className="bg-white rounded-full p-3">
                <svg 
                  xmlns="http://www.w3.org/2000/svg" 
                  width="32" 
                  height="32" 
                  viewBox="0 0 24 24" 
                  fill="none" 
                  stroke="currentColor" 
                  strokeWidth="2" 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  className="text-gray-500"
                >
                  <rect width="18" height="11" x="3" y="11" rx="2" ry="2"></rect>
                  <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
                </svg>
              </div>
            </div>
          )}
          
          {badge?.obtained && (
            <div className="absolute top-2 right-2 bg-green-500 text-white px-2 py-1 rounded-full text-xs font-medium flex items-center">
              <Trophy className="h-3 w-3 mr-1" />
              Completed
            </div>
          )}
        </div>
        
        {/* Facility Description */}
        <section className="mb-6">
          <h2 className="text-lg font-semibold mb-2">About</h2>
          <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
            <p className="text-sm text-gray-600">{facility.description}</p>
          </div>
        </section>
        
        {/* Battle Style */}
        <section className="mb-6">
          <h2 className="text-lg font-semibold mb-2">Battle Style</h2>
          <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
            <p className="text-sm font-medium">{facility.battleStyle}</p>
          </div>
        </section>
        
        {/* Rules */}
        <section className="mb-6">
          <h2 className="text-lg font-semibold mb-2">Rules</h2>
          <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
            <ul className="text-sm space-y-2">
              {facility.rules.map((rule, index) => (
                <li key={index} className="flex items-start">
                  <span className="text-atl-primary-purple mr-2">•</span>
                  <span>{rule}</span>
                </li>
              ))}
            </ul>
          </div>
        </section>
        
        {/* Entry Requirements */}
        <section className="mb-6">
          <h2 className="text-lg font-semibold mb-2">Entry Requirements</h2>
          <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
            <ul className="text-sm space-y-2">
              {facility.entryRequirements.map((req, index) => {
                const isTokenReq = req.startsWith("Min.");
                let isMet = true;
                
                if (isTokenReq) {
                  const tokenReq = parseInt(req.split(" ")[1]);
                  isMet = trainer.tokens >= tokenReq;
                } else if (req.includes(" Badge")) {
                  const badgeName = req.split(" ")[0];
                  const requiredBadgeId = trainer.badges.find(
                    b => b.name.includes(badgeName)
                  )?.id;
                  
                  if (requiredBadgeId) {
                    isMet = !!trainer.badges.find(
                      b => b.id === requiredBadgeId && b.obtained
                    );
                  }
                }
                
                return (
                  <li key={index} className="flex items-center justify-between">
                    <span 
                      className={`flex items-center ${isMet ? 'text-gray-600' : 'text-red-500'}`}
                    >
                      <span className="mr-2">•</span>
                      <span>{req}</span>
                    </span>
                    
                    {isTokenReq && (
                      <TokenDisplay count={trainer.tokens} size="sm" />
                    )}
                  </li>
                );
              })}
            </ul>
          </div>
        </section>
        
        {/* Challenge Button */}
        <div className="mt-6">
          <Button 
            className="w-full bg-atl-primary-purple hover:bg-atl-secondary-purple h-12"
            disabled={!canChallenge() || badge?.obtained}
            onClick={handleChallenge}
          >
            {badge?.obtained 
              ? 'Already Completed' 
              : facility.status === "locked" 
                ? 'Locked' 
                : canChallenge() 
                  ? 'Challenge Facility' 
                  : 'Requirements Not Met'}
          </Button>
        </div>
      </main>

      <BottomNavigation />
    </div>
  );
};

export default FacilityDetailPage;
