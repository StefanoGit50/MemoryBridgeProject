import { AmbientBackground } from './components/AmbientBackground';
import { MemorySpotlight } from './sections/MemorySpotlight';
import { MemoryFilmstrip } from './sections/MemoryFilmstrip';
import { useMemories } from './hooks/useMemories';
import { useReactions } from '@/shared/Post/useReactions';
import { useComments } from '@/shared/Post/useComments';
import { MEMORIES_PAGE_CONTENT } from './content';
import styles from './Memoriespage.module.css';
import { Navbar } from '@/shared/Navbar/Navbar';
import { CommentsProvider } from '@/shared/Post/component/CommentContext';

export default function MemoriesPage() {
    // 1. Prendi addReply direttamente da useMemories
    const { memories, selectedMemory, selectedId, selectMemory, addComment, addReply } = useMemories();

    const { userReaction, showReactionPicker, floatingEmojis, toggleReaction, toggleReactionPicker } =
        useReactions(selectedId);

    // 2. Rimosso submitReply da useComments per evitare confusione
    const { showComments, toggleComments, newCommentText, setNewCommentText, submitComment } =
        useComments(selectedId, addComment, addReply);

    const userAvatarUrl = 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=120&q=80';

    return (
        <div className={styles.page}>
            <AmbientBackground
                imageKey={selectedMemory?.id ?? 'none'}
                imageUrl={selectedMemory?.imageUrl}
            />

            <Navbar
                activeHref="/"
                ctaLabel="Aggiungi Ricordo"
                onCtaClick={() => {}}
                avatarUrl={userAvatarUrl}
                avatarAlt="Il tuo profilo"
            />

            <div className={styles.content}>
                <div className={styles.hero}>
                    <span className={styles.heroEyebrow}>{MEMORIES_PAGE_CONTENT.hero.eyebrow}</span>
                    <h1 className={styles.heroTitle}>{MEMORIES_PAGE_CONTENT.hero.title}</h1>
                </div>

                {/* 3. Passa addReply (quella di useMemories) a CommentsProvider */}
                <CommentsProvider onAddReply={addReply}>
                    <MemorySpotlight
                        memory={selectedMemory}
                        floatingEmojis={floatingEmojis}
                        onClose={() => selectMemory(null)}
                        userReaction={userReaction}
                        showReactionPicker={showReactionPicker}
                        onTogglePicker={toggleReactionPicker}
                        onToggleReaction={toggleReaction}
                        showComments={showComments}
                        onToggleComments={toggleComments}
                        newCommentText={newCommentText}
                        onChangeCommentText={setNewCommentText}
                        onSubmitComment={submitComment}
                    />
                </CommentsProvider>

                <MemoryFilmstrip
                    memories={memories}
                    selectedId={selectedMemory?.id ?? null}
                    onSelect={selectMemory}
                />
            </div>
        </div>
    );
}