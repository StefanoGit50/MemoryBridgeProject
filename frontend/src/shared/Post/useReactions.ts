import { useEffect, useRef, useState } from 'react';
import type { FloatingEmoji } from './types';

export function useReactions(selectedId: string | null) {
    const [userReaction, setUserReaction] = useState<string | null>(null);
    const [showReactionPicker, setShowReactionPicker] = useState<boolean>(false);
    const [floatingEmojis, setFloatingEmojis] = useState<FloatingEmoji[]>([]);
    const timeoutsRef = useRef<Set<ReturnType<typeof setTimeout>>>(new Set());

    // Reset dello stato reazioni ogni volta che cambia il ricordo selezionato,
    // replica il comportamento di handleSelectMemory nel monolite originale.
    useEffect(() => {
        setUserReaction(null);
        setShowReactionPicker(false);
        setFloatingEmojis([]);
    }, [selectedId]);

    // Pulizia di tutti i timeout pendenti allo smontaggio, per evitare il leak
    // segnalato nel refactor (setState dopo unmount).
    useEffect(() => {
        const timeouts = timeoutsRef.current;
        return () => {
            timeouts.forEach((timeoutId) => clearTimeout(timeoutId));
            timeouts.clear();
        };
    }, []);

    function toggleReaction(emoji: string) {
        if (userReaction === emoji) {
            setUserReaction(null);
        } else {
            setUserReaction(emoji);
            const newFloating: FloatingEmoji = {
                id: Date.now(),
                emoji,
                leftOffset: Math.random() * 60 + 20,
            };
            setFloatingEmojis((prev) => [...prev, newFloating]);

            const timeoutId = setTimeout(() => {
                setFloatingEmojis((prev) => prev.filter((item) => item.id !== newFloating.id));
                timeoutsRef.current.delete(timeoutId);
            }, 1800);
            timeoutsRef.current.add(timeoutId);
        }
        setShowReactionPicker(false);
    }

    function toggleReactionPicker() {
        setShowReactionPicker((prev) => !prev);
    }

    return {
        userReaction,
        showReactionPicker,
        floatingEmojis,
        toggleReaction,
        toggleReactionPicker,
    };
}