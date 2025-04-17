
import { useState } from "react";
import { Link } from "react-router-dom";
import { ChevronLeft, Trophy, X, Search, Filter } from "lucide-react";
import { BottomNavigation } from "@/components/bottom-navigation";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { useTrainer } from "@/context/trainer-context";
import { mockFacilities } from "@/data/mock-data";
import { cn } from "@/lib/utils";

const BattleHistoryPage = () => {
  const { battles } = useTrainer();
  const [searchTerm, setSearchTerm] = useState("");
  const [filter, setFilter] = useState("all");
  
  // Filter battles based on selected filter
  const filteredBattles = battles.filter(battle => {
    if (filter === "wins" && battle.result !== "win") return false;
    if (filter === "losses" && battle.result !== "loss") return false;
    
    // Search filter
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      return (
        battle.opponentName.toLowerCase().includes(term) ||
        (battle.notes && battle.notes.toLowerCase().includes(term))
      );
    }
    
    return true;
  });
  
  // Group battles by date
  const battlesByDate = filteredBattles.reduce((acc, battle) => {
    const date = new Date(battle.date).toLocaleDateString();
    
    if (!acc[date]) {
      acc[date] = [];
    }
    
    acc[date].push(battle);
    return acc;
  }, {} as Record<string, typeof battles>);
  
  // Get facility name
  const getFacilityName = (facilityId?: string) => {
    if (!facilityId) return "Friendly Battle";
    
    const facility = mockFacilities.find(f => f.id === facilityId);
    return facility ? facility.name : "Unknown Facility";
  };
  
  return (
    <div className="min-h-screen pb-20">
      {/* Header */}
      <header className="bg-white px-4 py-4 border-b border-gray-200 sticky top-0 z-10">
        <div className="flex items-center">
          <Link to="/dashboard" className="mr-2">
            <ChevronLeft className="h-5 w-5" />
          </Link>
          <h1 className="text-xl font-bold text-atl-dark-purple">Battle History</h1>
        </div>
      </header>

      <main className="p-4">
        {/* Search Bar */}
        <div className="relative mb-4">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search battles by opponent or notes..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-9"
          />
        </div>
        
        {/* Tabs */}
        <div className="mb-6">
          <Tabs defaultValue="all" onValueChange={setFilter}>
            <TabsList className="w-full">
              <TabsTrigger value="all">All</TabsTrigger>
              <TabsTrigger value="wins">Wins</TabsTrigger>
              <TabsTrigger value="losses">Losses</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
        
        {/* Battle List */}
        {Object.keys(battlesByDate).length > 0 ? (
          <div className="space-y-6">
            {Object.entries(battlesByDate).map(([date, dayBattles]) => (
              <div key={date}>
                <h3 className="text-sm font-medium text-gray-500 mb-3">{date}</h3>
                
                <div className="space-y-3">
                  {dayBattles.map((battle) => (
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
                            {new Date(battle.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
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
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-10">
            <div className="text-gray-400 mb-2">
              <Filter className="h-10 w-10 mx-auto" />
            </div>
            <h3 className="text-lg font-medium mb-1">No battles found</h3>
            <p className="text-gray-500 text-sm">
              {searchTerm 
                ? "Try a different search term" 
                : filter !== "all" 
                  ? `No ${filter} recorded yet` 
                  : "Your battle history will appear here"}
            </p>
          </div>
        )}
      </main>

      <BottomNavigation />
    </div>
  );
};

export default BattleHistoryPage;
