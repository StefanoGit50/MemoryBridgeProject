import { useEffect, useState } from 'react';
import { MEMORIES_PAGE_CONTENT } from '@/pages/app/InteractiveTimeline/content';
import type { Comment } from './types';

export function useComments(
    selectedId: string | null,
    onAddComment: (memoryId: string, comment: Comment) => void,
    onAddReplyToMemory?: (memoryId: string, parentId: string, reply: Comment) => void, // 👈 Facoltativo per retrocompatibilità
) {
    const [showComments, setShowComments] = useState<boolean>(false);
    const [newCommentText, setNewCommentText] = useState<string>('');

    useEffect(() => {
        setShowComments(false);
        setNewCommentText('');
    }, [selectedId]);

    function toggleComments() {
        setShowComments((prev) => !prev);
    }

    function submitComment(event: React.FormEvent) {
        event.preventDefault();
        if (!newCommentText.trim() || !selectedId) return;

        const newComment: Comment = {
            id: Date.now().toString(),
            author: MEMORIES_PAGE_CONTENT.comments.guestAuthorName,
            avatar: MEMORIES_PAGE_CONTENT.comments.guestAuthorAvatar,
            date: MEMORIES_PAGE_CONTENT.comments.justNowLabel,
            text: newCommentText,
            likesCount: 0,
            replies: []
        };

        onAddComment(selectedId, newComment);
        setNewCommentText('');
    }

    /**
     * Gestisce la creazione e l'invio di una risposta a un commento esistente.
     */
    function submitReply(parentId: string, replyText: string) {
        if (!replyText.trim() || !selectedId) return;

        const newReply: Comment = {
            id: Date.now().toString(),
            author: MEMORIES_PAGE_CONTENT.comments.guestAuthorName,
            avatar: MEMORIES_PAGE_CONTENT.comments.guestAuthorAvatar,
            date: MEMORIES_PAGE_CONTENT.comments.justNowLabel,
            text: replyText,
            likesCount: 0,
            parentId: parentId,
            replies: []
        };

        // Se hai una funzione esterna passata dalle memorie, usala, altrimenti gestiamo l'evento
        if (onAddReplyToMemory) {
            onAddReplyToMemory(selectedId, parentId, newReply);
        }
    }

    return {
        showComments,
        toggleComments,
        newCommentText,
        setNewCommentText,
        submitComment,
        submitReply, // 👈 Esportiamo questa funzione!
    };
}