'use client';

import { useEffect } from 'react';
import styles from './PokemonModal.module.css';
import { PokemonDetail } from '@/services/pokeApi';

interface PokemonModalProps {
  pokemon: PokemonDetail;
  onClose: () => void;
}

export default function PokemonModal({ pokemon, onClose }: PokemonModalProps) {
  // Close on escape key
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleEsc);
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', handleEsc);
      document.body.style.overflow = 'unset';
    };
  }, [onClose]);

  const imageSrc = pokemon.sprites.other['official-artwork'].front_default || pokemon.sprites.front_default;
  const primaryType = pokemon.types[0]?.type.name || 'normal';

  // Calculate stat bar width (max base stat usually around 255)
  const getStatWidth = (val: number) => `${Math.min(100, (val / 255) * 100)}%`;

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <button className={styles.closeBtn} onClick={onClose}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </button>

        <div className={styles.header}>
          <div 
            className={styles.headerBg} 
            style={{ backgroundColor: `var(--type-${primaryType}, var(--accent))` }}
          ></div>
          <div className={styles.imageContainer}>
            {imageSrc && <img src={imageSrc} alt={pokemon.name} className={styles.image} />}
          </div>
          <h2 className={styles.title}>{pokemon.name.replace('-', ' ')}</h2>
          <div className={styles.types}>
            {pokemon.types.map((t) => (
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

        <div className={styles.body}>
          <h3 className={styles.sectionTitle}>Base Stats</h3>
          <div className={styles.statsGrid}>
            {pokemon.stats.map((s) => (
              <div key={s.stat.name} className={styles.statRow}>
                <span className={styles.statName}>{s.stat.name.replace('-', ' ')}</span>
                <span className={styles.statValue}>{s.base_stat}</span>
                <div className={styles.statBarBg}>
                  <div 
                    className={styles.statBarFill} 
                    style={{ width: getStatWidth(s.base_stat) }}
                  ></div>
                </div>
              </div>
            ))}
          </div>

          <h3 className={styles.sectionTitle}>Details</h3>
          <div className={styles.infoGrid}>
            <div className={styles.infoBox}>
              <div className={styles.infoLabel}>Height</div>
              <div className={styles.infoValue}>{pokemon.height / 10} m</div>
            </div>
            <div className={styles.infoBox}>
              <div className={styles.infoLabel}>Weight</div>
              <div className={styles.infoValue}>{pokemon.weight / 10} kg</div>
            </div>
            <div className={styles.infoBox} style={{ gridColumn: '1 / -1' }}>
              <div className={styles.infoLabel}>Abilities</div>
              <div className={styles.infoValue}>
                {pokemon.abilities.map(a => a.ability.name.replace('-', ' ')).join(', ')}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
