import { useState } from 'react';
import { TIMELINE_MEMORIES } from '@/pages/app/InteractiveTimeline/memoriesMock';
import type { Comment, MemoryItem } from '@/shared/Post/types';

export function useHomeFeed() {
    const [posts, setPosts] = useState<MemoryItem[]>(TIMELINE_MEMORIES);

    function addComment(postId: string, comment: Comment) {
        setPosts((prev) =>
            prev.map((post) =>
                post.id === postId
                    ? { ...post, comments: [...post.comments, comment] }
                    : post,
            ),
        );
    }

    function addReply(parentId: string, text: string) {
        const newReply: Comment = {
            id: Date.now().toString(),
            author: 'Tu',
            avatar: '/avatar.jpg', // Sostituisci con il percorso del tuo avatar
            date: 'Ora',
            text,
            likesCount: 0,
            parentId: parentId,
            replies: [],
        };

        const updateTree = (list: Comment[]): Comment[] =>
            list.map((item) => {
                if (item.id === parentId) {
                    return { ...item, replies: [...(item.replies || []), newReply] };
                }
                if (item.replies?.length) {
                    return { ...item, replies: updateTree(item.replies) };
                }
                return item;
            });

        setPosts((prev) =>
            prev.map((post) => ({
                ...post,
                comments: updateTree(post.comments || []),
            })),
        );
    }

    return { posts, addComment, addReply };

}