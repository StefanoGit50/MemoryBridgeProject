export const REACTIONS_CONTENT = {
    reactedLabel: 'Hai reagito',
    reactLabel: 'Reagisci',
    defaultEmoji: '🤍',
    pickerButtonAriaLabel: 'Scegli una reazione',
    countSuffix: 'reazioni',
} as const;

/**
 * tipo per creare l'anteprima del post
 */
export const CREATE_MEMORY_CONTENT = {
    stepIndicator: {
        step1: '1. Contenuto',
        step2: '2. Dettagli',
        step3: '3. Anteprima & Iris ✨',
    },
    exitButtonLabel: '✕ Chiudi',

    contentTypeStep: {
        title: 'Che tipo di contenuto vuoi condividere?',
        typeLabels: {
            audio: 'audio',
            video: 'video',
            immagine: 'immagine',
        },
        audio: {
            prompt: 'Premi per registrare la tua nota vocale',
            startButton: '🎙️ Registra Voce',
            stopButton: '■ Interrompi',
            recordedLabel: '✓ Nota vocale registrata!',
            reRecordButton: '🗑️ Elimina e Registra di nuovo',
            micPermissionError: 'Impossibile accedere al microfono. Verifica i permessi nel browser.',
        },
        video: {
            prompt: 'Carica un file video',
            uploadButton: '📁 Sfoglia Video',
            selectedPrefix: 'Selezionato:',
        },
        immagine: {
            prompt: "Seleziona un'immagine dalla galleria",
            uploadButton: '🖼 Carica Foto',
        },
        nextButton: 'Avanti →',
    },

    detailsStep: {
        title: 'Aggiungi i dettagli del ricordo',
        locationLabel: '📍 DOVE TI TROVAVI?',
        locationPlaceholder: 'Es. Spiaggia di Positano, Casa della nonna...',
        peopleLabel: '👥 CON CHI ERI?',
        quickPeopleOptions: ['Famiglia 👨‍👩‍👧', 'Amici 🥳', 'Partner ❤️', 'Da solo 🧘‍♂️', 'Colleghi 💼'],
        customPersonPlaceholder: '+ Aggiungi un nome e premi Invio...',
        descriptionLabel: '📝 RACCONTA QUESTO MOMENTO',
        descriptionPlaceholder: 'Scrivi qui la tua storia o un pensiero speciale su questo ricordo...',
        backButton: '← Indietro',
        nextButton: 'Chiedi un consiglio ad Iris ✨',
    },

    processing: {
        title: "Iris sta organizzando l'anteprema...",
        subtitle: 'Stiamo elaborando la bozza del post e preparando gli spunti di riflessione.',
    },

    previewStep: {
        currentUserName: 'Shila Han',
        postColumn: {
            header: '📸 ANTEPRIMA POST',
            videoPreviewLabel: '📹 Anteprima Video',
            noMediaLabel: '[ Nessun media inserito ]',
            noDescriptionPlaceholder: 'Nessuna descrizione ancora inserita. Modificala dalla colonna centrale.',
            playAudioButton: 'RIPRODUCI AUDIO',
            pauseAudioButton: 'PAUSA AUDIO',
        },
        editorColumn: {
            header: '📝 EDITORE DESCRIZIONE',
            subtitle:
                'Modifica la tua storia in tempo reale. Le modifiche verranno mostrate subito nell\'anteprema a sinistra:',
            descriptionPlaceholder: 'Scrivi qui la tua descrizione...',
        },
        irisColumn: {
            header: 'SPUNTI DI IRIS',
            subtitle: "Domande guida per aiutarti a trovare l'ispirazione e arricchire il tuo racconto:",
            tips: [
                "C'è una frase anche banale che ti ha fatto sentire in un certo modo?",
                'Che ricordo, anche doloroso o felice, ti ha attraversato la mente?',
                'Quale dettaglio sensoriale (un profumo, una luce, un suono) rende unico questo momento?',
                'Se dovessi riaprire questo ricordo tra 10 anni, quale sensazione vorresti ritrovare?',
            ],
        },
        backButton: '← Modifica Dettagli',
        publishButton: 'PUBBLICA RICORDO ✨',
    },
} as const;
