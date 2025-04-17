
import { useState } from "react";
import { useLocation, useNavigate, Link } from "react-router-dom";
import { ChevronLeft, Plus, Minus, QrCode, Scan } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { BottomNavigation } from "@/components/bottom-navigation";
import { TokenDisplay } from "@/components/token-display";
import { useTrainer } from "@/context/trainer-context";
import { PokemonSprite } from "@/components/pokemon-sprite";
import { mockFacilities } from "@/data/mock-data";

const BattleSetupPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { trainer, subtractTokens, addBattle } = useTrainer();
  
  const facilityId = location.state?.facilityId;
  const facility = facilityId ? mockFacilities.find(f => f.id === facilityId) : null;
  
  const [opponentId, setOpponentId] = useState("");
  const [opponentName, setOpponentName] = useState("");
  const [battleFormat, setBattleFormat] = useState("single");
  const [tokensWager, setTokensWager] = useState(5);
  const [teamSelected, setTeamSelected] = useState(true);
  
  if (!trainer) return null;
  
  const handleTokenIncrease = () => {
    if (tokensWager < trainer.tokens) {
      setTokensWager(prev => prev + 1);
    }
  };
  
  const handleTokenDecrease = () => {
    if (tokensWager > 1) {
      setTokensWager(prev => prev - 1);
    }
  };
  
  const handleBattleStart = () => {
    // Validate form
    if (!opponentName) {
      alert("Please enter an opponent name");
      return;
    }
    
    // Check if enough tokens
    if (trainer.tokens < tokensWager) {
      alert("You don't have enough tokens");
      return;
    }
    
    // Subtract tokens for the wager (will be returned + opponent tokens if win)
    subtractTokens(tokensWager);
    
    // For demo purposes, we'll just create a mock battle with 50/50 win chance
    const result = Math.random() > 0.5 ? "win" : "loss";
    
    // Create a new battle record
    const battle = addBattle({
      opponentId: opponentId || "unknown",
      opponentName,
      facilityId,
      result,
      tokensWagered: tokensWager,
      notes: `${battleFormat} battle at ${facility?.name || 'unknown location'}`
    });
    
    // Navigate to result page
    navigate("/battle/results", { state: { battle } });
  };
  
  const handleScanQR = () => {
    navigate("/scanner", { state: { returnTo: "/battle/setup" } });
  };
  
  return (
    <div className="min-h-screen pb-20">
      {/* Header */}
      <header className="bg-white px-4 py-4 border-b border-gray-200 sticky top-0 z-10">
        <div className="flex justify-between items-center">
          <div className="flex items-center">
            <Link to={facilityId ? `/facility/${facilityId}` : "/dashboard"} className="mr-2">
              <ChevronLeft className="h-5 w-5" />
            </Link>
            <h1 className="text-xl font-bold text-atl-dark-purple">Battle Setup</h1>
          </div>
          <TokenDisplay count={trainer.tokens} />
        </div>
      </header>

      <main className="p-4">
        {facility && (
          <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100 mb-6">
            <h2 className="font-medium text-base mb-2">{facility.name}</h2>
            <p className="text-sm text-gray-600">{facility.battleStyle}</p>
          </div>
        )}
        
        {/* Opponent Selection */}
        <section className="mb-6">
          <h2 className="text-lg font-semibold mb-3">Opponent</h2>
          <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
            <div className="space-y-4">
              <div>
                <Label htmlFor="opponentName">Opponent Name</Label>
                <div className="flex mt-1">
                  <Input
                    id="opponentName"
                    placeholder="Enter opponent's name"
                    value={opponentName}
                    onChange={(e) => setOpponentName(e.target.value)}
                    className="rounded-r-none"
                  />
                  <Button
                    variant="outline"
                    className="rounded-l-none border-l-0"
                    onClick={handleScanQR}
                  >
                    <Scan className="h-4 w-4 mr-1" />
                    Scan
                  </Button>
                </div>
              </div>
              
              <div>
                <Label htmlFor="opponentId" className="text-gray-500 text-sm">Opponent ID (Optional)</Label>
                <Input
                  id="opponentId"
                  placeholder="T12345"
                  value={opponentId}
                  onChange={(e) => setOpponentId(e.target.value)}
                  className="mt-1"
                />
              </div>
            </div>
          </div>
        </section>
        
        {/* Battle Format */}
        <section className="mb-6">
          <h2 className="text-lg font-semibold mb-3">Battle Format</h2>
          <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
            <RadioGroup value={battleFormat} onValueChange={setBattleFormat}>
              <div className="flex items-center space-x-2 mb-3">
                <RadioGroupItem value="single" id="single" />
                <Label htmlFor="single">Single Battle (1v1)</Label>
              </div>
              <div className="flex items-center space-x-2 mb-3">
                <RadioGroupItem value="double" id="double" />
                <Label htmlFor="double">Double Battle (2v2)</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="multi" id="multi" />
                <Label htmlFor="multi">Multi Battle (2 trainers vs 2 trainers)</Label>
              </div>
            </RadioGroup>
          </div>
        </section>
        
        {/* Token Wager */}
        <section className="mb-6">
          <h2 className="text-lg font-semibold mb-3">Token Wager</h2>
          <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
            <p className="text-sm text-gray-600 mb-4">
              The winner receives the wager amount from the loser.
            </p>
            
            <div className="flex items-center justify-between">
              <Button
                variant="outline"
                size="icon"
                onClick={handleTokenDecrease}
                disabled={tokensWager <= 1}
              >
                <Minus className="h-4 w-4" />
              </Button>
              
              <div className="flex flex-col items-center">
                <div className="text-2xl font-bold text-atl-dark-purple">{tokensWager}</div>
                <div className="text-xs text-gray-500">Tokens</div>
              </div>
              
              <Button
                variant="outline"
                size="icon"
                onClick={handleTokenIncrease}
                disabled={tokensWager >= trainer.tokens}
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>
            
            <div className="mt-4 text-center text-sm">
              <span className="text-gray-500">Your tokens: </span>
              <span className="font-medium">{trainer.tokens}</span>
            </div>
          </div>
        </section>
        
        {/* Team Preview */}
        <section className="mb-6">
          <div className="flex justify-between items-center mb-3">
            <h2 className="text-lg font-semibold">Your Team</h2>
            <Link 
              to="/team" 
              className="text-atl-primary-purple text-sm"
            >
              Edit Team
            </Link>
          </div>
          
          <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
            <div className="grid grid-cols-6 gap-2">
              {trainer.team.map((pokemon) => (
                <div key={pokemon.id} className="flex flex-col items-center">
                  <PokemonSprite 
                    id={pokemon.id} 
                    name={pokemon.name}
                    size="sm"
                  />
                  <span className="text-xs mt-1 truncate w-full text-center">
                    {pokemon.name}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </section>
        
        {/* Start Battle Button */}
        <div className="mt-6">
          <Button 
            className="w-full bg-atl-primary-purple hover:bg-atl-secondary-purple h-12"
            onClick={handleBattleStart}
            disabled={!opponentName || !teamSelected || trainer.tokens < tokensWager}
          >
            Start Battle
          </Button>
        </div>
      </main>

      <BottomNavigation />
    </div>
  );
};

export default BattleSetupPage;
