
import { useState, useEffect } from "react";
import { useLocation, useNavigate, Link } from "react-router-dom";
import { ChevronLeft, Plus, Minus, QrCode, Scan, Copy, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { BottomNavigation } from "@/components/bottom-navigation";
import { TokenDisplay } from "@/components/token-display";
import { useTrainer } from "@/context/trainer-context";
import { PokemonSprite } from "@/components/pokemon-sprite";
import { mockFacilities } from "@/data/mock-data";
import { cn } from "@/lib/utils";
import { toast } from "@/components/ui/sonner";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";

const BattleSetupPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { trainer, subtractTokens, createBattleRequest, hasPendingBattleRequestFrom } = useTrainer();
  
  const facilityId = location.state?.facilityId;
  const facility = facilityId ? mockFacilities.find(f => f.id === facilityId) : null;
  
  const [opponentId, setOpponentId] = useState("");
  const [opponentName, setOpponentName] = useState("");
  const [battleFormat, setBattleFormat] = useState("single");
  const [tokensWager, setTokensWager] = useState(1);
  const [teamSelected, setTeamSelected] = useState(true);
  const [showLinkCodeDialog, setShowLinkCodeDialog] = useState(false);
  const [linkCode, setLinkCode] = useState("");
  const [linkCodeCopied, setLinkCodeCopied] = useState(false);
  const [isChallengeMode, setIsChallengeMode] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Maximum token wager limit
  const MAX_TOKEN_WAGER = 5;
  
  useEffect(() => {
    // Check if we're in challenge mode (from leaderboard or QR scan)
    if (location.state?.challengeMode) {
      setIsChallengeMode(true);
      if (location.state.opponentName) setOpponentName(location.state.opponentName);
      if (location.state.opponentId) setOpponentId(location.state.opponentId);
      if (location.state.facilityId) {
        const selectedFacility = mockFacilities.find(f => f.id === location.state.facilityId);
        if (selectedFacility && selectedFacility.battleStyle) {
          setBattleFormat(selectedFacility.battleStyle.toLowerCase());
        }
      }
      if (location.state.tokensWagered) {
        // Ensure token wager is within limits
        const wageredTokens = location.state.tokensWagered;
        setTokensWager(Math.min(MAX_TOKEN_WAGER, Math.max(1, wageredTokens)));
      }
    }

    // Check if we have a link code from the opponent
    if (location.state?.linkCode) {
      setLinkCode(location.state.linkCode);
      setShowLinkCodeDialog(true);
    }
  }, [location.state]);
  
  if (!trainer) return null;
  
  const handleTokenIncrease = () => {
    if (tokensWager < Math.min(MAX_TOKEN_WAGER, trainer.tokens)) {
      setTokensWager(prev => prev + 1);
    }
  };
  
  const handleTokenDecrease = () => {
    if (tokensWager > 1) {
      setTokensWager(prev => prev - 1);
    }
  };
  
  const generateLinkCode = () => {
    // Generate random 8-digit code
    const code = Math.floor(10000000 + Math.random() * 90000000).toString();
    setLinkCode(code);
    setShowLinkCodeDialog(true);

    // Share link code with the opponent (in a real app, this would be a WebSocket or API call)
    // For demo, we'll just log it
    console.log(`Link code ${code} generated for battle with ${opponentName}`);
    
    // Subtract tokens for the wager
    subtractTokens(tokensWager);
  };
  
  const copyLinkCode = () => {
    navigator.clipboard.writeText(linkCode);
    setLinkCodeCopied(true);
    setTimeout(() => setLinkCodeCopied(false), 2000);
    toast.success("Link code copied to clipboard");
  };
  
  const handleBattleStart = async () => {
    // Validate form
    if (!opponentName) {
      toast.error("Please enter an opponent name");
      return;
    }
    
    // Check if enough tokens
    if (trainer.tokens < tokensWager) {
      toast.error("You don't have enough tokens");
      return;
    }
    
    // Check if there's already a pending request to this opponent
    if (opponentId && hasPendingBattleRequestFrom(trainer.id)) {
      toast.error("You already have a pending battle request with this trainer");
      return;
    }
    
    setIsSubmitting(true);
    
    if (isChallengeMode) {
      // Create battle request
      try {
        await createBattleRequest({
          facilityId: facilityId || "",
          facilityName: facility?.name || "Battle Arena",
          battleStyle: battleFormat,
          time: new Date().toISOString(),
          tokensWagered: tokensWager,
          notes: `Challenge from ${trainer.name}`,
          opponentId: opponentId
        });
        
        // Generate a link code for the battle request too
        const code = Math.floor(10000000 + Math.random() * 90000000).toString();
        setLinkCode(code);
        
        toast.success(`Battle request sent to ${opponentName}!`);
        // Show link code dialog even for challenge mode
        setShowLinkCodeDialog(true);
      } catch (error) {
        toast.error("Failed to create battle request");
        console.error(error);
      } finally {
        setIsSubmitting(false);
      }
    } else {
      // Generate link code and proceed to battle
      generateLinkCode();
      setIsSubmitting(false);
    }
  };
  
  const proceedToBattle = () => {
    // Navigate to result page with the link code
    navigate("/battle/results", { 
      state: { 
        battle: {
          opponentId: opponentId || "unknown",
          opponentName,
          facilityId,
          result: "pending",
          tokensWagered: tokensWager,
          linkCode: linkCode,
          notes: `${battleFormat} battle at ${facility?.name || 'Unknown Location'}`
        } 
      }
    });
  };
  
  const handleScanQR = () => {
    navigate("/scanner", { 
      state: { 
        returnTo: "/battle/setup",
        forBattleChallenge: true 
      } 
    });
  };
  
  return (
    <div className="min-h-screen bg-gradient-to-b from-atl-dark-purple to-atl-secondary-purple text-white pb-20">
      {/* Header */}
      <header className="px-4 py-4 sticky top-0 z-10 bg-atl-dark-purple/80 backdrop-blur-sm">
        <div className="flex justify-between items-center">
          <div className="flex items-center">
            <Link to={facilityId ? `/battle-area/${facilityId}` : "/dashboard"} className="mr-2 text-white">
              <ChevronLeft className="h-5 w-5" />
            </Link>
            <h1 className="text-xl font-bold">
              {isChallengeMode ? "Challenge Trainer" : "Battle Setup"}
            </h1>
          </div>
          <TokenDisplay count={trainer.tokens} showAddButton={false} className="bg-white/20 text-white" />
        </div>
      </header>

      <main className="p-4">
        {facility && (
          <div className="bg-white/10 backdrop-blur-sm p-4 rounded-xl border border-white/20 mb-6">
            <h2 className="font-medium text-base mb-2">{facility.name}</h2>
            <p className="text-sm text-white/80">{facility.battleStyle}</p>
          </div>
        )}
        
        {/* Opponent Selection */}
        <section className="mb-6">
          <h2 className="text-lg font-semibold mb-3">Opponent</h2>
          <div className="bg-white/10 backdrop-blur-sm p-4 rounded-xl border border-white/20">
            <div className="space-y-4">
              <div>
                <Label htmlFor="opponentName" className="text-white">Opponent Name</Label>
                <div className="flex mt-1">
                  <Input
                    id="opponentName"
                    placeholder="Enter opponent's name"
                    value={opponentName}
                    onChange={(e) => setOpponentName(e.target.value)}
                    className="rounded-r-none bg-white/10 border-white/20 text-white placeholder:text-white/60"
                    readOnly={isChallengeMode}
                  />
                  <Button
                    variant="outline"
                    className="rounded-l-none border-l-0 border-white/20 text-white"
                    onClick={handleScanQR}
                    disabled={isChallengeMode}
                  >
                    <Scan className="h-4 w-4 mr-1" />
                    Scan
                  </Button>
                </div>
                {isChallengeMode && (
                  <p className="mt-1 text-xs text-white/70">
                    Challenging {opponentName} to a battle
                  </p>
                )}
              </div>
              
              <div>
                <Label htmlFor="opponentId" className="text-white/70 text-sm">Opponent ID {!isChallengeMode && "(Optional)"}</Label>
                <Input
                  id="opponentId"
                  placeholder="T12345"
                  value={opponentId}
                  onChange={(e) => setOpponentId(e.target.value)}
                  className="mt-1 bg-white/10 border-white/20 text-white placeholder:text-white/60"
                  readOnly={isChallengeMode}
                />
              </div>
            </div>
          </div>
        </section>
        
        {/* Battle Format */}
        <section className="mb-6">
          <h2 className="text-lg font-semibold mb-3">Battle Format</h2>
          <div className="bg-white/10 backdrop-blur-sm p-4 rounded-xl border border-white/20">
            <RadioGroup value={battleFormat} onValueChange={setBattleFormat} disabled={isChallengeMode}>
              <div className="flex items-center space-x-2 mb-3">
                <RadioGroupItem value="single" id="single" className="border-white text-white" />
                <Label htmlFor="single" className="text-white">Single Battle (1v1)</Label>
              </div>
              <div className="flex items-center space-x-2 mb-3">
                <RadioGroupItem value="double" id="double" className="border-white text-white" />
                <Label htmlFor="double" className="text-white">Double Battle (2v2)</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="multi" id="multi" className="border-white text-white" />
                <Label htmlFor="multi" className="text-white">Multi Battle (2 trainers vs 2 trainers)</Label>
              </div>
            </RadioGroup>
          </div>
        </section>
        
        {/* Token Wager */}
        <section className="mb-6">
          <h2 className="text-lg font-semibold mb-3">Token Wager</h2>
          <div className="bg-white/10 backdrop-blur-sm p-4 rounded-xl border border-white/20">
            <p className="text-sm text-white/80 mb-4">
              The winner receives the wager amount from the loser.
              <span className="block mt-1 text-white/80">Maximum wager: {MAX_TOKEN_WAGER} tokens</span>
            </p>
            
            <div className="flex items-center justify-between">
              <Button
                variant="outline"
                size="icon"
                onClick={handleTokenDecrease}
                disabled={tokensWager <= 1 || isChallengeMode}
                className="border-white/20 text-white"
              >
                <Minus className="h-4 w-4" />
              </Button>
              
              <div className="flex flex-col items-center">
                <div className="text-2xl font-bold text-white">{tokensWager}</div>
                <div className="text-xs text-white/70">Tokens</div>
              </div>
              
              <Button
                variant="outline"
                size="icon"
                onClick={handleTokenIncrease}
                disabled={tokensWager >= Math.min(MAX_TOKEN_WAGER, trainer.tokens) || isChallengeMode}
                className="border-white/20 text-white"
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>
            
            <div className="mt-4 text-center text-sm">
              <span className="text-white/70">Your tokens: </span>
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
              className="text-atl-light-purple text-sm"
            >
              Edit Team
            </Link>
          </div>
          
          <div className="bg-white/10 backdrop-blur-sm p-4 rounded-xl border border-white/20">
            <div className="grid grid-cols-6 gap-2">
              {trainer.team.map((pokemon) => (
                <div key={pokemon.id} className="flex flex-col items-center">
                  <div className="bg-white/10 rounded-full p-1">
                    <PokemonSprite 
                      id={pokemon.id} 
                      name={pokemon.name}
                      size="sm"
                    />
                  </div>
                  <span className="text-xs mt-1 truncate w-full text-center text-white/80">
                    {pokemon.name}
                  </span>
                </div>
              ))}
              
              {trainer.team.length === 0 && (
                <div className="col-span-6 text-center py-4 text-white/60">
                  <p>No Pokémon in your team</p>
                </div>
              )}
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
            {isChallengeMode ? "Send Battle Request" : "Start Battle"}
          </Button>
        </div>
      </main>

      <BottomNavigation />
      
      {/* Link Code Dialog */}
      <Dialog open={showLinkCodeDialog} onOpenChange={setShowLinkCodeDialog}>
        <DialogContent className="bg-atl-dark-purple border-white/20 text-white">
          <DialogHeader>
            <DialogTitle className="text-white text-center">Battle Link Code</DialogTitle>
            <DialogDescription className="text-white/70 text-center">
              {isChallengeMode 
                ? "Share this code with your opponent after they accept your request" 
                : "Share this code with your opponent to connect"}
            </DialogDescription>
          </DialogHeader>
          
          <div className="py-4">
            <div className="bg-white/10 rounded-lg p-4 mb-4 flex flex-col items-center">
              <p className="text-sm text-white/70 mb-2">Both trainers need this code:</p>
              <p className="text-3xl font-mono text-center tracking-widest">{linkCode}</p>
            </div>
            
            <div className="flex justify-center mb-4">
              <Button
                variant="outline"
                onClick={copyLinkCode}
                className="border-white/20 bg-white/10 text-white hover:bg-white/20"
              >
                {linkCodeCopied ? (
                  <><Check className="h-4 w-4 mr-2" /> Copied</>
                ) : (
                  <><Copy className="h-4 w-4 mr-2" /> Copy Code</>
                )}
              </Button>
            </div>
            
            <div className="bg-atl-primary-purple/20 p-3 rounded-lg mb-4">
              <p className="text-white/90 text-sm">
                1. Open Pokémon on your Switch
              </p>
              <p className="text-white/90 text-sm">
                2. Go to Link Battle in the menu
              </p>
              <p className="text-white/90 text-sm">
                3. Enter this code when prompted
              </p>
            </div>
          </div>
          
          <DialogFooter>
            <Button
              onClick={proceedToBattle}
              className="w-full bg-atl-primary-purple hover:bg-atl-secondary-purple"
            >
              Continue to Battle
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default BattleSetupPage;
