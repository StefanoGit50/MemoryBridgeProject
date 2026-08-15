import { AnimatePresence } from 'framer-motion';
import type { Comment, FloatingEmoji, MemoryItem } from '../types';
import { MemoryPhotoPanel } from '../components/MemoryPhotoPanel';
import { MemoryDetailsPanel } from '../components/MemoryDetailsPanel';
import styles from './MemorySpotlight.module.css';

interface MemorySpotlightProps {
    memory: MemoryItem | null;
    onClose: () => void;
    floatingEmojis: FloatingEmoji[];
    userReaction: string | null;
    showReactionPicker: boolean;
    onTogglePicker: () => void;
    onToggleReaction: (emoji: string) => void;
    showComments: boolean;
    onToggleComments: () => void;
    newCommentText: string;
    onChangeCommentText: (text: string) => void;
    onSubmitComment: (e: React.FormEvent) => void;
}

export function MemorySpotlight({
                                    memory,
                                    onClose,
                                    floatingEmojis,
                                    userReaction,
                                    showReactionPicker,
                                    onTogglePicker,
                                    onToggleReaction,
                                    showComments,
                                    onToggleComments,
                                    newCommentText,
                                    onChangeCommentText,
                                    onSubmitComment,
                                }: MemorySpotlightProps) {
    return (
        <div>
            <AnimatePresence mode="wait">
                {memory && (
                    <div key={memory.id} className={styles.grid}>
                        <MemoryPhotoPanel memory={memory} floatingEmojis={floatingEmojis} />
                        <MemoryDetailsPanel
                            memory={memory}
                            onClose={onClose}
                            reactionBar={{
                                userReaction,
                                showReactionPicker,
                                onTogglePicker,
                                onToggleReaction,
                            }}
                            comments={{
                                showComments,
                                onToggleComments,
                                newCommentText,
                                onChangeText: onChangeCommentText,
                                onSubmit: onSubmitComment,
                            }}
                        />
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
}