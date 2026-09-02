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

    return { posts, addComment };
}