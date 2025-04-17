
import { Pokemon } from "@/types";

const BASE_URL = "https://pokeapi.co/api/v2";

// Interface for PokeAPI responses
interface PokemonListResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: {
    name: string;
    url: string;
  }[];
}

interface PokemonDetails {
  id: number;
  name: string;
  sprites: {
    front_default: string;
    other: {
      "official-artwork": {
        front_default: string;
      }
    }
  };
  moves: {
    move: {
      name: string;
    }
  }[];
  stats: {
    base_stat: number;
    stat: {
      name: string;
    }
  }[];
}

// We're now including ALL generations
// Pokémon IDs from #1 (Bulbasaur) to the latest (currently around #1025)
const POKEMON_MIN_ID = 1;
// The actual maximum ID might be higher in the future
const POKEMON_MAX_ID = 1025;

// Generation 9 Pokémon (Scarlet & Violet) constants (kept for backward compatibility)
const GEN9_MIN_ID = 906;
const GEN9_MAX_ID = 1025;

// Get a paginated list of Pokémon
export const getPokemonList = async (limit = 20, offset = 0): Promise<PokemonListResponse> => {
  const response = await fetch(`${BASE_URL}/pokemon?limit=${limit}&offset=${offset}`);
  return response.json();
};

// Get details for a specific Pokémon by name or ID
export const getPokemonDetails = async (nameOrId: string | number): Promise<PokemonDetails> => {
  const response = await fetch(`${BASE_URL}/pokemon/${nameOrId}`);
  return response.json();
};

// Convert PokeAPI format to our app's format
export const convertToAppFormat = (pokemonDetails: PokemonDetails, level = 50): Pokemon => {
  // Get 4 random moves or fewer if there are less than 4 moves
  const allMoves = pokemonDetails.moves.map(m => formatMoveName(m.move.name));
  const randomMoves = allMoves.length <= 4 ? allMoves : getRandomMoves(allMoves, 4);
  
  return {
    id: pokemonDetails.id,
    name: formatPokemonName(pokemonDetails.name),
    moves: randomMoves,
    level: level
  };
};

// Format move names (e.g., "thunder-punch" to "Thunder Punch")
const formatMoveName = (name: string): string => {
  return name
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
};

// Format Pokémon names (e.g., "charizard" to "Charizard")
const formatPokemonName = (name: string): string => {
  return name.charAt(0).toUpperCase() + name.slice(1);
};

// Get random moves from list
const getRandomMoves = (moves: string[], count: number): string[] => {
  const shuffled = [...moves].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
};

// Get list of all Pokémon (or a specific generation range if provided)
export const getAllPokemonList = async (minId = POKEMON_MIN_ID, maxId = POKEMON_MAX_ID): Promise<Pokemon[]> => {
  try {
    const pokemonPromises = [];
    
    // Fetch all Pokémon within the ID range
    for (let id = minId; id <= maxId; id++) {
      pokemonPromises.push(
        getPokemonDetails(id)
          .then(details => convertToAppFormat(details))
          .catch(error => {
            console.error(`Error fetching Pokémon #${id}:`, error);
            return null;
          })
      );
    }
    
    const results = await Promise.all(pokemonPromises);
    // Filter out any null results (failed fetches)
    return results.filter(pokemon => pokemon !== null) as Pokemon[];
  } catch (error) {
    console.error(`Error fetching Pokémon from ID ${minId} to ${maxId}:`, error);
    return [];
  }
};

// Get list of Scarlet & Violet Pokémon (Generation 9) - kept for backward compatibility
export const getGen9PokemonList = async (): Promise<Pokemon[]> => {
  return getAllPokemonList(GEN9_MIN_ID, GEN9_MAX_ID);
};

// Search for Pokémon by name across all generations
export const searchPokemon = async (searchTerm: string): Promise<Pokemon[]> => {
  try {
    // First try to search by ID if the search term is a number
    const numericSearch = parseInt(searchTerm);
    if (!isNaN(numericSearch) && numericSearch >= POKEMON_MIN_ID && numericSearch <= POKEMON_MAX_ID) {
      try {
        const details = await getPokemonDetails(numericSearch);
        return [convertToAppFormat(details)];
      } catch {
        // If ID search fails, continue with name search
      }
    }
    
    // Get a larger list to search through
    const { results } = await getPokemonList(1000, 0);
    
    // Filter by search term
    const filteredResults = results.filter(pokemon => 
      pokemon.name.includes(searchTerm.toLowerCase())
    );
    
    // Limit to first 20 results to avoid too many API calls
    const limitedResults = filteredResults.slice(0, 20);
    
    // Fetch details for each Pokémon
    const pokemonPromises = limitedResults.map(async pokemon => {
      const details = await getPokemonDetails(pokemon.name);
      return convertToAppFormat(details);
    });
    
    return Promise.all(pokemonPromises);
  } catch (error) {
    console.error("Error searching Pokémon:", error);
    return [];
  }
};
