import { AmbientBackground } from './components/AmbientBackground';
import { MemorySpotlight } from './sections/MemorySpotlight';
import { MemoryFilmstrip } from './sections/MemoryFilmstrip';
import { useMemories } from './hooks/useMemories';
import { useReactions } from './hooks/useReactions';
import { useComments } from './hooks/useComments';
import { MEMORIES_PAGE_CONTENT } from './content';
import styles from './Memoriespage.module.css';

export default function MemoriesPage() {
    const { memories, selectedMemory, selectedId, selectMemory, addComment } = useMemories();

    const { userReaction, showReactionPicker, floatingEmojis, toggleReaction, toggleReactionPicker } =
        useReactions(selectedId);

    const { showComments, toggleComments, newCommentText, setNewCommentText, submitComment } =
        useComments(selectedId, addComment);

    return (
        <div className={styles.page}>
            {selectedMemory && (
                <AmbientBackground imageKey={selectedMemory.id} imageUrl={selectedMemory.imageUrl} />
            )}

            {/* La Navbar condivisa (src/shared/components/Navbar) verrà agganciata qui
                in un secondo momento, come da accordo. */}

            <div className={styles.content}>
                <div className={styles.hero}>
                    <span className={styles.heroEyebrow}>{MEMORIES_PAGE_CONTENT.hero.eyebrow}</span>
                    <h1 className={styles.heroTitle}>{MEMORIES_PAGE_CONTENT.hero.title}</h1>
                </div>

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


                <MemoryFilmstrip
                    memories={memories}
                    selectedId={selectedMemory?.id ?? null}
                    onSelect={selectMemory}
                />
            </div>
        </div>
    );
}