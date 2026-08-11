import React, { useState } from 'react';
import {createRoot} from "react-dom/client";
import IrisAvatar from "@/images/Iris.png"

// ============================================================================
// MEMORYBRIDGE - INTERFACCIA ED ELEMENTI CARATTERISTICI (REACT MONOLITH)
// ============================================================================

function MemoryBridgeApp() {
    // --- STATO ACCESSIBILITÀ (ISO 9241 & WCAG) ---
    const [highContrast, setHighContrast] = useState(false);
    const [largeFont, setLargeFont] = useState(false);

    // --- STATO INTERFACCIA ---
    const [isSpeaking, setIsSpeaking] = useState(false);
    const [accessibilityOpen, setAccessibilityOpen] = useState(false);

    // --- STATO GUIDA & REGISTRAZIONE VOCALE (Per Nonna Maria) ---
    const [isInterviewOpen, setIsInterviewOpen] = useState(false);
    const [isRecording, setIsRecording] = useState(false);
    const [interviewStep, setInterviewStep] = useState(0);
    const [interviewAnswers, setInterviewAnswers] = useState({ who: '', when: '', story: '' });

    // --- STATO FEED & INTERAZIONI (Per Sofia & Marco) ---
    const [likes, setLikes] = useState(12);
    const [hasLiked, setHasLiked] = useState(false);
    const [showComments, setShowComments] = useState(false);
    const [comments, setComments] = useState([
        "Che bella foto di famiglia! Che anno era precisamente?",
        "Zio Orazio aveva sempre lo stesso sorriso!",
        "Grazie per aver condiviso questo ricordo ❤️"
    ]);
    const [newComment, setNewComment] = useState("");

    const guidedQuestions = [
        { id: 'who', question: 'Chi c’è in questa fotografia o in questo ricordo?', placeholder: 'Es. Nonno Orazio, Cugino Antonio...' },
        { id: 'when', question: 'In che anno o occasione speciale è successo?', placeholder: 'Es. Matrimonio del 1965, Estate a Salerno...' },
        { id: 'story', question: 'Racconta cosa vi stavate dicendo o un aneddoto speciale:', placeholder: 'Premi il microfono se preferisci parlare a voce!' }
    ];

    const toggleLike = () => {
        setLikes(prev => hasLiked ? prev - 1 : prev + 1);
        setHasLiked(!hasLiked);
    };

    const handleAddComment = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (newComment.trim()) {
            setComments([...comments, newComment.trim()]);
            setNewComment("");
        }
    };
    const toggleSpeech = (text: string) => {
        if ('speechSynthesis' in window) {
            if (isSpeaking) {
                window.speechSynthesis.cancel();  //API per lettura vocale su web
                setIsSpeaking(false);
            } else {
                const utterance = new SpeechSynthesisUtterance(text);
                utterance.lang = 'it-IT';
                utterance.onend = () => setIsSpeaking(false);
                window.speechSynthesis.speak(utterance);
                setIsSpeaking(true);
            }
        } else {
            alert("La sintesi vocale non è supportata da questo browser.");
        }
    };

    const theme = {
        bg: highContrast ? '#000000' : '#f8fafc',
        cardBg: highContrast ? '#121212' : '#ffffff',
        text: highContrast ? '#ffffff' : '#0f172a',
        textMuted: highContrast ? '#cbd5e1' : '#64748b',
        primary: highContrast ? '#ffff00' : '#2563eb',
        primaryBg: highContrast ? '#ffff00' : '#eff6ff',
        primaryText: highContrast ? '#000000' : '#ffffff',
        accent: highContrast ? '#00ffff' : '#0284c7',
        border: highContrast ? '#ffffff' : '#e2e8f0',
        fontSizeMultiplier: largeFont ? 1.25 : 1,
    };

    const sampleStoryText = "Il nonno Orazio al matrimonio del cugino Antonio. Trovato questo gioiello in un vecchio album fotografico. Si può vedere tutta la famiglia riunita, tutti eleganti e sorridenti.";

    return (
        <div style={{
            backgroundColor: theme.bg,
            color: theme.text,
            minHeight: '100vh',
            fontFamily: '"Plus Jakarta Sans", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
            letterSpacing: '-0.02em', // Rende la spaziatura compatta come nell'immagine
            fontSize: `${16 * theme.fontSizeMultiplier}px`,
            lineHeight: '1.6',
            transition: 'all 0.2s ease-in-out'
        }}>


            {/* 2. HEADER / BRANDING MEMORYBRIDGE */}
            <header style={{
                backgroundColor: theme.cardBg,
                borderBottom: `2px solid ${theme.border}`,
                position: 'sticky',
                top: 0,
                zIndex: 40,
                boxShadow: '0 2px 8px rgba(0,0,0,0.06)'
            }}>
                <div style={{
                    maxWidth: '1200px', /* Aumentato da 1000px per distanziare Logo e Menu */
                    margin: '0 auto',
                    padding: '12px 20px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    flexWrap: 'wrap',
                    gap: '16px'
                }}>
                    {/* LOGO */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <div style={{
                            width: '46px',
                            height: '46px',
                            borderRadius: '12px',
                            backgroundColor: theme.primary,
                            color: theme.primaryText,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: '24px',
                            boxShadow: '0 2px 6px rgba(0,0,0,0.15)'
                        }}>🌉</div>
                        <div>
                            <h1 style={{ margin: 0, fontSize: `${22 * theme.fontSizeMultiplier}px`, fontWeight: '800', color: theme.primary, lineHeight: 1 }}>
                                MemoryBridge
                            </h1>
                            <span style={{ fontSize: '12px', color: theme.textMuted, fontWeight: '500' }}>Ponte tra Memorie Familiari</span>
                        </div>
                    </div>

                    {/* NAVIGAZIONE CARATTERISTICA */}
                    <nav>
                        <ul style={{ display: 'flex', listStyle: 'none', margin: 0, padding: 0, gap: '28px' }}> {/* Aumentato gap da 6px a 28px per distanziare le voci tra loro */}
                            {[
                                { label: 'Ricordi', icon: '🏠', active: true },
                                { label: 'Albero Genealogico', icon: '🌳', active: false },
                                { label: 'Esplora Epoche', icon: '⏳', active: false },
                                { label: 'Profilo', icon: '👤', active: false }
                            ].map((item, idx) => (
                                <li key={idx}>
                                    <a href="#" style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '6px',
                                        padding: '8px 14px',
                                        minHeight: '44px',
                                        borderRadius: '10px',
                                        textDecoration: 'none',
                                        backgroundColor: item.active ? (highContrast ? '#ffff00' : '#e0f2fe') : 'transparent',
                                        color: item.active ? (highContrast ? '#000000' : '#0369a1') : theme.text,
                                        fontWeight: item.active ? 'bold' : '500',
                                        fontSize: `${14 * theme.fontSizeMultiplier}px`
                                    }}>
                                        <span>{item.icon}</span>
                                        <span>{item.label}</span>
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </nav>
                </div>
            </header>

            {/* 3. CONTENUTO PRINCIPALE */}
            <main style={{ maxWidth: '720px', margin: '24px auto', padding: '0 16px' }}>

                {/* SPUNTO DEL GIORNO — a cura di IRIS IA */}
                <section style={{
                    background: highContrast ? '#1a1a1a' : 'linear-gradient(135deg, #f5f3ff 0%, #eef2ff 100%)',
                    borderRadius: '16px',
                    padding: '16px 20px',
                    border: `2px solid ${highContrast ? '#ffff00' : '#c4b5fd'}`,
                    marginBottom: '20px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '16px',
                    flexWrap: 'wrap'
                }}>
                    <img
                        src={IrisAvatar}
                        alt="Iris IA"
                        style={{
                            width: '54px',
                            height: '54px',
                            borderRadius: '50%',
                            objectFit: 'cover',
                            flexShrink: 0,
                            border: `2px solid ${highContrast ? '#ffff00' : '#7c3aed'}`,
                            boxShadow: '0 2px 6px rgba(124,58,237,0.35)'
                        }}
                    />

                    <div style={{ flex: 1, minWidth: '240px' }}>
                        <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                            <span style={{ fontSize: '14px', fontWeight: 'bold', color: highContrast ? '#ffff00' : '#7c3aed' }}>
                                Iris IA consiglia :
                            </span>
                            <span style={{
                                fontSize: '10px',
                                fontWeight: 'bold',
                                backgroundColor: highContrast ? '#ffff00' : '#ede9fe',
                                color: highContrast ? '#000000' : '#6d28d9',
                                padding: '1px 6px',
                                borderRadius: '6px',
                                letterSpacing: '0.5px'
                            }}>
                                AI
                            </span>
                        </span>
                        <p style={{ margin: '4px 0 0 0', fontWeight: 'bold', fontSize: `${16 * theme.fontSizeMultiplier}px` }}>
                            "Nonna Maria, ti va di raccontarci qual è stato il tuo primo viaggio importante?"
                        </p>
                    </div>
                    <button
                        onClick={() => setIsInterviewOpen(true)}
                        style={{
                            padding: '10px 18px',
                            minHeight: '44px',
                            backgroundColor: highContrast ? '#ffff00' : '#7c3aed',
                            color: highContrast ? '#000000' : '#ffffff',
                            border: 'none',
                            borderRadius: '10px',
                            fontWeight: 'bold',
                            cursor: 'pointer',
                            whiteSpace: 'nowrap'
                        }}
                    >
                        ✨ Crea Ricordo
                    </button>
                </section>

                {/* BOX DI CREAZIONE / INTERVISTA */}
                <section style={{
                    backgroundColor: theme.cardBg,
                    borderRadius: '16px',
                    padding: '20px',
                    border: `1px solid ${theme.border}`,
                    marginBottom: '24px',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.03)'
                }}>
                    <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
                        <div style={{
                            width: '56px',
                            height: '56px',
                            borderRadius: '50%',
                            backgroundColor: '#3b82f6',
                            color: '#ffffff',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: '28px',
                            flexShrink: 0
                        }}>👤</div>

                        <button
                            onClick={() => setIsInterviewOpen(true)}
                            style={{
                                flexGrow: 1,
                                padding: '14px 18px',
                                minHeight: '52px',
                                textAlign: 'left',
                                backgroundColor: theme.bg,
                                border: `2px dashed ${theme.primary}`,
                                borderRadius: '12px',
                                color: theme.text,
                                fontSize: `${15 * theme.fontSizeMultiplier}px`,
                                cursor: 'pointer',
                                fontWeight: '500'
                            }}
                        >
                            💭 Clicca qui per raccontare una foto o un ricordo...
                        </button>
                    </div>

                    <div style={{ display: 'flex', gap: '12px', marginTop: '16px', justifyContent: 'space-between', flexWrap: 'wrap' }}>
                        <button
                            onClick={() => setIsInterviewOpen(true)}
                            style={{
                                flex: '1 1 45%',
                                minHeight: '48px',
                                backgroundColor: theme.primary,
                                color: theme.primaryText,
                                border: 'none',
                                borderRadius: '10px',
                                padding: '10px 16px',
                                fontWeight: 'bold',
                                cursor: 'pointer'
                            }}
                        >
                            🎤 Registra con Guida Vocale
                        </button>

                        <button
                            onClick={() => setIsInterviewOpen(true)}
                            style={{
                                flex: 1,
                                minHeight: '48px',
                                backgroundColor: theme.bg,
                                color: theme.text,
                                border: `1px solid ${theme.border}`,
                                borderRadius: '10px',
                                fontWeight: 'bold',
                                cursor: 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                gap: '8px'
                            }}
                        >
                            📷 Carica Vecchia Foto
                        </button>
                    </div>
                </section>

                {/* FEED CARD RICORDO */}
                <article style={{
                    backgroundColor: theme.cardBg,
                    borderRadius: '20px',
                    border: `1px solid ${theme.border}`,
                    padding: '24px',
                    boxShadow: '0 4px 16px rgba(0,0,0,0.04)'
                }}>
                    {/* HEADER POST — STILE INSTAGRAM: nome + "con..." sotto, niente badge separati */}
                    <header style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '16px' }}>
                        <div style={{
                            width: '54px',
                            height: '54px',
                            borderRadius: '50%',
                            backgroundColor: '#e2e8f0',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: '28px',
                            border: `2px solid ${theme.primary}`
                        }}>👵</div>

                        <div style={{ flexGrow: 1 }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <h3 style={{ margin: 0, fontSize: `${18 * theme.fontSizeMultiplier}px`, fontWeight: 'bold' }}>
                                    Maria Han (Nonna)
                                </h3>
                                <span style={{
                                    backgroundColor: highContrast ? '#ffff00' : '#dbeafe',
                                    color: highContrast ? '#000000' : '#1e40af',
                                    fontSize: '12px',
                                    fontWeight: 'bold',
                                    padding: '2px 8px',
                                    borderRadius: '6px'
                                }}>
                  👵 Ramo Materno
                                </span>
                            </div>
                            {/* Riga "con..." in stile Instagram, al posto dei tag a pillola */}
                            <p style={{ margin: '2px 0 0 0', fontSize: '17px', color: theme.textMuted }}>
                                con{' '}
                                <span style={{ color: theme.primary, fontWeight: '700', cursor: 'pointer' }}>
                                 Nonno Orazio
                                </span>
                                {' '}· Matrimonio Antonio
                            </p>
                            <p style={{ margin: 0, fontSize: '13px', color: theme.textMuted }}>
                                📍 New York • 15 Giugno 1965
                            </p>
                        </div>
                    </header>

                    {/* TESTO DEL RICORDO + SINTESI VOCALE */}
                    <div style={{ marginBottom: '16px' }}>
                        <p style={{ fontSize: `${17 * theme.fontSizeMultiplier}px`, margin: '0 0 12px 0', lineHeight: '1.6' }}>
                            {sampleStoryText}
                        </p>

                        <button
                            onClick={() => toggleSpeech(sampleStoryText)}
                            style={{
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '8px',
                                padding: '8px 14px',
                                minHeight: '40px',
                                backgroundColor: isSpeaking ? '#dc2626' : theme.primaryBg,
                                color: isSpeaking ? '#ffffff' : (highContrast ? '#000' : theme.primary),
                                border: `1px solid ${theme.primary}`,
                                borderRadius: '20px',
                                fontWeight: 'bold',
                                fontSize: '14px',
                                cursor: 'pointer'
                            }}
                        >
                            {isSpeaking ? '🛑 Ferma Lettura Vocale' : '🔊 Ascolta Racconto A Voce'}
                        </button>
                    </div>

                    {/* FOTO STORICA (con tag persone in overlay, stile Instagram) */}
                    <div style={{ position: 'relative', borderRadius: '14px', overflow: 'hidden', marginBottom: '16px', border: `1px solid ${theme.border}` }}>
                        <img
                            src="https://images.unsplash.com/photo-1511895426328-dc8714191300?w=800&auto=format&fit=crop&q=80"
                            alt="Foto d'epoca della famiglia riunita"
                            style={{ width: '100%', height: 'auto', display: 'block', maxHeight: '480px', objectFit: 'cover' }}
                        />
                        <span style={{
                            position: 'absolute',
                            bottom: '10px',
                            left: '10px',
                            backgroundColor: 'rgba(0,0,0,0.55)',
                            color: '#ffffff',
                            fontSize: '12px',
                            fontWeight: 'bold',
                            padding: '4px 10px',
                            borderRadius: '20px',
                            backdropFilter: 'blur(2px)'
                        }}>
                            🌳 Collegato all'Albero Genealogico
                        </span>
                    </div>

                    {/* AUDIOPLAYER NOTA VOCALE ORIGINALE */}
                    <div style={{
                        backgroundColor: theme.bg,
                        padding: '12px 16px',
                        borderRadius: '12px',
                        border: `1px solid ${theme.border}`,
                        marginBottom: '20px',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '12px'
                    }}>
                        <button style={{
                            width: '40px',
                            height: '40px',
                            borderRadius: '50%',
                            backgroundColor: theme.primary,
                            color: theme.primaryText,
                            border: 'none',
                            fontSize: '18px',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                        }}>
                            ▶️
                        </button>
                        <div style={{ flex: 1 }}>
                            <div style={{ fontSize: '13px', fontWeight: 'bold' }}>🎙️ Audio originale di Nonna Maria (1:24)</div>
                            <div style={{ height: '6px', backgroundColor: theme.border, borderRadius: '3px', marginTop: '4px', overflow: 'hidden' }}>
                                <div style={{ width: '35%', height: '100%', backgroundColor: theme.primary }}></div>
                            </div>
                        </div>
                    </div>

                    {/* AZIONI POST */}
                    <footer style={{ borderTop: `1px solid ${theme.border}`, paddingTop: '16px' }}>
                        <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                            <button
                                onClick={toggleLike}
                                style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '8px',
                                    minHeight: '46px',
                                    padding: '8px 18px',
                                    border: `1px solid ${hasLiked ? theme.primary : theme.border}`,
                                    borderRadius: '24px',
                                    backgroundColor: hasLiked ? (highContrast ? '#ffff00' : '#dbeafe') : 'transparent',
                                    color: hasLiked ? (highContrast ? '#000000' : theme.primary) : theme.text,
                                    fontWeight: 'bold',
                                    cursor: 'pointer'
                                }}
                            >
                                ❤️ {likes} {hasLiked ? 'Ti Piace' : 'Mi Piace'}
                            </button>

                            <button
                                onClick={() => setShowComments(!showComments)}
                                style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '8px',
                                    minHeight: '46px',
                                    padding: '8px 18px',
                                    border: `1px solid ${theme.border}`,
                                    borderRadius: '24px',
                                    backgroundColor: 'transparent',
                                    color: theme.text,
                                    fontWeight: 'bold',
                                    cursor: 'pointer'
                                }}
                            >
                                💬 {comments.length} Risposte
                            </button>
                        </div>

                        {/* SEZIONE COMMENTI */}
                        {showComments && (
                            <div style={{ marginTop: '20px', paddingTop: '16px', borderTop: `1px dashed ${theme.border}` }}>
                                <h4 style={{ margin: '0 0 12px 0', fontSize: '15px' }}>💬 Commenti dei Nipoti e della Famiglia</h4>
                                <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 16px 0' }}>
                                    {comments.map((comment, i) => (
                                        <li key={i} style={{ backgroundColor: theme.bg, padding: '12px', borderRadius: '10px', marginBottom: '8px', border: `1px solid ${theme.border}`, fontSize: '14px' }}>
                                            {comment}
                                        </li>
                                    ))}
                                </ul>

                                <form onSubmit={handleAddComment} style={{ display: 'flex', gap: '8px' }}>
                                    <input
                                        type="text"
                                        value={newComment}
                                        onChange={(e) => setNewComment(e.target.value)}
                                        placeholder="Lascia un messaggio o una domanda alla nonna..."
                                        style={{
                                            flexGrow: 1,
                                            minHeight: '46px',
                                            padding: '8px 14px',
                                            borderRadius: '10px',
                                            border: `1px solid ${theme.border}`,
                                            backgroundColor: theme.cardBg,
                                            color: theme.text,
                                            fontSize: '14px'
                                        }}
                                    />
                                    <button
                                        type="submit"
                                        style={{
                                            minHeight: '46px',
                                            padding: '0 20px',
                                            backgroundColor: theme.primary,
                                            color: theme.primaryText,
                                            border: 'none',
                                            borderRadius: '10px',
                                            fontWeight: 'bold',
                                            cursor: 'pointer'
                                        }}
                                    >
                                        Invia
                                    </button>
                                </form>
                            </div>
                        )}
                    </footer>
                </article>

            </main>

            {/* 4. MODALE INTERVISTA GUIDATA PER GLI ANZIANI */}
            {isInterviewOpen && (
                <div style={{
                    position: 'fixed',
                    inset: 0,
                    backgroundColor: 'rgba(0,0,0,0.8)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: '16px',
                    zIndex: 100
                }}>
                    <div style={{
                        backgroundColor: theme.cardBg,
                        border: `3px solid ${theme.primary}`,
                        borderRadius: '24px',
                        maxWidth: '620px',
                        width: '100%',
                        padding: '28px',
                        boxShadow: '0 10px 25px rgba(0,0,0,0.3)'
                    }}>
                        <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                            <h2 style={{ margin: 0, color: theme.primary, fontSize: `${20 * theme.fontSizeMultiplier}px` }}>
                                👵 Assistente Guidato Raccolta Ricordi
                            </h2>
                            <button
                                onClick={() => setIsInterviewOpen(false)}
                                style={{ border: 'none', background: 'transparent', fontSize: '28px', cursor: 'pointer', color: theme.text }}
                            >
                                ✖
                            </button>
                        </header>

                        <div style={{ display: 'flex', gap: '8px', marginBottom: '16px' }}>
                            {guidedQuestions.map((_, index) => (
                                <div
                                    key={index}
                                    style={{
                                        flex: 1,
                                        height: '8px',
                                        borderRadius: '4px',
                                        backgroundColor: index <= interviewStep ? theme.primary : theme.border
                                    }}
                                />
                            ))}
                        </div>

                        <p style={{ fontWeight: 'bold', color: theme.accent, marginTop: 0 }}>
                            Passaggio {interviewStep + 1} di {guidedQuestions.length}
                        </p>

                        <div style={{ backgroundColor: theme.bg, padding: '20px', borderRadius: '16px', marginBottom: '20px', border: `1px solid ${theme.border}` }}>
                            <label style={{ display: 'block', fontSize: `${18 * theme.fontSizeMultiplier}px`, fontWeight: 'bold', marginBottom: '12px' }}>
                                {guidedQuestions[interviewStep].question}
                            </label>

                            <textarea
                                rows={4}
                                placeholder={guidedQuestions[interviewStep].placeholder}
                                value={interviewStep === 0 ? interviewAnswers.who : interviewStep === 1 ? interviewAnswers.when : interviewAnswers.story}
                                onChange={(e) => {
                                    const val = e.target.value;
                                    if (interviewStep === 0) setInterviewAnswers({ ...interviewAnswers, who: val });
                                    if (interviewStep === 1) setInterviewAnswers({ ...interviewAnswers, when: val });
                                    if (interviewStep === 2) setInterviewAnswers({ ...interviewAnswers, story: val });
                                }}
                                style={{
                                    width: '100%',
                                    padding: '14px',
                                    borderRadius: '10px',
                                    border: `2px solid ${theme.border}`,
                                    backgroundColor: theme.cardBg,
                                    color: theme.text,
                                    fontSize: '16px'
                                }}
                            />

                            <div style={{ marginTop: '16px', textAlign: 'center' }}>
                                <button
                                    type="button"
                                    onClick={() => setIsRecording(!isRecording)}
                                    style={{
                                        minHeight: '54px',
                                        padding: '12px 28px',
                                        backgroundColor: isRecording ? '#dc2626' : '#16a34a',
                                        color: '#ffffff',
                                        border: 'none',
                                        borderRadius: '30px',
                                        fontWeight: 'bold',
                                        fontSize: '16px',
                                        cursor: 'pointer',
                                        boxShadow: isRecording ? '0 0 12px rgba(220, 38, 38, 0.5)' : 'none'
                                    }}
                                >
                                    {isRecording ? '🔴 Interrompi Registrazione' : '🎙️ Premi qui e parla a voce'}
                                </button>
                                {isRecording && (
                                    <p style={{ color: '#dc2626', fontWeight: 'bold', marginTop: '10px', animation: 'pulse 1s infinite' }}>
                                        🎙️ Sto ascoltando la tua voce... parla pure liberamente!
                                    </p>
                                )}
                            </div>
                        </div>

                        <footer style={{ display: 'flex', justifyContent: 'space-between', gap: '12px' }}>
                            <button
                                disabled={interviewStep === 0}
                                onClick={() => setInterviewStep(prev => prev - 1)}
                                style={{
                                    minHeight: '48px',
                                    padding: '0 20px',
                                    borderRadius: '10px',
                                    border: `1px solid ${theme.border}`,
                                    backgroundColor: theme.bg,
                                    color: theme.text,
                                    cursor: interviewStep === 0 ? 'not-allowed' : 'pointer',
                                    opacity: interviewStep === 0 ? 0.5 : 1
                                }}
                            >
                                ← Indietro
                            </button>

                            {interviewStep < guidedQuestions.length - 1 ? (
                                <button
                                    onClick={() => setInterviewStep(prev => prev + 1)}
                                    style={{
                                        minHeight: '48px',
                                        padding: '0 24px',
                                        borderRadius: '10px',
                                        border: 'none',
                                        backgroundColor: theme.primary,
                                        color: theme.primaryText,
                                        fontWeight: 'bold',
                                        cursor: 'pointer'
                                    }}
                                >
                                    Avanti →
                                </button>
                            ) : (
                                <button
                                    onClick={() => {
                                        alert("Ricordo salvato e condiviso con tutta la famiglia!");
                                        setIsInterviewOpen(false);
                                        setInterviewStep(0);
                                    }}
                                    style={{
                                        minHeight: '48px',
                                        padding: '0 24px',
                                        borderRadius: '10px',
                                        border: 'none',
                                        backgroundColor: '#16a34a',
                                        color: '#ffffff',
                                        fontWeight: 'bold',
                                        cursor: 'pointer'
                                    }}
                                >
                                    💾 Salva per la Famiglia
                                </button>
                            )}
                        </footer>
                    </div>
                </div>
            )}
            {/* WIDGET ACCESSIBILITÀ — Dial Radiale */}
            <div style={{ position: 'fixed', bottom: '24px', right: '24px', zIndex: 200 }}>
                <button
                    onClick={() => setLargeFont(!largeFont)}
                    title="Testo Ingrandito"
                    style={{
                        position: 'absolute',
                        bottom: accessibilityOpen ? '92px' : '0px',
                        right: accessibilityOpen ? '8px' : '0px',
                        width: '52px',
                        height: '52px',
                        borderRadius: '50%',
                        border: 'none',
                        backgroundColor: largeFont ? theme.primary : (highContrast ? '#1f2937' : '#ffffff'),
                        color: largeFont ? theme.primaryText : theme.text,
                        boxShadow: '0 4px 14px rgba(0,0,0,0.25)',
                        fontSize: '20px',
                        cursor: 'pointer',
                        opacity: accessibilityOpen ? 1 : 0,
                        transform: accessibilityOpen ? 'scale(1)' : 'scale(0.3)',
                        pointerEvents: accessibilityOpen ? 'auto' : 'none',
                        transition: 'all 0.28s cubic-bezier(0.34, 1.56, 0.64, 1)'
                    }}
                >
                    🔍
                </button>

                <button
                    onClick={() => setHighContrast(!highContrast)}
                    title="Alto Contrasto"
                    style={{
                        position: 'absolute',
                        bottom: accessibilityOpen ? '68px' : '0px',
                        right: accessibilityOpen ? '80px' : '0px',
                        width: '52px',
                        height: '52px',
                        borderRadius: '50%',
                        border: 'none',
                        backgroundColor: highContrast ? '#ffff00' : '#ffffff',
                        color: highContrast ? '#000000' : theme.text,
                        boxShadow: '0 4px 14px rgba(0,0,0,0.25)',
                        fontSize: '20px',
                        cursor: 'pointer',
                        opacity: accessibilityOpen ? 1 : 0,
                        transform: accessibilityOpen ? 'scale(1)' : 'scale(0.3)',
                        pointerEvents: accessibilityOpen ? 'auto' : 'none',
                        transition: 'all 0.32s cubic-bezier(0.34, 1.56, 0.64, 1)'
                    }}
                >
                    👁️
                </button>

                <button
                    onClick={() => setAccessibilityOpen(!accessibilityOpen)}
                    title="Opzioni di Accessibilità"
                    style={{
                        width: '60px',
                        height: '60px',
                        borderRadius: '50%',
                        border: 'none',
                        backgroundColor: highContrast ? '#ffff00' : theme.primary,
                        color: highContrast ? '#000000' : theme.primaryText,
                        fontSize: accessibilityOpen ? '26px' : '20px',
                        fontWeight: 'bold',
                        cursor: 'pointer',
                        boxShadow: '0 6px 18px rgba(0,0,0,0.3)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        transform: accessibilityOpen ? 'rotate(135deg)' : 'rotate(0deg)',
                    }}
                >
                    {accessibilityOpen ? '✖' : '⚙️'}
                </button>
            </div>
        </div>
    );
}

const container = document.getElementById('root');
if (container) {
    const root = createRoot(container);
    root.render(<MemoryBridgeApp />);
}