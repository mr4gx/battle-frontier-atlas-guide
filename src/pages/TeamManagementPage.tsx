
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { ChevronLeft, Plus, X, Save, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { BottomNavigation } from "@/components/bottom-navigation";
import { PokemonSprite } from "@/components/pokemon-sprite";
import { useTrainer } from "@/context/trainer-context";
import { Pokemon } from "@/types";
import { cn } from "@/lib/utils";

const TeamManagementPage = () => {
  const { trainer, updateTeam } = useTrainer();
  const [team, setTeam] = useState<Pokemon[]>([]);
  const [isEditing, setIsEditing] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [showPokemonSearch, setShowPokemonSearch] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState<number | null>(null);
  const [pokemonResults, setPokemonResults] = useState<Pokemon[]>([]);
  
  useEffect(() => {
    if (trainer) {
      setTeam([...trainer.team]);
    }
  }, [trainer]);
  
  if (!trainer) return null;
  
  const handleStartEdit = () => {
    setIsEditing(true);
  };
  
  const handleSave = () => {
    updateTeam(team);
    setIsEditing(false);
  };
  
  const handleAddPokemon = (slot: number) => {
    setSelectedSlot(slot);
    setShowPokemonSearch(true);
    // Generate mock search results
    generateMockSearchResults("");
  };
  
  const handleRemovePokemon = (index: number) => {
    const updatedTeam = [...team];
    // Create an empty Pokemon slot
    updatedTeam[index] = {
      id: 0,
      name: "Empty",
      moves: [],
      level: 0
    };
    setTeam(updatedTeam);
  };
  
  const handleSelectPokemon = (pokemon: Pokemon) => {
    if (selectedSlot === null) return;
    
    const updatedTeam = [...team];
    updatedTeam[selectedSlot] = { ...pokemon };
    setTeam(updatedTeam);
    setShowPokemonSearch(false);
    setSelectedSlot(null);
    setSearchTerm("");
  };
  
  // Mock function to simulate searching for Pokémon
  const generateMockSearchResults = (term: string) => {
    // Popular Pokémon to include in results
    const popularPokemon = [
      { id: 25, name: "Pikachu", moves: ["Thunderbolt", "Quick Attack", "Iron Tail", "Volt Tackle"], level: 50 },
      { id: 6, name: "Charizard", moves: ["Flamethrower", "Dragon Claw", "Air Slash", "Blast Burn"], level: 50 },
      { id: 9, name: "Blastoise", moves: ["Hydro Pump", "Ice Beam", "Flash Cannon", "Skull Bash"], level: 50 },
      { id: 3, name: "Venusaur", moves: ["Solar Beam", "Sludge Bomb", "Earth Power", "Sleep Powder"], level: 50 },
      { id: 149, name: "Dragonite", moves: ["Dragon Dance", "Outrage", "Hurricane", "Extreme Speed"], level: 50 },
      { id: 150, name: "Mewtwo", moves: ["Psystrike", "Aura Sphere", "Ice Beam", "Fire Blast"], level: 50 },
      { id: 94, name: "Gengar", moves: ["Shadow Ball", "Sludge Wave", "Focus Blast", "Thunderbolt"], level: 50 },
      { id: 59, name: "Arcanine", moves: ["Flare Blitz", "Wild Charge", "Extreme Speed", "Crunch"], level: 50 },
      { id: 130, name: "Gyarados", moves: ["Waterfall", "Bounce", "Earthquake", "Ice Fang"], level: 50 },
      { id: 143, name: "Snorlax", moves: ["Body Slam", "Earthquake", "Rest", "Sleep Talk"], level: 50 },
      { id: 65, name: "Alakazam", moves: ["Psychic", "Shadow Ball", "Focus Blast", "Energy Ball"], level: 50 },
      { id: 448, name: "Lucario", moves: ["Aura Sphere", "Close Combat", "Meteor Mash", "Extreme Speed"], level: 50 },
    ];
    
    const lowerTerm = term.toLowerCase();
    let results = [...popularPokemon];
    
    if (lowerTerm) {
      results = popularPokemon.filter(pokemon => 
        pokemon.name.toLowerCase().includes(lowerTerm)
      );
    }
    
    setPokemonResults(results);
  };
  
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const term = e.target.value;
    setSearchTerm(term);
    generateMockSearchResults(term);
  };
  
  return (
    <div className="min-h-screen pb-20">
      {/* Header */}
      <header className="bg-white px-4 py-4 border-b border-gray-200 sticky top-0 z-10">
        <div className="flex justify-between items-center">
          <div className="flex items-center">
            <Link to="/passport" className="mr-2">
              <ChevronLeft className="h-5 w-5" />
            </Link>
            <h1 className="text-xl font-bold text-atl-dark-purple">Team Management</h1>
          </div>
          {isEditing ? (
            <Button 
              size="sm"
              className="bg-atl-primary-purple hover:bg-atl-secondary-purple"
              onClick={handleSave}
            >
              <Save className="h-4 w-4 mr-1" />
              Save Team
            </Button>
          ) : (
            <Button 
              variant="outline" 
              size="sm"
              onClick={handleStartEdit}
            >
              Edit Team
            </Button>
          )}
        </div>
      </header>

      <main className="p-4">
        {/* Team Grid */}
        <div className="grid grid-cols-2 gap-3 mb-6">
          {team.map((pokemon, index) => (
            <div 
              key={index}
              className="bg-white p-3 rounded-lg shadow-sm border border-gray-100"
            >
              <div className="flex items-center">
                <div className="w-16 h-16 flex-shrink-0">
                  {pokemon.id > 0 ? (
                    <PokemonSprite 
                      id={pokemon.id} 
                      name={pokemon.name}
                      size="md"
                    />
                  ) : (
                    <div className="w-full h-full rounded-lg bg-gray-100 flex items-center justify-center">
                      {isEditing ? (
                        <button 
                          className="text-atl-primary-purple"
                          onClick={() => handleAddPokemon(index)}
                        >
                          <Plus className="h-8 w-8" />
                        </button>
                      ) : (
                        <span className="text-gray-400 text-sm">Empty</span>
                      )}
                    </div>
                  )}
                </div>
                
                <div className="ml-3 flex-1">
                  <div className="flex justify-between items-center">
                    <h3 className="font-medium">
                      {pokemon.id > 0 ? pokemon.name : "Empty Slot"}
                    </h3>
                    
                    {isEditing && pokemon.id > 0 && (
                      <button 
                        className="text-gray-400 hover:text-red-500"
                        onClick={() => handleRemovePokemon(index)}
                      >
                        <X className="h-4 w-4" />
                      </button>
                    )}
                  </div>
                  
                  {pokemon.id > 0 && (
                    <div className="text-sm text-gray-500 mt-1">
                      Lv. {pokemon.level}
                    </div>
                  )}
                </div>
              </div>
              
              {isEditing && pokemon.id > 0 && (
                <Button 
                  variant="outline" 
                  size="sm"
                  className="w-full mt-2 h-7 text-xs"
                  onClick={() => handleAddPokemon(index)}
                >
                  Change
                </Button>
              )}
            </div>
          ))}
        </div>
        
        {/* Team Rules */}
        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100 mb-6">
          <h2 className="font-medium mb-2">Team Rules</h2>
          <ul className="text-sm space-y-1">
            <li className="flex items-start">
              <span className="text-atl-primary-purple mr-2">•</span>
              <span>All Pokémon must be Level 50 for official battles</span>
            </li>
            <li className="flex items-start">
              <span className="text-atl-primary-purple mr-2">•</span>
              <span>Maximum 6 Pokémon per team</span>
            </li>
            <li className="flex items-start">
              <span className="text-atl-primary-purple mr-2">•</span>
              <span>Some facilities have special team requirements</span>
            </li>
          </ul>
        </div>
      </main>
      
      {/* Pokémon Search Modal */}
      {showPokemonSearch && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg w-full max-w-md max-h-[80vh] flex flex-col">
            <div className="p-4 border-b border-gray-100">
              <div className="flex justify-between items-center mb-4">
                <h2 className="font-bold text-lg">Select Pokémon</h2>
                <button 
                  onClick={() => {
                    setShowPokemonSearch(false);
                    setSelectedSlot(null);
                    setSearchTerm("");
                  }}
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
              
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search Pokémon..."
                  value={searchTerm}
                  onChange={handleSearch}
                  className="pl-9"
                />
              </div>
            </div>
            
            <div className="overflow-y-auto flex-1 p-4">
              <div className="grid grid-cols-2 gap-3">
                {pokemonResults.map((pokemon) => (
                  <div 
                    key={pokemon.id}
                    className={cn(
                      "border rounded-lg p-2 flex items-center cursor-pointer hover:bg-gray-50",
                      team.some(p => p.id === pokemon.id) && "border-atl-primary-purple bg-atl-soft-blue/30"
                    )}
                    onClick={() => handleSelectPokemon(pokemon)}
                  >
                    <PokemonSprite 
                      id={pokemon.id} 
                      name={pokemon.name}
                      size="sm"
                      className="mr-2"
                    />
                    <div>
                      <div className="font-medium text-sm">{pokemon.name}</div>
                      <div className="text-xs text-gray-500">Lv. {pokemon.level}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      <BottomNavigation />
    </div>
  );
};

export default TeamManagementPage;
