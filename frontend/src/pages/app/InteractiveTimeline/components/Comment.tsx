import { useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { Comment } from '../types';
import { MEMORIES_PAGE_CONTENT } from '../content';
import styles from './Comment.module.css';

const { inputPlaceholder, submitLabel } = MEMORIES_PAGE_CONTENT.comments;

interface CommentSectionProps {
    isOpen: boolean;
    onClose: () => void;
    comments: Comment[];
    newCommentText: string;
    onChangeText: (text: string) => void;
    onSubmit: (e: React.FormEvent) => void;
}

export function CommentSection({
                                   isOpen,
                                   onClose,
                                   comments,
                                   newCommentText,
                                   onChangeText,
                                   onSubmit,
                               }: CommentSectionProps) {
    const listRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!isOpen || !listRef.current) return;
        listRef.current.scrollTo({ top: listRef.current.scrollHeight, behavior: 'smooth' });
    }, [isOpen, comments.length]);

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    initial={{ y: '100%' }}
                    animate={{ y: 0 }}
                    exit={{ y: '100%' }}
                    transition={{ type: 'tween', duration: 0.32, ease: [0.16, 1, 0.3, 1] }}
                    className={styles.overlay}
                >
                    <div className={styles.header}>
                        <button type="button" onClick={onClose} className={styles.backButton} aria-label="Torna al post">
                            ←
                        </button>
                        <h4 className={styles.headerTitle}>{comments.length} Commenti</h4>
                    </div>

                    <div ref={listRef} className={styles.list}>
                        {comments.map((comment) => (
                            <div key={comment.id} className={styles.commentRow}>
                                <img src={comment.avatar} alt={comment.author} className={styles.avatar} />
                                <div className={styles.bubble}>
                                    <div className={styles.bubbleHeader}>
                                        <span className={styles.author}>{comment.author}</span>
                                        <span className={styles.date}>{comment.date}</span>
                                    </div>
                                    <p className={styles.text}>{comment.text}</p>
                                </div>
                            </div>
                        ))}
                    </div>

                    <form onSubmit={onSubmit} className={styles.form}>
                        <input
                            type="text"
                            placeholder={inputPlaceholder}
                            value={newCommentText}
                            onChange={(e) => onChangeText(e.target.value)}
                            className={styles.input}
                        />
                        <button type="submit" className={styles.submitButton}>
                            {submitLabel}
                        </button>
                    </form>
                </motion.div>
            )}
        </AnimatePresence>
    );
}