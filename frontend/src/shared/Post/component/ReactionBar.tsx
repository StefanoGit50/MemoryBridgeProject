import { motion, AnimatePresence } from 'framer-motion';
import { AVAILABLE_REACTIONS } from '../constant';
import { REACTIONS_CONTENT } from '../content';
import styles from './ReactionBar.module.css';

const { reactedLabel, reactLabel, defaultEmoji, pickerButtonAriaLabel, countSuffix } = REACTIONS_CONTENT;

interface ReactionBarProps {
    userReaction: string | null;
    showReactionPicker: boolean;
    likesCount: number;
    onTogglePicker: () => void;
    onToggleReaction: (emoji: string) => void;
    size?: 'default' | 'compact';
}

export function ReactionBar({
                                userReaction,
                                showReactionPicker,
                                likesCount,
                                onTogglePicker,
                                onToggleReaction,
                                size = 'default',
                            }: ReactionBarProps) {
    const isCompact = size === 'compact';

    return (
        <div className={styles.wrapper}>
            <AnimatePresence>
                {showReactionPicker && (
                    <motion.div
                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                        animate={{ opacity: 1, y: isCompact ? -40 : -52, scale: 1 }}
                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                        transition={{ duration: 0.2 }}
                        className={isCompact ? `${styles.picker} ${styles.pickerCompact}` : styles.picker}
                        role="menu"
                    >
                        {AVAILABLE_REACTIONS.map((emoji) => (
                            <motion.button
                                key={emoji}
                                type="button"
                                whileHover={{ scale: 1.35 }}
                                whileTap={{ scale: 0.9 }}
                                onClick={() => onToggleReaction(emoji)}
                                className={isCompact ? `${styles.pickerEmoji} ${styles.pickerEmojiCompact}` : styles.pickerEmoji}
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
                    className={`${isCompact ? styles.reactButtonCompact : styles.reactButton} ${
                        userReaction ? styles.reactButtonActive : ''
                    }`}
                    aria-label={pickerButtonAriaLabel}
                >
                    <span>{userReaction ?? defaultEmoji}</span>
                    {!isCompact && <span>{userReaction ? reactedLabel : reactLabel}</span>}
                </button>

                <span className={isCompact ? styles.countCompact : styles.count}>
                    {likesCount} {isCompact ? '' : countSuffix}
                </span>
            </div>
        </div>
    );
}