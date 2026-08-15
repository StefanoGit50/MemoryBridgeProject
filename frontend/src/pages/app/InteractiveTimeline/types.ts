// src/pages/app/memories/types.ts

export interface Comment {
    id: string;
    author: string;
    avatar: string;
    date: string;
    text: string;
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
}

export interface FloatingEmoji {
    id: number;
    emoji: string;
    leftOffset: number;
}