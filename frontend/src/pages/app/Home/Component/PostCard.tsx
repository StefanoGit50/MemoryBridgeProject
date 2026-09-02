import { useState } from 'react';
import type { MemoryItem, Comment } from '@/shared/Post/types';
import { useReactions } from '@/shared/Post/useReactions';
import { ReactionBar } from '@/shared/Post/component/ReactionBar';
import { useSpeechSynthesis } from '@/shared/Accessibility/UseSpeechAccessibility';
import { CommentAccordion } from './CommentAccordion';
import { HOME_PAGE_CONTENT } from '../content';
import styles from './PostCard.module.css';

interface PostCardProps {
    post: MemoryItem;
    onAddComment: (postId: string, comment: Comment) => void;
}

export function PostCard({ post, onAddComment }: PostCardProps) {
    const { userReaction, showReactionPicker, toggleReaction, toggleReactionPicker } =
        useReactions(post.id);
    const { isSpeaking, toggleSpeech } = useSpeechSynthesis();
    const [showComments, setShowComments] = useState(false);
    const [newCommentText, setNewCommentText] = useState('');

    const totalLikes = post.likesCount + (userReaction ? 1 : 0);

    function handleSubmitComment(e: React.FormEvent) {
        e.preventDefault();
        if (!newCommentText.trim()) return;

        onAddComment(post.id, {
            id: Date.now().toString(),
            author: 'Tu',
            avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=120&q=80',
            date: 'Adesso',
            text: newCommentText.trim(),
            likesCount: 0,
        });
        setNewCommentText('');
    }

    return (
        <article className={styles.card}>
            <header className={styles.header}>
                <div className={styles.authorAvatar}>👵</div>
                <div className={styles.authorInfo}>
                    <div className={styles.nameRow}>
                        <h3 className={styles.authorName}>{post.authorName}</h3>
                    </div>
                    <p className={styles.meta}>{post.dateStr}</p>
                </div>
            </header>

            <div className={styles.body}>
                <p className={styles.story}>{post.story}</p>
                <button
                    type="button"
                    onClick={() => toggleSpeech(post.story)}
                    className={`${styles.speechButton} ${isSpeaking ? styles.speechButtonActive : ''}`}
                >
                    {isSpeaking ? HOME_PAGE_CONTENT.voiceNote.stopSpeak : HOME_PAGE_CONTENT.voiceNote.speak}
                </button>
            </div>

            <div className={styles.photoFrame}>
                <img src={post.imageUrl} alt={post.title} className={styles.photo} />
            </div>

            <footer className={styles.footer}>
                <div className={styles.actionsRow}>
                    <ReactionBar
                        userReaction={userReaction}
                        showReactionPicker={showReactionPicker}
                        likesCount={totalLikes}
                        onTogglePicker={toggleReactionPicker}
                        onToggleReaction={toggleReaction}
                    />

                    <button
                        type="button"
                        onClick={() => setShowComments((v) => !v)}
                        className={styles.commentsToggle}
                    >
                        💬 {post.comments.length} Risposte
                    </button>
                </div>

                <CommentAccordion
                    isOpen={showComments}
                    comments={post.comments}
                    newCommentText={newCommentText}
                    onChangeText={setNewCommentText}
                    onSubmit={handleSubmitComment}
                    inputPlaceholder={HOME_PAGE_CONTENT.comments.inputPlaceholder}
                    submitLabel={HOME_PAGE_CONTENT.comments.submitLabel}
                />
            </footer>
        </article>
    );
}