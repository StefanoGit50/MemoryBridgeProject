import React from 'react';
import { useSpeech } from './SpeechContext';
import { useAccessibilitySettings } from '@/shared/Accessibility/AccessibilityDial';
import styles from './SpeechButton.module.css';

function cx(...classes: (string | false | undefined)[]) {
    return classes.filter(Boolean).join(' ');
}

interface SpeechButtonProps {
    /** Identificatore univoco del testo da leggere (es. id del ricordo) */
    id: string;
    text: string;
    lang?: string;
}

export function SpeechButton({ id, text, lang }: SpeechButtonProps) {
    const { toggleSpeech, isSpeaking } = useSpeech();
    const { highContrast } = useAccessibilitySettings();
    const speaking = isSpeaking(id);

    return (
        <button
            onClick={() => toggleSpeech(id, text, lang)}
            className={cx(styles.button, highContrast && styles.highContrast, speaking && styles.speaking)}
        >
            {speaking ? '🛑 Ferma Lettura Vocale' : '🔊 Ascolta Racconto A Voce'}
        </button>
    );
}