import { useEffect, useRef } from 'react';
import type { Comment } from '../types';
import { CommentRow } from '../CommentRow';
import styles from './CommentThread.module.css';

interface CommentThreadProps {
    comments: Comment[];
    newCommentText: string;
    onChangeText: (text: string) => void;
    onSubmit: (e: React.FormEvent) => void;
    inputPlaceholder: string;
    submitLabel: string;
}

/**
 * Componente per la gestione e visualizzazione di un thread di commenti.
 *
 * Responsabilità:
 * 1. Renderizza la lista scrollabile dei commenti delegando la grafica di ciascun elemento a {@link CommentRow}.
 * 2. Mantiene l'auto-scroll verso il basso (`scrollTo`) ogni volta che viene aggiunto un nuovo commento.
 * 3. Mostra il modulo di input e pulsante per inviare nuovi commenti.
 *
 * @param props - {@link CommentThreadProps}
 */
export function CommentThread({
                                  comments,
                                  newCommentText,
                                  onChangeText,
                                  onSubmit,
                                  inputPlaceholder,
                                  submitLabel,
                              }: CommentThreadProps) {
    const listRef = useRef<HTMLDivElement>(null);

    /**
     * Effetto che forza lo scroll della lista in basso (fino all'ultimo commento)
     * ogni volta che il numero di commenti varia.
     */
    useEffect(() => {
        if (!listRef.current) return;
        listRef.current.scrollTo({ top: listRef.current.scrollHeight, behavior: 'smooth' });
    }, [comments.length]);

    return (
        <div className={styles.thread}>
        <div ref={listRef} className={styles.list}>
        {comments.map((comment) => (
                <CommentRow key={comment.id} comment={comment} />
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
        </div>
);
}