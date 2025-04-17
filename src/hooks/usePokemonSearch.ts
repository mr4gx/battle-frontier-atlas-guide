
import { useState, useEffect } from "react";
import { Pokemon } from "@/types";
import { searchPokemon, getPokemonList, getPokemonDetails, convertToAppFormat } from "@/services/pokemonApi";
import { useQuery } from "@tanstack/react-query";

export function usePokemonSearch() {
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState<Pokemon[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  
  // Query for popular Pokémon (to show when no search term)
  const popularPokemonIds = [25, 6, 9, 3, 149, 150, 94, 59, 130, 143, 65, 448];
  
  const { data: popularPokemon, isLoading: isLoadingPopular } = useQuery({
    queryKey: ['popularPokemon'],
    queryFn: async () => {
      try {
        const pokemonPromises = popularPokemonIds.map(async id => {
          const details = await getPokemonDetails(id);
          return convertToAppFormat(details);
        });
        
        return Promise.all(pokemonPromises);
      } catch (error) {
        console.error("Error fetching popular Pokémon:", error);
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
