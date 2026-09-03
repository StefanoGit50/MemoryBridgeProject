import { useEffect, useState } from 'react';
import { MEMORIES_PAGE_CONTENT } from '@/pages/app/InteractiveTimeline/content';
import type { Comment } from './types';

/**
 * Custom Hook per la gestione dello stato dell'interfaccia e della creazione dei commenti.
 *
 * Si occupa di:
 * - Tracciare e alternare la visibilità della sezione commenti (`showComments`).
 * - Gestire lo stato del testo inserito nel campo di input (`newCommentText`).
 * - Resettare automaticamente lo stato dell'input e la visibilità quando cambia il ricordo selezionato.
 * - Formattare un nuovo oggetto {@link Comment} e inviarlo tramite la callback `onAddComment`.
 *
 * @param selectedId - L'ID del ricordo attualmente attivo/selezionato, o `null` se nessuno è attivo.
 * @param onAddComment - Callback invocata per aggiungere il nuovo commento allo stato globale.
 *
 * @returns Un oggetto contenente:
 * - `showComments`: Stato booleano di visibilità della sezione commenti.
 * - `toggleComments`: Funzione per mostrare/nascondere la sezione commenti.
 * - `newCommentText`: Il testo attualmente digitato nel campo d'inserimento.
 * - `setNewCommentText`: Setter per aggiornare manualmente il testo dell'input.
 * - `submitComment`: Event handler per la gestione del submit del form di invio.
 */
export function useComments(
    selectedId: string | null,
    onAddComment: (memoryId: string, comment: Comment) => void,
) {
    const [showComments, setShowComments] = useState<boolean>(false);
    const [newCommentText, setNewCommentText] = useState<string>('');

    // Reset dell'input ogni volta che cambia il ricordo selezionato.
    useEffect(() => {
        setShowComments(false);
        setNewCommentText('');
    }, [selectedId]);

    function toggleComments() {
        setShowComments((prev) => !prev);
    }

    /**
     * Gestisce l'invio del form, crea il nuovo oggetto commento e invoca la callback di salvataggio.
     *
     * @param event - L'evento di sottomissione del form React.
     */
    function submitComment(event: React.FormEvent) {
        event.preventDefault();
        if (!newCommentText.trim() || !selectedId) return;

        const newComment: Comment = {
            id: Date.now().toString(),
            author: MEMORIES_PAGE_CONTENT.comments.guestAuthorName,
            avatar: MEMORIES_PAGE_CONTENT.comments.guestAuthorAvatar,
            date: MEMORIES_PAGE_CONTENT.comments.justNowLabel,
            text: newCommentText,
            likesCount: 0
        };

        onAddComment(selectedId, newComment);
        setNewCommentText('');
    }

    return {
        showComments,
        toggleComments,
        newCommentText,
        setNewCommentText,
        submitComment,
    };
}