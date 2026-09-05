import React, { createContext, useContext, useState, useEffect, useCallback, useRef, ReactNode } from 'react';

interface SpeechContextValue {
    speakingId: string | null;
    toggleSpeech: (id: string, text: string, lang?: string) => void;
    isSpeaking: (id: string) => boolean;
}

const SpeechContext = createContext<SpeechContextValue | null>(null);

export function SpeechProvider({ children }: { children: ReactNode }) {
    const [speakingId, setSpeakingId] = useState<string | null>(null);
    // Mantiene un riferimento all'utterance per evitare che Chrome la distrugga via Garbage Collector
    const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);

    const stopCurrentSpeech = useCallback(() => {
        if ('speechSynthesis' in window) {
            if (utteranceRef.current) {
                // Rimuove gli handler per evitare che scattino durante la cancellazione manuale
                utteranceRef.current.onend = null;
                utteranceRef.current.onerror = null;
            }
            window.speechSynthesis.cancel();
        }
        utteranceRef.current = null;
    }, []);

    // Cleanup completo se il provider si smonta (es. cambio pagina)
    useEffect(() => {
        return () => {
            stopCurrentSpeech();
        };
    }, [stopCurrentSpeech]);

    const toggleSpeech = useCallback((id: string, text: string, lang = 'it-IT') => {
        if (!('speechSynthesis' in window)) {
            alert('La sintesi vocale non è supportata da questo browser.');
            return;
        }

        // Se clicchiamo sullo STESSO elemento che sta parlando: stoppiamo
        if (speakingId === id) {
            stopCurrentSpeech();
            setSpeakingId(null);
            return;
        }

        // Se sta parlando un ALTRO elemento: stoppiamo quello vecchio prima di far partire il nuovo
        stopCurrentSpeech();

        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = lang;

        const handleFinish = () => {
            // Rimuove lo stato solo se è ancora QUESTO id a parlare
            setSpeakingId((currentId) => (currentId === id ? null : currentId));
            utteranceRef.current = null;
        };

        utterance.onend = handleFinish;
        utterance.onerror = handleFinish;

        utteranceRef.current = utterance;
        setSpeakingId(id);

        window.speechSynthesis.speak(utterance);
    }, [speakingId, stopCurrentSpeech]);

    const isSpeaking = useCallback((id: string) => speakingId === id, [speakingId]);

    return (
        <SpeechContext.Provider value={{ speakingId, toggleSpeech, isSpeaking }}>
            {children}
        </SpeechContext.Provider>
    );
}

export function useSpeech() {
    const ctx = useContext(SpeechContext);
    if (!ctx) {
        throw new Error('useSpeech deve stare dentro <SpeechProvider>');
    }
    return ctx;
}