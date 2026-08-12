import React, { useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// Inserisci qui il nome o percorso della tua immagine caricata
import fotoFamiglia from "@/images/0014314705.jpg";
import {createRoot} from "react-dom/client";

// ============================================================================
// INTERFACCE E TIPI
// ============================================================================
interface Comment {
    id: string;
    author: string;
    avatar: string;
    date: string;
    text: string;
}

interface MemoryItem {
    id: string;
    year: number;
    catalogCode: string;
    dateStr: string;
    authorName: string;
    authorAvatar: string;
    title: string;
    story: string;
    imageUrl: string;
    likesCount: number;
    comments: Comment[];
}

interface FloatingEmoji {
    id: number;
    emoji: string;
    leftOffset: number;
}

const PRIMARY_COLOR = '#4378EE';
const AVAILABLE_REACTIONS = ['❤️', '👏', '🥹', '✨', '🔥'];

const TIMELINE_MEMORIES: MemoryItem[] = [
    {
        id: 'm1',
        year: 1965,
        catalogCode: 'EXHIBIT 1965-01 / ARCHIVIO HAN',
        dateStr: 'Estate 1965',
        authorName: 'Elena Han',
        authorAvatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=120&q=80',
        title: 'La Grande Riunione di Famiglia',
        story: "Tutti i rami della famiglia riuniti nel cortile di casa. Al centro il nonno con il suo gilet coordinato e gli zii in abito elegante. In primo piano i più piccoli, con i loro abiti della festa in maglia bianca. Un istante scolpito nel tempo che custodisce le nostre radici e il calore indimenticabile di quel pomeriggio d'estate.",
        imageUrl: fotoFamiglia,
        likesCount: 24,
        comments: [
            {
                id: 'c1',
                author: 'Zia Caterina',
                avatar: 'https://images.unsplash.com/photo-1554151228-14d9def656e4?auto=format&fit=crop&w=120&q=80',
                date: '2 ore fa',
                text: 'Che meraviglia rivedere questa foto! Ricordo ancora il profumo delle zeppole che la nonna aveva preparato per tutti.',
            },
            {
                id: 'c2',
                author: 'Marco Han',
                avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=120&q=80',
                date: '1 ora fa',
                text: 'Il bambino a sinistra in prima fila ero io! Avevo un capriccio terribile perché volevo andare a giocare col pallone.',
            },
        ],
    },
    {
        id: 'm2',
        year: 1978,
        catalogCode: 'EXHIBIT 1978-04 / ARCHIVIO ROSSI',
        dateStr: '2 Settembre 1978',
        authorName: 'Roberto Rossi',
        authorAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=120&q=80',
        title: 'Viaggio verso il Mare in Fiat 127',
        story: "Il primo viaggio lungo verso la Calabria con la macchina nuova blu. Valigie sul tettuccio, finestrini abbassati e la musica della radio a farci compagnia durante tutto il tragitto. Una tappa fondamentale nei ricordi della nostra giovinezza.",
        imageUrl: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=1600&q=80',
        likesCount: 18,
        comments: [
            {
                id: 'c3',
                author: 'Luisa Rossi',
                avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=120&q=80',
                date: 'Ieri',
                text: 'Si è fuso il radiatore a metà strada, te lo ricordi? Ma è stato il viaggio più bello di sempre.',
            },
        ],
    },
    {
        id: 'm3',
        year: 1984,
        catalogCode: 'EXHIBIT 1984-09 / ARCHIVIO BIANCHI',
        dateStr: '15 Agosto 1984',
        authorName: 'Anna Bianchi',
        authorAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=80',
        title: 'Pranzo di Ferragosto in Compagnia',
        story: "Tavolate lunghissime all'ombra del pergolato. Risate, bicchieri di vino che si alzano in brindisi continui e piatti colmi di prelibatezze preparate fin dalle prime ore dell'alba.",
        imageUrl: 'https://images.unsplash.com/photo-1511632765486-a01980e01a18?auto=format&fit=crop&w=1600&q=80',
        likesCount: 31,
        comments: [],
    },
    {
        id: 'm4',
        year: 1992,
        catalogCode: 'EXHIBIT 1992-12 / ARCHIVIO VERDI',
        dateStr: 'Natale 1992',
        authorName: 'Giorgio Verdi',
        authorAvatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=120&q=80',
        title: 'La Nevicata Memorabile',
        story: "La città e la casa di campagna completamente sommerse da un metro di neve fresca. Usciti fuori con stivali e sciarpe per costruire un gigantesco pupazzo di neve.",
        imageUrl: 'https://images.unsplash.com/photo-1491002052546-bf38f186af56?auto=format&fit=crop&w=1600&q=80',
        likesCount: 42,
        comments: [],
    },
    {
        id: 'm5',
        year: 1995,
        catalogCode: 'EXHIBIT 1995-03 / ARCHIVIO NERI',
        dateStr: '10 Luglio 1995',
        authorName: 'Martina Neri',
        authorAvatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=120&q=80',
        title: 'Gita in Montagna',
        story: "Passeggiata sui sentieri alpini con zaino in spalla e bastoni da trekking. Aria frizzante e panorama mozzafiato dalla cima.",
        imageUrl: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=1600&q=80',
        likesCount: 15,
        comments: [],
    },
    {
        id: 'm6',
        year: 2001,
        catalogCode: 'EXHIBIT 2001-08 / ARCHIVIO CONTI',
        dateStr: 'Capodanno 2001',
        authorName: 'Davide Conti',
        authorAvatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=120&q=80',
        title: 'Festa di Inizio Millennio',
        story: "Festeggiamenti in piazza con musica, canti e fuochi d'artificio per dare il benvenuto al nuovo millennio insieme agli amici di una vita.",
        imageUrl: 'https://images.unsplash.com/photo-1467810563316-b5476525c0f9?auto=format&fit=crop&w=1600&q=80',
        likesCount: 50,
        comments: [],
    }
];

export default function MuseumSocialPostTimeline() {
    const [selectedMemory, setSelectedMemory] = useState<MemoryItem | null>(TIMELINE_MEMORIES[0]);
    const [showComments, setShowComments] = useState<boolean>(false);
    const [newCommentText, setNewCommentText] = useState<string>('');

    // Reazioni
    const [userReaction, setUserReaction] = useState<string | null>(null);
    const [showReactionPicker, setShowReactionPicker] = useState<boolean>(false);
    const [floatingEmojis, setFloatingEmojis] = useState<FloatingEmoji[]>([]);

    // Riferimento per lo scorrimento del filmstrip
    const filmstripRef = useRef<HTMLDivElement>(null);

    const handleSelectMemory = (item: MemoryItem) => {
        setSelectedMemory(item);
        setShowComments(false);
        setUserReaction(null);
        setShowReactionPicker(false);
        setFloatingEmojis([]);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleToggleReaction = (emoji: string) => {
        if (userReaction === emoji) {
            setUserReaction(null);
        } else {
            setUserReaction(emoji);
            const newFloating: FloatingEmoji = {
                id: Date.now(),
                emoji: emoji,
                leftOffset: Math.random() * 60 + 20,
            };
            setFloatingEmojis((prev) => [...prev, newFloating]);

            setTimeout(() => {
                setFloatingEmojis((prev) => prev.filter((e) => e.id !== newFloating.id));
            }, 1800);
        }
        setShowReactionPicker(false);
    };

    const handleAddComment = (e: React.FormEvent) => {
        e.preventDefault();
        if (!newCommentText.trim() || !selectedMemory) return;

        const newComment: Comment = {
            id: Date.now().toString(),
            author: 'Tu (Ospite)',
            avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=120&q=80',
            date: 'Proprio ora',
            text: newCommentText,
        };

        selectedMemory.comments.push(newComment);
        setNewCommentText('');
    };

    return (
        <div style={{
            position: 'relative',
            minHeight: '100vh',
            backgroundColor: '#090d16',
            color: '#0f172a',
            fontFamily: 'system-ui, -apple-system, sans-serif',
            paddingBottom: '5rem',
            overflowX: 'hidden',
        }}>

            {/* ====================================================================
          1. SFONDO CINEMATOGRAFICO AMBIENTALE
         ==================================================================== */}
            <AnimatePresence mode="wait">
                {selectedMemory && (
                    <motion.div
                        key={selectedMemory.id}
                        initial={{ opacity: 0, scale: 1.08 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 1.03 }}
                        transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1] }}
                        style={{
                            position: 'fixed',
                            inset: 0,
                            zIndex: 0,
                            backgroundImage: `url(${selectedMemory.imageUrl})`,
                            backgroundSize: 'cover',
                            backgroundPosition: 'center',
                            filter: 'blur(14px) brightness(0.85)',
                            transform: 'scale(1.05)',
                        }}
                    />
                )}
            </AnimatePresence>

            {/* VELO DI LUMINOSITÀ ED ELEGANZA */}
            <div style={{
                position: 'fixed',
                inset: 0,
                zIndex: 1,
                background: 'linear-gradient(180deg, rgba(248, 250, 252, 0.65) 0%, rgba(248, 250, 252, 0.82) 100%)',
                pointerEvents: 'none',
            }} />

            {/* ====================================================================
          2. NAVIGATION BAR MEMORYBRIDGE (#4378EE)
         ==================================================================== */}
            <nav style={{
                position: 'sticky',
                top: 0,
                zIndex: 50,
                backgroundColor: 'rgba(255, 255, 255, 0.88)',
                backdropFilter: 'blur(20px)',
                borderBottom: '1px solid rgba(226, 232, 240, 0.8)',
                padding: '0.85rem 3rem',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                boxShadow: '0 4px 25px rgba(0, 0, 0, 0.05)',
            }}>
                {/* LOGO */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', cursor: 'pointer' }}>
                    <div style={{
                        width: '36px',
                        height: '36px',
                        borderRadius: '10px',
                        backgroundColor: PRIMARY_COLOR,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: '#ffffff',
                        fontWeight: 'bold',
                        fontSize: '0.9rem',
                        boxShadow: '0 4px 12px rgba(67, 120, 238, 0.35)',
                    }}>
                        MB
                    </div>
                    <span style={{ fontSize: '1.25rem', fontWeight: 700, color: '#0f172a', letterSpacing: '-0.02em' }}>
                        Memory<span style={{ color: PRIMARY_COLOR, fontWeight: 500 }}>Bridge</span>
                    </span>
                </div>

                {/* NAVIGATION LINKS */}
                <div style={{ display: 'flex', gap: '2.5rem', alignItems: 'center' }}>
                    <a href="#timeline" style={{ color: PRIMARY_COLOR, textDecoration: 'none', fontSize: '0.9rem', fontWeight: 600 }}>
                        Timeline
                    </a>
                    <a href="#galleria" style={{ color: '#475569', textDecoration: 'none', fontSize: '0.9rem', fontWeight: 500 }}>
                        Esplora Ricordi
                    </a>
                    <a href="#famiglia" style={{ color: '#475569', textDecoration: 'none', fontSize: '0.9rem', fontWeight: 500 }}>
                        Albero di Famiglia
                    </a>
                </div>

                {/* AZIONI UTENTE */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
                    <button style={{
                        backgroundColor: PRIMARY_COLOR,
                        color: '#ffffff',
                        border: 'none',
                        padding: '0.55rem 1.2rem',
                        borderRadius: '8px',
                        fontSize: '0.85rem',
                        fontWeight: 600,
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.4rem',
                        boxShadow: '0 4px 12px rgba(67, 120, 238, 0.3)',
                    }}>
                        <span style={{ fontSize: '1.1rem', lineHeight: 1 }}>+</span> Aggiungi Ricordo
                    </button>

                    <img
                        src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=120&q=80"
                        alt="Profilo Tuo"
                        style={{
                            width: '38px',
                            height: '38px',
                            borderRadius: '50%',
                            border: `2px solid ${PRIMARY_COLOR}`,
                            cursor: 'pointer',
                            objectFit: 'cover',
                        }}
                    />
                </div>
            </nav>

            {/* ====================================================================
          3. ESPOSIZIONE DI GALLERIA (TITOLO CENTRATO E LAYOUT A DUE COLONNE)
         ==================================================================== */}
            <div style={{ position: 'relative', zIndex: 10, maxWidth: '1800px', margin: '0 auto', padding: '3rem 9rem 0 9rem' }}>

                {/* TITOLO PRINCIPALE CENTRATO */}
                <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
                    <span style={{
                        fontSize: '0.75rem',
                        letterSpacing: '0.2em',
                        textTransform: 'uppercase',
                        color: PRIMARY_COLOR,
                        fontWeight: 800,
                        display: 'block',
                        marginBottom: '0.4rem'
                    }}>
                        ARCHIVIO DELLA MEMORIA FAMILIARE
                    </span>
                    <h1 style={{
                        fontSize: '2.4rem',
                        fontWeight: 700,
                        color: '#0f172a',
                        margin: 0,
                        fontFamily: 'system-ui, -apple-system, sans-serif'
                    }}>
                        Racconto del Post
                    </h1>
                </div>

                <AnimatePresence mode="wait">
                    {selectedMemory && (
                        <div key={selectedMemory.id} style={{
                            display: 'grid',
                            gridTemplateColumns: '2.6fr 1fr',
                            gap: 0,
                            alignItems: 'stretch',
                            marginBottom: '3.5rem',
                            borderRadius: '28px',
                            boxShadow: '0 30px 70px rgba(0,0,0,0.12)',
                            overflow: 'hidden',
                        }}>

                            {/* --------------------------------------------------------------
                  COLONNA SINISTRA: FOTO MONUMENTALE (2/4 DEL LAYOUT = 50%)
                 -------------------------------------------------------------- */}
                            <motion.div
                                initial={{ opacity: 0, y: 40, scale: 0.96 }}
                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                exit={{ opacity: 0, y: -20, scale: 0.97 }}
                                transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
                                style={{
                                    position: 'relative',
                                    backgroundColor: 'rgba(255, 255, 255, 0.95)',
                                    padding: '0.5rem',
                                    backdropFilter: 'blur(20px)',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    justifyContent: 'flex-start',
                                    paddingTop: '2rem',
                                    height: '100%',
                                }}
                            >
                                <div style={{
                                    position: 'relative',
                                    borderRadius: '20px',
                                    overflow: 'hidden',
                                    height: '750px',
                                    backgroundColor: '#0b1329',
                                }}>
                                    <img
                                        src={selectedMemory.imageUrl}
                                        alt={selectedMemory.title}
                                        style={{
                                            width: '100%',
                                            height: '100%',
                                            objectFit: 'cover',
                                            objectPosition: 'center',
                                            display: 'block',
                                        }}
                                    />

                                    {/* ETICHETTA ANNO E MUSEO */}
                                    <div style={{
                                        position: 'absolute',
                                        top: '1.5rem',
                                        left: '1.5rem',
                                        display: 'flex',
                                        gap: '0.6rem',
                                        alignItems: 'center',
                                    }}>
                                        <span style={{
                                            backgroundColor: PRIMARY_COLOR,
                                            color: '#ffffff',
                                            fontWeight: 800,
                                            fontSize: '0.85rem',
                                            padding: '0.45rem 1rem',
                                            borderRadius: '30px',
                                            boxShadow: '0 4px 15px rgba(67, 120, 238, 0.4)',
                                        }}>
                                            {selectedMemory.year}
                                        </span>
                                        <span style={{
                                            backgroundColor: 'rgba(15, 23, 42, 0.65)',
                                            color: '#ffffff',
                                            fontWeight: 600,
                                            fontSize: '0.75rem',
                                            padding: '0.45rem 0.9rem',
                                            borderRadius: '30px',
                                            backdropFilter: 'blur(10px)',
                                            border: '1px solid rgba(255,255,255,0.2)',
                                        }}>
                                            {selectedMemory.catalogCode}
                                        </span>
                                    </div>

                                    {/* REAZIONI FLUTTUANTI */}
                                    <AnimatePresence>
                                        {floatingEmojis.map((item) => (
                                            <motion.span
                                                key={item.id}
                                                initial={{ opacity: 1, y: 520, scale: 0.8 }}
                                                animate={{ opacity: 0, y: -40, scale: 2.2 }}
                                                transition={{ duration: 1.8, ease: 'easeOut' }}
                                                style={{
                                                    position: 'absolute',
                                                    left: `${item.leftOffset}%`,
                                                    fontSize: '2.8rem',
                                                    pointerEvents: 'none',
                                                    filter: 'drop-shadow(0 4px 12px rgba(0,0,0,0.4))',
                                                }}
                                            >
                                                {item.emoji}
                                            </motion.span>
                                        ))}
                                    </AnimatePresence>
                                </div>
                            </motion.div>

                            {/* --------------------------------------------------------------
                  COLONNA DESTRA: DESCRIZIONE E COMMENTI (SEZIONE ORIGINALE INVARIATA)
                 -------------------------------------------------------------- */}
                            <motion.div
                                initial={{ opacity: 0, y: -40 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -30 }}
                                transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                                style={{
                                    backgroundColor: 'rgba(255, 255, 255, 0.92)',
                                    padding: '2.5rem',
                                    backdropFilter: 'blur(20px)',
                                    borderLeft: '1px solid rgba(226,232,240,0.7)',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    gap: '1.75rem',
                                    minHeight: '750px',
                                    justifyContent: 'space-between',
                                }}
                            >
                                <div>
                                    {/* METADATI E AUTORE */}
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
                                            <img
                                                src={selectedMemory.authorAvatar}
                                                alt={selectedMemory.authorName}
                                                style={{
                                                    width: '48px',
                                                    height: '48px',
                                                    borderRadius: '50%',
                                                    objectFit: 'cover',
                                                    border: '2px solid #ffffff',
                                                    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                                                }}
                                            />
                                            <div>
                                                <h4 style={{ margin: 0, fontSize: '1.05rem', fontWeight: 700, color: '#0f172a' }}>
                                                    {selectedMemory.authorName}
                                                </h4>
                                                <span style={{ fontSize: '0.78rem', color: '#64748b' }}>
                                                    Pubblicato • {selectedMemory.dateStr}
                                                </span>
                                            </div>
                                        </div>

                                        <button
                                            onClick={() => setSelectedMemory(null)}
                                            style={{
                                                background: 'rgba(241, 245, 249, 0.9)',
                                                border: 'none',
                                                color: '#64748b',
                                                width: '34px',
                                                height: '34px',
                                                borderRadius: '50%',
                                                cursor: 'pointer',
                                                fontWeight: 'bold',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                fontSize: '0.9rem',
                                            }}
                                        >
                                            ✕
                                        </button>
                                    </div>

                                    <hr style={{ border: 'none', borderTop: '1px solid #e2e8f0', margin: '0 0 1.75rem 0' }} />

                                    {/* TITOLO (SEZIONE DESCRIZIONE) */}
                                    <div>
                                        <span style={{
                                            fontSize: '0.75rem',
                                            letterSpacing: '0.15em',
                                            textTransform: 'uppercase',
                                            color: PRIMARY_COLOR,
                                            fontWeight: 800,
                                        }}>
                                            Scheda Descrittiva
                                        </span>
                                        <h2 style={{
                                            fontSize: '2.1rem',
                                            fontWeight: 700,
                                            color: '#0f172a',
                                            margin: '0.4rem 0 1.25rem 0',
                                            lineHeight: 1.2,
                                            fontFamily: 'Georgia, "Times New Roman", serif',
                                        }}>
                                            {selectedMemory.title}
                                        </h2>
                                    </div>

                                    {/* PARAGRAFO RACCONTO */}
                                    <p style={{
                                        fontSize: '1.1rem',
                                        lineHeight: 1.85,
                                        color: '#334155',
                                        margin: 0,
                                        fontFamily: 'Georgia, "Times New Roman", serif',
                                    }}>
                                        {selectedMemory.story}
                                    </p>
                                </div>

                                {/* AREA INTERATTIVA: REAZIONI E COMMENTI */}
                                <div>
                                    <div style={{
                                        position: 'relative',
                                        paddingTop: '1.25rem',
                                        borderTop: '1px solid #f1f5f9',
                                        display: 'flex',
                                        justifyContent: 'space-between',
                                        alignItems: 'center',
                                    }}>
                                        {/* POPUP SELETTORE EMOJI */}
                                        <AnimatePresence>
                                            {showReactionPicker && (
                                                <motion.div
                                                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                                    animate={{ opacity: 1, y: -52, scale: 1 }}
                                                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                                                    transition={{ duration: 0.2 }}
                                                    style={{
                                                        position: 'absolute',
                                                        left: 0,
                                                        backgroundColor: '#ffffff',
                                                        border: '1px solid #e2e8f0',
                                                        borderRadius: '30px',
                                                        padding: '0.4rem 0.8rem',
                                                        display: 'flex',
                                                        gap: '0.6rem',
                                                        boxShadow: '0 10px 30px rgba(0,0,0,0.12)',
                                                        zIndex: 20,
                                                    }}
                                                >
                                                    {AVAILABLE_REACTIONS.map((emoji) => (
                                                        <motion.button
                                                            key={emoji}
                                                            whileHover={{ scale: 1.35 }}
                                                            whileTap={{ scale: 0.9 }}
                                                            onClick={() => handleToggleReaction(emoji)}
                                                            style={{
                                                                background: 'transparent',
                                                                border: 'none',
                                                                fontSize: '1.4rem',
                                                                cursor: 'pointer',
                                                                padding: '0.2rem',
                                                                lineHeight: 1,
                                                            }}
                                                        >
                                                            {emoji}
                                                        </motion.button>
                                                    ))}
                                                </motion.div>
                                            )}
                                        </AnimatePresence>

                                        <div style={{ display: 'flex', gap: '0.8rem', alignItems: 'center' }}>
                                            <button
                                                onClick={() => setShowReactionPicker(!showReactionPicker)}
                                                style={{
                                                    background: userReaction ? '#eff6ff' : '#ffffff',
                                                    border: userReaction ? `1px solid ${PRIMARY_COLOR}` : '1px solid #cbd5e1',
                                                    color: userReaction ? PRIMARY_COLOR : '#475569',
                                                    padding: '0.55rem 1.2rem',
                                                    fontSize: '0.85rem',
                                                    fontWeight: 600,
                                                    cursor: 'pointer',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    gap: '0.5rem',
                                                    borderRadius: '8px',
                                                    transition: 'all 0.2s',
                                                }}
                                            >
                                                <span>{userReaction ? userReaction : '🤍'}</span>
                                                <span>{userReaction ? 'Hai reagito' : 'Reagisci'}</span>
                                            </button>

                                            <span style={{ fontSize: '0.85rem', color: '#64748b', fontWeight: 600 }}>
                                                {selectedMemory.likesCount + (userReaction ? 1 : 0)} reazioni
                                            </span>
                                        </div>

                                        <button
                                            onClick={() => setShowComments(!showComments)}
                                            style={{
                                                background: showComments ? '#f1f5f9' : '#ffffff',
                                                border: '1px solid #cbd5e1',
                                                color: '#475569',
                                                padding: '0.55rem 1.2rem',
                                                fontSize: '0.85rem',
                                                fontWeight: 600,
                                                cursor: 'pointer',
                                                display: 'flex',
                                                alignItems: 'center',
                                                gap: '0.5rem',
                                                borderRadius: '8px',
                                            }}
                                        >
                                            💬 {selectedMemory.comments.length} Commenti
                                        </button>
                                    </div>

                                    {/* SEZIONE COMMENTI ESPANDIBILE */}
                                    <AnimatePresence>
                                        {showComments && (
                                            <motion.div
                                                initial={{ opacity: 0, height: 0 }}
                                                animate={{ opacity: 1, height: 'auto' }}
                                                exit={{ opacity: 0, height: 0 }}
                                                transition={{ duration: 0.3 }}
                                                style={{
                                                    backgroundColor: '#f8fafc',
                                                    borderRadius: '12px',
                                                    padding: '1rem',
                                                    marginTop: '1rem',
                                                    border: '1px solid #e2e8f0',
                                                }}
                                            >
                                                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem', marginBottom: '1rem', maxHeight: '140px', overflowY: 'auto' }}>
                                                    {selectedMemory.comments.map((comment) => (
                                                        <div key={comment.id} style={{ display: 'flex', gap: '0.7rem' }}>
                                                            <img src={comment.avatar} alt={comment.author} style={{ width: '28px', height: '28px', borderRadius: '50%', objectFit: 'cover' }}/>
                                                            <div style={{ backgroundColor: '#ffffff', borderRadius: '8px', padding: '0.5rem 0.8rem', flex: 1, border: '1px solid #e2e8f0' }}>
                                                                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', marginBottom: '0.1rem' }}>
                                                                    <span style={{ fontWeight: 700, color: '#0f172a' }}>{comment.author}</span>
                                                                    <span style={{ color: '#94a3b8' }}>{comment.date}</span>
                                                                </div>
                                                                <p style={{ margin: 0, fontSize: '0.8rem', color: '#334155' }}>{comment.text}</p>
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                                <form onSubmit={handleAddComment} style={{ display: 'flex', gap: '0.5rem' }}>
                                                    <input
                                                        type="text"
                                                        placeholder="Aggiungi un aneddoto..."
                                                        value={newCommentText}
                                                        onChange={(e) => setNewCommentText(e.target.value)}
                                                        style={{
                                                            flex: 1,
                                                            backgroundColor: '#ffffff',
                                                            border: '1px solid #cbd5e1',
                                                            borderRadius: '6px',
                                                            padding: '0.5rem 0.8rem',
                                                            color: '#0f172a',
                                                            fontSize: '0.8rem',
                                                            outline: 'none',
                                                        }}
                                                    />
                                                    <button
                                                        type="submit"
                                                        style={{
                                                            backgroundColor: PRIMARY_COLOR,
                                                            color: '#ffffff',
                                                            border: 'none',
                                                            borderRadius: '6px',
                                                            padding: '0.5rem 1rem',
                                                            fontWeight: 600,
                                                            fontSize: '0.8rem',
                                                            cursor: 'pointer',
                                                        }}
                                                    >
                                                        Invia
                                                    </button>
                                                </form>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </div>
                            </motion.div>
                        </div>
                    )}
                </AnimatePresence>

                {/* ====================================================================
                  4. STRISCIA PELLICOLA ORIZZONTALE (STILE TIMELINE A RULLINO)
                 ==================================================================== */}
                <div style={{ width: '100%', marginTop: '3rem' }}>

                    {/* INTESTAZIONE DELLA TIMELINE */}
                    <h3 style={{
                        fontSize: '0.85rem',
                        letterSpacing: '0.15em',
                        textTransform: 'uppercase',
                        color: '#64748b',
                        fontWeight: 700,
                        marginBottom: '1rem',
                        fontFamily: 'inherit',
                    }}>
                        Sfoglia Altri Post della Timeline
                    </h3>

                    {/* CONTENITORE CON FRECCE E STRISCIA */}
                    <div style={{ position: 'relative', display: 'flex', alignItems: 'center', width: '100%' }}>

                        {/* FRECCIA SINISTRA (TRASPARENTE CON HOVER) */}
                        <button
                            onClick={() => filmstripRef.current?.scrollBy({ left: -350, behavior: 'smooth' })}
                            onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.9)'; e.currentTarget.style.color = '#4378EE'; }}
                            onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.2)'; e.currentTarget.style.color = 'white'; }}
                            style={{
                                position: 'absolute',
                                left: '-20px',
                                zIndex: 20,
                                backgroundColor: 'rgba(255, 255, 255, 0.2)',
                                border: '1px solid rgba(255,255,255,0.3)',
                                borderRadius: '50%',
                                width: '45px',
                                height: '45px',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                cursor: 'pointer',
                                transition: 'all 0.3s ease',
                                fontSize: '1.2rem',
                                color: 'white',
                                boxShadow: '0 4px 15px rgba(0,0,0,0.2)',
                            }}
                        >
                            ◀
                        </button>

                        {/* STRISCIA ORIZZONTALE CON LE VIGNETTE IN STILE CARD CHIARA */}
                        <div
                            ref={filmstripRef}
                            style={{
                                display: 'flex',
                                gap: '1.5rem',
                                overflowX: 'auto',
                                padding: '1rem 0.5rem',
                                width: '100%',
                                scrollbarWidth: 'none',
                                msOverflowStyle: 'none',
                            }}
                        >
                            {TIMELINE_MEMORIES.map((item) => {
                                const isSelected = selectedMemory?.id === item.id;
                                return (
                                    <div
                                        key={item.id}
                                        onClick={() => handleSelectMemory(item)}
                                        style={{
                                            minWidth: '340px',
                                            maxWidth: '340px',
                                            flexShrink: 0,
                                            backgroundColor: '#ffffff',
                                            borderRadius: '20px',
                                            padding: '14px',
                                            cursor: 'pointer',
                                            boxShadow: '0 10px 30px rgba(0,0,0,0.08)',
                                            border: isSelected ? '2px solid #4378EE' : '2px solid transparent',
                                            transition: 'all 0.2s ease',
                                        }}
                                    >
                                        {/* FOTO CON BADGE DELL'ANNO IN BASSO A SINISTRA */}
                                        <div style={{
                                            position: 'relative',
                                            height: '240px',
                                            borderRadius: '12px',
                                            overflow: 'hidden',
                                            backgroundColor: '#000000',
                                        }}>
                                            <img
                                                src={item.imageUrl}
                                                alt={item.title}
                                                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                            />
                                            <span style={{
                                                position: 'absolute',
                                                bottom: '10px',
                                                left: '10px',
                                                backgroundColor: '#4378EE',
                                                color: '#ffffff',
                                                fontWeight: 700,
                                                fontSize: '0.75rem',
                                                padding: '0.25rem 0.7rem',
                                                borderRadius: '6px',
                                                boxShadow: '0 2px 8px rgba(0,0,0,0.3)',
                                            }}>
                                        {item.year}
                                    </span>
                                        </div>

                                        {/* TITOLO SOTTO LA FOTO (PIÙ COMPATTO) */}
                                        <div style={{ padding: '8px 2px 2px 2px' }}>
                                            <h4 style={{
                                                fontSize: '0.9rem',
                                                fontWeight: 700,
                                                color: '#0f172a',
                                                margin: 0,
                                                whiteSpace: 'nowrap',
                                                overflow: 'hidden',
                                                textOverflow: 'ellipsis',
                                            }}>
                                                {item.title}
                                            </h4>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>

                        {/* FRECCIA DESTRA (TRASPARENTE CON HOVER) */}
                        <button
                            onClick={() => filmstripRef.current?.scrollBy({ left: 350, behavior: 'smooth' })}
                            onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.9)'; e.currentTarget.style.color = '#4378EE'; }}
                            onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.2)'; e.currentTarget.style.color = 'white'; }}
                            style={{
                                position: 'absolute',
                                right: '-20px',
                                zIndex: 20,
                                backgroundColor: 'rgba(255, 255, 255, 0.2)',
                                border: '1px solid rgba(255,255,255,0.3)',
                                borderRadius: '50%',
                                width: '45px',
                                height: '45px',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                cursor: 'pointer',
                                transition: 'all 0.3s ease',
                                fontSize: '1.2rem',
                                color: 'white',
                                boxShadow: '0 4px 15px rgba(0,0,0,0.2)',
                            }}
                        >
                            ▶
                        </button>
                    </div>
                </div>

            </div>
        </div>
    );
}

const container = document.getElementById('root');
if (container) {
    const root = createRoot(container);
    root.render(<MuseumSocialPostTimeline/>);
}