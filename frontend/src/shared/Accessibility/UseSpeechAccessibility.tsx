import { useState, useCallback, useEffect } from 'react';

export function useSpeechSynthesis() {
    const [isSpeaking, setIsSpeaking] = useState(false);

    useEffect(() => {
        return () => {
            window.speechSynthesis?.cancel();
        };
    }, []);

    const toggleSpeech = useCallback((text: string, lang = 'it-IT') => {
        if (!('speechSynthesis' in window)) {
            alert('La sintesi vocale non è supportata da questo browser.');
            return;
        }

        if (isSpeaking) {
            window.speechSynthesis.cancel();
            setIsSpeaking(false);
            return;
        }

        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = lang;
        utterance.onend = () => setIsSpeaking(false);
        window.speechSynthesis.speak(utterance);
        setIsSpeaking(true);
    }, [isSpeaking]);

    return { isSpeaking, toggleSpeech };
}