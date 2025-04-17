
import { useEffect, useState } from "react";
import { useLocation, useNavigate, Link } from "react-router-dom";
import { ChevronLeft, Trophy, X, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { BottomNavigation } from "@/components/bottom-navigation";
import { TokenDisplay } from "@/components/token-display";
import { BadgeIcon } from "@/components/ui/badge-icon";
import { useTrainer } from "@/context/trainer-context";
import { Battle } from "@/types";
import { mockFacilities } from "@/data/mock-data";

const BattleResultsPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { trainer, addTokens, updateBadge } = useTrainer();
  const [notes, setNotes] = useState("");
  const [saveComplete, setSaveComplete] = useState(false);
  const [showTokenAnimation, setShowTokenAnimation] = useState(false);
  const [showBadgeAnimation, setShowBadgeAnimation] = useState(false);
  
  // Get battle from location state or use a default
  const battle = location.state?.battle as Battle;
  
  if (!battle) {
    // Redirect to dashboard if no battle data
    navigate("/dashboard");
    return null;
  }
  
  const facility = battle.facilityId 
    ? mockFacilities.find(f => f.id === battle.facilityId) 
    : null;
    
  const badge = facility 
    ? trainer?.badges.find(b => b.facilityId === facility.id) 
    : null;
    
  // Determine if this battle would earn a badge
  const shouldEarnBadge = battle.result === "win" && facility && badge && !badge.obtained;
  
  useEffect(() => {
    // Show token animation after a delay
    const tokenTimer = setTimeout(() => {
      setShowTokenAnimation(true);
    }, 500);
    
    // Show badge animation if applicable after token animation
    let badgeTimer: ReturnType<typeof setTimeout>;
    if (shouldEarnBadge) {
      badgeTimer = setTimeout(() => {
        setShowBadgeAnimation(true);
      }, 1500);
    }
    
    return () => {
      clearTimeout(tokenTimer);
      if (badgeTimer) clearTimeout(badgeTimer);
    };
  }, [shouldEarnBadge]);
  
  // When token animation completes, actually add the tokens
  useEffect(() => {
    if (showTokenAnimation && battle.result === "win") {
      // Award double the wager amount (original wager + opponent's wager)
      addTokens(battle.tokensWagered * 2);
    }
  }, [showTokenAnimation, battle.result, battle.tokensWagered, addTokens]);
  
  // When badge animation completes, actually update the badge
  useEffect(() => {
    if (showBadgeAnimation && shouldEarnBadge && badge) {
      updateBadge(badge.id, { 
        obtained: true, 
        dateObtained: new Date().toISOString() 
      });
    }
  }, [showBadgeAnimation, shouldEarnBadge, badge, updateBadge]);
  
  const handleSaveResult = () => {
    // In a real app, we would update the battle record with notes
    // For demo, we'll just simulate a save
    setTimeout(() => {
      setSaveComplete(true);
    }, 500);
  };
  
  const handleReturn = () => {
    if (battle.facilityId) {
      navigate(`/facility/${battle.facilityId}`);
    } else {
      navigate("/dashboard");
    }
  };
  
  if (!trainer) return null;
  
  return (
    <div className="min-h-screen pb-20">
      {/* Header */}
      <header className="bg-white px-4 py-4 border-b border-gray-200 sticky top-0 z-10">
        <div className="flex justify-between items-center">
          <div className="flex items-center">
            <button onClick={handleReturn} className="mr-2">
              <ChevronLeft className="h-5 w-5" />
            </button>
            <h1 className="text-xl font-bold text-atl-dark-purple">Battle Results</h1>
          </div>
          <TokenDisplay count={trainer.tokens} />
        </div>
      </header>

      <main className="p-4">
        {/* Result Banner */}
        <div 
          className={`w-full p-6 rounded-lg text-white text-center mb-6 ${
            battle.result === "win" 
              ? "bg-gradient-to-r from-green-500 to-green-600" 
              : "bg-gradient-to-r from-red-500 to-red-600"
          }`}
        >
          <div className="flex justify-center items-center mb-2">
            {battle.result === "win" ? (
              <Trophy className="h-8 w-8 mr-2" />
            ) : (
              <X className="h-8 w-8 mr-2" />
            )}
            <h2 className="text-2xl font-bold">
              {battle.result === "win" ? "Victory!" : "Defeat"}
            </h2>
          </div>
          <p className="text-sm opacity-90">
            vs. {battle.opponentName}
          </p>
        </div>
        
        {/* Battle Details */}
        <section className="mb-6">
          <h2 className="text-lg font-semibold mb-3">Battle Details</h2>
          <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
            <div className="space-y-3">
              {facility && (
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Facility:</span>
                  <span className="text-sm font-medium">{facility.name}</span>
                </div>
              )}
              
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Date:</span>
                <span className="text-sm font-medium">
                  {new Date(battle.date).toLocaleString()}
                </span>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Opponent:</span>
                <span className="text-sm font-medium">{battle.opponentName}</span>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Tokens Wagered:</span>
                <span className="text-sm font-medium">{battle.tokensWagered}</span>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Result:</span>
                <span 
                  className={`text-sm font-medium ${
                    battle.result === "win" ? "text-green-600" : "text-red-600"
                  }`}
                >
                  {battle.result === "win" ? "Win" : "Loss"}
                </span>
              </div>
            </div>
          </div>
        </section>
        
        {/* Token Exchange Animation */}
        <section className="mb-6">
          <h2 className="text-lg font-semibold mb-3">Token Exchange</h2>
          <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100 flex justify-center items-center">
            {!showTokenAnimation ? (
              <div className="text-center py-4">
                <div className="w-10 h-10 border-2 border-atl-primary-purple border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
                <p className="text-sm text-gray-500">Calculating token exchange...</p>
              </div>
            ) : (
              <div className="text-center py-4">
                {battle.result === "win" ? (
                  <div className="flex flex-col items-center">
                    <Check className="h-10 w-10 text-green-500 mb-2" />
                    <p className="text-sm mb-1">You won {battle.tokensWagered * 2} tokens!</p>
                    <TokenDisplay count={battle.tokensWagered * 2} />
                  </div>
                ) : (
                  <div className="flex flex-col items-center">
                    <X className="h-10 w-10 text-red-500 mb-2" />
                    <p className="text-sm mb-1">You lost {battle.tokensWagered} tokens</p>
                    <TokenDisplay count={battle.tokensWagered} />
                  </div>
                )}
              </div>
            )}
          </div>
        </section>
        
        {/* Badge Award (if applicable) */}
        {shouldEarnBadge && (
          <section className="mb-6">
            <h2 className="text-lg font-semibold mb-3">Badge Earned</h2>
            <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100 flex justify-center items-center">
              {!showBadgeAnimation ? (
                <div className="text-center py-4">
                  <div className="w-10 h-10 border-2 border-atl-primary-purple border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
                  <p className="text-sm text-gray-500">Verifying badge requirements...</p>
                </div>
              ) : (
                <div className="text-center py-4">
                  <div className="animate-bounce-small mb-2">
                    <BadgeIcon 
                      name={facility!.name} 
                      obtained={true} 
                      size="lg" 
                    />
                  </div>
                  <p className="text-base font-medium mb-1">{facility!.name} Badge</p>
                  <p className="text-sm text-gray-600">Congratulations! You've earned a new badge!</p>
                </div>
              )}
            </div>
          </section>
        )}
        
        {/* Notes Field */}
        <section className="mb-6">
          <h2 className="text-lg font-semibold mb-3">Battle Notes</h2>
          <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
            <Textarea
              placeholder="Add any notes about this battle..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={4}
            />
          </div>
        </section>
        
        {/* Save Button */}
        <div className="mt-6 space-y-3">
          {!saveComplete ? (
            <Button 
              className="w-full bg-atl-primary-purple hover:bg-atl-secondary-purple h-12"
              onClick={handleSaveResult}
            >
              Save Result
            </Button>
          ) : (
            <Button 
              className="w-full bg-green-500 hover:bg-green-600 h-12"
              onClick={handleReturn}
            >
              <Check className="h-5 w-5 mr-2" />
              Result Saved - Return
            </Button>
          )}
        </div>
      </main>

      <BottomNavigation />
    </div>
  );
};

export default BattleResultsPage;
