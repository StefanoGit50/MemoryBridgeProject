import { useEffect, useState } from 'react';
import { MEMORIES_PAGE_CONTENT } from '../content';
import type { Comment } from '../types';

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

    function submitComment(event: React.FormEvent) {
        event.preventDefault();
        if (!newCommentText.trim() || !selectedId) return;

        const newComment: Comment = {
            id: Date.now().toString(),
            author: MEMORIES_PAGE_CONTENT.comments.guestAuthorName,
            avatar: MEMORIES_PAGE_CONTENT.comments.guestAuthorAvatar,
            date: MEMORIES_PAGE_CONTENT.comments.justNowLabel,
            text: newCommentText,
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