import { useMemo, useState } from 'react';
import { TIMELINE_MEMORIES } from "@/pages/app/InteractiveTimeline/memoriesMock";
import type { Comment, MemoryItem } from '@/shared/Post/types';

export function useMemories() {
    const [memories, setMemories] = useState<MemoryItem[]>(TIMELINE_MEMORIES);
    const [selectedId, setSelectedId] = useState<string | null>(memories[0]?.id ?? null);

    const selectedMemory = useMemo(
        () => memories.find((memory) => memory.id === selectedId) ?? null,
        [memories, selectedId],
    );

    function selectMemory(id: string | null) {
        setSelectedId(id);
    }

    function addComment(memoryId: string, comment: Comment) {
        setMemories((prev) =>
            prev.map((memory) =>
                memory.id === memoryId
                    ? { ...memory, comments: [...memory.comments, comment] }
                    : memory,
            ),
        );
    }

    // Helper ricorsivo con cast String() per evitare bug tra numeri e stringhe
    function addReplyToComment(comments: Comment[], parentId: string, newReply: Comment): Comment[] {
        return comments.map((comment) => {
            if (String(comment.id) === String(parentId)) { // 👈 String() risolve il problema dei dati mock
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

    function addReply(parentId: string, text: string) {
        const newReply: Comment = {
            id: Date.now().toString(),
            author: 'Tu',
            avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=120&q=80',
            date: 'Ora',
            text,
            likesCount: 0,
            parentId,
            replies: [],
        };

        setMemories((prev) =>
            prev.map((memory) => ({
                ...memory,
                comments: addReplyToComment(memory.comments || [], parentId, newReply),
            })),
        );
    }

    return {
        memories,
        selectedMemory,
        selectedId,
        selectMemory,
        addComment,
        addReply,
    };
}