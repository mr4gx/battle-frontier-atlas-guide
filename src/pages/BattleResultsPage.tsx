
import { useEffect, useState, useRef } from "react";
import { useLocation, useNavigate, Link } from "react-router-dom";
import { ChevronLeft, Trophy, X, Check, Camera, Upload, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { BottomNavigation } from "@/components/bottom-navigation";
import { TokenDisplay } from "@/components/token-display";
import { BadgeIcon } from "@/components/ui/badge-icon";
import { useTrainer } from "@/context/trainer-context";
import { Battle } from "@/types";
import { mockFacilities } from "@/data/mock-data";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { toast } from "@/components/ui/sonner";
import { useBattleLock } from "@/hooks/use-battle-lock";

const BattleResultsPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { trainer, addTokens, updateBadge, subtractTokens, addBattle } = useTrainer();
  const { lockNavigation, unlockNavigation } = useBattleLock();
  const [notes, setNotes] = useState("");
  const [saveComplete, setSaveComplete] = useState(false);
  const [showTokenAnimation, setShowTokenAnimation] = useState(false);
  const [showBadgeAnimation, setShowBadgeAnimation] = useState(false);
  const [battleResult, setBattleResult] = useState<"win" | "loss" | "pending">("pending");
  const [verificationImage, setVerificationImage] = useState<string | null>(null);
  const [tokensAdded, setTokensAdded] = useState(false); // Track if tokens have been added
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const battle = location.state?.battle as Battle;
  
  useEffect(() => {
    if (!battle) {
      navigate("/dashboard");
    }
  }, [battle, navigate]);
  
  if (!battle) {
    return null;
  }
  
  const facility = battle.facilityId 
    ? mockFacilities.find(f => f.id === battle.facilityId) 
    : null;
    
  const badge = facility 
    ? trainer?.badges.find(b => b.facilityId === facility.id) 
    : null;
    
  const shouldEarnBadge = battleResult === "win" && facility && badge && !badge.obtained;
  
  useEffect(() => {
    lockNavigation("/battle/results");
    
    return () => {
      if (saveComplete) {
        unlockNavigation();
      }
    };
  }, [lockNavigation, saveComplete, unlockNavigation]);
  
  useEffect(() => {
    if (battle.result && battle.result !== "pending") {
      setBattleResult(battle.result as "win" | "loss");
      
      const tokenTimer = setTimeout(() => {
        setShowTokenAnimation(true);
      }, 500);
      
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
    }
  }, [battle.result, shouldEarnBadge]);
  
  // Modify this effect to check if tokens have already been added
  useEffect(() => {
    if (showTokenAnimation && battleResult === "win" && !tokensAdded) {
      addTokens(battle.tokensWagered * 2);
      setTokensAdded(true); // Mark tokens as added to prevent multiple additions
    }
  }, [showTokenAnimation, battleResult, battle.tokensWagered, addTokens, tokensAdded]);
  
  useEffect(() => {
    if (showBadgeAnimation && shouldEarnBadge && badge) {
      updateBadge(badge.id, { 
        obtained: true, 
        dateObtained: new Date().toISOString() 
      });
    }
  }, [showBadgeAnimation, shouldEarnBadge, badge, updateBadge]);
  
  const handleResultSelection = (result: "win" | "loss") => {
    // If result is the same as current, do nothing to prevent re-triggers
    if (result === battleResult) return;
    
    setBattleResult(result);
    
    if (result === "loss") {
      // For losses, we only subtract tokens once
      if (!tokensAdded) {
        subtractTokens(battle.tokensWagered);
        setTokensAdded(true);
      }
    }
    
    setTimeout(() => {
      setShowTokenAnimation(true);
    }, 500);
    
    if (result === "win" && facility && badge && !badge.obtained) {
      setTimeout(() => {
        setShowBadgeAnimation(true);
      }, 1500);
    }
  };
  
  const handleCaptureImage = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };
  
  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setVerificationImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };
  
  const handleSaveResult = () => {
    if (battleResult === "pending") {
      toast.error("Please select a battle result");
      return;
    }
    
    if (!verificationImage) {
      toast.error("Please upload a verification screenshot");
      return;
    }
    
    // Add the battle with the completed status
    addBattle({
      opponentId: battle.opponentId,
      opponentName: battle.opponentName,
      facilityId: battle.facilityId,
      result: battleResult,
      tokensWagered: battle.tokensWagered,
      notes: notes || `${battleResult === "win" ? "Victory" : "Defeat"} against ${battle.opponentName}`,
      verificationImage: verificationImage,
      status: "completed" // Set status as completed when saving result
    });
    
    toast.success("Battle result saved successfully!");
    setSaveComplete(true);
    unlockNavigation();
    
    navigate("/dashboard");
  };
  
  const handleReturn = () => {
    navigate("/dashboard");
  };
  
  if (!trainer) return null;
  
  return (
    <div className="min-h-screen bg-gradient-to-b from-atl-dark-purple to-atl-secondary-purple text-white pb-20">
      <header className="px-4 py-4 sticky top-0 z-10 bg-atl-dark-purple/80 backdrop-blur-sm">
        <div className="flex justify-between items-center">
          <div className="flex items-center">
            <button onClick={handleReturn} className="mr-2 text-white">
              <ChevronLeft className="h-5 w-5" />
            </button>
            <h1 className="text-xl font-bold text-white">Battle Results</h1>
          </div>
          <TokenDisplay count={trainer.tokens} showAddButton={false} className="bg-white/20 text-white" />
        </div>
      </header>

      <main className="p-4">
        {battleResult !== "pending" ? (
          <div 
            className={`w-full p-6 rounded-lg text-white text-center mb-6 ${
              battleResult === "win" 
                ? "bg-gradient-to-r from-green-500/80 to-green-600/80" 
                : "bg-gradient-to-r from-red-500/80 to-red-600/80"
            }`}
          >
            <div className="flex justify-center items-center mb-2">
              {battleResult === "win" ? (
                <Trophy className="h-8 w-8 mr-2" />
              ) : (
                <X className="h-8 w-8 mr-2" />
              )}
              <h2 className="text-2xl font-bold">
                {battleResult === "win" ? "Victory!" : "Defeat"}
              </h2>
            </div>
            <p className="text-sm opacity-90">
              vs. {battle.opponentName}
            </p>
          </div>
        ) : (
          <section className="mb-6">
            <h2 className="text-lg font-semibold mb-3">Battle Outcome</h2>
            <div className="bg-white/10 backdrop-blur-sm p-4 rounded-lg border border-white/20">
              <p className="text-sm text-white/80 mb-4">
                Select the result of your battle with {battle.opponentName}
              </p>
              
              <RadioGroup value={battleResult} onValueChange={(val: "win" | "loss") => handleResultSelection(val)}>
                <div className="flex items-center space-x-2 mb-3 p-3 rounded-lg border border-white/10 bg-white/5">
                  <RadioGroupItem value="win" id="win" className="border-white text-white" />
                  <div className="flex-1">
                    <Label htmlFor="win" className="text-white font-medium">Victory</Label>
                    <p className="text-xs text-white/70">I won the battle</p>
                  </div>
                  <Trophy className="h-5 w-5 text-green-400" />
                </div>
                
                <div className="flex items-center space-x-2 p-3 rounded-lg border border-white/10 bg-white/5">
                  <RadioGroupItem value="loss" id="loss" className="border-white text-white" />
                  <div className="flex-1">
                    <Label htmlFor="loss" className="text-white font-medium">Defeat</Label>
                    <p className="text-xs text-white/70">I lost the battle</p>
                  </div>
                  <X className="h-5 w-5 text-red-400" />
                </div>
              </RadioGroup>
              
              <p className="mt-4 text-xs text-white/60 italic">
                * Please be honest about your battle result. False reporting may result in penalties.
              </p>
            </div>
          </section>
        )}
        
        <section className="mb-6">
          <h2 className="text-lg font-semibold mb-3">Battle Details</h2>
          <div className="bg-white/10 backdrop-blur-sm p-4 rounded-lg border border-white/20">
            <div className="space-y-3">
              {facility && (
                <div className="flex justify-between items-center">
                  <span className="text-sm text-white/80">Facility:</span>
                  <span className="text-sm font-medium text-white">{facility.name}</span>
                </div>
              )}
              
              <div className="flex justify-between items-center">
                <span className="text-sm text-white/80">Date:</span>
                <span className="text-sm font-medium text-white">
                  {new Date(battle.date).toLocaleString()}
                </span>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="text-sm text-white/80">Opponent:</span>
                <span className="text-sm font-medium text-white">{battle.opponentName}</span>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="text-sm text-white/80">Tokens Wagered:</span>
                <span className="text-sm font-medium text-white">{battle.tokensWagered}</span>
              </div>
              
              {battle.linkCode && (
                <div className="flex justify-between items-center">
                  <span className="text-sm text-white/80">Link Code:</span>
                  <span className="text-sm font-medium text-white font-mono">{battle.linkCode}</span>
                </div>
              )}
              
              {battleResult !== "pending" && (
                <div className="flex justify-between items-center">
                  <span className="text-sm text-white/80">Result:</span>
                  <span 
                    className={`text-sm font-medium ${
                      battleResult === "win" ? "text-green-400" : "text-red-400"
                    }`}
                  >
                    {battleResult === "win" ? "Win" : "Loss"}
                  </span>
                </div>
              )}
            </div>
          </div>
        </section>
        
        {battleResult !== "pending" && (
          <section className="mb-6">
            <h2 className="text-lg font-semibold mb-3">Token Exchange</h2>
            <div className="bg-white/10 backdrop-blur-sm p-4 rounded-lg border border-white/20 flex justify-center items-center">
              {!showTokenAnimation ? (
                <div className="text-center py-4">
                  <div className="w-10 h-10 border-2 border-atl-primary-purple border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
                  <p className="text-sm text-white/70">Calculating token exchange...</p>
                </div>
              ) : (
                <div className="text-center py-4">
                  {battleResult === "win" ? (
                    <div className="flex flex-col items-center">
                      <Check className="h-10 w-10 text-green-400 mb-2" />
                      <p className="text-sm mb-1 text-white">You won {battle.tokensWagered * 2} tokens!</p>
                      <TokenDisplay count={battle.tokensWagered * 2} className="bg-white/20 text-white" />
                    </div>
                  ) : (
                    <div className="flex flex-col items-center">
                      <X className="h-10 w-10 text-red-400 mb-2" />
                      <p className="text-sm mb-1 text-white">You lost {battle.tokensWagered} tokens</p>
                      <TokenDisplay count={battle.tokensWagered} className="bg-white/20 text-white" />
                    </div>
                  )}
                </div>
              )}
            </div>
          </section>
        )}
        
        {shouldEarnBadge && (
          <section className="mb-6">
            <h2 className="text-lg font-semibold mb-3">Badge Earned</h2>
            <div className="bg-white/10 backdrop-blur-sm p-4 rounded-lg border border-white/20 flex justify-center items-center">
              {!showBadgeAnimation ? (
                <div className="text-center py-4">
                  <div className="w-10 h-10 border-2 border-atl-primary-purple border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
                  <p className="text-sm text-white/70">Verifying badge requirements...</p>
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
                  <p className="text-base font-medium mb-1 text-white">{facility!.name} Badge</p>
                  <p className="text-sm text-white/80">Congratulations! You've earned a new badge!</p>
                </div>
              )}
            </div>
          </section>
        )}
        
        <section className="mb-6">
          <h2 className="text-lg font-semibold mb-3">Verification Screenshot</h2>
          <div className="bg-white/10 backdrop-blur-sm p-4 rounded-lg border border-white/20">
            {verificationImage ? (
              <div className="space-y-3">
                <div className="relative w-full aspect-video rounded-md overflow-hidden bg-black/40">
                  <img 
                    src={verificationImage} 
                    alt="Battle verification" 
                    className="w-full h-full object-contain"
                  />
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleCaptureImage}
                  className="w-full border-white/20 text-white"
                >
                  <RefreshCw className="h-4 w-4 mr-2" /> Change Image
                </Button>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-8 border-2 border-dashed border-white/20 rounded-md">
                <Camera className="h-12 w-12 text-white/50 mb-2" />
                <p className="text-sm text-white/80 mb-4">Upload a screenshot of your battle result</p>
                <Button
                  variant="outline"
                  onClick={handleCaptureImage}
                  className="border-white/20 text-white"
                >
                  <Upload className="h-4 w-4 mr-2" /> Upload Screenshot
                </Button>
                <input 
                  type="file" 
                  ref={fileInputRef}
                  onChange={handleImageChange}
                  accept="image/*"
                  className="hidden" 
                />
              </div>
            )}
            <p className="mt-3 text-xs text-white/60 italic">
              Screenshots help verify battle results and prevent fraudulent claims.
            </p>
          </div>
        </section>
        
        <section className="mb-6">
          <h2 className="text-lg font-semibold mb-3">Battle Notes</h2>
          <div className="bg-white/10 backdrop-blur-sm p-4 rounded-lg border border-white/20">
            <Textarea
              placeholder="Add any notes about this battle..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={4}
              className="bg-white/10 border-white/20 text-white placeholder:text-white/60"
            />
          </div>
        </section>
        
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
