import { motion, AnimatePresence } from 'framer-motion';
import { AVAILABLE_REACTIONS } from '../constant';
import { MEMORIES_PAGE_CONTENT } from '../content';
import styles from './ReactionBar.module.css';

const { reactedLabel, reactLabel, defaultEmoji,  pickerButtonAriaLabel, countSuffix } =
    MEMORIES_PAGE_CONTENT.reactions;

interface ReactionBarProps {
    userReaction: string | null;
    showReactionPicker: boolean;
    likesCount: number;
    onTogglePicker: () => void;
    onToggleReaction: (emoji: string) => void;
}

export function ReactionBar({
                                userReaction,
                                showReactionPicker,
                                likesCount,
                                onTogglePicker,
                                onToggleReaction,
                            }: ReactionBarProps) {
    return (
        <div className={styles.wrapper}>
            <AnimatePresence>
                {showReactionPicker && (
                    <motion.div
                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                        animate={{ opacity: 1, y: -52, scale: 1 }}
                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                        transition={{ duration: 0.2 }}
                        className={styles.picker}
                        role="menu"
                    >
                        {AVAILABLE_REACTIONS.map((emoji) => (
                            <motion.button
                                key={emoji}
                                type="button"
                                whileHover={{ scale: 1.35 }}
                                whileTap={{ scale: 0.9 }}
                                onClick={() => onToggleReaction(emoji)}
                                className={styles.pickerEmoji}
                                aria-label={emoji}
                            >
                                {emoji}
                            </motion.button>
                        ))}
                    </motion.div>
                )}
            </AnimatePresence>

            <div className={styles.actions}>
                <button
                    type="button"
                    onClick={onTogglePicker}
                    className={`${styles.reactButton} ${userReaction ? styles.reactButtonActive : ''}`}
                    aria-label={pickerButtonAriaLabel}
                >
                    <span>{userReaction ?? defaultEmoji}</span>
                    <span>{userReaction ? reactedLabel : reactLabel}</span>
                </button>

                <span className={styles.count}>
                    {likesCount} {countSuffix}
                </span>
            </div>
        </div>
    );
}
