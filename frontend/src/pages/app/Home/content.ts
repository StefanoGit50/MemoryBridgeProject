export const HOME_PAGE_CONTENT = {
    createBox: {
        promptLead: 'Cosa vuoi condividere oggi?',
        promptCta: '(Clicca qui)',
        recordButton: 'Registra con Guida Vocale',
        uploadButton: 'Carica Foto o Documento',
    },
    interview: {
        title: 'Assistente Guidato Raccolta Ricordi',
        closeAriaLabel: 'Chiudi assistente',
        stepLabel: 'Passaggio',
        ofLabel: 'di',
        recordStart: '🎙️ Premi qui e parla a voce',
        recordStop: '🔴 Interrompi Registrazione',
        recordingHint: '🎙️ Sto ascoltando la tua voce... parla pure liberamente!',
        back: '← Indietro',
        next: 'Avanti →',
        save: '💾 Salva per la Famiglia',
        saveConfirmation: 'Ricordo salvato e condiviso con tutta la famiglia!',
    },
    questions: [
        { id: 'who', question: 'Chi c\'è in questa fotografia o in questo ricordo?', placeholder: 'Es. Nonno Orazio, Cugino Antonio...' },
        { id: 'when', question: 'In che anno o occasione speciale è successo?', placeholder: 'Es. Matrimonio del 1965, Estate a Salerno...' },
        { id: 'story', question: 'Racconta cosa vi stavate dicendo o un aneddoto speciale:', placeholder: 'Premi il microfono se preferisci parlare a voce!' },
    ],
    comments: {
        inputPlaceholder: 'Aggiungi un commento...',
        submitLabel: 'Pubblica',
    },
    voiceNote: {
        speak: '🔊 Ascolta Racconto A Voce',
        stopSpeak: '🛑 Ferma Lettura Vocale',
    },
} as const;