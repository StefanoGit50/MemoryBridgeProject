// @/shared/Post/component/CommentSection.tsx (o il percorso del tuo file CommentSection)
import { useEffect, useRef, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { Comment } from '@/shared/Post/types';
import { MEMORIES_PAGE_CONTENT } from '../content';
import {CommentRow} from "@/shared/Post/component/CommentRow";
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

// Helper per contare ricorsivamente commenti + risposte
function countTotalComments(comments: Comment[] = []): number {
    return comments.reduce(
        (acc, comment) => acc + 1 + (comment.replies ? countTotalComments(comment.replies) : 0),
        0
    );
}

export function CommentSection({
                                   isOpen,
                                   onClose,
                                   comments = [],
                                   newCommentText,
                                   onChangeText,
                                   onSubmit,
                               }: CommentSectionProps) {
    const listRef = useRef<HTMLDivElement>(null);

    // Conteggio totale per l'intestazione "X Commenti"
    const totalCommentsCount = useMemo(() => countTotalComments(comments), [comments]);

    // Tracciamo lo stato precedente di apertura e il numero di commenti principali
    const prevIsOpenRef = useRef(isOpen);
    const prevCommentsLengthRef = useRef(comments.length);

    useEffect(() => {
        if (!isOpen || !listRef.current) return;

        const isJustOpened = isOpen && !prevIsOpenRef.current;
        const hasNewTopLevelComment = comments.length > prevCommentsLengthRef.current;

        // Scrolla in fondo SOLO se la modale si è appena aperta
        // OPPURE se è stato creato un nuovo commento di primo livello dal form in basso
        if (isJustOpened || hasNewTopLevelComment) {
            listRef.current.scrollTo({
                top: listRef.current.scrollHeight,
                behavior: 'smooth',
            });
        }

        prevIsOpenRef.current = isOpen;
        prevCommentsLengthRef.current = comments.length;
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
                        <h4 className={styles.headerTitle}>
                            {totalCommentsCount} {totalCommentsCount === 1 ? 'Commento' : 'Commenti'}
                        </h4>
                    </div>

                    <div ref={listRef} className={styles.list}>
                        {comments.map((comment) => (
                            <CommentRow
                                key={comment.id}
                                comment={comment}
                            />
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