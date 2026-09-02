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

export function CommentThread({
                                  comments,
                                  newCommentText,
                                  onChangeText,
                                  onSubmit,
                                  inputPlaceholder,
                                  submitLabel,
                              }: CommentThreadProps) {
    const listRef = useRef<HTMLDivElement>(null);

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