import { motion, AnimatePresence } from 'framer-motion';
import type { FloatingEmoji, MemoryItem } from '@/shared/Post/types';
import styles from './MemoryPhotoPanel.module.css';

interface MemoryPhotoPanelProps {
    memory: MemoryItem;
    floatingEmojis: FloatingEmoji[];
}

export function MemoryPhotoPanel({ memory, floatingEmojis }: MemoryPhotoPanelProps) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 40, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.97 }}
            transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
            className={styles.wrapper}
        >
            <div className={styles.photoFrame}>
                <img src={memory.imageUrl} alt={memory.title} className={styles.photo} />

                <div className={styles.badgeRow}>
                    <span className={styles.yearBadge}>{memory.year}</span>
                    <span className={styles.catalogBadge}>{memory.catalogCode}</span>
                </div>

                <AnimatePresence>
                    {floatingEmojis.map((item) => (
                        <motion.span
                            key={item.id}
                            initial={{ opacity: 1, y: 520, scale: 0.8 }}
                            animate={{ opacity: 0, y: -40, scale: 2.2 }}
                            transition={{ duration: 1.8, ease: 'easeOut' }}
                            className={styles.floatingEmoji}
                            style={{ left: `${item.leftOffset}%` }}
                        >
                            {item.emoji}
                        </motion.span>
                    ))}
                </AnimatePresence>
            </div>
        </motion.div>
    );
}