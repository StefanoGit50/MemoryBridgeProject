import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

type ContentType = 'audio' | 'video' | 'immagine' | null;

interface CreateMemoryPageProps {
    onClose?: () => void;
    onSave?: (memoryData: any) => void;
}

export function CreateMemoryScreen({ onClose, onSave }: CreateMemoryPageProps) {
    const [step, setStep] = useState<1 | 2 | 3>(1);
    const [contentType, setContentType] = useState<ContentType>('immagine');
    const [isProcessing, setIsProcessing] = useState(false);

    // Media State
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);

    // Audio Recording Real State & Refs
    const [isRecording, setIsRecording] = useState(false);
    const [audioRecorded, setAudioRecorded] = useState(false);
    const [recordingTime, setRecordingTime] = useState(0);
    const mediaRecorderRef = useRef<MediaRecorder | null>(null);
    const audioChunksRef = useRef<Blob[]>([]);
    const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

    // Step 3 Audio Preview State & Ref
    const [isPlayingPreview, setIsPlayingPreview] = useState(false);
    const previewAudioRef = useRef<HTMLAudioElement | null>(null);

    // Step 2 & 3 State
    const [location, setLocation] = useState('');
    const [peopleTags, setPeopleTags] = useState<string[]>([]);
    const [customPerson, setCustomPerson] = useState('');
    const [description, setDescription] = useState('');

    const quickPeopleOptions = ['Famiglia 👨‍👩‍👧', 'Amici 🥳', 'Partner ❤️', 'Da solo 🧘‍♂️', 'Colleghi 💼'];

    const aiTips = [
        "C'è una frase anche banale che ti ha fatto sentire in un certo modo?",
        "Che ricordo, anche doloroso o felice, ti ha attraversato la mente?",
        "Quale dettaglio sensoriale (un profumo, una luce, un suono) rende unico questo momento?",
        "Se dovessi riaprire questo ricordo tra 10 anni, quale sensazione vorresti ritrovare?"
    ];

    useEffect(() => {
        return () => {
            if (timerRef.current) clearInterval(timerRef.current);
        };
    }, []);

    // REGISTRAZIONE AUDIO REALE (MediaRecorder API)
    const startRecording = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            const mediaRecorder = new MediaRecorder(stream);
            mediaRecorderRef.current = mediaRecorder;
            audioChunksRef.current = [];

            mediaRecorder.ondataavailable = (event) => {
                if (event.data.size > 0) {
                    audioChunksRef.current.push(event.data);
                }
            };

            mediaRecorder.onstop = () => {
                const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
                const audioUrl = URL.createObjectURL(audioBlob);
                setPreviewUrl(audioUrl);
                setSelectedFile(new File([audioBlob], 'nota-vocale.webm', { type: 'audio/webm' }));
                setAudioRecorded(true);

                stream.getTracks().forEach(track => track.stop());
            };

            mediaRecorder.start();
            setIsRecording(true);
            setAudioRecorded(false);
            setRecordingTime(0);

            timerRef.current = setInterval(() => {
                setRecordingTime(prev => prev + 1);
            }, 1000);
        } catch (err) {
            console.error("Errore microfono:", err);
            alert("Impossibile accedere al microfono. Verifica i permessi nel browser.");
        }
    };

    const stopRecording = () => {
        if (mediaRecorderRef.current && isRecording) {
            mediaRecorderRef.current.stop();
            setIsRecording(false);
            if (timerRef.current) clearInterval(timerRef.current);
        }
    };

    const resetAudioRecording = () => {
        setPreviewUrl(null);
        setSelectedFile(null);
        setAudioRecorded(false);
        setRecordingTime(0);
        setIsPlayingPreview(false);
    };

    const togglePlayPreview = () => {
        if (!previewAudioRef.current) return;
        if (isPlayingPreview) {
            previewAudioRef.current.pause();
            setIsPlayingPreview(false);
        } else {
            previewAudioRef.current.play();
            setIsPlayingPreview(true);
        }
    };

    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    };

    const togglePersonTag = (tag: string) => {
        setPeopleTags(prev =>
            prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]
        );
    };

    const addCustomPerson = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && customPerson.trim()) {
            e.preventDefault();
            if (!peopleTags.includes(customPerson.trim())) {
                setPeopleTags([...peopleTags, customPerson.trim()]);
            }
            setCustomPerson('');
        }
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            setSelectedFile(file);
            setPreviewUrl(URL.createObjectURL(file));
        }
    };

    const handleGoToStep3 = () => {
        setStep(3);
        setIsProcessing(true);
        setTimeout(() => {
            setIsProcessing(false);
        }, 1500);
    };

    const isStep1Valid = Boolean(
        (contentType === 'audio' && audioRecorded) ||
        (contentType === 'video' && selectedFile) ||
        (contentType === 'immagine' && selectedFile) ||
        previewUrl
    );

    const handleSubmit = () => {
        const memoryData = {
            type: contentType,
            file: selectedFile,
            previewUrl,
            location,
            people: peopleTags,
            description,
            createdAt: new Date().toISOString(),
        };
        if (onSave) onSave(memoryData);
    };

    return (
        <div style={styles.fullPageLayout}>
            {/* TOP HEADER */}
            <header style={styles.topHeader}>
                <div style={styles.stepIndicator}>
                    <span style={{ fontWeight: step === 1 ? '700' : '400', color: step === 1 ? '#0284c7' : '#94a3b8' }}>1. Contenuto</span>
                    <span style={{ color: '#cbd5e1' }}> • </span>
                    <span style={{ fontWeight: step === 2 ? '700' : '400', color: step === 2 ? '#0284c7' : '#94a3b8' }}>2. Dettagli</span>
                    <span style={{ color: '#cbd5e1' }}> • </span>
                    <span style={{ fontWeight: step === 3 ? '700' : '400', color: step === 3 ? '#ff8c00' : '#94a3b8' }}>3. Anteprima & Iris ✨</span>
                </div>
                {onClose && (
                    <button style={styles.exitBtn} onClick={onClose}>
                        ✕ Chiudi
                    </button>
                )}
            </header>

            {/* MAIN CONTAINER */}
            <main style={styles.bodyContainer}>
                <AnimatePresence mode="wait">

                    {/* STEP 1 */}
                    {step === 1 && (
                        <motion.div
                            key="step1"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            style={styles.step1CenterBox}
                        >
                            <h1 style={styles.titleText}>Che tipo di contenuto vuoi condividere?</h1>

                            <div style={styles.iconGroup}>
                                <div style={styles.optionItem} onClick={() => { setContentType('audio'); resetAudioRecording(); }}>
                                    <motion.button
                                        whileHover={{ scale: 1.08 }}
                                        whileTap={{ scale: 0.95 }}
                                        style={{
                                            ...styles.roundIconBtn,
                                            backgroundColor: '#4db6ac',
                                            boxShadow: contentType === 'audio' ? '0 0 0 4px #0284c7' : '0 6px 16px rgba(0,0,0,0.1)',
                                        }}
                                    >
                                        <svg width="34" height="34" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2">
                                            <path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3z"/>
                                            <path d="M19 10v2a7 7 0 0 1-14 0v-2"/>
                                            <line x1="12" y1="19" x2="12" y2="22"/>
                                        </svg>
                                    </motion.button>
                                    <span style={{ ...styles.iconText, color: contentType === 'audio' ? '#0284c7' : '#38bdf8' }}>audio</span>
                                </div>

                                <div style={styles.optionItem} onClick={() => { setContentType('video'); setAudioRecorded(false); }}>
                                    <motion.button
                                        whileHover={{ scale: 1.08 }}
                                        whileTap={{ scale: 0.95 }}
                                        style={{
                                            ...styles.roundIconBtn,
                                            backgroundColor: '#e91e63',
                                            boxShadow: contentType === 'video' ? '0 0 0 4px #0284c7' : '0 6px 16px rgba(0,0,0,0.1)',
                                        }}
                                    >
                                        <div style={styles.recBadgeText}>•REC</div>
                                    </motion.button>
                                    <span style={{ ...styles.iconText, color: contentType === 'video' ? '#0284c7' : '#38bdf8' }}>video</span>
                                </div>

                                <div style={styles.optionItem} onClick={() => { setContentType('immagine'); setAudioRecorded(false); }}>
                                    <motion.button
                                        whileHover={{ scale: 1.08 }}
                                        whileTap={{ scale: 0.95 }}
                                        style={{
                                            ...styles.roundIconBtn,
                                            backgroundColor: '#ffffff',
                                            border: '2px solid #2563eb',
                                            boxShadow: contentType === 'immagine' ? '0 0 0 4px #0284c7' : '0 6px 16px rgba(0,0,0,0.1)',
                                        }}
                                    >
                                        <svg width="36" height="36" viewBox="0 0 24 24" fill="#2563eb">
                                            <rect x="3" y="3" width="18" height="18" rx="3" fill="#2563eb"/>
                                            <circle cx="8.5" cy="8.5" r="1.5" fill="#ffffff"/>
                                            <path d="M21 15l-5-5L5 21" stroke="#ffffff" strokeWidth="2"/>
                                        </svg>
                                    </motion.button>
                                    <span style={{ ...styles.iconText, color: contentType === 'immagine' ? '#0284c7' : '#38bdf8' }}>immagine</span>
                                </div>
                            </div>

                            <hr style={styles.blueLine} />

                            <div style={styles.dynamicSection}>
                                {contentType === 'audio' && (
                                    <div style={styles.actionBoxInner}>
                                        {!isRecording && !audioRecorded && (
                                            <>
                                                <p style={styles.actionPrompt}>Premi per registrare la tua nota vocale</p>
                                                <button onClick={startRecording} style={styles.startRecordMicBtn}>
                                                    🎙️ Registra Voce
                                                </button>
                                            </>
                                        )}

                                        {isRecording && (
                                            <div style={styles.voiceRecordContainer}>
                                                <motion.div
                                                    animate={{ scale: [1, 1.25, 1], opacity: [1, 0.4, 1] }}
                                                    transition={{ repeat: Infinity, duration: 0.8 }}
                                                    style={styles.recordingRedDot}
                                                />
                                                <span style={styles.timerText}>{formatTime(recordingTime)}</span>

                                                <div style={styles.waveformBox}>
                                                    {[18, 32, 12, 28, 40, 20, 36, 14, 25, 38, 16, 30].map((h, i) => (
                                                        <motion.div
                                                            key={i}
                                                            animate={{ height: [8, h, 10] }}
                                                            transition={{
                                                                repeat: Infinity,
                                                                duration: 0.4 + (i % 4) * 0.12,
                                                                repeatType: 'reverse',
                                                            }}
                                                            style={styles.waveBar}
                                                        />
                                                    ))}
                                                </div>

                                                <button onClick={stopRecording} style={styles.stopRecordBtn}>
                                                    ■ Interrompi
                                                </button>
                                            </div>
                                        )}

                                        {audioRecorded && previewUrl && (
                                            <div style={styles.recordedAudioBox}>
                                                <p style={{ color: '#0d9488', fontWeight: '700', margin: '0 0 10px 0' }}>
                                                    ✓ Nota vocale registrata!
                                                </p>
                                                <audio src={previewUrl} controls style={styles.audioPlayerStyle} />
                                                <button onClick={resetAudioRecording} style={styles.reRecordBtn}>
                                                    🗑️ Elimina e Registra di nuovo
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                )}

                                {contentType === 'video' && (
                                    <div style={styles.actionBoxInner}>
                                        <p style={styles.actionPrompt}>Carica un file video</p>
                                        <input type="file" accept="video/*" onChange={handleFileChange} id="video-upload-full" style={{ display: 'none' }} />
                                        <label htmlFor="video-upload-full" style={styles.blueUploadBtn}>📁 Sfoglia Video</label>
                                        {selectedFile && <p style={{ color: '#0284c7', fontSize: '15px', marginTop: '10px' }}>Selezionato: {selectedFile.name}</p>}
                                    </div>
                                )}

                                {contentType === 'immagine' && (
                                    <div style={styles.actionBoxInner}>
                                        <p style={styles.actionPrompt}>Seleziona un'immagine dalla galleria</p>
                                        <input type="file" accept="image/*" onChange={handleFileChange} id="image-upload-full" style={{ display: 'none' }} />
                                        <label htmlFor="image-upload-full" style={styles.blueUploadBtn}>🖼 Carica Foto</label>
                                        {previewUrl && (
                                            <img src={previewUrl} alt="Anteprima" style={{ width: '120px', height: '120px', objectFit: 'cover', borderRadius: '12px', marginTop: '14px' }} />
                                        )}
                                    </div>
                                )}
                            </div>

                            <div style={styles.bottomNextWrapper}>
                                <button
                                    onClick={() => setStep(2)}
                                    disabled={!isStep1Valid}
                                    style={{
                                        ...styles.blueNextBtn,
                                        opacity: isStep1Valid ? 1 : 0.4,
                                        cursor: isStep1Valid ? 'pointer' : 'not-allowed',
                                    }}
                                >
                                    Avanti →
                                </button>
                            </div>
                        </motion.div>
                    )}

                    {/* STEP 2 */}
                    {step === 2 && (
                        <motion.div
                            key="step2"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            style={styles.step2FullGrid}
                        >
                            <div style={styles.previewPanel}>
                                <div style={styles.mediaContainer}>
                                    {contentType === 'immagine' && previewUrl && (
                                        <img src={previewUrl} alt="Ricordo" style={styles.fullMediaImg} />
                                    )}
                                    {contentType === 'video' && (
                                        <div style={styles.placeholderMediaText}>📹 Video Caricato</div>
                                    )}
                                    {contentType === 'audio' && previewUrl && (
                                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '14px' }}>
                                            <div style={styles.placeholderMediaText}>🎙️ Nota Vocale Registrata</div>
                                            <audio src={previewUrl} controls style={{ maxWidth: '300px' }} />
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div style={styles.editorPanel}>
                                <h2 style={styles.leftTitleText}>Aggiungi i dettagli del ricordo</h2>

                                <div style={styles.inputGroup}>
                                    <label style={styles.fieldLabel}>📍 DOVE TI TROVAVI?</label>
                                    <input
                                        type="text"
                                        placeholder="Es. Spiaggia di Positano, Casa della nonna..."
                                        value={location}
                                        onChange={(e) => setLocation(e.target.value)}
                                        style={styles.textInput}
                                    />
                                </div>

                                <div style={styles.inputGroup}>
                                    <label style={styles.fieldLabel}>👥 CON CHI ERI?</label>
                                    <div style={styles.tagCloudRow}>
                                        {quickPeopleOptions.map((tag) => (
                                            <button
                                                key={tag}
                                                type="button"
                                                onClick={() => togglePersonTag(tag)}
                                                style={{
                                                    ...styles.personChip,
                                                    backgroundColor: peopleTags.includes(tag) ? '#0284c7' : '#f1f5f9',
                                                    color: peopleTags.includes(tag) ? '#ffffff' : '#334155',
                                                }}
                                            >
                                                {tag}
                                            </button>
                                        ))}
                                    </div>
                                    <input
                                        type="text"
                                        placeholder="+ Aggiungi un nome e premi Invio..."
                                        value={customPerson}
                                        onChange={(e) => setCustomPerson(e.target.value)}
                                        onKeyDown={addCustomPerson}
                                        style={{ ...styles.textInput, marginTop: '8px' }}
                                    />
                                </div>

                                <div style={{ ...styles.inputGroup, flex: 1, display: 'flex', flexDirection: 'column' }}>
                                    <label style={styles.fieldLabel}>📝 RACCONTA QUESTO MOMENTO</label>
                                    <textarea
                                        placeholder="Scrivi qui la tua storia o un pensiero speciale su questo ricordo..."
                                        value={description}
                                        onChange={(e) => setDescription(e.target.value)}
                                        style={styles.giganticTextArea}
                                    />
                                </div>

                                <div style={styles.actionFooter}>
                                    <button onClick={() => setStep(1)} style={styles.grayBackBtn}>
                                        ← Indietro
                                    </button>
                                    <button onClick={handleGoToStep3} style={styles.orangeIrisNextBtn}>
                                        Chiedi un consiglio ad Iris ✨
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    )}

                    {/* STEP 3 */}
                    {step === 3 && (
                        <div style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column' }}>
                            {isProcessing ? (
                                <motion.div
                                    key="processing"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                    style={styles.processingFullWrapper}
                                >
                                    <motion.div
                                        animate={{ rotate: 360, scale: [1, 1.12, 1] }}
                                        transition={{ repeat: Infinity, duration: 2 }}
                                        style={styles.processingIcon}
                                    >
                                        🦉
                                    </motion.div>
                                    <h2 style={styles.processingTitle}>Iris sta organizzando l'anteprema...</h2>
                                    <p style={styles.processingSub}>Stiamo elaborando la bozza del post e preparando gli spunti di riflessione.</p>
                                </motion.div>
                            ) : (
                                <motion.div
                                    key="step3Content"
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    style={styles.step3LayoutFull}
                                >
                                    <div style={styles.gridThreeColumns}>
                                        {/* COL 1 */}
                                        <div style={styles.columnCard}>
                                            <div style={styles.columnHeader}>
                                                <span style={styles.columnHeaderTitle}>📸 ANTEPRIMA POST</span>
                                            </div>

                                            <div style={styles.postCardOuter}>
                                                <div style={styles.postHeaderRow}>
                                                    <div style={styles.userAvatar}>👤</div>
                                                    <div>
                                                        <div style={{ fontWeight: '700', fontSize: '15px', color: '#0f172a' }}>Shila Han</div>
                                                        {location && <div style={{ fontSize: '13px', color: '#0284c7' }}>📍 {location}</div>}
                                                    </div>
                                                </div>

                                                <div style={styles.postImageContainer}>
                                                    {contentType === 'immagine' && previewUrl && (
                                                        <img src={previewUrl} alt="Post preview" style={styles.postImage} />
                                                    )}

                                                    {/* CUSTOM AUDIO PLAYER COME DA WIREFRAME */}
                                                    {contentType === 'audio' && previewUrl && (
                                                        <div style={styles.audioWireframeContainer}>
                                                            <audio
                                                                ref={previewAudioRef}
                                                                src={previewUrl}
                                                                onEnded={() => setIsPlayingPreview(false)}
                                                                style={{ display: 'none' }}
                                                            />

                                                            {/* ONDA SONORA GRAFICA */}
                                                            <div style={styles.staticWaveformRow}>
                                                                {[8, 16, 24, 12, 28, 36, 18, 32, 40, 22, 14, 30, 38, 20, 10, 26, 34, 16, 28, 32, 14, 22, 18, 8].map((h, idx) => (
                                                                    <div key={idx} style={{ ...styles.waveformBarItem, height: `${h}px` }} />
                                                                ))}
                                                            </div>

                                                            {/* PULSANTE BLU "RIPRODUCI AUDIO" */}
                                                            <button onClick={togglePlayPreview} style={styles.playAudioBigBtn}>
                                                                {isPlayingPreview ? 'PAUSA AUDIO' : 'RIPRODUCI AUDIO'}
                                                            </button>
                                                        </div>
                                                    )}

                                                    {contentType === 'video' && (
                                                        <div style={{ fontSize: '15px', color: '#0284c7', fontWeight: '600' }}>📹 Anteprima Video</div>
                                                    )}

                                                    {!previewUrl && (
                                                        <div style={{ fontSize: '14px', color: '#94a3b8' }}>[ Nessun media inserito ]</div>
                                                    )}
                                                </div>

                                                {peopleTags.length > 0 && (
                                                    <div style={styles.postTagsRow}>
                                                        👥 {peopleTags.join(', ')}
                                                    </div>
                                                )}

                                                <div style={styles.postDescriptionArea}>
                                                    {description ? (
                                                        <p style={styles.postTextContent}>{description}</p>
                                                    ) : (
                                                        <p style={styles.postTextPlaceholder}>Nessuna descrizione ancora inserita. Modificala dalla colonna centrale.</p>
                                                    )}
                                                </div>

                                                <div style={styles.postFooterBar}>
                                                    <span style={{ fontSize: '18px', cursor: 'pointer' }}>❤️</span>
                                                    <span style={{ fontSize: '18px', cursor: 'pointer' }}>💬</span>
                                                    <span style={{ fontSize: '18px', cursor: 'pointer' }}>🔗</span>
                                                </div>
                                            </div>
                                        </div>

                                        {/* COL 2 */}
                                        <div style={styles.columnCard}>
                                            <div style={styles.columnHeader}>
                                                <span style={styles.columnHeaderTitle}>📝 EDITORE DESCRIZIONE</span>
                                            </div>

                                            <p style={styles.columnSubtitle}>
                                                Modifica la tua storia in tempo reale. Le modifiche verranno mostrate subito nell'anteprema a sinistra:
                                            </p>

                                            <textarea
                                                value={description}
                                                onChange={(e) => setDescription(e.target.value)}
                                                placeholder="Scrivi qui la tua descrizione..."
                                                style={styles.bigColumnTextArea}
                                            />
                                        </div>

                                        {/* COL 3 */}
                                        <div style={{ ...styles.columnCard, border: '2px solid #ffb74d', backgroundColor: '#fffcf7' }}>
                                            <div style={styles.columnHeader}>
                                                <div style={styles.irisAvatarTitle}>🦉</div>
                                                <span style={{ ...styles.columnHeaderTitle, color: '#ff8c00' }}>SPUNTI DI IRIS</span>
                                            </div>

                                            <p style={styles.columnSubtitle}>
                                                Domande guida per aiutarti a trovare l'ispirazione e arricchire il tuo racconto:
                                            </p>

                                            <div style={styles.irisTipsStack}>
                                                {aiTips.map((tip, idx) => (
                                                    <div key={idx} style={styles.tipCardStatic}>
                                                        <div style={{ fontSize: '18px', color: '#ff8c00' }}>💡</div>
                                                        <div style={{ fontSize: '14px', fontWeight: '500', color: '#334155', lineHeight: '1.4' }}>
                                                            {tip}
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    </div>

                                    {/* FOOTER */}
                                    <div style={styles.bottomBarGlobal}>
                                        <button onClick={() => setStep(2)} style={styles.grayBackBtn}>
                                            ← Modifica Dettagli
                                        </button>

                                        <button onClick={handleSubmit} style={styles.publishBtnHuge}>
                                            PUBBLICA RICORDO ✨
                                        </button>
                                    </div>
                                </motion.div>
                            )}
                        </div>
                    )}

                </AnimatePresence>
            </main>
        </div>
    );
}

const styles: { [key: string]: React.CSSProperties } = {
    fullPageLayout: {
        position: 'fixed',
        inset: 0,
        width: '100vw',
        height: '100vh',
        backgroundColor: '#ffffff',
        zIndex: 999999,
        display: 'flex',
        flexDirection: 'column',
        fontFamily: 'system-ui, -apple-system, sans-serif',
    },
    topHeader: {
        height: '64px',
        padding: '0 32px',
        borderBottom: '1px solid #e2e8f0',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: '#ffffff',
        flexShrink: 0,
    },
    stepIndicator: {
        fontSize: '15px',
    },
    exitBtn: {
        background: 'none',
        border: 'none',
        fontSize: '16px',
        fontWeight: '600',
        color: '#64748b',
        cursor: 'pointer',
    },
    bodyContainer: {
        flex: 1,
        padding: '32px',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        overflowY: 'auto',
    },

    // STEP 1 STYLES
    step1CenterBox: {
        maxWidth: '800px',
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
    },
    titleText: {
        fontSize: '28px',
        fontWeight: '600',
        color: '#2563eb',
        textAlign: 'center',
        marginBottom: '40px',
        fontFamily: 'serif, system-ui',
    },
    iconGroup: {
        display: 'flex',
        justifyContent: 'center',
        gap: '60px',
        marginBottom: '36px',
    },
    optionItem: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        cursor: 'pointer',
    },
    roundIconBtn: {
        width: '90px',
        height: '90px',
        borderRadius: '50%',
        border: 'none',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        cursor: 'pointer',
    },
    recBadgeText: {
        backgroundColor: '#ffffff',
        color: '#e91e63',
        fontWeight: '900',
        fontSize: '13px',
        padding: '4px 8px',
        borderRadius: '4px',
    },
    iconText: {
        marginTop: '14px',
        fontSize: '20px',
        fontWeight: '600',
    },
    blueLine: {
        width: '90%',
        border: 'none',
        borderTop: '2px solid #93c5fd',
        margin: '0 auto 32px auto',
    },
    dynamicSection: {
        minHeight: '140px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
    },
    actionBoxInner: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
    },
    actionPrompt: {
        fontSize: '16px',
        fontWeight: '600',
        color: '#334155',
        marginBottom: '14px',
    },

    startRecordMicBtn: {
        padding: '16px 36px',
        borderRadius: '30px',
        border: 'none',
        backgroundColor: '#4db6ac',
        color: '#ffffff',
        fontWeight: '700',
        fontSize: '17px',
        cursor: 'pointer',
        boxShadow: '0 6px 18px rgba(77, 182, 172, 0.4)',
    },

    // BARRA DI REGISTRAZIONE AUDIO (VERDE STESSO COLORE DEL MICROFONO)
    voiceRecordContainer: {
        display: 'flex',
        alignItems: 'center',
        gap: '16px',
        backgroundColor: '#4db6ac',
        padding: '12px 24px',
        borderRadius: '40px',
        boxShadow: '0 8px 20px rgba(77, 182, 172, 0.35)',
    },
    recordingRedDot: {
        width: '14px',
        height: '14px',
        borderRadius: '50%',
        backgroundColor: '#ff4d4d',
        border: '2px solid #ffffff',
    },
    timerText: {
        fontFamily: 'monospace',
        fontSize: '18px',
        fontWeight: '700',
        color: '#ffffff',
        minWidth: '50px',
    },
    waveformBox: {
        display: 'flex',
        alignItems: 'center',
        gap: '4px',
        height: '40px',
        padding: '0 10px',
    },
    waveBar: {
        width: '4px',
        backgroundColor: '#ffffff',
        borderRadius: '2px',
    },
    stopRecordBtn: {
        backgroundColor: '#ef4444',
        color: '#ffffff',
        border: 'none',
        padding: '10px 20px',
        borderRadius: '20px',
        fontWeight: '700',
        fontSize: '14px',
        cursor: 'pointer',
        boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
    },
    recordedAudioBox: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '8px',
        backgroundColor: '#e6f4f1',
        padding: '16px 24px',
        borderRadius: '20px',
        border: '1px solid #4db6ac',
    },
    audioPlayerStyle: {
        height: '40px',
        outline: 'none',
    },
    reRecordBtn: {
        background: 'none',
        border: 'none',
        color: '#dc2626',
        fontSize: '13px',
        fontWeight: '600',
        cursor: 'pointer',
        textDecoration: 'underline',
        marginTop: '4px',
    },

    blueUploadBtn: {
        padding: '14px 28px',
        backgroundColor: '#0284c7',
        color: '#ffffff',
        borderRadius: '24px',
        fontWeight: '600',
        fontSize: '16px',
        cursor: 'pointer',
    },
    bottomNextWrapper: {
        marginTop: '40px',
        width: '100%',
        display: 'flex',
        justifyContent: 'flex-end',
    },
    blueNextBtn: {
        backgroundColor: '#0284c7',
        color: '#ffffff',
        border: 'none',
        padding: '14px 32px',
        borderRadius: '12px',
        fontWeight: '600',
        fontSize: '16px',
    },

    // STEP 2 STYLES
    step2FullGrid: {
        display: 'grid',
        gridTemplateColumns: '400px 1fr',
        gap: '48px',
        width: '100%',
        maxWidth: '1200px',
        height: '100%',
        maxHeight: '750px',
    },
    previewPanel: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
    },
    mediaContainer: {
        width: '100%',
        height: '100%',
        maxHeight: '500px',
        borderRadius: '20px',
        border: '2px dashed #93c5fd',
        padding: '16px',
        backgroundColor: '#f8fafc',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
    },
    fullMediaImg: {
        width: '100%',
        height: '100%',
        objectFit: 'cover',
        borderRadius: '14px',
    },
    placeholderMediaText: {
        fontSize: '20px',
        fontWeight: '600',
        color: '#0284c7',
    },
    editorPanel: {
        display: 'flex',
        flexDirection: 'column',
        gap: '20px',
        height: '100%',
    },
    leftTitleText: {
        fontSize: '24px',
        fontWeight: '600',
        color: '#2563eb',
        fontFamily: 'serif, system-ui',
        marginBottom: '8px',
    },
    inputGroup: {
        display: 'flex',
        flexDirection: 'column',
        gap: '8px',
    },
    fieldLabel: {
        fontSize: '13px',
        fontWeight: '700',
        color: '#334155',
        letterSpacing: '0.5px',
    },
    textInput: {
        width: '100%',
        padding: '14px',
        borderRadius: '12px',
        border: '1px solid #cbd5e1',
        fontSize: '15px',
        outline: 'none',
        boxSizing: 'border-box',
    },
    tagCloudRow: {
        display: 'flex',
        flexWrap: 'wrap',
        gap: '10px',
    },
    personChip: {
        border: '1px solid #cbd5e1',
        padding: '8px 16px',
        borderRadius: '20px',
        fontSize: '14px',
        fontWeight: '600',
        cursor: 'pointer',
    },
    giganticTextArea: {
        width: '100%',
        flex: 1,
        minHeight: '180px',
        padding: '18px',
        borderRadius: '14px',
        border: '1px solid #cbd5e1',
        fontSize: '16px',
        lineHeight: '1.6',
        outline: 'none',
        resize: 'none',
        boxSizing: 'border-box',
        fontFamily: 'sans-serif',
    },
    actionFooter: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: 'auto',
        paddingTop: '16px',
    },
    grayBackBtn: {
        backgroundColor: '#f1f5f9',
        color: '#475569',
        border: 'none',
        padding: '14px 24px',
        borderRadius: '12px',
        fontWeight: '600',
        fontSize: '15px',
        cursor: 'pointer',
    },
    orangeIrisNextBtn: {
        backgroundColor: '#ff8c00',
        color: '#ffffff',
        border: 'none',
        padding: '14px 32px',
        borderRadius: '12px',
        fontWeight: '700',
        fontSize: '16px',
        cursor: 'pointer',
        boxShadow: '0 4px 12px rgba(255, 140, 0, 0.3)',
    },

    // PROCESSING STYLES
    processingFullWrapper: {
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',
    },
    processingIcon: {
        fontSize: '70px',
        marginBottom: '20px',
    },
    processingTitle: {
        fontSize: '24px',
        fontWeight: '700',
        color: '#0f172a',
        margin: '0 0 8px 0',
    },
    processingSub: {
        fontSize: '15px',
        color: '#64748b',
        margin: 0,
    },

    // STEP 3 FULL PAGE LAYOUT
    step3LayoutFull: {
        flex: 1,
        width: '100%',
        maxWidth: '1500px',
        margin: '0 auto',
        display: 'flex',
        flexDirection: 'column',
        gap: '20px',
        height: '100%',
    },
    gridThreeColumns: {
        flex: 1,
        display: 'grid',
        gridTemplateColumns: '1fr 1.2fr 1fr',
        gap: '24px',
        alignItems: 'stretch',
    },
    columnCard: {
        backgroundColor: '#ffffff',
        borderRadius: '18px',
        border: '1px solid #e2e8f0',
        padding: '20px',
        display: 'flex',
        flexDirection: 'column',
        boxShadow: '0 4px 20px rgba(0,0,0,0.03)',
    },
    columnHeader: {
        display: 'flex',
        alignItems: 'center',
        gap: '10px',
        marginBottom: '10px',
        paddingBottom: '10px',
        borderBottom: '1px solid #f1f5f9',
    },
    columnHeaderTitle: {
        fontSize: '16px',
        fontWeight: '800',
        color: '#2563eb',
        letterSpacing: '0.5px',
    },
    columnSubtitle: {
        fontSize: '13px',
        color: '#64748b',
        marginTop: 0,
        marginBottom: '14px',
        lineHeight: '1.4',
    },

    // COL 1: ANTEPRIMA POST
    postCardOuter: {
        display: 'flex',
        flexDirection: 'column',
        backgroundColor: '#ffffff',
        border: '1px solid #e2e8f0',
        borderRadius: '16px',
        overflow: 'hidden',
        boxShadow: '0 2px 10px rgba(0,0,0,0.04)',
        flex: 1,
    },
    postHeaderRow: {
        display: 'flex',
        alignItems: 'center',
        gap: '10px',
        padding: '12px 16px',
        backgroundColor: '#ffffff',
    },
    userAvatar: {
        width: '36px',
        height: '36px',
        borderRadius: '50%',
        backgroundColor: '#e2e8f0',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: '18px',
    },
    postImageContainer: {
        width: '100%',
        minHeight: '220px',
        backgroundColor: '#ffffff',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden',
        padding: '10px 0',
    },
    postImage: {
        width: '100%',
        height: '100%',
        maxHeight: '260px',
        objectFit: 'cover',
    },

    // WIREFRAME AUDIO PLAYER DALL'IMMAGINE
    audioWireframeContainer: {
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '24px 16px',
        gap: '24px',
    },
    staticWaveformRow: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '3px',
        width: '100%',
        height: '45px',
    },
    waveformBarItem: {
        width: '3px',
        backgroundColor: '#1e293b',
        borderRadius: '2px',
    },
    playAudioBigBtn: {
        backgroundColor: '#0091ff',
        color: '#ffffff',
        border: 'none',
        borderRadius: '12px',
        padding: '14px 28px',
        fontWeight: '800',
        fontSize: '15px',
        letterSpacing: '0.5px',
        cursor: 'pointer',
        boxShadow: '0 4px 14px rgba(0, 145, 255, 0.3)',
        transition: 'transform 0.1s ease',
    },

    postTagsRow: {
        padding: '8px 16px',
        fontSize: '13px',
        fontWeight: '600',
        color: '#0284c7',
        backgroundColor: '#f0f9ff',
    },
    postDescriptionArea: {
        padding: '14px 16px',
        flex: 1,
        backgroundColor: '#ffffff',
    },
    postTextContent: {
        fontSize: '14px',
        lineHeight: '1.5',
        color: '#334155',
        margin: 0,
        whiteSpace: 'pre-line',
    },
    postTextPlaceholder: {
        fontSize: '13px',
        color: '#94a3b8',
        fontStyle: 'italic',
        margin: 0,
    },
    postFooterBar: {
        display: 'flex',
        gap: '16px',
        padding: '10px 16px',
        borderTop: '1px solid #f1f5f9',
        backgroundColor: '#fafafa',
    },

    // COL 2: EDITORE DESCRIZIONE
    bigColumnTextArea: {
        width: '100%',
        flex: 1,
        minHeight: '320px',
        padding: '16px',
        borderRadius: '14px',
        border: '2px solid #3b82f6',
        fontSize: '15px',
        lineHeight: '1.6',
        outline: 'none',
        resize: 'none',
        boxSizing: 'border-box',
        backgroundColor: '#ffffff',
    },

    // COL 3: IRIS
    irisAvatarTitle: {
        width: '32px',
        height: '32px',
        borderRadius: '50%',
        backgroundColor: '#ff8c00',
        color: '#fff',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: '18px',
    },
    irisTipsStack: {
        display: 'flex',
        flexDirection: 'column',
        gap: '12px',
        flex: 1,
    },
    tipCardStatic: {
        border: '1px solid #fed7aa',
        backgroundColor: '#ffffff',
        borderRadius: '12px',
        padding: '12px 14px',
        display: 'flex',
        alignItems: 'flex-start',
        gap: '10px',
    },

    // BOTTOM BAR GLOBAL
    bottomBarGlobal: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingTop: '8px',
    },
    publishBtnHuge: {
        backgroundColor: '#0099ff',
        color: '#ffffff',
        border: 'none',
        padding: '16px 48px',
        borderRadius: '14px',
        fontWeight: '800',
        fontSize: '17px',
        letterSpacing: '0.5px',
        cursor: 'pointer',
        boxShadow: '0 4px 18px rgba(0, 153, 255, 0.35)',
    },
};