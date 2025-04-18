import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { ChevronLeft, Plus, X, Save, Search, Edit2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { BottomNavigation } from "@/components/bottom-navigation";
import { PokemonSprite } from "@/components/pokemon-sprite";
import { useTrainer } from "@/context/trainer-context";
import { Pokemon } from "@/types";
import { cn } from "@/lib/utils";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { usePokemonSearch } from "@/hooks/usePokemonSearch";

const TeamManagementPage = () => {
  const { trainer, updateTeam } = useTrainer();
  const [team, setTeam] = useState<Pokemon[]>([]);
  const [isEditing, setIsEditing] = useState(false);
  const [showPokemonSearch, setShowPokemonSearch] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState<number | null>(null);
  const [editingLevel, setEditingLevel] = useState<number | null>(null);
  
  const { 
    searchTerm, 
    setSearchTerm, 
    results: pokemonResults, 
    isLoading: isSearchLoading 
  } = usePokemonSearch();
  
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
    setEditingLevel(null);
  };
  
  const handleAddPokemon = (slot: number) => {
    setSelectedSlot(slot);
    setShowPokemonSearch(true);
    setSearchTerm("");
  };
  
  const handleRemovePokemon = (index: number) => {
    const updatedTeam = [...team];
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

  const handleEditLevel = (index: number) => {
    setEditingLevel(index);
  };

  const handleLevelChange = (index: number, newLevel: number) => {
    if (newLevel < 1) newLevel = 1;
    if (newLevel > 100) newLevel = 100;

    const updatedTeam = [...team];
    updatedTeam[index] = { ...updatedTeam[index], level: newLevel };
    setTeam(updatedTeam);
  };

  const handleLevelInputBlur = () => {
    setEditingLevel(null);
  };
  
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const term = e.target.value;
    setSearchTerm(term);
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
                    <div className="flex items-center text-sm text-gray-500 mt-1">
                      {editingLevel === index ? (
                        <div className="flex items-center space-x-2 w-full">
                          <Input 
                            type="number"
                            min={1}
                            max={100}
                            value={pokemon.level}
                            onChange={(e) => handleLevelChange(index, parseInt(e.target.value) || 1)}
                            onBlur={handleLevelInputBlur}
                            className="h-7 w-16 px-2 py-1 text-sm"
                            autoFocus
                          />
                          <span className="text-xs text-gray-400">/ 100</span>
                        </div>
                      ) : (
                        <div className="flex items-center">
                          <span>Lv. {pokemon.level}</span>
                          {isEditing && (
                            <button
                              onClick={() => handleEditLevel(index)}
                              className="ml-2 text-gray-400 hover:text-atl-primary-purple"
                            >
                              <Edit2 className="h-3 w-3" />
                            </button>
                          )}
                        </div>
                      )}
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
              <span>Maximum 6 Pokémon per team</span>
            </li>
            <li className="flex items-start">
              <span className="text-atl-primary-purple mr-2">•</span>
              <span>Some facilities have special team requirements</span>
            </li>
            <li className="flex items-start">
              <span className="text-atl-primary-purple mr-2">•</span>
              <span>Pokémon can be between Level 1-100 for casual battles</span>
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
                  className="pl-9 bg-white text-atl-dark-purple"
                />
              </div>
            </div>
            
            <div className="overflow-y-auto flex-1 p-4">
              {isSearchLoading ? (
                <div className="flex justify-center items-center py-8">
                  <LoadingSpinner size="md" />
                </div>
              ) : pokemonResults.length > 0 ? (
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
              ) : searchTerm ? (
                <div className="text-center py-8 text-gray-500">
                  No Pokémon found matching "{searchTerm}"
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  Start typing to search for Pokémon
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      <BottomNavigation />
    </div>
  );
};

export default TeamManagementPage;
