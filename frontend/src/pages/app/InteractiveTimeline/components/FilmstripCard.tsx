import type { MemoryItem } from '../types';
import styles from './FilmstripCard.module.css';

interface FilmstripCardProps {
    item: MemoryItem;
    isSelected: boolean;
    onSelect: (id: string) => void;
}

export function FilmstripCard({ item, isSelected, onSelect }: FilmstripCardProps) {
    return (
        <div
            className={`${styles.card} ${isSelected ? styles.cardSelected : ''}`}
            onClick={() => onSelect(item.id)}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') onSelect(item.id);
            }}
        >
            <div className={styles.photoWrapper}>
                <img src={item.imageUrl} alt={item.title} className={styles.photo} />
                <span className={styles.yearBadge}>{item.year}</span>
            </div>
            <div className={styles.caption}>
                <h4 className={styles.title}>{item.title}</h4>
            </div>
        </div>
    );
}
