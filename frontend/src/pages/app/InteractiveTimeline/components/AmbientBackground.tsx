import { motion, AnimatePresence } from 'framer-motion';
import styles from './AmbientBackground.module.css';

interface AmbientBackgroundProps {
    imageKey: string;
    imageUrl: string;
}

export function AmbientBackground({ imageKey, imageUrl }: AmbientBackgroundProps) {
    return (
        <>
            <AnimatePresence mode="wait">
                <motion.div
                    key={imageKey}
                    initial={{ opacity: 0, scale: 1.08 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 1.03 }}
                    transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1] }}
                    className={styles.backdrop}
                    style={{ backgroundImage: `url(${imageUrl})` }}
                />
            </AnimatePresence>
            <div className={styles.veil} />
        </>
    );
}
