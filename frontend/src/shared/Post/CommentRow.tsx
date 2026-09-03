import { useMemo } from 'react';
import type { Comment } from './types';
import { useReactions } from './useReactions';
import { ReactionBar } from './component/ReactionBar';
import styles from './CommentRow.module.css';

interface CommentRowProps {
    comment: Comment;
}

/**
 * Componente atomico per il rendering e la gestione di una singola riga di commento.
 *
 * Si occupa di:
 * - Mostrare le informazioni dell'autore, l'avatar, la data di pubblicazione e il testo.
 * - Gestire in modo del tutto autonomo le reazioni (like/emoji) sul singolo commento
 *   tramite l'hook `useReactions(comment.id)`, disaccoppiandolo dallo stato del post padre.
 * - Calcolare in modo efficiente (`useMemo`) l'incremento visivo dei like quando l'utente reagisce.
 * - Renderizzare una `ReactionBar` in modalità compatta (`size="compact"`).
 *
 * @param props - Oggetto {@link CommentRowProps} contenente i dati del commento.
 * @returns Elemento JSX rappresentante la riga del commento con interazioni integrate.
 */
export function CommentRow({ comment }: CommentRowProps) {
    const { userReaction, showReactionPicker, toggleReaction, toggleReactionPicker } =
        useReactions(comment.id);

    const totalLikes = useMemo(
        () => comment.likesCount + (userReaction ? 1 : 0),
        [comment.likesCount, userReaction],
    );

    return (
        <div className={styles.row}>
        <img src={comment.avatar} alt={comment.author} className={styles.avatar} />
    <div className={styles.body}>
    <div className={styles.bubble}>
    <div className={styles.header}>
    <span className={styles.author}>{comment.author}</span>
        <span className={styles.date}>{comment.date}</span>
        </div>
        <p className={styles.text}>{comment.text}</p>
        </div>

        <div className={styles.actions}>
    <ReactionBar
        size="compact"
    userReaction={userReaction}
    showReactionPicker={showReactionPicker}
    likesCount={totalLikes}
    onTogglePicker={toggleReactionPicker}
    onToggleReaction={toggleReaction}
    />
    </div>
    </div>
    </div>
);
}