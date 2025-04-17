
import { useState, useEffect } from "react";
import { Pokemon } from "@/types";
import { searchPokemon, getGen9PokemonList, getPokemonDetails, convertToAppFormat } from "@/services/pokemonApi";
import { useQuery } from "@tanstack/react-query";

export function usePokemonSearch() {
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState<Pokemon[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  
  // Query for popular Gen 9 starter Pokémon (to show when no search term)
  const gen9StarterIds = [906, 909, 912]; // Sprigatito, Fuecoco, Quaxly
  const gen9PopularIds = [...gen9StarterIds, 945, 946, 962, 973, 978, 992, 1000, 1001, 1010]; // Add more popular Gen 9 Pokémon
  
  const { data: popularPokemon, isLoading: isLoadingPopular } = useQuery({
    queryKey: ['popularGen9Pokemon'],
    queryFn: async () => {
      try {
        const pokemonPromises = gen9PopularIds.map(async id => {
          const details = await getPokemonDetails(id);
          return convertToAppFormat(details);
        });
        
        return Promise.all(pokemonPromises);
      } catch (error) {
        console.error("Error fetching popular Gen 9 Pokémon:", error);
        return [];
      }
    },
    staleTime: 1000 * 60 * 60, // 1 hour
  });
  
  // Search effect
  useEffect(() => {
    const controller = new AbortController();
    
    const delayDebounceFn = setTimeout(async () => {
      if (searchTerm.trim()) {
        setIsSearching(true);
        try {
          const results = await searchPokemon(searchTerm);
          setSearchResults(results);
        } catch (error) {
          console.error("Error searching Pokémon:", error);
          setSearchResults([]);
        } finally {
          setIsSearching(false);
        }
      } else {
        setSearchResults([]);
      }
    }, 500);
    
    return () => {
      controller.abort();
      clearTimeout(delayDebounceFn);
    };
  }, [searchTerm]);
  
  // Get the appropriate results based on whether we're searching or not
  const results = searchTerm.trim() ? searchResults : (popularPokemon || []);
  const isLoading = searchTerm.trim() ? isSearching : isLoadingPopular;
  
  return {
    searchTerm,
    setSearchTerm,
    results,
    isLoading
  };
}
