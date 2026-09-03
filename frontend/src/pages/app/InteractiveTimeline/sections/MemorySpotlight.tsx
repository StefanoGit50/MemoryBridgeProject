import { AnimatePresence } from 'framer-motion';
import type { FloatingEmoji, MemoryItem } from '@/shared/Post/types';
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
    onAddReply: (parentId: string, text: string) => void;
}

/**
 * Componente layout "Spotlight" per la visualizzazione dettagliata di un ricordo selezionato.
 *
 * Si occupa di:
 * - Gestire le animazioni fluide di entrata/uscita tramite `framer-motion` (`AnimatePresence`).
 * - Suddividere la vista in una griglia a due colonne (`MemoryPhotoPanel` a sinistra, `MemoryDetailsPanel` a destra).
 * - Raggruppare e distribuire lo stato globale e le callback ai sotto-componenti responsabili delle foto, delle reazioni e dei commenti.
 *
 * @param props - Oggetto {@link MemorySpotlightProps} contenente i dati del ricordo e i gestori degli eventi.
 * @returns Elemento JSX contenente la griglia animata del ricordo o `null` se nessun ricordo è selezionato.
 */
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
                                    onAddReply,
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
                                onAddReply: onAddReply,
                            }}
                        />
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
}