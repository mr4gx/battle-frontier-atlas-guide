
import { useState } from "react";
import { Link } from "react-router-dom";
import { ChevronLeft, Trophy, Sword, Medal, Filter, Search } from "lucide-react";
import { BottomNavigation } from "@/components/bottom-navigation";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useTrainer } from "@/context/trainer-context";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { toast } from "@/components/ui/sonner";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { TokenDisplay } from "@/components/token-display";
import { Trainer } from "@/types";

const LeaderboardPage = () => {
  const { trainer, getAllTrainers, createBattleRequest } = useTrainer();
  const [searchTerm, setSearchTerm] = useState("");
  const [filterClass, setFilterClass] = useState("");
  const [selectedTrainer, setSelectedTrainer] = useState<Trainer | null>(null);
  const [battleRequest, setBattleRequest] = useState({
    facilityId: "",
    facilityName: "",
    battleStyle: "Singles",
    time: "",
    tokensWagered: 1,
    notes: ""
  });
  
  // Mock facilities data for selecting in the battle request form
  const facilities = [
    { id: "f1", name: "Battle Tower", battleStyle: "Singles" },
    { id: "f2", name: "Battle Dome", battleStyle: "Singles" },
    { id: "f3", name: "Battle Factory", battleStyle: "Doubles" },
  ];
  
  if (!trainer) return null;
  
  const allTrainers = getAllTrainers().sort((a, b) => b.tokens - a.tokens);
  
  // Filter trainers based on search and class filter
  const filteredTrainers = allTrainers.filter(t => {
    const matchesSearch = t.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         t.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesClass = filterClass ? t.trainerClass === filterClass : true;
    return matchesSearch && matchesClass;
  });
  
  // Get all unique trainer classes for the filter
  const trainerClasses = [...new Set(allTrainers.map(t => t.trainerClass))];
  
  // Get the rank of the current trainer
  const currentTrainerRank = allTrainers.findIndex(t => t.id === trainer.id) + 1;
  
  // Get medal type based on rank
  const getMedalType = (rank: number) => {
    if (rank === 1) return "text-yellow-400";
    if (rank === 2) return "text-gray-400";
    if (rank === 3) return "text-amber-600";
    return "text-gray-500";
  };
  
  // Handle selecting a trainer for battle
  const handleSelectTrainer = (selectedTrainer: Trainer) => {
    setSelectedTrainer(selectedTrainer);
  };
  
  // Handle facility selection in the form
  const handleFacilityChange = (facilityId: string) => {
    const facility = facilities.find(f => f.id === facilityId);
    if (facility) {
      setBattleRequest({
        ...battleRequest,
        facilityId: facility.id,
        facilityName: facility.name,
        battleStyle: facility.battleStyle
      });
    }
  };
  
  // Handle submitting a battle request
  const handleSubmitRequest = () => {
    // Validate the form
    if (!battleRequest.facilityId || !battleRequest.time || battleRequest.tokensWagered < 1) {
      toast.error("Please fill out all required fields");
      return;
    }
    
    if (!selectedTrainer) {
      toast.error("No trainer selected");
      return;
    }
    
    createBattleRequest(battleRequest);
    
    toast.success(`Battle request sent to ${selectedTrainer.name}`);
    
    // Reset form
    setBattleRequest({
      facilityId: "",
      facilityName: "",
      battleStyle: "Singles",
      time: "",
      tokensWagered: 1,
      notes: ""
    });
    setSelectedTrainer(null);
  };
  
  return (
    <div className="min-h-screen pb-20 bg-gradient-to-b from-atl-dark-purple to-atl-secondary-purple text-white">
      {/* Header */}
      <header className="bg-white/10 backdrop-blur-md px-4 py-4 border-b border-white/10 sticky top-0 z-10">
        <div className="flex justify-between items-center">
          <div className="flex items-center">
            <Link to="/dashboard" className="mr-2 text-white">
              <ChevronLeft className="h-5 w-5" />
            </Link>
            <h1 className="text-xl font-bold text-white">Trainer Leaderboard</h1>
          </div>
          <div className="flex items-center">
            <TokenDisplay count={trainer.tokens} />
          </div>
        </div>
      </header>

      <main className="p-4">
        {/* Search and Filter */}
        <div className="flex items-center gap-2 mb-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search trainers..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9 bg-white/10 border-white/20 text-white placeholder:text-gray-300"
            />
          </div>
          
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline" size="icon" className="border-white/20 bg-white/10 text-white hover:bg-white/20">
                <Filter className="h-4 w-4" />
              </Button>
            </SheetTrigger>
            <SheetContent className="bg-atl-dark-purple text-white border-white/20">
              <SheetHeader>
                <SheetTitle className="text-white">Filter Trainers</SheetTitle>
              </SheetHeader>
              
              <div className="mt-6 space-y-4">
                <div className="space-y-2">
                  <Label className="text-white">Trainer Class</Label>
                  <Select 
                    value={filterClass} 
                    onValueChange={setFilterClass}
                  >
                    <SelectTrigger className="bg-white/10 border-white/20 text-white">
                      <SelectValue placeholder="All Classes" />
                    </SelectTrigger>
                    <SelectContent className="bg-atl-dark-purple text-white border-white/20">
                      <SelectItem value="" className="focus:bg-white/20 focus:text-white">All Classes</SelectItem>
                      {trainerClasses.map((tClass) => (
                        <SelectItem key={tClass} value={tClass} className="focus:bg-white/20 focus:text-white">
                          {tClass}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="pt-4">
                  <Button 
                    variant="outline" 
                    onClick={() => setFilterClass("")}
                    className="w-full border-white/20 bg-white/10 text-white hover:bg-white/20"
                  >
                    Reset Filters
                  </Button>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
        
        {/* Current Trainer Rank */}
        <div className="bg-white/10 backdrop-blur-md rounded-lg border border-white/20 p-4 mb-4">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="font-medium text-sm text-gray-300">Your Rank</h2>
              <div className="flex items-center mt-1">
                <span className="font-bold text-2xl text-white">#{currentTrainerRank}</span>
                <div className="ml-2 px-2 py-1 bg-white/20 rounded-full text-xs text-white">
                  {trainer.tokens} Tokens
                </div>
              </div>
            </div>
            <div className="h-12 w-12 flex items-center justify-center">
              <Medal className={`h-8 w-8 ${getMedalType(currentTrainerRank)}`} />
            </div>
          </div>
        </div>
        
        {/* Leaderboard */}
        <div className="bg-white/10 backdrop-blur-md rounded-lg border border-white/20 overflow-hidden">
          <div className="px-4 py-3 border-b border-white/20 flex justify-between items-center">
            <h2 className="font-semibold text-white">Top Trainers</h2>
            <Badge variant="outline" className="font-normal border-white/20 text-white">
              {filteredTrainers.length} Trainers
            </Badge>
          </div>
          
          <div className="divide-y divide-white/10">
            {filteredTrainers.map((t, index) => (
              <div key={t.id} className="p-4 flex items-center justify-between">
                <div className="flex items-center">
                  <div className="w-8 text-center font-bold text-white">
                    {index < 3 ? (
                      <Medal className={`h-5 w-5 mx-auto ${getMedalType(index + 1)}`} />
                    ) : (
                      `#${index + 1}`
                    )}
                  </div>
                  
                  <div className="ml-3">
                    <div className="font-medium text-white">{t.name}</div>
                    <div className="text-xs text-gray-300">{t.trainerClass} • ID: {t.id}</div>
                  </div>
                </div>
                
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-1 bg-white/20 px-2 py-1 rounded-full">
                    <Trophy className="h-3 w-3 text-white" />
                    <span className="text-sm font-medium text-white">{t.tokens}</span>
                  </div>
                  
                  {t.id !== trainer.id && (
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button 
                          variant="outline" 
                          size="icon" 
                          className="h-8 w-8 border-white/20 bg-white/10 text-white hover:bg-white/20"
                          onClick={() => handleSelectTrainer(t)}
                        >
                          <Sword className="h-4 w-4 text-white" />
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="bg-atl-dark-purple text-white border-white/20">
                        <DialogHeader>
                          <DialogTitle className="text-white">Challenge {selectedTrainer?.name}</DialogTitle>
                          <DialogDescription className="text-gray-300">
                            Create a battle request to challenge this trainer.
                          </DialogDescription>
                        </DialogHeader>
                        
                        <div className="space-y-4 py-4">
                          <div className="space-y-2">
                            <Label className="text-white">Battle Facility</Label>
                            <Select 
                              value={battleRequest.facilityId} 
                              onValueChange={handleFacilityChange}
                            >
                              <SelectTrigger className="bg-white/10 border-white/20 text-white">
                                <SelectValue placeholder="Select Facility" />
                              </SelectTrigger>
                              <SelectContent className="bg-atl-dark-purple text-white border-white/20">
                                {facilities.map(facility => (
                                  <SelectItem key={facility.id} value={facility.id} className="focus:bg-white/20 focus:text-white">
                                    {facility.name}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                          
                          <div className="space-y-2">
                            <Label className="text-white">Battle Style</Label>
                            <Select 
                              value={battleRequest.battleStyle} 
                              onValueChange={(value) => setBattleRequest({...battleRequest, battleStyle: value})}
                            >
                              <SelectTrigger className="bg-white/10 border-white/20 text-white">
                                <SelectValue placeholder="Battle Style" />
                              </SelectTrigger>
                              <SelectContent className="bg-atl-dark-purple text-white border-white/20">
                                <SelectItem value="Singles" className="focus:bg-white/20 focus:text-white">Singles</SelectItem>
                                <SelectItem value="Doubles" className="focus:bg-white/20 focus:text-white">Doubles</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          
                          <div className="space-y-2">
                            <Label className="text-white">Date & Time</Label>
                            <Input 
                              type="datetime-local"
                              value={battleRequest.time}
                              onChange={(e) => setBattleRequest({...battleRequest, time: e.target.value})}
                              className="bg-white/10 border-white/20 text-white"
                            />
                          </div>
                          
                          <div className="space-y-2">
                            <Label className="text-white">Token Wager</Label>
                            <div className="flex items-center">
                              <Button 
                                type="button" 
                                variant="outline" 
                                size="sm"
                                className="border-white/20 bg-white/10 text-white hover:bg-white/20"
                                onClick={() => setBattleRequest({...battleRequest, tokensWagered: Math.max(1, battleRequest.tokensWagered - 1)})}
                              >
                                -
                              </Button>
                              <span className="mx-4 font-medium text-white">{battleRequest.tokensWagered}</span>
                              <Button 
                                type="button" 
                                variant="outline" 
                                size="sm"
                                className="border-white/20 bg-white/10 text-white hover:bg-white/20"
                                onClick={() => setBattleRequest({...battleRequest, tokensWagered: Math.min(10, battleRequest.tokensWagered + 1)})}
                              >
                                +
                              </Button>
                            </div>
                          </div>
                          
                          <div className="space-y-2">
                            <Label className="text-white">Notes (Optional)</Label>
                            <Input 
                              placeholder="Any special rules or comments"
                              value={battleRequest.notes}
                              onChange={(e) => setBattleRequest({...battleRequest, notes: e.target.value})}
                              className="bg-white/10 border-white/20 text-white placeholder:text-gray-300"
                            />
                          </div>
                        </div>
                        
                        <DialogFooter>
                          <Button 
                            onClick={handleSubmitRequest}
                            className="bg-white/20 hover:bg-white/30 text-white"
                          >
                            Send Challenge
                          </Button>
                        </DialogFooter>
                      </DialogContent>
                    </Dialog>
                  )}
                </div>
              </div>
            ))}
            
            {filteredTrainers.length === 0 && (
              <div className="p-8 text-center">
                <p className="text-gray-300">No trainers found</p>
              </div>
            )}
          </div>
        </div>
      </main>

      <BottomNavigation />
    </div>
  );
};

export default LeaderboardPage;
