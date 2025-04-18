import { useState } from "react";
import { Link } from "react-router-dom";
import { ChevronLeft, User, Edit, CheckCheck, Award } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { BottomNavigation } from "@/components/bottom-navigation";
import { BadgeIcon } from "@/components/ui/badge-icon";
import { mockFacilities } from "@/data/mock-data";
import { useTrainer } from "@/context/trainer-context";
import { TokenDisplay } from "@/components/token-display";
import { PokemonSprite } from "@/components/pokemon-sprite";
import { DiscordSettings } from "@/components/discord-settings";
import { DiscordIcon } from "@/components/discord-icon";

const ProfilePage = () => {
  const { trainer, updateTrainer } = useTrainer();
  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState("");
  const [editClass, setEditClass] = useState("");
  
  if (!trainer) return null;
  
  const handleStartEdit = () => {
    setEditName(trainer.name);
    setEditClass(trainer.trainerClass);
    setIsEditing(true);
  };
  
  const handleSave = () => {
    updateTrainer({
      name: editName,
      trainerClass: editClass
    });
    setIsEditing(false);
  };
  
  const handleCancel = () => {
    setIsEditing(false);
  };
  
  return (
    <div className="atl-gradient-bg min-h-screen pb-24">
      <header className="bg-white/10 backdrop-blur-md px-4 py-4 border-b border-white/10 sticky top-0 z-10">
        <div className="flex justify-between items-center">
          <div className="flex items-center">
            <Link to="/dashboard" className="mr-2">
              <ChevronLeft className="h-5 w-5 text-white" />
            </Link>
            <h1 className="text-xl font-bold text-white">Trainer Profile</h1>
          </div>
          {isEditing ? (
            <div className="flex gap-2">
              <Button 
                variant="ghost" 
                size="sm"
                onClick={handleCancel}
                className="text-white hover:bg-white/10"
              >
                Cancel
              </Button>
              <Button 
                size="sm"
                className="bg-white/20 hover:bg-white/30 text-white"
                onClick={handleSave}
              >
                Save
              </Button>
            </div>
          ) : (
            <Button 
              variant="outline" 
              size="sm"
              onClick={handleStartEdit}
              className="border-white/20 text-white hover:bg-white/10"
            >
              <Edit className="h-4 w-4 mr-1" />
              Edit
            </Button>
          )}
        </div>
      </header>

      <main className="p-4">
        <section className="mb-6">
          <div className="bg-white/10 p-4 rounded-lg backdrop-blur-sm border border-white/20">
            <div className="flex items-center mb-6">
              <div className="relative">
                <div className="w-20 h-20 rounded-full bg-atl-soft-blue border-2 border-atl-light-purple flex items-center justify-center mr-4">
                  {trainer.avatar ? (
                    <img 
                      src={trainer.avatar} 
                      alt={trainer.name} 
                      className="w-full h-full rounded-full object-cover"
                    />
                  ) : (
                    <User className="h-10 w-10 text-white" />
                  )}
                </div>
                {!isEditing && (
                  <button className="absolute -bottom-1 -right-1 bg-white/10 backdrop-blur-sm p-1 rounded-full border border-white/20">
                    <Edit className="h-3 w-3 text-white" />
                  </button>
                )}
              </div>
              
              <div className="flex-1">
                {isEditing ? (
                  <div className="space-y-2">
                    <div>
                      <label className="text-xs text-white/70 mb-1 block">Trainer Name</label>
                      <Input
                        value={editName}
                        onChange={(e) => setEditName(e.target.value)}
                        placeholder="Your trainer name"
                      />
                    </div>
                    <div>
                      <label className="text-xs text-white/70 mb-1 block">Trainer Class</label>
                      <Input
                        value={editClass}
                        onChange={(e) => setEditClass(e.target.value)}
                        placeholder="Your trainer class"
                      />
                    </div>
                  </div>
                ) : (
                  <>
                    <h2 className="text-xl font-bold text-white">{trainer.name}</h2>
                    <p className="text-white/70">{trainer.trainerClass}</p>
                    <p className="text-sm text-white/70">ID: {trainer.id}</p>
                  </>
                )}
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-white/10 backdrop-blur-sm p-3 rounded-lg">
                <div className="text-sm text-white/70 mb-1">Tokens</div>
                <div className="flex items-center">
                  <TokenDisplay count={trainer.tokens} />
                </div>
              </div>
              
              <div className="bg-white/10 backdrop-blur-sm p-3 rounded-lg">
                <div className="text-sm text-white/70 mb-1">Record</div>
                <div className="font-bold">
                  <span className="text-green-400">{trainer.wins}</span>
                  <span className="text-gray-400 mx-1">-</span>
                  <span className="text-red-400">{trainer.losses}</span>
                </div>
              </div>
            </div>
          </div>
        </section>
        
        <section className="mb-6">
          <h2 className="text-lg font-semibold mb-3 text-white flex items-center">
            <DiscordIcon size={20} className="mr-2" /> Discord Integration
          </h2>
          <DiscordSettings />
        </section>
        
        <section className="mb-6">
          <div className="flex justify-between items-center mb-3">
            <h2 className="text-lg font-semibold text-white">Badges</h2>
            <Link 
              to="/passport" 
              className="text-atl-light-purple text-sm"
            >
              View Full Passport
            </Link>
          </div>
          
          <div className="bg-white/10 backdrop-blur-sm p-4 rounded-lg border border-white/20">
            <div className="grid grid-cols-3 gap-4">
              {trainer.badges.map((badge) => {
                const facility = mockFacilities.find(f => f.id === badge.facilityId);
                
                return (
                  <div key={badge.id} className="flex flex-col items-center">
                    <BadgeIcon 
                      name={badge.name}
                      obtained={badge.obtained}
                      size="md"
                    />
                    <span className="text-xs mt-2 text-center text-white/80">
                      {facility?.name.split(' ')[1] || badge.name.split(' ')[1]}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </section>
        
        <section className="mb-6">
          <div className="flex justify-between items-center mb-3">
            <h2 className="text-lg font-semibold text-white">Team</h2>
            <Link 
              to="/team" 
              className="text-atl-light-purple text-sm"
            >
              Manage Team
            </Link>
          </div>
          
          <div className="bg-white/10 backdrop-blur-sm p-4 rounded-lg border border-white/20">
            <div className="grid grid-cols-6 gap-2">
              {trainer.team.map((pokemon) => (
                <div key={pokemon.id} className="flex flex-col items-center">
                  <PokemonSprite 
                    id={pokemon.id} 
                    name={pokemon.name}
                    size="sm"
                  />
                  <span className="text-xs mt-1 truncate w-full text-center text-white/80">
                    {pokemon.name}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </section>
        
        <section>
          <h2 className="text-lg font-semibold mb-3 text-white">Achievements</h2>
          
          <div className="bg-white/10 backdrop-blur-sm p-4 rounded-lg border border-white/20">
            <div className="flex flex-wrap gap-2">
              {trainer.achievementBadges.map((badge, index) => (
                <div 
                  key={index}
                  className="flex items-center bg-white/10 backdrop-blur-sm text-white rounded-full px-3 py-1"
                >
                  <Award className="h-3 w-3 mr-1" />
                  <span className="text-xs font-medium">{badge}</span>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>

      <BottomNavigation />
    </div>
  );
};

export default ProfilePage;
