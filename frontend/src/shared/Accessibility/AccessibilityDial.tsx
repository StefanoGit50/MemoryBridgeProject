import React, { createContext, useContext, useState, ReactNode } from 'react';
import owlMascot from "@/shared/Iris/Iris.png";
import styles from "./AccessibilityDial.module.css";

// ============================================================
// CONTEXT CONDIVISO — invariato rispetto a prima
// ============================================================
interface AccessibilityContextValue {
    highContrast: boolean;
    largeFont: boolean;
    toggleHighContrast: () => void;
    toggleLargeFont: () => void;
}

const AccessibilityContext = createContext<AccessibilityContextValue | null>(null);

export function AccessibilityProvider({ children }: { children: ReactNode }) {
    const [highContrast, setHighContrast] = useState(() =>
        document.documentElement.classList.contains('high-contrast')
    );
    const [largeFont, setLargeFont] = useState(() =>
        document.documentElement.classList.contains('large-font')
    );

    const toggleHighContrast = () => {
        setHighContrast((prev) => {
            const next = !prev;
            document.documentElement.classList.toggle('high-contrast', next);
            return next;
        });
    };

    const toggleLargeFont = () => {
        setLargeFont((prev) => {
            const next = !prev;
            document.documentElement.classList.toggle('large-font', next);
            return next;
        });
    };

    return (
        <AccessibilityContext.Provider value={{ highContrast, largeFont, toggleHighContrast, toggleLargeFont }}>
            {children}
        </AccessibilityContext.Provider>
    );
}

export function useAccessibilitySettings() {
    const ctx = useContext(AccessibilityContext);
    if (!ctx) {
        throw new Error('useAccessibilitySettings deve stare dentro <AccessibilityProvider>');
    }
    return ctx;
}

// Piccolo helper per concatenare classi condizionali senza dipendenze esterne
function cx(...classes: (string | false | undefined)[]) {
    return classes.filter(Boolean).join(' ');
}

// ============================================================
// COMPONENTE — ora usa styles.* invece di style inline
// ============================================================

interface AccessibilityDialProps {
    onOpenChat?: () => void;
}

export function AccessibilityDial({ onOpenChat }: AccessibilityDialProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [isDismissed, setIsDismissed] = useState(false);
    const [isHovered, setIsHovered] = useState(false);
    const [hoveredButton, setHoveredButton] = useState<string | null>(null);

    const { highContrast, largeFont, toggleHighContrast, toggleLargeFont } = useAccessibilitySettings();

    return (
        <aside
            onMouseEnter={() => {
                setIsHovered(true);
                if (isDismissed) setIsDismissed(false);
            }}
            onMouseLeave={() => {
                setIsHovered(false);
                setHoveredButton(null);
            }}
            className={cx(styles.wrapper, isDismissed && styles.dismissed)}
        >
            {!isOpen && !isDismissed && (
                <div className={styles.welcomeBubble}>
                    Come Posso Aiutarti? 🦉
                </div>
            )}

            {isHovered && !isDismissed && (
                <button
                    onClick={(e) => {
                        e.stopPropagation();
                        setIsDismissed(true);
                        setIsOpen(false);
                    }}
                    title="Rendi trasparente"
                    aria-label="Nascondi dial"
                    className={styles.dismissButton}
                >
                    ✕
                </button>
            )}

            {/* Alto contrasto */}
            <div
                onMouseEnter={() => setHoveredButton('contrast')}
                onMouseLeave={() => setHoveredButton(null)}
                className={cx(styles.iconWrapper, styles.contrastWrapper, isOpen && styles.open)}
            >
                {hoveredButton === 'contrast' && (
                    <span className={styles.tooltip}>
                        {highContrast ? 'Contrasto Standard' : 'Alto Contrasto'}
                    </span>
                )}
                <button
                    onClick={toggleHighContrast}
                    aria-label="Alto contrasto"
                    className={cx(styles.circleButton, highContrast && styles.contrastActive)}
                >
                    {highContrast ? '☀️' : '👁️'}
                </button>
            </div>

            {/* Font ingrandito */}
            <div
                onMouseEnter={() => setHoveredButton('font')}
                onMouseLeave={() => setHoveredButton(null)}
                className={cx(styles.iconWrapper, styles.fontWrapper, isOpen && styles.open)}
            >
                {hoveredButton === 'font' && (
                    <span className={styles.tooltip}>
                        {largeFont ? 'Testo Normale' : 'Testo Ingrandito'}
                    </span>
                )}
                <button
                    onClick={toggleLargeFont}
                    aria-label="Ingrandisci testo"
                    className={cx(styles.circleButton, largeFont && styles.fontActive)}
                >
                    🔍
                </button>
            </div>

            {/* Chat con Iris */}
            <div
                onMouseEnter={() => setHoveredButton('chat')}
                onMouseLeave={() => setHoveredButton(null)}
                className={cx(styles.iconWrapper, styles.chatWrapper, isOpen && styles.open)}
            >
                {hoveredButton === 'chat' && (
                    <span className={styles.tooltip}>Chatta con Iris</span>
                )}
                <button
                    onClick={() => {
                        if (onOpenChat) onOpenChat();
                        setIsOpen(false);
                    }}
                    aria-label="Chatta con Iris"
                    className={styles.circleButton}
                >
                    💬
                </button>
            </div>

            {/* Pulsante principale (gufo) */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                title="Opzioni di Accessibilità"
                aria-label="Apri menu accessibilità"
                className={cx(styles.mainButton, isOpen && styles.open)}
            >
                <img
                    src={owlMascot}
                    alt="Mascotte Gufo Iris"
                    className={styles.mainImage}
                />
            </button>
        </aside>
    );
}