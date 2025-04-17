
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
    <div className="min-h-screen pb-20">
      {/* Header */}
      <header className="bg-white px-4 py-4 border-b border-gray-200 sticky top-0 z-10">
        <div className="flex justify-between items-center">
          <div className="flex items-center">
            <Link to="/dashboard" className="mr-2">
              <ChevronLeft className="h-5 w-5" />
            </Link>
            <h1 className="text-xl font-bold text-atl-dark-purple">Trainer Profile</h1>
          </div>
          {isEditing ? (
            <div className="flex gap-2">
              <Button 
                variant="ghost" 
                size="sm"
                onClick={handleCancel}
              >
                Cancel
              </Button>
              <Button 
                size="sm"
                className="bg-atl-primary-purple hover:bg-atl-secondary-purple"
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
            >
              <Edit className="h-4 w-4 mr-1" />
              Edit
            </Button>
          )}
        </div>
      </header>

      <main className="p-4">
        {/* Trainer Card */}
        <section className="mb-6">
          <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
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
                    <User className="h-10 w-10 text-atl-dark-purple" />
                  )}
                </div>
                {!isEditing && (
                  <button className="absolute -bottom-1 -right-1 bg-white p-1 rounded-full border border-gray-200">
                    <Edit className="h-3 w-3 text-gray-500" />
                  </button>
                )}
              </div>
              
              <div className="flex-1">
                {isEditing ? (
                  <div className="space-y-2">
                    <div>
                      <label className="text-xs text-gray-500 mb-1 block">Trainer Name</label>
                      <Input
                        value={editName}
                        onChange={(e) => setEditName(e.target.value)}
                        placeholder="Your trainer name"
                      />
                    </div>
                    <div>
                      <label className="text-xs text-gray-500 mb-1 block">Trainer Class</label>
                      <Input
                        value={editClass}
                        onChange={(e) => setEditClass(e.target.value)}
                        placeholder="Your trainer class"
                      />
                    </div>
                  </div>
                ) : (
                  <>
                    <h2 className="text-xl font-bold">{trainer.name}</h2>
                    <p className="text-gray-600">{trainer.trainerClass}</p>
                    <p className="text-sm text-gray-500">ID: {trainer.id}</p>
                  </>
                )}
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-gray-50 p-3 rounded-lg">
                <div className="text-sm text-gray-500 mb-1">Tokens</div>
                <div className="flex items-center">
                  <TokenDisplay count={trainer.tokens} />
                </div>
              </div>
              
              <div className="bg-gray-50 p-3 rounded-lg">
                <div className="text-sm text-gray-500 mb-1">Record</div>
                <div className="font-bold">
                  <span className="text-green-600">{trainer.wins}</span>
                  <span className="text-gray-400 mx-1">-</span>
                  <span className="text-red-600">{trainer.losses}</span>
                </div>
              </div>
            </div>
          </div>
        </section>
        
        {/* Badge Collection */}
        <section className="mb-6">
          <div className="flex justify-between items-center mb-3">
            <h2 className="text-lg font-semibold">Badges</h2>
            <Link 
              to="/passport" 
              className="text-atl-primary-purple text-sm"
            >
              View Passport
            </Link>
          </div>
          
          <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
            <div className="grid grid-cols-5 gap-3">
              {trainer.badges.map((badge) => {
                const facility = mockFacilities.find(f => f.id === badge.facilityId);
                
                return (
                  <div key={badge.id} className="flex flex-col items-center">
                    <BadgeIcon 
                      name={badge.name}
                      obtained={badge.obtained}
                      size="md"
                    />
                    <span className="text-xs mt-1 text-center">
                      {facility?.name.split(' ')[1] || badge.name.split(' ')[1]}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </section>
        
        {/* Team Preview */}
        <section className="mb-6">
          <div className="flex justify-between items-center mb-3">
            <h2 className="text-lg font-semibold">Team</h2>
            <Link 
              to="/team" 
              className="text-atl-primary-purple text-sm"
            >
              Manage Team
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
        
        {/* Achievement Badges */}
        <section className="mb-6">
          <h2 className="text-lg font-semibold mb-3">Achievements</h2>
          
          <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
            <div className="flex flex-wrap gap-2">
              {trainer.achievementBadges.map((badge, index) => (
                <div 
                  key={index}
                  className="flex items-center bg-atl-soft-blue text-atl-dark-purple rounded-full px-3 py-1"
                >
                  <Award className="h-3 w-3 mr-1" />
                  <span className="text-xs font-medium">{badge}</span>
                </div>
              ))}
            </div>
          </div>
        </section>
        
        {/* QR Code */}
        <section>
          <h2 className="text-lg font-semibold mb-3">Trainer QR Code</h2>
          
          <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100 flex flex-col items-center">
            <div className="w-48 h-48 bg-white border border-gray-200 rounded-lg flex items-center justify-center mb-3">
              {/* Mock QR code - in a real app we'd generate a real QR code */}
              <div className="w-40 h-40 bg-[repeating-linear-gradient(45deg,#f0f0f0,#f0f0f0_10px,#e0e0e0_10px,#e0e0e0_20px)] relative">
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="bg-atl-primary-purple text-white font-bold py-1 px-3 rounded">
                    {trainer.id}
                  </div>
                </div>
              </div>
            </div>
            
            <div className="text-sm text-center mb-2">
              <div className="font-medium">{trainer.name}</div>
              <div className="text-gray-500">{trainer.id}</div>
            </div>
            
            <Button 
              variant="outline" 
              size="sm"
              className="mb-1"
            >
              <CheckCheck className="h-4 w-4 mr-1" />
              Save to Gallery
            </Button>
          </div>
        </section>
      </main>

      <BottomNavigation />
    </div>
  );
};

export default ProfilePage;
