'use client';

import { useState, useEffect } from 'react';
import styles from './PokemonCard.module.css';
import { PokemonDetail, fetchPokemonDetail } from '@/services/pokeApi';

interface PokemonCardProps {
  name: string;
  url: string;
  isFavorite: boolean;
  onToggleFavorite: (name: string) => void;
  onClick: (detail: PokemonDetail) => void;
}

export default function PokemonCard({ name, url, isFavorite, onToggleFavorite, onClick }: PokemonCardProps) {
  const [detail, setDetail] = useState<PokemonDetail | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    const loadDetail = async () => {
      try {
        const data = await fetchPokemonDetail(name);
        if (mounted) setDetail(data);
      } catch (e) {
        console.error(e);
      } finally {
        if (mounted) setLoading(false);
      }
    };
    loadDetail();
    return () => { mounted = false; };
  }, [name]);

  if (loading || !detail) {
    return (
      <div className={styles.card} style={{ height: '240px', justifyContent: 'center' }}>
        <div style={{ color: 'var(--text-secondary)' }}>Loading...</div>
      </div>
    );
  }

  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onToggleFavorite(name);
  };

  const imageSrc = detail.sprites.other['official-artwork'].front_default || detail.sprites.front_default;

  return (
    <div className={styles.card} onClick={() => onClick(detail)}>
      <button 
        className={`${styles.favoriteBtn} ${isFavorite ? styles.active : styles.inactive}`}
        onClick={handleFavoriteClick}
        aria-label={isFavorite ? "Remove from favorites" : "Add to favorites"}
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill={isFavorite ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="2">
          <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
        </svg>
      </button>

      <div className={styles.id}>#{String(detail.id).padStart(3, '0')}</div>
      
      <div className={styles.imageContainer}>
        {imageSrc && <img src={imageSrc} alt={name} className={styles.image} loading="lazy" />}
      </div>
      
      <div className={styles.name}>{name.replace('-', ' ')}</div>
      
      <div className={styles.types}>
        {detail.types.map((t) => (
          <span 
            key={t.type.name} 
            className={styles.typeBadge}
            style={{ backgroundColor: `var(--type-${t.type.name}, var(--border))` }}
          >
            {t.type.name}
          </span>
        ))}
      </div>
    </div>
  );
}
