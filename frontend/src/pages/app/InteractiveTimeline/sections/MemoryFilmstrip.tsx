import { useRef } from 'react';
import type { MemoryItem } from '@/shared/Post/types';
import { MEMORIES_PAGE_CONTENT } from '../content';
import { FilmstripCard } from '../components/FilmstripCard';
import styles from './MemoryFilmstrip.module.css';

const { title, previousAriaLabel,   nextAriaLabel } = MEMORIES_PAGE_CONTENT.filmstrip;

const SCROLL_AMOUNT_PX = 350;

interface MemoryFilmstripProps {
    memories: MemoryItem[];
    selectedId: string | null;
    onSelect: (id: string) => void;
}

/**
 * Componente per il rullino/galleria orizzontale dei ricordi.
 *
 * Si occupa di:
 * - Mostrare un'elenco di anteprime (`FilmstripCard`) disposte in linea orizzontale.
 * - Gestire lo scorrimento programmatico della barra tramite `useRef` e l'API nativa `scrollBy`.
 * - Evidenziare la scheda attiva confrontando `selectedId` con l'ID della singola scheda.
 *
 * @param props - Oggetto {@link MemoryFilmstripProps} contenente i ricordi e i gestori di selezione.
 * @returns Elemento JSX contenente la sezione con frecce di navigazione e traccia scrollabile.
 */
export function MemoryFilmstrip({ memories, selectedId, onSelect }: MemoryFilmstripProps) {
    const trackRef = useRef<HTMLDivElement>(null);

    function scrollByAmount(direction: 1 | -1) {
        trackRef.current?.scrollBy({ left: direction * SCROLL_AMOUNT_PX, behavior: 'smooth' });
    }

    return (
        <div className={styles.section}>
            <h3 className={styles.heading}>{title}</h3>

            <div className={styles.rail}>
                <button
                    type="button"
                    onClick={() => scrollByAmount(-1)}
                    className={`${styles.arrowButton} ${styles.arrowButtonLeft}`}
                    aria-label={previousAriaLabel}
                >
                    ◀
                </button>

                <div ref={trackRef} className={styles.track}>
                    {memories.map((item) => (
                        <FilmstripCard
                            key={item.id}
                            item={item}
                            isSelected={selectedId === item.id}
                            onSelect={onSelect}
                        />
                    ))}
                </div>

                <button
                    type="button"
                    onClick={() => scrollByAmount(1)}
                    className={`${styles.arrowButton} ${styles.arrowButtonRight}`}
                    aria-label={nextAriaLabel}
                >
                    ▶
                </button>
            </div>
        </div>
    );
}