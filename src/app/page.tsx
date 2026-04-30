'use client';

import { useState, useEffect, useMemo } from 'react';
import styles from './page.module.css';
import { 
  fetchAllPokemon, 
  fetchTypes, 
  fetchPokemonByType,
  PokemonListItem,
  PokemonDetail
} from '@/services/pokeApi';
import { useFavorites } from '@/hooks/useFavorites';
import PokemonCard from '@/components/PokemonCard';
import PokemonModal from '@/components/PokemonModal';
import AuthButton from '@/components/AuthButton';

const ITEMS_PER_PAGE = 20;

export default function Home() {
  const [allPokemon, setAllPokemon] = useState<PokemonListItem[]>([]);
  const [types, setTypes] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  
  const [search, setSearch] = useState('');
  const [selectedType, setSelectedType] = useState('');
  const [showFavorites, setShowFavorites] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  
  const [selectedPokemon, setSelectedPokemon] = useState<PokemonDetail | null>(null);
  
  const { favorites, toggleFavorite, isFavorite } = useFavorites();

  // Load initial data
  useEffect(() => {
    async function loadInitial() {
      try {
        const [pokemonData, typesData] = await Promise.all([
          fetchAllPokemon(),
          fetchTypes()
        ]);
        setAllPokemon(pokemonData);
        setTypes(typesData);
      } catch (e) {
        console.error('Failed to load initial data', e);
      } finally {
        setLoading(false);
      }
    }
    loadInitial();
  }, []);

  // Handle type change logic (fetch subset from API)
  const [typeFilteredList, setTypeFilteredList] = useState<PokemonListItem[] | null>(null);
  useEffect(() => {
    if (!selectedType) {
      setTypeFilteredList(null);
      return;
    }
    let mounted = true;
    const loadByType = async () => {
      setLoading(true);
      try {
        const data = await fetchPokemonByType(selectedType);
        if (mounted) setTypeFilteredList(data);
      } catch (e) {
        console.error('Failed to filter by type', e);
      } finally {
        if (mounted) setLoading(false);
      }
    };
    loadByType();
    return () => { mounted = false; };
  }, [selectedType]);

  // Derived state: Apply Search and Favorites to the currently active list
  const filteredPokemon = useMemo(() => {
    let list = typeFilteredList || allPokemon;

    if (search.trim()) {
      list = list.filter(p => p.name.includes(search.toLowerCase().trim()));
    }

    if (showFavorites) {
      list = list.filter(p => isFavorite(p.name));
    }

    return list;
  }, [allPokemon, typeFilteredList, search, showFavorites, isFavorite]);

  // Pagination logic
  const totalPages = Math.ceil(filteredPokemon.length / ITEMS_PER_PAGE) || 1;
  const currentList = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredPokemon.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  }, [filteredPokemon, currentPage]);

  // Reset page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [search, selectedType, showFavorites]);

  return (
    <main className={styles.container}>
      <div className={styles.topBar}>
        <AuthButton />
      </div>

      <header className={styles.header}>
        <h1 className={styles.title}>Pokédex Lite</h1>
        <p className={styles.subtitle}>Search and filter your favorite Pokémon</p>
      </header>

      <div className={styles.controls}>
        <div className={styles.searchBox}>
          <svg className={styles.searchIcon} width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="11" cy="11" r="8"></circle>
            <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
          </svg>
          <input 
            type="text" 
            placeholder="Search Pokémon..." 
            className={styles.searchInput}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div className={styles.filterBox}>
          <select 
            className={styles.filterSelect}
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value)}
          >
            <option value="">All Types</option>
            {types.map(t => (
              <option key={t} value={t}>{t.charAt(0).toUpperCase() + t.slice(1)}</option>
            ))}
          </select>

          <button 
            className={`${styles.toggleFavorites} ${showFavorites ? styles.active : ''}`}
            onClick={() => setShowFavorites(!showFavorites)}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill={showFavorites ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="2">
              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
            </svg>
            Favorites
          </button>
        </div>
      </div>

      {loading && !currentList.length ? (
        <div className={styles.loading}>Loading Pokémon...</div>
      ) : currentList.length === 0 ? (
        <div className={styles.noResults}>No Pokémon found.</div>
      ) : (
        <>
          <div className={styles.grid}>
            {currentList.map(p => (
              <PokemonCard 
                key={p.name}
                name={p.name}
                url={p.url}
                isFavorite={isFavorite(p.name)}
                onToggleFavorite={toggleFavorite}
                onClick={setSelectedPokemon}
              />
            ))}
          </div>

          <div className={styles.pagination}>
            <button 
              className={styles.pageBtn}
              disabled={currentPage === 1}
              onClick={() => setCurrentPage(prev => prev - 1)}
            >
              Previous
            </button>
            <span className={styles.pageInfo}>
              Page {currentPage} of {totalPages}
            </span>
            <button 
              className={styles.pageBtn}
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage(prev => prev + 1)}
            >
              Next
            </button>
          </div>
        </>
      )}

      {selectedPokemon && (
        <PokemonModal 
          pokemon={selectedPokemon} 
          onClose={() => setSelectedPokemon(null)} 
        />
      )}
    </main>
  );
}
