import { useRef } from 'react';
import type { MemoryItem } from '../types';
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