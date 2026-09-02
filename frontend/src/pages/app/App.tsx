// --- MONOLITH HOME MIGLIORATA ---

import React, { useState } from 'react';
import { createRoot } from "react-dom/client";
import { Navbar } from "@/shared/Navbar/Navbar";
// 1. IMPORTA ANCHE L'HOOK OLTRE AL DIAL
import { AccessibilityDial, useAccessibilitySettings, AccessibilityProvider } from "@/shared/Accessibility/AccessibilityDial";

// --- INTERFACCIA TIPO COMMENTO ---
interface CommentItem {
    id: number;
    author: string;
    handle: string;
    avatar: string;
    text: string;
    time: string;
    likes: number;
    hasLiked: boolean;
}

export function MemoryBridgeApp() {
    // 2. SOSTITUISCI I VECCHI useState(false) CON L'HOOK CONDIVISO
    const { highContrast, largeFont } = useAccessibilitySettings();

    // --- STATO INTERFACCIA ---
    const [isSpeaking, setIsSpeaking] = useState(false);

    // --- STATO GUIDA & REGISTRAZIONE VOCALE (Per Nonna Maria) ---
    const [isInterviewOpen, setIsInterviewOpen] = useState(false);
    const [isRecording, setIsRecording] = useState(false);
    const [interviewStep, setInterviewStep] = useState(0);
    const [interviewAnswers, setInterviewAnswers] = useState({ who: '', when: '', story: '' });

    // --- STATO FEED & INTERAZIONI (Stile Social) ---
    const [likes, setLikes] = useState(12);
    const [hasLiked, setHasLiked] = useState(false);
    const [showComments, setShowComments] = useState(false);
    const [comments, setComments] = useState<CommentItem[]>([
        {
            id: 1,
            author: "Sofia Rossi",
            handle: "@sofia_r",
            avatar: "👧",
            text: "Che bella foto di famiglia! Che anno era precisamente?",
            time: "2h fa",
            likes: 3,
            hasLiked: false
        },
        {
            id: 2,
            author: "Marco Han",
            handle: "@marco_han",
            avatar: "👦",
            text: "Zio Orazio aveva sempre lo stesso identico sorriso! stupenda ❤️",
            time: "45m fa",
            likes: 1,
            hasLiked: false
        }
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
            setComments([
                ...comments,
                {
                    id: Date.now(),
                    author: "Tu",
                    handle: "@tu",
                    avatar: "👤",
                    text: newComment.trim(),
                    time: "Adesso",
                    likes: 0,
                    hasLiked: false
                }
            ]);
            setNewComment("");
        }
    };

    const toggleCommentLike = (id: number) => {
        setComments(comments.map(c => {
            if (c.id === id) {
                return {
                    ...c,
                    likes: c.hasLiked ? c.likes - 1 : c.likes + 1,
                    hasLiked: !c.hasLiked
                };
            }
            return c;
        }));
    };

    const toggleSpeech = (text: string) => {
        if ('speechSynthesis' in window) {
            if (isSpeaking) {
                window.speechSynthesis.cancel();
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

    // Ora 'theme' si aggiornerà istantaneamente ogni volta che premi i bottoni nel Dial!
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
            fontFamily: 'system-ui, -apple-system, sans-serif',
            fontSize: `${16 * theme.fontSizeMultiplier}px`,
            lineHeight: '1.6',
            transition: 'all 0.2s ease-in-out'
        }}>

            {/* HEADER NAVBAR */}
            <Navbar
                activeHref="/"
                ctaLabel="Nuovo Ricordo"
                onCtaClick={() => alert('Crea ricordo!')}
                avatarUrl="https://via.placeholder.com/40"
                avatarAlt="Foto Profilo"
            />

            {/* DIAL ACCESSIBILITÀ ANIMATO */}
            <AccessibilityDial />

            {/* CONTENUTO PRINCIPALE */}
            <main style={{ maxWidth: '720px', margin: '24px auto', padding: '0 16px' }}>

                {/* BOX DI CREAZIONE / INTERVISTA */}
                <section style={{
                    backgroundColor: theme.cardBg,
                    borderRadius: '24px',
                    padding: '24px',
                    border: highContrast ? '2px solid #ffffff' : '1px solid #f1f5f9',
                    marginBottom: '24px',
                    boxShadow: '0 4px 20px rgba(0, 0, 0, 0.05)'
                }}>
                    <div style={{ display: 'flex', gap: '16px', alignItems: 'center', marginBottom: '20px' }}>
                        <div style={{
                            width: '56px',
                            height: '56px',
                            borderRadius: '50%',
                            backgroundColor: '#2563eb',
                            color: '#ffffff',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: '26px',
                            flexShrink: 0
                        }}>
                            👤
                        </div>

                        <button
                            onClick={() => setIsInterviewOpen(true)}
                            style={{
                                flex: 1,
                                padding: '14px 20px',
                                minHeight: '56px',
                                textAlign: 'left',
                                backgroundColor: highContrast ? '#1f2937' : '#f8fafc',
                                border: '2px dashed #2563eb',
                                borderRadius: '16px',
                                color: theme.text,
                                fontSize: `${16 * theme.fontSizeMultiplier}px`,
                                cursor: 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '10px'
                            }}
                        >
                            <span style={{ fontSize: '18px' }}>💭</span>
                            <span>
                                Cosa vuoi condividere oggi?{' '}
                                <strong style={{ color: highContrast ? '#ffff00' : '#2563eb' }}>
                                    (Clicca qui)
                                </strong>
                            </span>
                        </button>
                    </div>

                    <div style={{ display: 'flex', gap: '16px', width: '100%' }}>
                        <button
                            onClick={() => setIsInterviewOpen(true)}
                            style={{
                                flex: 1,
                                minHeight: '52px',
                                backgroundColor: highContrast ? '#ffff00' : '#2563eb',
                                color: highContrast ? '#000000' : '#ffffff',
                                border: 'none',
                                borderRadius: '12px',
                                padding: '12px 16px',
                                fontWeight: 'bold',
                                fontSize: `${15 * theme.fontSizeMultiplier}px`,
                                cursor: 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                gap: '8px'
                            }}
                        >
                            <span>🎤</span> Registra con Guida Vocale
                        </button>

                        <button
                            onClick={() => setIsInterviewOpen(true)}
                            style={{
                                flex: 1,
                                minHeight: '52px',
                                backgroundColor: highContrast ? '#1e293b' : '#e0f2fe',
                                color: highContrast ? '#ffffff' : '#0369a1',
                                border: highContrast ? '1px solid #ffffff' : 'none',
                                borderRadius: '12px',
                                padding: '12px 16px',
                                fontWeight: 'bold',
                                fontSize: `${15 * theme.fontSizeMultiplier}px`,
                                cursor: 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                gap: '8px'
                            }}
                        >
                            <span>📷</span> Carica Foto o Documento
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

                    {/* AZIONI POST E COMMENTI MODERN SOCIAL */}
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

                        {/* SEZIONE COMMENTI STILE THREADS/INSTAGRAM */}
                        {showComments && (
                            <div style={{
                                marginTop: '20px',
                                paddingTop: '20px',
                                borderTop: `1px solid ${theme.border}`,
                                display: 'flex',
                                flexDirection: 'column',
                                gap: '16px'
                            }}>
                                <form onSubmit={handleAddComment} style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                                    <div style={{
                                        width: '38px',
                                        height: '38px',
                                        borderRadius: '50%',
                                        backgroundColor: theme.primaryBg,
                                        color: theme.primary,
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        fontSize: '18px',
                                        fontWeight: 'bold',
                                        flexShrink: 0
                                    }}>
                                        👤
                                    </div>
                                    <div style={{
                                        flex: 1,
                                        display: 'flex',
                                        alignItems: 'center',
                                        backgroundColor: highContrast ? '#1f2937' : '#f1f5f9',
                                        borderRadius: '24px',
                                        padding: '4px 8px 4px 16px',
                                        border: `1px solid ${theme.border}`
                                    }}>
                                        <input
                                            type="text"
                                            value={newComment}
                                            onChange={(e) => setNewComment(e.target.value)}
                                            placeholder="Aggiungi un commento..."
                                            style={{
                                                flex: 1,
                                                border: 'none',
                                                outline: 'none',
                                                backgroundColor: 'transparent',
                                                color: theme.text,
                                                fontSize: '14px',
                                                padding: '8px 0'
                                            }}
                                        />
                                        <button
                                            type="submit"
                                            disabled={!newComment.trim()}
                                            style={{
                                                backgroundColor: 'transparent',
                                                color: newComment.trim() ? theme.primary : theme.textMuted,
                                                border: 'none',
                                                fontWeight: '700',
                                                fontSize: '14px',
                                                cursor: newComment.trim() ? 'pointer' : 'default',
                                                padding: '6px 12px',
                                                opacity: newComment.trim() ? 1 : 0.5
                                            }}
                                        >
                                            Pubblica
                                        </button>
                                    </div>
                                </form>

                                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginTop: '8px' }}>
                                    {comments.map((comment) => (
                                        <div key={comment.id} style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
                                            <div style={{
                                                width: '36px',
                                                height: '36px',
                                                borderRadius: '50%',
                                                backgroundColor: highContrast ? '#374151' : '#e2e8f0',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                fontSize: '18px',
                                                flexShrink: 0
                                            }}>
                                                {comment.avatar}
                                            </div>

                                            <div style={{ flex: 1 }}>
                                                <div style={{
                                                    backgroundColor: highContrast ? '#1f2937' : '#f8fafc',
                                                    padding: '10px 14px',
                                                    borderRadius: '16px',
                                                    border: `1px solid ${theme.border}`
                                                }}>
                                                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '2px' }}>
                                                        <span style={{ fontWeight: '700', fontSize: '13px', color: theme.text }}>
                                                            {comment.author}
                                                        </span>
                                                        <span style={{ fontSize: '12px', color: theme.textMuted }}>
                                                            {comment.handle}
                                                        </span>
                                                    </div>
                                                    <p style={{ margin: 0, fontSize: '14px', lineHeight: '1.4', color: theme.text }}>
                                                        {comment.text}
                                                    </p>
                                                </div>

                                                <div style={{
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    gap: '16px',
                                                    marginTop: '4px',
                                                    marginLeft: '8px',
                                                    fontSize: '12px',
                                                    color: theme.textMuted,
                                                    fontWeight: '600'
                                                }}>
                                                    <span>{comment.time}</span>
                                                    <button style={{
                                                        background: 'none',
                                                        border: 'none',
                                                        padding: 0,
                                                        color: theme.textMuted,
                                                        fontSize: '12px',
                                                        fontWeight: '700',
                                                        cursor: 'pointer'
                                                    }}>
                                                        Rispondi
                                                    </button>
                                                    {comment.likes > 0 && (
                                                        <span>{comment.likes} {comment.likes === 1 ? 'like' : 'like'}</span>
                                                    )}
                                                </div>
                                            </div>

                                            <button
                                                onClick={() => toggleCommentLike(comment.id)}
                                                style={{
                                                    background: 'none',
                                                    border: 'none',
                                                    cursor: 'pointer',
                                                    fontSize: '14px',
                                                    padding: '4px',
                                                    color: comment.hasLiked ? '#ef4444' : theme.textMuted
                                                }}
                                            >
                                                {comment.hasLiked ? '❤️' : '🤍'}
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </footer>
                </article>

            </main>

            {/* MODALE INTERVISTA GUIDATA */}
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
                                    <p style={{ color: '#dc2626', fontWeight: 'bold', marginTop: '10px' }}>
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

        </div>
    );
}

// INIZIALIZZAZIONE REACT DOM
const container = document.getElementById('root');
if (container) {
    const root = createRoot(container);
    root.render(
        <AccessibilityProvider>
            <MemoryBridgeApp />
        </AccessibilityProvider>
    );
}