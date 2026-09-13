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

// TIPI MULTIMEDIALI

export type ContentType = 'audio' | 'video' | 'immagine' | null;

export type WizardStep = 1 | 2 | 3;

export interface MemoryDraft {
    type: ContentType;
    file: File | null;
    previewUrl: string | null;
    location: string;
    people: string[];
    description: string;
    createdAt: string;
}

export interface CreateMemoryScreenProps {
    onClose?: () => void;
    onSave?: (memoryData: MemoryDraft) => void;
}
