import { useMemo, useState } from 'react';
import { TIMELINE_MEMORIES } from "@/pages/app/InteractiveTimeline/memoriesMock";
import type { Comment, MemoryItem } from '@/shared/Post/types';

/**
 * Custom Hook per la gestione dello stato dei ricordi, della selezione attiva e dei relativi commenti.
 *
 * @returns Un oggetto contenente:
 * - `memories`: L'elenco aggiornato di tutti i ricordi.
 * - `selectedMemory`: L'oggetto {@link MemoryItem} del ricordo attualmente in evidenza, o `null`.
 * - `selectedId`: L'ID del ricordo selezionato, oppure `null`.
 * - `selectMemory`: Funzione per cambiare il ricordo selezionato.
 * - `addComment`: Funzione per aggiungere un nuovo commento a uno specifico ricordo.
 * - `addReply`: Funzione per aggiungere una risposta a un commento ricorsivo.
 */
export function useMemories() {
    const [memories, setMemories] = useState<MemoryItem[]>(TIMELINE_MEMORIES);
    const [selectedId, setSelectedId] = useState<string | null>(memories[0]?.id ?? null);

    const selectedMemory = useMemo(
        () => memories.find((memory) => memory.id === selectedId) ?? null,
        [memories, selectedId],
    );

    /**
     * Imposta un nuovo ricordo come selezionato oppure deseleziona l'attuale.
     *
     * @param id - L'ID del ricordo da selezionare, o `null` per chiudere la selezione.
     */
    function selectMemory(id: string | null) {
        setSelectedId(id);
    }

    /**
     * Aggiunge in modo immutabile un nuovo commento alla lista dei commenti di un ricordo.
     *
     * @param memoryId - L'ID del ricordo a cui aggiungere il commento.
     * @param comment - L'oggetto {@link Comment} da inserire.
     */
    function addComment(memoryId: string, comment: Comment) {
        setMemories((prev) =>
            prev.map((memory) =>
                memory.id === memoryId
                    ? { ...memory, comments: [...memory.comments, comment] }
                    : memory,
            ),
        );
    }

    function addReplyToComment(comments: Comment[], parentId: string, newReply: Comment): Comment[] {
        return comments.map((comment) => {
            if (comment.id === parentId) {
                return {
                    ...comment,
                    replies: [...(comment.replies || []), newReply],
                };
            }
            if (comment.replies && comment.replies.length > 0) {
                return {
                    ...comment,
                    replies: addReplyToComment(comment.replies, parentId, newReply),
                };
            }
            return comment;
        });
    }

    /**
     * Aggiunge una risposta a un commento (anche nidificato) sfruttando la funzione ricorsiva.
     */
    function addReply(memoryId: string, parentId: string, newReply: Comment) {
        setMemories((prev) =>
            prev.map((memory) => {
                if (memory.id !== memoryId) return memory;
                return {
                    ...memory,
                    comments: addReplyToComment(memory.comments, parentId, newReply),
                };
            }),
        );
    }

    return {
        memories,
        selectedMemory,
        selectedId,
        selectMemory,
        addComment,
        addReply, // 👈 Esportiamo la funzione qui!
    };
}