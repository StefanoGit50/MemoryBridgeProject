import type { MemoryItem, Comment } from '@/shared/Post/types';
import { PostCard } from '../Component/PostCard';
import styles from './MemoryFeed.module.css';

interface MemoryFeedProps {
    posts: MemoryItem[];
    onAddComment: (postId: string, comment: Comment) => void;
}

export function MemoryFeed({ posts, onAddComment }: MemoryFeedProps) {
    return (
        <div className={styles.feed}>
            {posts.map((post) => (
                <PostCard key={post.id} post={post} onAddComment={onAddComment} />
            ))}
        </div>
    );
}