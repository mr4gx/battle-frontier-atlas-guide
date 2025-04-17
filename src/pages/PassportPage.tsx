
import { Link } from "react-router-dom";
import { Share2, ChevronLeft } from "lucide-react";
import { BottomNavigation } from "@/components/bottom-navigation";
import { TokenDisplay } from "@/components/token-display";
import { BadgeIcon } from "@/components/ui/badge-icon";
import { Button } from "@/components/ui/button";
import { useTrainer } from "@/context/trainer-context";
import { mockFacilities } from "@/data/mock-data";
import { PokemonSprite } from "@/components/pokemon-sprite";

const PassportPage = () => {
  const { trainer, isLoading } = useTrainer();
  
  if (isLoading || !trainer) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    );
  }

  return (
    <div className="min-h-screen pb-20">
      {/* Header */}
      <header className="bg-white px-4 py-4 border-b border-gray-200 sticky top-0 z-10">
        <div className="flex justify-between items-center">
          <div className="flex items-center">
            <Link to="/dashboard" className="mr-2">
              <ChevronLeft className="h-5 w-5" />
            </Link>
            <h1 className="text-xl font-bold text-atl-dark-purple">Digital Passport</h1>
          </div>
          <Button variant="outline" size="sm" className="gap-1">
            <Share2 className="h-4 w-4" />
            Share
          </Button>
        </div>
      </header>

      <main className="p-4">
        {/* Trainer Info */}
        <section className="mb-6">
          <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
            <div className="flex items-center mb-4">
              <div className="w-16 h-16 rounded-full bg-gray-200 overflow-hidden">
                {trainer.avatar ? (
                  <img 
                    src={trainer.avatar} 
                    alt={trainer.name} 
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-atl-primary-purple text-white font-bold text-xl">
                    {trainer.name.charAt(0)}
                  </div>
                )}
              </div>
              <div className="ml-4">
                <h2 className="font-bold text-lg">{trainer.name}</h2>
                <div className="text-sm text-gray-600">{trainer.trainerClass}</div>
                <div className="text-xs text-gray-500">ID: {trainer.id}</div>
              </div>
            </div>
            
            <div className="flex justify-between items-center">
              <div className="text-sm">
                <span className="text-gray-500">Win/Loss: </span>
                <span className="font-medium">{trainer.wins}-{trainer.losses}</span>
              </div>
              <TokenDisplay count={trainer.tokens} />
            </div>
          </div>
        </section>

        {/* Badges Collection */}
        <section className="mb-6">
          <h2 className="text-lg font-semibold mb-3">Frontier Badges</h2>
          <div className="grid grid-cols-5 gap-3 bg-white p-4 rounded-lg shadow-sm border border-gray-100">
            {trainer.badges.map((badge) => (
              <div key={badge.id} className="flex flex-col items-center">
                <BadgeIcon 
                  name={badge.name}
                  obtained={badge.obtained}
                  size="md"
                />
                <span className="text-xs mt-1 text-center">
                  {badge.name.split(' ')[1]}
                </span>
              </div>
            ))}
          </div>
        </section>

        {/* Facility Stamps */}
        <section className="mb-6">
          <h2 className="text-lg font-semibold mb-3">Facility Stamps</h2>
          <div className="grid grid-cols-2 gap-3">
            {mockFacilities.map((facility) => {
              const badge = trainer.badges.find(b => b.facilityId === facility.id);
              
              return (
                <div 
                  key={facility.id} 
                  className={`bg-white p-3 rounded-lg shadow-sm border ${
                    badge?.obtained 
                      ? "border-green-500" 
                      : facility.status === "locked" 
                        ? "border-gray-300 opacity-70" 
                        : "border-gray-100"
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
                    <div className="mt-1 text-xs text-green-600">
                      Completed: {new Date(badge.dateObtained!).toLocaleDateString()}
                    </div>
                  ) : (
                    <div className="mt-1 text-xs text-gray-500">
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
            <h2 className="text-lg font-semibold">Team Summary</h2>
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
      </main>

      <BottomNavigation />
    </div>
  );
};

export default PassportPage;
