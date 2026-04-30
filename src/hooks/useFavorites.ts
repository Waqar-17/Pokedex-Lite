'use client';

import { useState, useEffect } from 'react';

export function useFavorites() {
  const [favorites, setFavorites] = useState<string[]>([]);

  // Load favorites from local storage on mount
  useEffect(() => {
    const saved = localStorage.getItem('pokedex-favorites');
    if (saved) {
      try {
        setFavorites(JSON.parse(saved));
      } catch (e) {
        console.error('Failed to parse favorites', e);
      }
    }
  }, []);

  const toggleFavorite = (name: string) => {
    setFavorites((prev) => {
      let newFavs;
      if (prev.includes(name)) {
        newFavs = prev.filter((f) => f !== name);
      } else {
        newFavs = [...prev, name];
      }
      localStorage.setItem('pokedex-favorites', JSON.stringify(newFavs));
      return newFavs;
    });
  };

  const isFavorite = (name: string) => favorites.includes(name);

  return { favorites, toggleFavorite, isFavorite };
}
