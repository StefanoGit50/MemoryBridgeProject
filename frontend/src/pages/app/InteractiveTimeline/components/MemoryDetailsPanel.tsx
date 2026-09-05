import { motion } from 'framer-motion';
import type { Comment, MemoryItem } from '@/shared/Post/types';
import { MEMORIES_PAGE_CONTENT } from '../content';
import { ReactionBar } from '@/shared/Post/component/ReactionBar';
import { CommentSection } from './Comment';
import styles from './MemoryDetailsPanel.module.css';

const { closeButtonAriaLabel, detailsEyebrow, publishedLabel } = MEMORIES_PAGE_CONTENT.spotlight;
const { toggleAriaLabel } = MEMORIES_PAGE_CONTENT.comments;

interface ReactionBarState {
    userReaction: string | null;
    showReactionPicker: boolean;
    onTogglePicker: () => void;
    onToggleReaction: (emoji: string) => void;
}

interface CommentsState {
    showComments: boolean;
    onToggleComments: () => void;
    newCommentText: string;
    onChangeText: (text: string) => void;
    onSubmit: (e: React.FormEvent) => void;
}

interface MemoryDetailsPanelProps {
    memory: MemoryItem;
    onClose: () => void;
    reactionBar: ReactionBarState;
    comments: CommentsState;
}

// Helper per contare ricorsivamente commenti + risposte
function countTotalComments(comments: Comment[]): number {
    return comments.reduce(
        (acc, comment) => acc + 1 + (comment.replies ? countTotalComments(comment.replies) : 0),
        0
    );
}

export function MemoryDetailsPanel({
                                       memory,
                                       onClose,
                                       reactionBar,
                                       comments,
                                   }: MemoryDetailsPanelProps) {
    const totalLikes = memory.likesCount + (reactionBar.userReaction ? 1 : 0);
    // Calcolo del totale reale comprensivo di tutte le risposte ricorsive
    const totalCommentsCount = countTotalComments(memory.comments || []);

    return (
        <motion.div
            initial={{ opacity: 0, y: -40 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -30 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className={styles.wrapper}
        >
            <div>
                <div className={styles.authorRow}>
                    <div className={styles.authorInfo}>
                        <img
                            src={memory.authorAvatar}
                            alt={memory.authorName}
                            className={styles.authorAvatar}
                        />
                        <div>
                            <h4 className={styles.authorName}>{memory.authorName}</h4>
                            <span className={styles.publishedDate}>
                                {publishedLabel} • {memory.dateStr}
                            </span>
                        </div>
                    </div>

                    <button
                        type="button"
                        onClick={onClose}
                        className={styles.closeButton}
                        aria-label={closeButtonAriaLabel}
                    >
                        ✕
                    </button>
                </div>

                <hr className={styles.divider} />

                <div>
                    <span className={styles.eyebrow}>{detailsEyebrow}</span>
                    <h2 className={styles.title}>{memory.title}</h2>
                </div>

                <p className={styles.story}>{memory.story}</p>
            </div>

            <div>
                <div className={styles.interactionRow}>
                    <ReactionBar
                        userReaction={reactionBar.userReaction}
                        showReactionPicker={reactionBar.showReactionPicker}
                        likesCount={totalLikes}
                        onTogglePicker={reactionBar.onTogglePicker}
                        onToggleReaction={reactionBar.onToggleReaction}
                    />

                    <button
                        type="button"
                        onClick={comments.onToggleComments}
                        className={`${styles.commentsToggle} ${
                            comments.showComments ? styles.commentsToggleActive : ''
                        }`}
                    >
                        {/* 👈 Utilizzato totalCommentsCount al posto di memory.comments.length */}
                        💬 {totalCommentsCount} {toggleAriaLabel}
                    </button>
                </div>

                <CommentSection
                    isOpen={comments.showComments}
                    onClose={comments.onToggleComments}
                    comments={memory.comments}
                    newCommentText={comments.newCommentText}
                    onChangeText={comments.onChangeText}
                    onSubmit={comments.onSubmit}
                />
            </div>
        </motion.div>
    );
}