export interface PokemonListResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: PokemonListItem[];
}

export interface PokemonListItem {
  name: string;
  url: string;
}

export interface PokemonDetail {
  id: number;
  name: string;
  height: number;
  weight: number;
  sprites: {
    other: {
      'official-artwork': {
        front_default: string;
      };
    };
    front_default: string;
  };
  types: {
    slot: number;
    type: {
      name: string;
      url: string;
    };
  }[];
  stats: {
    base_stat: number;
    stat: {
      name: string;
    };
  }[];
  abilities: {
    ability: {
      name: string;
    };
  }[];
}

export interface TypeListResponse {
  count: number;
  results: { name: string; url: string }[];
}

export interface TypeDetailResponse {
  pokemon: {
    pokemon: { name: string; url: string };
  }[];
}

const API_BASE = 'https://pokeapi.co/api/v2';

// Fetch all pokemon for client-side search/filter (up to ~1302 available)
export async function fetchAllPokemon(): Promise<PokemonListItem[]> {
  const res = await fetch(`${API_BASE}/pokemon?limit=10000`);
  if (!res.ok) throw new Error('Failed to fetch pokemon list');
  const data: PokemonListResponse = await res.json();
  return data.results;
}

// Fetch details for a specific pokemon
export async function fetchPokemonDetail(nameOrId: string | number): Promise<PokemonDetail> {
  const res = await fetch(`${API_BASE}/pokemon/${nameOrId}`);
  if (!res.ok) throw new Error('Failed to fetch pokemon detail');
  return res.json();
}

// Fetch all available types
export async function fetchTypes(): Promise<string[]> {
  const res = await fetch(`${API_BASE}/type`);
  if (!res.ok) throw new Error('Failed to fetch types');
  const data: TypeListResponse = await res.json();
  // Filter out unknown and shadow types as they rarely have normal pokemon
  return data.results
    .map((t) => t.name)
    .filter((t) => t !== 'unknown' && t !== 'shadow');
}

// Fetch pokemon by specific type
export async function fetchPokemonByType(type: string): Promise<PokemonListItem[]> {
  const res = await fetch(`${API_BASE}/type/${type}`);
  if (!res.ok) throw new Error('Failed to fetch pokemon by type');
  const data: TypeDetailResponse = await res.json();
  return data.pokemon.map((p) => p.pokemon);
}

// Helper: Extract ID from URL
export function extractIdFromUrl(url: string): string {
  const parts = url.split('/').filter(Boolean);
  return parts[parts.length - 1];
}
