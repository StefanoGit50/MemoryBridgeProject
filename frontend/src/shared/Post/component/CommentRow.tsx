// @/shared/Post/CommentRow.tsx
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { Comment } from '../types';
import { useReactions } from '../useReactions';
import { ReactionBar } from './ReactionBar';
import { useCommentsContext } from '@/shared/Post/component/CommentContext';
import styles from './CommentRow.module.css';

interface CommentRowProps {
    comment: Comment;
}

export function CommentRow({ comment }: CommentRowProps) {
    const { onAddReply } = useCommentsContext();
    const { userReaction, showReactionPicker, toggleReaction, toggleReactionPicker } =
        useReactions(comment.id);

    const [isReplying, setIsReplying] = useState(false);
    const [replyText, setReplyText] = useState('');
    const [showReplies, setShowReplies] = useState(true);

    const handleReplySubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!replyText.trim()) return;
        onAddReply(comment.id, replyText);
        setReplyText('');
        setIsReplying(false);
        setShowReplies(true);
    };

    const hasReplies = comment.replies && comment.replies.length > 0;

    return (
        <div className={styles.container}>
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

                    {/* Bar azioni: Reazione + Tasto Rispondi */}
                    <div className={styles.actionsBar}>
                        <ReactionBar
                            size="compact"
                            userReaction={userReaction}
                            showReactionPicker={showReactionPicker}
                            likesCount={(comment.likesCount ?? 0) + (userReaction ? 1 : 0)} // 👈 Previene il bug NaN
                            onTogglePicker={toggleReactionPicker}
                            onToggleReaction={toggleReaction}
                        />
                        <button
                            type="button"
                            className={styles.replyButton}
                            onClick={() => setIsReplying(!isReplying)}
                        >
                            {isReplying ? 'Annulla' : 'Rispondi'}
                        </button>
                    </div>

                    {/* Form Inline Animato */}
                    <AnimatePresence>
                        {isReplying && (
                            <motion.form
                                initial={{ opacity: 0, y: -8, height: 0 }}
                                animate={{ opacity: 1, y: 0, height: 'auto' }}
                                exit={{ opacity: 0, y: -8, height: 0 }}
                                style={{ overflow: 'hidden' }} // 👈 Evita scatti di layout nell'animazione
                                className={styles.replyForm}
                                onSubmit={handleReplySubmit}
                            >
                                <input
                                    type="text"
                                    autoFocus
                                    placeholder={`Rispondi a @${comment.author}...`}
                                    value={replyText}
                                    onChange={(e) => setReplyText(e.target.value)}
                                    className={styles.replyInput}
                                />
                                <button type="submit" className={styles.replySubmit}>
                                    Invia
                                </button>
                            </motion.form>
                        )}
                    </AnimatePresence>
                </div>
            </div>

            {/* Risposte Nested */}
            {hasReplies && (
                <div className={styles.repliesWrapper}>
                    <button
                        type="button"
                        onClick={() => setShowReplies(!showReplies)}
                        className={styles.toggleRepliesBtn}
                    >
                        <span className={styles.lineConnector} />
                        {showReplies ? 'Nascondi risposte' : `Mostra ${comment.replies!.length} risposte`}
                    </button>

                    <AnimatePresence>
                        {showReplies && (
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                className={styles.repliesThread}
                            >
                                {comment.replies!.map((reply) => (
                                    <CommentRow key={reply.id} comment={reply} />
                                ))}
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            )}
        </div>
    );
}