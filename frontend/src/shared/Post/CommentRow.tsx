import { useMemo } from 'react';
import type { Comment } from './types';
import { useReactions } from './useReactions';
import { ReactionBar } from './component/ReactionBar';
import styles from './CommentRow.module.css';

interface CommentRowProps {
    comment: Comment;
}

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