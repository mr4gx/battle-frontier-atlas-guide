
import { useState } from "react";
import { Link } from "react-router-dom";
import { ChevronLeft, Trophy, Calendar } from "lucide-react";
import { BottomNavigation } from "@/components/bottom-navigation";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";
import { mockTournament } from "@/data/mock-data";
import { useTrainer } from "@/context/trainer-context";

const BracketPage = () => {
  const { trainer } = useTrainer();
  const [selectedRound, setSelectedRound] = useState("all");
  
  if (!trainer) return null;
  
  const tournament = mockTournament;
  
  // Filter matches by round if a specific round is selected
  const displayedMatches = selectedRound === "all" 
    ? tournament.matches 
    : tournament.matches.filter(match => match.round.toString() === selectedRound);
  
  // Group matches by round
  const matchesByRound = displayedMatches.reduce((acc, match) => {
    if (!acc[match.round]) {
      acc[match.round] = [];
    }
    acc[match.round].push(match);
    return acc;
  }, {} as Record<number, typeof tournament.matches>);
  
  // Get participant name function
  const getParticipantName = (id?: string) => {
    if (!id) return "TBD";
    if (id === trainer.id) return trainer.name;
    
    // Mock participant names
    const mockNames: Record<string, string> = {
      "T54321": "Gary Oak",
      "T98765": "Misty",
      "T24680": "Brock",
      "T13579": "Dawn",
      "T11111": "Cynthia",
      "T22222": "Lance",
      "T33333": "Steven"
    };
    
    return mockNames[id] || id;
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
            <h1 className="text-xl font-bold text-atl-dark-purple">Championship Bracket</h1>
          </div>
          <div className="flex items-center text-sm text-atl-primary-purple">
            <Trophy className="h-4 w-4 mr-1" />
            <span>Round {tournament.currentRound}/{tournament.totalRounds}</span>
          </div>
        </div>
      </header>

      <main className="p-4">
        {/* Tournament Info */}
        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100 mb-6">
          <h2 className="font-bold text-lg mb-2">{tournament.name}</h2>
          <div className="flex items-center text-sm text-gray-500">
            <Calendar className="h-4 w-4 mr-1" />
            <span>April 16-18, 2025</span>
          </div>
        </div>
        
        {/* Round Selection */}
        <div className="mb-6">
          <Tabs defaultValue="all" onValueChange={setSelectedRound}>
            <TabsList className="w-full">
              <TabsTrigger value="all">All Rounds</TabsTrigger>
              {Array.from({ length: tournament.totalRounds }, (_, i) => (
                <TabsTrigger key={i + 1} value={(i + 1).toString()}>
                  Round {i + 1}
                </TabsTrigger>
              ))}
            </TabsList>
          </Tabs>
        </div>
        
        {/* Bracket Visualization */}
        <div className="space-y-6">
          {Object.entries(matchesByRound).map(([round, matches]) => (
            <div key={round}>
              <h3 className="text-lg font-semibold mb-3">
                Round {round} {Number(round) === tournament.currentRound && "(Current)"}
              </h3>
              
              <div className="space-y-3">
                {matches.map((match) => {
                  const isYourMatch = match.participant1Id === trainer.id || match.participant2Id === trainer.id;
                  const participant1 = getParticipantName(match.participant1Id);
                  const participant2 = getParticipantName(match.participant2Id);
                  const matchTime = match.time ? new Date(match.time) : null;
                  
                  return (
                    <div 
                      key={match.id} 
                      className={cn(
                        "bg-white rounded-lg shadow-sm border overflow-hidden",
                        match.completed ? "border-gray-200" : 
                        isYourMatch ? "border-atl-primary-purple" : "border-gray-100"
                      )}
                    >
                      {/* Match Header */}
                      <div 
                        className={cn(
                          "px-3 py-2 text-sm flex justify-between items-center border-b",
                          match.completed ? "bg-gray-50 border-gray-100" : 
                          isYourMatch ? "bg-atl-soft-blue border-atl-light-purple" : 
                          "bg-white border-gray-100"
                        )}
                      >
                        <div className="font-medium">
                          Match {match.id.replace("m", "#")}
                        </div>
                        {matchTime && (
                          <div className="text-gray-500 text-xs">
                            {matchTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}{' '}
                            • {matchTime.toLocaleDateString([], { month: 'short', day: 'numeric' })}
                          </div>
                        )}
                      </div>
                      
                      {/* Participants */}
                      <div className="p-3">
                        <div className="flex justify-between items-center mb-2">
                          <div 
                            className={cn(
                              "flex items-center flex-1",
                              match.winnerId === match.participant1Id && "font-medium"
                            )}
                          >
                            <div 
                              className={cn(
                                "w-8 h-8 rounded-full flex items-center justify-center mr-2 text-white",
                                isYourMatch && match.participant1Id === trainer.id 
                                  ? "bg-atl-primary-purple" 
                                  : "bg-gray-400"
                              )}
                            >
                              {participant1.charAt(0)}
                            </div>
                            <span className={cn(
                              match.winnerId === match.participant1Id ? "text-green-600" :
                              match.completed ? "text-gray-500" : ""
                            )}>
                              {participant1}
                            </span>
                          </div>
                          
                          {match.completed && match.winnerId === match.participant1Id && (
                            <Trophy className="h-4 w-4 text-yellow-500" />
                          )}
                        </div>
                        
                        <div className="border-t border-gray-100 my-2"></div>
                        
                        <div className="flex justify-between items-center">
                          <div 
                            className={cn(
                              "flex items-center flex-1",
                              match.winnerId === match.participant2Id && "font-medium"
                            )}
                          >
                            <div 
                              className={cn(
                                "w-8 h-8 rounded-full flex items-center justify-center mr-2 text-white",
                                isYourMatch && match.participant2Id === trainer.id 
                                  ? "bg-atl-primary-purple" 
                                  : "bg-gray-400"
                              )}
                            >
                              {participant2.charAt(0)}
                            </div>
                            <span className={cn(
                              match.winnerId === match.participant2Id ? "text-green-600" :
                              match.completed ? "text-gray-500" : ""
                            )}>
                              {participant2}
                            </span>
                          </div>
                          
                          {match.completed && match.winnerId === match.participant2Id && (
                            <Trophy className="h-4 w-4 text-yellow-500" />
                          )}
                        </div>
                      </div>
                      
                      {/* Match Status */}
                      {match.completed ? (
                        <div className="px-3 py-2 bg-gray-50 text-xs text-gray-500 border-t border-gray-100">
                          Match completed
                        </div>
                      ) : (
                        <div className="px-3 py-2 bg-atl-soft-blue text-xs text-atl-dark-purple border-t border-atl-light-purple/30">
                          {isYourMatch ? "Your upcoming match" : "Match scheduled"}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </main>

      <BottomNavigation />
    </div>
  );
};

export default BracketPage;
