
import { useState, useEffect } from "react";
import { useLocation, useNavigate, Link } from "react-router-dom";
import { ChevronLeft, Zap, ZapOff, Scan } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { BottomNavigation } from "@/components/bottom-navigation";
import { useTrainer } from "@/context/trainer-context";
import { toast } from "@/components/ui/sonner";
import { QrReader } from "react-qr-reader";

const QRScannerPage = () => {
  const { getTrainerByIdOrName } = useTrainer();
  const location = useLocation();
  const navigate = useNavigate();
  const returnTo = location.state?.returnTo || "/dashboard";
  const isBattleChallenge = location.state?.forBattleChallenge || false;
  
  const [isScanning, setIsScanning] = useState(true);
  const [manualEntry, setManualEntry] = useState("");
  const [flashOn, setFlashOn] = useState(false);
  const [scanResult, setScanResult] = useState<string | null>(null);
  const [recentScans, setRecentScans] = useState<string[]>([]);
  const [facingMode, setFacingMode] = useState<"environment" | "user">("environment");
  
  const handleScan = (result: string | null) => {
    if (result && isScanning) {
      setScanResult(result);
      setIsScanning(false);
      
      // Add to recent scans
      setRecentScans(prev => {
        const newScans = [result, ...prev];
        return newScans.slice(0, 5); // Keep only last 5
      });
      
      toast.success("QR Code successfully scanned!");
    }
  };
  
  const handleScanAgain = () => {
    setScanResult(null);
    setIsScanning(true);
  };
  
  const handleManualSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!manualEntry) return;
    
    // Check if the entry is a valid trainer
    const trainer = getTrainerByIdOrName(manualEntry);
    
    if (trainer) {
      // Format: ID|Name
      const result = `${trainer.id}|${trainer.name}`;
      setScanResult(result);
      setIsScanning(false);
      
      // Add to recent scans
      setRecentScans(prev => {
        const newScans = [result, ...prev];
        return newScans.slice(0, 5); // Keep only last 5
      });
    } else {
      // Format: ID|Name (using the manual entry as the name)
      const result = `T${Math.floor(Math.random() * 90000) + 10000}|${manualEntry}`;
      setScanResult(result);
      setIsScanning(false);
      
      // Add to recent scans
      setRecentScans(prev => {
        const newScans = [result, ...prev];
        return newScans.slice(0, 5); // Keep only last 5
      });
    }
  };
  
  const handleUseResult = () => {
    if (!scanResult) return;
    
    // Parse result
    const [id, name] = scanResult.split("|");
    
    if (isBattleChallenge) {
      // Navigate to battle setup with the opponent info
      navigate("/battle/setup", { 
        state: { 
          challengeMode: true,
          opponentId: id,
          opponentName: name
        } 
      });
    } else {
      // Navigate back with the result
      navigate(returnTo, { 
        state: { 
          scannedOpponentId: id,
          scannedOpponentName: name
        } 
      });
    }
  };
  
  const toggleFlash = () => {
    setFlashOn(!flashOn);
    // In a real app, this would toggle the device flash using a camera API
  };
  
  const toggleCamera = () => {
    setFacingMode(prev => prev === "environment" ? "user" : "environment");
  };
  
  return (
    <div className="min-h-screen pb-20">
      {/* Header */}
      <header className="bg-white px-4 py-4 border-b border-gray-200 sticky top-0 z-10">
        <div className="flex justify-between items-center">
          <div className="flex items-center">
            <Link to={returnTo} className="mr-2">
              <ChevronLeft className="h-5 w-5" />
            </Link>
            <h1 className="text-xl font-bold text-atl-dark-purple">
              {isBattleChallenge ? "Scan Trainer QR" : "QR Scanner"}
            </h1>
          </div>
          <div className="flex gap-2">
            <Button 
              variant="outline" 
              size="sm"
              onClick={toggleCamera}
            >
              <Scan className="h-4 w-4" />
            </Button>
            <Button 
              variant={flashOn ? "default" : "outline"} 
              size="sm"
              onClick={toggleFlash}
            >
              {flashOn ? (
                <Zap className="h-4 w-4" />
              ) : (
                <ZapOff className="h-4 w-4" />
              )}
            </Button>
          </div>
        </div>
        {isBattleChallenge && (
          <p className="text-sm text-gray-500 mt-1">
            Scan a trainer's passport QR code to challenge them to a battle
          </p>
        )}
      </header>

      <main className="p-4 flex flex-col items-center">
        {/* Scanner Viewfinder */}
        <div className="relative w-full aspect-square max-w-md mb-6 bg-black rounded-lg overflow-hidden">
          {isScanning ? (
            <div className="absolute inset-0">
              <QrReader
                onResult={(result, error) => {
                  if (result) {
                    handleScan(result.getText());
                  }
                  
                  if (error) {
                    console.error(error);
                  }
                }}
                constraints={{
                  facingMode: facingMode,
                  aspectRatio: 1
                }}
                className="w-full h-full"
                videoStyle={{ objectFit: "cover", width: "100%", height: "100%" }}
                videoContainerStyle={{ width: "100%", height: "100%" }}
                scanDelay={500}
              />
              
              {/* Scanning overlay */}
              <div className="absolute inset-0 pointer-events-none flex flex-col items-center justify-center">
                <div className="w-3/4 h-3/4 border-2 border-atl-primary-purple relative">
                  <div className="absolute top-0 left-0 w-8 h-8 border-t-2 border-l-2 border-atl-primary-purple"></div>
                  <div className="absolute top-0 right-0 w-8 h-8 border-t-2 border-r-2 border-atl-primary-purple"></div>
                  <div className="absolute bottom-0 left-0 w-8 h-8 border-b-2 border-l-2 border-atl-primary-purple"></div>
                  <div className="absolute bottom-0 right-0 w-8 h-8 border-b-2 border-r-2 border-atl-primary-purple"></div>
                </div>
                
                {/* Scan line animation */}
                <div className="absolute w-3/4 h-0.5 bg-atl-primary-purple top-1/2 animate-bounce-small"></div>
              </div>
              
              <div className="absolute bottom-4 left-0 right-0 text-center text-white text-sm">
                Scanning...
              </div>
            </div>
          ) : (
            <div className="absolute inset-0 bg-white flex flex-col items-center justify-center p-4">
              {scanResult ? (
                <>
                  <div className="bg-green-100 text-green-800 p-3 rounded-full mb-4">
                    <Check className="h-8 w-8" />
                  </div>
                  <h3 className="text-lg font-bold mb-1">QR Code Scanned!</h3>
                  
                  {scanResult.split("|").length === 2 && (
                    <div className="text-center mb-4">
                      <p className="text-gray-800 text-lg font-medium">
                        {scanResult.split("|")[1]}
                      </p>
                      <p className="text-gray-500 text-sm">
                        ID: {scanResult.split("|")[0]}
                      </p>
                    </div>
                  )}
                  
                  <div className="flex gap-2 mt-2">
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={handleScanAgain}
                    >
                      Scan Again
                    </Button>
                    <Button 
                      size="sm"
                      className="bg-atl-primary-purple hover:bg-atl-secondary-purple"
                      onClick={handleUseResult}
                    >
                      {isBattleChallenge ? "Challenge" : "Use Result"}
                    </Button>
                  </div>
                </>
              ) : (
                <div className="text-center">
                  <h3 className="text-lg font-bold mb-2">No QR Code Detected</h3>
                  <p className="text-gray-500 text-sm mb-4">
                    Try scanning again or enter details manually
                  </p>
                  <Button 
                    onClick={handleScanAgain}
                    className="bg-atl-primary-purple hover:bg-atl-secondary-purple"
                  >
                    Scan Again
                  </Button>
                </div>
              )}
            </div>
          )}
        </div>
        
        {/* Manual Entry Form */}
        <div className="w-full max-w-md mb-6">
          <h2 className="text-lg font-semibold mb-3">Manual Entry</h2>
          <form onSubmit={handleManualSubmit} className="flex gap-2">
            <Input
              placeholder={isBattleChallenge ? "Enter trainer name or ID" : "Enter trainer name"}
              value={manualEntry}
              onChange={(e) => setManualEntry(e.target.value)}
              className="flex-1"
            />
            <Button 
              type="submit" 
              className="bg-atl-primary-purple hover:bg-atl-secondary-purple"
              disabled={!manualEntry}
            >
              Submit
            </Button>
          </form>
        </div>
        
        {/* Recent Scans */}
        {recentScans.length > 0 && (
          <div className="w-full max-w-md">
            <h2 className="text-lg font-semibold mb-3">Recent Scans</h2>
            <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
              {recentScans.map((scan, index) => {
                const [id, name] = scan.split("|");
                
                return (
                  <div 
                    key={index} 
                    className="p-3 flex justify-between items-center border-b border-gray-100 last:border-b-0"
                    onClick={() => {
                      setScanResult(scan);
                      setIsScanning(false);
                    }}
                  >
                    <div>
                      <h3 className="font-medium text-sm">{name}</h3>
                      <p className="text-xs text-gray-500">{id}</p>
                    </div>
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        if (isBattleChallenge) {
                          navigate("/battle/setup", { 
                            state: { 
                              challengeMode: true,
                              opponentId: id,
                              opponentName: name
                            } 
                          });
                        } else {
                          navigate(returnTo, { 
                            state: { 
                              scannedOpponentId: id,
                              scannedOpponentName: name
                            } 
                          });
                        }
                      }}
                    >
                      {isBattleChallenge ? "Challenge" : "Use"}
                    </Button>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </main>

      <BottomNavigation />
    </div>
  );
};

export default QRScannerPage;

// Helper icon component for scan success
const Check = ({ className }: { className?: string }) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    width="24" 
    height="24" 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round" 
    className={className}
  >
    <path d="M20 6 9 17l-5-5"/>
  </svg>
);
