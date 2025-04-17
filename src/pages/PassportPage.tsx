
import { useState } from "react";
import { Link } from "react-router-dom";
import { Share2, ChevronLeft, User, Star, Award, QrCode } from "lucide-react";
import { BottomNavigation } from "@/components/bottom-navigation";
import { TokenDisplay } from "@/components/token-display";
import { BadgeIcon } from "@/components/ui/badge-icon";
import { Button } from "@/components/ui/button";
import { useTrainer } from "@/context/trainer-context";
import { mockFacilities } from "@/data/mock-data";
import { PokemonSprite } from "@/components/pokemon-sprite";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { toast } from "@/components/ui/sonner";

const PassportPage = () => {
  const { trainer, isLoading } = useTrainer();
  const [showQRCode, setShowQRCode] = useState(false);
  
  if (isLoading || !trainer) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    );
  }

  // Calculate stats for summary
  const badgeCount = trainer.badges.filter(badge => badge.obtained).length;
  const stampCount = mockFacilities.filter(facility => 
    trainer.badges.some(b => b.facilityId === facility.id && b.obtained)
  ).length;

  const handleShareQRCode = () => {
    setShowQRCode(true);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-atl-dark-purple to-atl-secondary-purple text-white pb-20">
      {/* Header */}
      <header className="px-4 py-4 sticky top-0 z-10 bg-atl-dark-purple/80 backdrop-blur-sm">
        <div className="flex justify-between items-center">
          <div className="flex items-center">
            <Link to="/dashboard" className="mr-2 text-white">
              <ChevronLeft className="h-5 w-5" />
            </Link>
            <h1 className="text-xl font-bold">Digital Passport</h1>
          </div>
          <div className="flex space-x-2">
            <Button 
              variant="ghost" 
              size="sm" 
              className="gap-1 text-white"
              onClick={handleShareQRCode}
            >
              <QrCode className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="sm" className="gap-1 text-white">
              <Share2 className="h-4 w-4" />
              Share
            </Button>
          </div>
        </div>
      </header>

      <main className="p-4">
        {/* Trainer Profile Card */}
        <section className="mb-6 bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
          <div className="flex items-center gap-4">
            <Avatar className="h-16 w-16 border-2 border-white/30">
              {trainer.avatar ? (
                <AvatarImage src={trainer.avatar} alt={trainer.name} />
              ) : (
                <AvatarFallback className="bg-atl-primary-purple text-white">
                  {trainer.name.charAt(0)}
                </AvatarFallback>
              )}
            </Avatar>
            
            <div className="flex-1">
              <h2 className="font-bold text-lg">{trainer.name}</h2>
              <div className="text-sm text-white/80">{trainer.trainerClass}</div>
              <div className="text-xs text-white/60">ID: {trainer.id}</div>
            </div>
            
            <Button
              variant="outline"
              size="sm"
              className="border-white/20 text-white hover:bg-white/10"
              onClick={handleShareQRCode}
            >
              <QrCode className="h-4 w-4 mr-1" />
              Battle Me
            </Button>
          </div>
          
          {/* Stats Summary */}
          <div className="mt-4 grid grid-cols-3 gap-2 text-center">
            <div className="bg-white/10 rounded-lg p-2">
              <div className="text-lg font-bold">{badgeCount}</div>
              <div className="text-xs text-white/70">Badges</div>
            </div>
            <div className="bg-white/10 rounded-lg p-2">
              <div className="text-lg font-bold">{trainer.tokens}</div>
              <div className="text-xs text-white/70">Tokens</div>
            </div>
            <div className="bg-white/10 rounded-lg p-2">
              <div className="text-lg font-bold">{stampCount}</div>
              <div className="text-xs text-white/70">Stamps</div>
            </div>
          </div>
          
          <div className="mt-4 flex justify-between items-center">
            <div className="text-sm">
              <span className="text-white/70">Record: </span>
              <span className="font-medium">{trainer.wins}-{trainer.losses}</span>
            </div>
            <TokenDisplay 
              count={trainer.tokens} 
              showAddButton 
              className="bg-white/20 text-white"
            />
          </div>
        </section>

        {/* Badges Collection */}
        <section className="mb-6">
          <h2 className="text-lg font-semibold mb-3 flex items-center">
            <Award className="h-5 w-5 mr-2" />
            Frontier Badges
          </h2>
          <div className="grid grid-cols-3 gap-3 bg-white/10 backdrop-blur-sm p-4 rounded-xl border border-white/20">
            {trainer.badges.map((badge) => (
              <div key={badge.id} className="flex flex-col items-center">
                <BadgeIcon 
                  name={badge.name}
                  obtained={badge.obtained}
                  size="md"
                />
                <span className="text-xs mt-1 text-center text-white/80">
                  {badge.name.split(' ')[1]}
                </span>
              </div>
            ))}
          </div>
        </section>

        {/* Facility Stamps */}
        <section className="mb-6">
          <h2 className="text-lg font-semibold mb-3 flex items-center">
            <Star className="h-5 w-5 mr-2" />
            Facility Stamps
          </h2>
          <div className="grid grid-cols-2 gap-3">
            {mockFacilities.map((facility) => {
              const badge = trainer.badges.find(b => b.facilityId === facility.id);
              
              return (
                <div 
                  key={facility.id} 
                  className={`backdrop-blur-sm p-3 rounded-xl border ${
                    badge?.obtained 
                      ? "bg-atl-primary-purple/30 border-atl-primary-purple" 
                      : facility.status === "locked" 
                        ? "bg-white/5 border-white/10 opacity-70" 
                        : "bg-white/10 border-white/20"
                  }`}
                >
                  <div className="flex justify-between items-start">
                    <h3 className="font-medium text-sm">{facility.name}</h3>
                    <BadgeIcon 
                      name={facility.name}
                      obtained={badge?.obtained || false}
                      size="sm"
                    />
                  </div>
                  
                  {badge?.obtained ? (
                    <div className="mt-1 text-xs text-atl-light-purple">
                      Completed: {new Date(badge.dateObtained!).toLocaleDateString()}
                    </div>
                  ) : (
                    <div className="mt-1 text-xs text-white/60">
                      {facility.status === "locked" ? "Locked" : "Not completed"}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </section>

        {/* Team Preview */}
        <section>
          <div className="flex justify-between items-center mb-3">
            <h2 className="text-lg font-semibold flex items-center">
              <User className="h-5 w-5 mr-2" />
              Active Team
            </h2>
            <Link 
              to="/team" 
              className="text-atl-light-purple text-sm"
            >
              Manage Team
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
                  <span className="text-[10px] text-white/60">
                    Lv. {pokemon.level}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </section>
        
        {/* Achievement Badges - New Section */}
        <section className="mt-6">
          <h2 className="text-lg font-semibold mb-3 flex items-center">
            <Award className="h-5 w-5 mr-2" />
            Achievements
          </h2>
          
          <div className="bg-white/10 backdrop-blur-sm p-4 rounded-xl border border-white/20">
            <div className="grid grid-cols-2 gap-3">
              {trainer.achievementBadges && trainer.achievementBadges.length > 0 ? (
                trainer.achievementBadges.map((achievement, index) => (
                  <div key={index} className="bg-white/10 p-2 rounded-lg flex items-center gap-2">
                    <div className="bg-atl-primary-purple/50 rounded-full p-1.5">
                      <Award className="h-4 w-4" />
                    </div>
                    <span className="text-sm">{achievement}</span>
                  </div>
                ))
              ) : (
                <div className="col-span-2 text-center py-2 text-white/60 text-sm">
                  No achievements yet. Keep battling!
                </div>
              )}
            </div>
          </div>
        </section>
      </main>

      <BottomNavigation />
      
      {/* QR Code Dialog */}
      <Dialog open={showQRCode} onOpenChange={setShowQRCode}>
        <DialogContent className="bg-white">
          <DialogHeader>
            <DialogTitle className="text-center">Battle Challenge QR Code</DialogTitle>
          </DialogHeader>
          
          <div className="flex flex-col items-center py-4">
            <div className="w-64 h-64 border border-gray-200 rounded-lg mb-4 flex items-center justify-center bg-white">
              <MockQRCode trainerId={trainer.id} name={trainer.name} />
              <p className="text-xs text-gray-500 mt-2">Scan to challenge</p>
            </div>
            
            <div className="text-center text-sm text-gray-600 max-w-xs">
              <p>Other trainers can scan this QR code to challenge you to a battle</p>
            </div>
            
            <div className="mt-4">
              <Button 
                onClick={() => {
                  toast.success("QR Code copied to clipboard");
                  setShowQRCode(false);
                }}
                className="bg-atl-primary-purple hover:bg-atl-secondary-purple"
              >
                Copy QR Code
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

// Simplified QR code mockup
const MockQRCode = ({ trainerId, name }: { trainerId: string; name: string }) => {
  return (
    <div className="w-48 h-48 bg-white relative flex items-center justify-center">
      <div className="w-40 h-40 border-2 border-black">
        <div className="absolute top-0 left-0 w-12 h-12 border-t-4 border-l-4 border-black"></div>
        <div className="absolute top-0 right-0 w-12 h-12 border-t-4 border-r-4 border-black"></div>
        <div className="absolute bottom-0 left-0 w-12 h-12 border-b-4 border-l-4 border-black"></div>
        <div className="absolute bottom-0 right-0 w-12 h-12 border-b-4 border-r-4 border-black"></div>
        
        <div className="w-full h-full flex flex-col items-center justify-center">
          <div className="w-20 h-20 bg-black m-2 flex items-center justify-center">
            <div className="w-14 h-14 bg-white flex items-center justify-center">
              <div className="w-8 h-8 bg-black"></div>
            </div>
          </div>
          <span className="text-xs font-mono mt-1">{trainerId}</span>
        </div>
      </div>
    </div>
  );
};

export default PassportPage;
