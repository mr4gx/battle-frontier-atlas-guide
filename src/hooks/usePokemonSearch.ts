
import { useState, useEffect } from "react";
import { Pokemon } from "@/types";
import { searchPokemon, getAllPokemonList, getPokemonDetails, convertToAppFormat } from "@/services/pokemonApi";
import { useQuery } from "@tanstack/react-query";

export function usePokemonSearch() {
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState<Pokemon[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  
  // Query for popular Pokémon from various generations (to show when no search term)
  const popularPokemonIds = [
    // Gen 1 starters and popular Pokémon
    1, 4, 7, 25, 133, 143, 150,
    // Gen 2 favorites
    152, 155, 158, 196, 249,
    // Gen 3 standouts
    252, 255, 258, 384,
    // Gen 4 picks
    387, 390, 393, 445, 448,
    // Gen 5
    495, 498, 501, 643,
    // Gen 6
    650, 653, 656, 719,
    // Gen 7
    722, 725, 728, 792,
    // Gen 8
    810, 813, 816, 888,
    // Gen 9
    906, 909, 912, 1000
  ];
  
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
