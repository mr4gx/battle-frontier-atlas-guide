
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ChevronLeft, Sword, Trophy, X, Clock, Shield } from "lucide-react";
import { BottomNavigation } from "@/components/bottom-navigation";
import { useTrainer } from "@/context/trainer-context";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Battle } from "@/types";
import { mockFacilities } from "@/data/mock-data";

const BattlesPage = () => {
  const { battles, trainer } = useTrainer();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("current");
  
  // Get active battles (pending result)
  const activeBattles = battles.filter(battle => battle.result === "pending");
  
  // Get completed battles
  const completedBattles = battles.filter(battle => battle.result !== "pending");
  
  // Get facility name
  const getFacilityName = (facilityId?: string) => {
    if (!facilityId) return "Friendly Battle";
    
    const facility = mockFacilities.find(f => f.id === facilityId);
    return facility ? facility.name : "Unknown Facility";
  };
  
  // Format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString();
  };
  
  const handleContinueBattle = (battle: Battle) => {
    navigate("/battle/results", { state: { battle } });
  };
  
  return (
    <div className="min-h-screen pb-20">
      {/* Header */}
      <header className="bg-white px-4 py-4 border-b border-gray-200 sticky top-0 z-10">
        <div className="flex items-center">
          <Link to="/dashboard" className="mr-2">
            <ChevronLeft className="h-5 w-5" />
          </Link>
          <h1 className="text-xl font-bold text-atl-dark-purple">Battles</h1>
        </div>
      </header>

      <main className="p-4">
        {/* Tabs */}
        <Tabs defaultValue="current" onValueChange={setActiveTab}>
          <TabsList className="w-full mb-4">
            <TabsTrigger value="current" className="flex-1">
              <Clock className="h-4 w-4 mr-2" />
              Active
            </TabsTrigger>
            <TabsTrigger value="history" className="flex-1">
              <Sword className="h-4 w-4 mr-2" />
              History
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="current">
            {activeBattles.length > 0 ? (
              <div className="space-y-4">
                {activeBattles.map(battle => (
                  <div key={battle.id} className="bg-white rounded-lg shadow-sm border overflow-hidden">
                    <div className="bg-amber-50 border-amber-100 px-3 py-2 text-sm flex justify-between items-center border-b">
                      <div className="font-medium">
                        {getFacilityName(battle.facilityId)}
                      </div>
                      <div className="text-amber-600 flex items-center">
                        <Clock className="h-3 w-3 mr-1" />
                        <span className="text-xs font-medium">In Progress</span>
                      </div>
                    </div>
                    
                    <div className="p-3">
                      <div className="flex justify-between items-center mb-2">
                        <div className="flex items-center">
                          <div className="w-8 h-8 rounded-full flex items-center justify-center mr-2 text-white bg-atl-primary-purple">
                            {battle.opponentName.charAt(0)}
                          </div>
                          <span className="font-medium">
                            vs. {battle.opponentName}
                          </span>
                        </div>
                        
                        <div className="text-xs text-gray-500">
                          {formatDate(battle.date)}
                        </div>
                      </div>
                      
                      <div className="flex justify-between items-center text-sm">
                        <div className="text-gray-600">
                          <span>Tokens: </span>
                          <span className="font-medium">{battle.tokensWagered}</span>
                        </div>
                        
                        <Button 
                          size="sm" 
                          onClick={() => handleContinueBattle(battle)}
                          className="bg-atl-primary-purple hover:bg-atl-secondary-purple"
                        >
                          Continue Battle
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-10">
                <div className="text-gray-400 mb-2">
                  <Shield className="h-10 w-10 mx-auto" />
                </div>
                <h3 className="text-lg font-medium mb-1">No active battles</h3>
                <p className="text-gray-500 text-sm mb-4">
                  You don't have any battles in progress
                </p>
                <Button
                  onClick={() => navigate("/battle/setup")}
                  className="bg-atl-primary-purple hover:bg-atl-secondary-purple"
                >
                  Start a Battle
                </Button>
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="history">
            {completedBattles.length > 0 ? (
              <div className="space-y-4">
                {completedBattles.map(battle => (
                  <div 
                    key={battle.id}
                    className="bg-white rounded-lg shadow-sm border overflow-hidden"
                  >
                    <div 
                      className={cn(
                        "px-3 py-2 text-sm flex justify-between items-center border-b",
                        battle.result === "win" ? "bg-green-50 border-green-100" : "bg-red-50 border-red-100"
                      )}
                    >
                      <div className="font-medium">
                        {getFacilityName(battle.facilityId)}
                      </div>
                      <div 
                        className={cn(
                          "flex items-center",
                          battle.result === "win" ? "text-green-600" : "text-red-600"
                        )}
                      >
                        {battle.result === "win" ? (
                          <Trophy className="h-3 w-3 mr-1" />
                        ) : (
                          <X className="h-3 w-3 mr-1" />
                        )}
                        <span className="text-xs font-medium">
                          {battle.result === "win" ? "Win" : "Loss"}
                        </span>
                      </div>
                    </div>
                    
                    <div className="p-3">
                      <div className="flex justify-between items-center mb-2">
                        <div className="flex items-center">
                          <div 
                            className={cn(
                              "w-8 h-8 rounded-full flex items-center justify-center mr-2 text-white",
                              battle.result === "win" ? "bg-gray-400" : "bg-atl-primary-purple"
                            )}
                          >
                            {battle.opponentName.charAt(0)}
                          </div>
                          <span className="font-medium">
                            {battle.opponentName}
                          </span>
                        </div>
                        
                        <div className="text-xs text-gray-500">
                          {formatDate(battle.date)}
                        </div>
                      </div>
                      
                      <div className="flex justify-between items-center text-sm">
                        <div className="text-gray-600">
                          <span>Tokens: </span>
                          <span className="font-medium">{battle.tokensWagered}</span>
                        </div>
                        
                        {battle.notes && (
                          <div className="text-gray-500 text-xs italic truncate max-w-[200px]">
                            "{battle.notes}"
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-10">
                <div className="text-gray-400 mb-2">
                  <Sword className="h-10 w-10 mx-auto" />
                </div>
                <h3 className="text-lg font-medium mb-1">No battle history</h3>
                <p className="text-gray-500 text-sm mb-4">
                  Your completed battles will appear here
                </p>
                <Button
                  onClick={() => navigate("/battle/setup")}
                  className="bg-atl-primary-purple hover:bg-atl-secondary-purple"
                >
                  Start a Battle
                </Button>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </main>

      <BottomNavigation />
    </div>
  );
};

export default BattlesPage;
