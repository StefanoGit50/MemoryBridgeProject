import { useMemo, useState } from 'react';
import { TIMELINE_MEMORIES } from "@/pages/app/InteractiveTimeline/memoriesMock";
import type { Comment, MemoryItem } from '../types';

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

    return {
        memories,
        selectedMemory,
        selectedId,
        selectMemory,
        addComment,
    };
}