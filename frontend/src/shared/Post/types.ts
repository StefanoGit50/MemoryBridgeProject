export interface Comment {
    id: string;
    author: string;
    avatar: string;
    date: string;
    text: string;
    likesCount: number;
    parentId?: string | null;
    replies?: Comment[];
}

export interface MemoryItem {
    id: string;
    year: number;
    catalogCode: string;
    dateStr: string;
    authorName: string;
    authorAvatar: string;
    title: string;
    story: string;
    imageUrl: string;
    likesCount: number;
    comments: Comment[];
    relationLabel?: string;
    spouseName?: string;
    spousePersonId?: string;
    eventLabel?: string;
    location?: string;
}

export interface FloatingEmoji {
    id: number;
    emoji: string;
    leftOffset: number;
}