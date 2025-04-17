
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

// Search for Pokémon by name
export const searchPokemon = async (searchTerm: string): Promise<Pokemon[]> => {
  try {
    // Get a larger list to search through
    const { results } = await getPokemonList(150, 0);
    
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
