// ============================================================================
// MEMORYBRIDGE - REACT MONOLITH (LOGICA E INTERFACCIA)
// ============================================================================

import {createRoot} from "react-dom/client";
import React from "react";

const { useState } = React;

function MemoryBridgeApp() {
    // --- STATO ACCESSIBILITÀ (ISO 9241 & WCAG) ---
    const [highContrast, setHighContrast] = useState(false);
    const [largeFont, setLargeFont] = useState(false);

    // --- STATO GUIDA & REGISTRAZIONE VOCALE (Per Maria) ---
    const [isInterviewOpen, setIsInterviewOpen] = useState(false);
    const [isRecording, setIsRecording] = useState(false);
    const [interviewStep, setInterviewStep] = useState(0);
    const [interviewAnswers, setInterviewAnswers] = useState({ who: '', when: '', story: '' });

    // --- STATO FEED & INTERAZIONI (Per Sofia & Marco) ---
    const [likes, setLikes] = useState(6);
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
    }

    const theme = {
        bg: highContrast ? '#000000' : '#f3f4f6',
        cardBg: highContrast ? '#121212' : '#ffffff',
        text: highContrast ? '#ffffff' : '#1f2937',
        textMuted: highContrast ? '#d1d5db' : '#6b7280',
        primary: highContrast ? '#ffff00' : '#2563eb',
        primaryText: highContrast ? '#000000' : '#ffffff',
        border: highContrast ? '#ffffff' : '#e5e7eb',
        fontSizeMultiplier: largeFont ? 1.25 : 1,
    };

    return (
        <div style={{
            backgroundColor: theme.bg,
            color: theme.text,
            minHeight: '100vh',
            fontFamily: 'system-ui, -apple-system, sans-serif',
            fontSize: `${16 * theme.fontSizeMultiplier}px`,
            lineHeight: '1.5',
            transition: 'all 0.2s ease-in-out'
        }}>

            {/* BARRA ACCESSIBILITÀ */}
            <section style={{
                backgroundColor: highContrast ? '#1f2937' : '#1e293b',
                color: '#ffffff',
                padding: '8px 16px',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                fontSize: '14px'
            }}>
                <span>♿ <strong>Modalità Accessibile</strong></span>
                <div style={{ display: 'flex', gap: '12px' }}>
                    <button
                        onClick={() => setLargeFont(!largeFont)}
                        style={{
                            padding: '6px 12px',
                            minHeight: '44px',
                            backgroundColor: largeFont ? theme.primary : 'transparent',
                            color: largeFont ? theme.primaryText : '#ffffff',
                            border: '1px solid #ffffff',
                            borderRadius: '6px',
                            cursor: 'pointer',
                            fontWeight: 'bold'
                        }}
                    >
                        {largeFont ? 'A- Testo Normale' : 'A+ Testo Grande'}
                    </button>

                    <button
                        onClick={() => setHighContrast(!highContrast)}
                        style={{
                            padding: '6px 12px',
                            minHeight: '44px',
                            backgroundColor: highContrast ? '#ffff00' : 'transparent',
                            color: highContrast ? '#000000' : '#ffffff',
                            border: '1px solid #ffffff',
                            borderRadius: '6px',
                            cursor: 'pointer',
                            fontWeight: 'bold'
                        }}
                    >
                        {highContrast ? '☀️ Contrasto Normale' : '👁️ Alto Contrasto'}
                    </button>
                </div>
            </section>

            {/* HEADER / NAVIGATION BAR */}
            <header style={{
                backgroundColor: theme.cardBg,
                borderBottom: `2px solid ${theme.border}`,
                position: 'sticky',
                top: 0,
                zIndex: 40,
                boxShadow: '0 2px 4px rgba(0,0,0,0.05)'
            }}>
                <div style={{
                    maxWidth: '1100px',
                    margin: '0 auto',
                    padding: '12px 16px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    flexWrap: 'wrap',
                    gap: '12px'
                }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <div style={{
                            width: '48px',
                            height: '48px',
                            borderRadius: '50%',
                            backgroundColor: '#0284c7',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: '24px'
                        }}>🌉</div>
                        <h1 style={{ margin: 0, fontSize: `${22 * theme.fontSizeMultiplier}px`, fontWeight: 'bold', color: theme.primary }}>
                            MemoryBridge
                        </h1>
                    </div>

                    <nav>
                        <ul style={{ display: 'flex', listStyle: 'none', margin: 0, padding: 0, gap: '8px', alignItems: 'center' }}>
                            {[
                                { label: 'Home', icon: '🏠', active: true },
                                { label: 'Albero Genealogico', icon: '🌳', active: false },
                                { label: 'Ricerca', icon: '🔍', active: false },
                                { label: 'Racconta un ricordo', icon: '📅', active: false },
                                { label: 'Profilo', icon: '👤', active: false },
                            ].map((item, idx) => (
                                <li key={idx}>
                                    <a href="#" style={{
                                        display: 'flex',
                                        flexDirection: 'column',
                                        alignItems: 'center',
                                        padding: '8px 12px',
                                        minHeight: '48px',
                                        textDecoration: 'none',
                                        color: item.active ? theme.primary : theme.text,
                                        fontWeight: item.active ? 'bold' : 'normal',
                                        borderBottom: item.active ? `3px solid ${theme.primary}` : 'none'
                                    }}>
                                        <span style={{ fontSize: '20px' }}>{item.icon}</span>
                                        <span style={{ fontSize: '13px' }}>{item.label}</span>
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </nav>
                </div>
            </header>

            {/* MAIN CONTENT */}
            <main style={{ maxWidth: '700px', margin: '24px auto', padding: '0 16px' }}>

                {/* CREATION BOX */}
                <section style={{
                    backgroundColor: theme.cardBg,
                    borderRadius: '16px',
                    padding: '20px',
                    border: `1px solid ${theme.border}`,
                    marginBottom: '24px',
                    boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)'
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
                                padding: '16px',
                                minHeight: '52px',
                                textAlign: 'left',
                                backgroundColor: theme.bg,
                                border: `2px dashed ${theme.primary}`,
                                borderRadius: '12px',
                                color: theme.text,
                                fontSize: `${16 * theme.fontSizeMultiplier}px`,
                                cursor: 'pointer',
                                fontWeight: '500'
                            }}
                        >
                            💭 Cosa vuoi condividere oggi? <span style={{ color: theme.primary, fontWeight: 'bold' }}>(Clicca qui)</span>
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
                                flex: '1 1 45%',
                                minHeight: '48px',
                                backgroundColor: highContrast ? '#333' : '#e0f2fe',
                                color: highContrast ? '#fff' : '#0369a1',
                                border: `1px solid ${theme.border}`,
                                borderRadius: '10px',
                                padding: '10px 16px',
                                fontWeight: 'bold',
                                cursor: 'pointer'
                            }}
                        >
                            📷 Carica Foto o Documento
                        </button>
                    </div>
                </section>

                {/* FEED CARD */}
                <article style={{
                    backgroundColor: theme.cardBg,
                    borderRadius: '16px',
                    border: `1px solid ${theme.border}`,
                    padding: '24px',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.05)'
                }}>
                    <header style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '16px' }}>
                        <div style={{
                            width: '52px',
                            height: '52px',
                            borderRadius: '50%',
                            backgroundColor: '#e5e7eb',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: '24px'
                        }}>👵</div>

                        <div style={{ flexGrow: 1 }}>
                            <h3 style={{ margin: 0, fontSize: `${18 * theme.fontSizeMultiplier}px`, fontWeight: 'bold' }}>
                                Shila Han
                            </h3>
                            <p style={{ margin: 0, fontSize: '14px', color: theme.textMuted }}>
                                📍 New York, NY • 15 Giugno 1965
                            </p>
                        </div>

                        <span style={{
                            padding: '4px 10px',
                            backgroundColor: highContrast ? '#333' : '#fef3c7',
                            color: highContrast ? '#fff' : '#92400e',
                            fontSize: '12px',
                            fontWeight: 'bold',
                            borderRadius: '12px',
                            border: '1px solid #f59e0b'
                        }}>
              🔒 Solo Famiglia
            </span>
                    </header>

                    <p style={{ fontSize: `${17 * theme.fontSizeMultiplier}px`, margin: '0 0 16px 0', lineHeight: '1.6' }}>
                        Il nonno Orazio al matrimonio del cugino Antonio. Trovato questo gioiello in un vecchio album fotografico.
                        Si può vedere tutta la famiglia riunita, tutti eleganti e sorridenti.
                    </p>

                    <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '16px' }}>
            <span style={{ backgroundColor: theme.bg, padding: '4px 12px', borderRadius: '16px', fontSize: '13px', border: `1px solid ${theme.border}` }}>
              👤 <strong>Parente:</strong> Nonno Orazio
            </span>
                        <span style={{ backgroundColor: theme.bg, padding: '4px 12px', borderRadius: '16px', fontSize: '13px', border: `1px solid ${theme.border}` }}>
              🎉 <strong>Evento:</strong> Matrimonio Antonio
            </span>
                    </div>

                    {/* IMMAGINE */}
                    <div style={{ borderRadius: '12px', overflow: 'hidden', marginBottom: '20px' }}>
                        <img
                            src="https://images.unsplash.com/photo-1511895426328-dc8714191300?w=800&auto=format&fit=crop&q=80"
                            alt="Foto di famiglia a tavola"
                            style={{ width: '100%', height: 'auto', display: 'block', maxHeight: '500px', objectFit: 'cover' }}
                        />
                    </div>

                    {/* BOTTOM ACTIONS */}
                    <footer style={{ borderTop: `1px solid ${theme.border}`, paddingTop: '16px' }}>
                        <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
                            <button
                                onClick={toggleLike}
                                style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '8px',
                                    minHeight: '48px',
                                    padding: '8px 16px',
                                    border: `1px solid ${hasLiked ? theme.primary : theme.border}`,
                                    borderRadius: '24px',
                                    backgroundColor: hasLiked ? (highContrast ? '#ffff00' : '#dbeafe') : 'transparent',
                                    color: hasLiked ? (highContrast ? '#000' : theme.primary) : theme.text,
                                    fontWeight: 'bold',
                                    cursor: 'pointer'
                                }}
                            >
                                👍 {likes} {hasLiked ? 'Apprezzato' : 'Mi piace'}
                            </button>

                            <button
                                onClick={() => setShowComments(!showComments)}
                                style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '8px',
                                    minHeight: '48px',
                                    padding: '8px 16px',
                                    border: `1px solid ${theme.border}`,
                                    borderRadius: '24px',
                                    backgroundColor: 'transparent',
                                    color: theme.text,
                                    fontWeight: 'bold',
                                    cursor: 'pointer'
                                }}
                            >
                                💬 {comments.length} Commenti
                            </button>
                        </div>

                        {showComments && (
                            <div style={{ marginTop: '20px', paddingTop: '16px', borderTop: `1px dashed ${theme.border}` }}>
                                <h4 style={{ margin: '0 0 12px 0' }}>Commenti della Famiglia</h4>
                                <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 16px 0' }}>
                                    {comments.map((comment, i) => (
                                        <li key={i} style={{ backgroundColor: theme.bg, padding: '12px', borderRadius: '8px', marginBottom: '8px', border: `1px solid ${theme.border}` }}>
                                            {comment}
                                        </li>
                                    ))}
                                </ul>
                                <form onSubmit={handleAddComment} style={{ display: 'flex', gap: '8px' }}>
                                    <input
                                        type="text"
                                        value={newComment}
                                        onChange={(e) => setNewComment(e.target.value)}
                                        placeholder="Scrivi un pensiero per la nonna..."
                                        style={{ flexGrow: 1, minHeight: '44px', padding: '8px 12px', borderRadius: '8px', border: `1px solid ${theme.border}`, backgroundColor: theme.cardBg, color: theme.text }}
                                    />
                                    <button type="submit" style={{ minHeight: '44px', padding: '0 20px', backgroundColor: theme.primary, color: theme.primaryText, border: 'none', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer' }}>
                                        Invia
                                    </button>
                                </form>
                            </div>
                        )}
                    </footer>
                </article>

            </main>

            {/* MODALE DI GUIDA */}
            {isInterviewOpen && (
                <div style={{
                    position: 'fixed',
                    inset: 0,
                    backgroundColor: 'rgba(0,0,0,0.75)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: '16px',
                    zIndex: 100
                }}>
                    <div style={{
                        backgroundColor: theme.cardBg,
                        border: `3px solid ${theme.primary}`,
                        borderRadius: '20px',
                        maxWidth: '600px',
                        width: '100%',
                        padding: '28px'
                    }}>
                        <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                            <h2 style={{ margin: 0, color: theme.primary }}>👵 Assistente Raccolta Ricordi</h2>
                            <button onClick={() => setIsInterviewOpen(false)} style={{ border: 'none', background: 'transparent', fontSize: '24px', cursor: 'pointer', color: theme.text }}>✖</button>
                        </header>

                        <p style={{ fontWeight: 'bold', color: theme.primary }}>Passo {interviewStep + 1} di {guidedQuestions.length}</p>

                        <div style={{ backgroundColor: theme.bg, padding: '20px', borderRadius: '12px', marginBottom: '20px', border: `1px solid ${theme.border}` }}>
                            <label style={{ display: 'block', fontSize: '18px', fontWeight: 'bold', marginBottom: '12px' }}>
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
                                style={{ width: '100%', padding: '12px', borderRadius: '8px', border: `2px solid ${theme.border}`, backgroundColor: theme.cardBg, color: theme.text, fontSize: '16px' }}
                            />

                            <div style={{ marginTop: '16px', textAlign: 'center' }}>
                                <button
                                    type="button"
                                    onClick={() => setIsRecording(!isRecording)}
                                    style={{
                                        minHeight: '52px',
                                        padding: '12px 24px',
                                        backgroundColor: isRecording ? '#dc2626' : '#16a34a',
                                        color: '#ffffff',
                                        border: 'none',
                                        borderRadius: '30px',
                                        fontWeight: 'bold',
                                        cursor: 'pointer'
                                    }}
                                >
                                    {isRecording ? '🔴 Interrompi Registrazione' : '🎙️ Parla invece di scrivere'}
                                </button>
                                {isRecording && <p style={{ color: '#dc2626', fontWeight: 'bold', marginTop: '8px' }}>Sto ascoltando la tua voce...</p>}
                            </div>
                        </div>

                        <footer style={{ display: 'flex', justifyContent: 'space-between' }}>
                            <button
                                disabled={interviewStep === 0}
                                onClick={() => setInterviewStep(prev => prev - 1)}
                                style={{ minHeight: '48px', padding: '0 20px', borderRadius: '10px', border: `1px solid ${theme.border}`, backgroundColor: theme.bg, color: theme.text, cursor: interviewStep === 0 ? 'not-allowed' : 'pointer' }}
                            >
                                ← Indietro
                            </button>

                            {interviewStep < guidedQuestions.length - 1 ? (
                                <button
                                    onClick={() => setInterviewStep(prev => prev + 1)}
                                    style={{ minHeight: '48px', padding: '0 24px', borderRadius: '10px', border: 'none', backgroundColor: theme.primary, color: theme.primaryText, fontWeight: 'bold', cursor: 'pointer' }}
                                >
                                    Prossima Domanda →
                                </button>
                            ) : (
                                <button
                                    onClick={() => {
                                        alert("Ricordo salvato con successo!");
                                        setIsInterviewOpen(false);
                                        setInterviewStep(0);
                                    }}
                                    style={{ minHeight: '48px', padding: '0 24px', borderRadius: '10px', border: 'none', backgroundColor: '#16a34a', color: '#ffffff', fontWeight: 'bold', cursor: 'pointer' }}
                                >
                                    💾 Salva per la Famiglia
                                </button>
                            )}
                        </footer>
                    </div>
                </div>
            )}

        </div>
    );
}

// Renderizza l'applicazione nel DOM
const container = document.getElementById('root');
if (container) {
    const root = createRoot(container);
    root.render(<MemoryBridgeApp />);
}