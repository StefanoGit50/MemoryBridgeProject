import { useState } from 'react';

export function usePeopleTags() {
    const [peopleTags, setPeopleTags] = useState<string[]>([]);
    const [customPerson, setCustomPerson] = useState('');

    function toggleQuickTag(tag: string) {
        setPeopleTags((prev) => (prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]));
    }

    function handleCustomPersonKeyDown(e: React.KeyboardEvent) {
        if (e.key !== 'Enter' || !customPerson.trim()) return;
        e.preventDefault();

        const trimmed = customPerson.trim();
        setPeopleTags((prev) => (prev.includes(trimmed) ? prev : [...prev, trimmed]));
        setCustomPerson('');
    }

    return {
        peopleTags,
        customPerson,
        setCustomPerson,
        toggleQuickTag,
        handleCustomPersonKeyDown,
    };
}
