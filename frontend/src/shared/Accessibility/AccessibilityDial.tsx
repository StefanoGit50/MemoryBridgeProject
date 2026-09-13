import React, { createContext, useContext, useState, ReactNode } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import owlMascot from "@/shared/Iris/Iris.png";
import styles from "./AccessibilityDial.module.css";

type ColorblindMode = 'none' | 'protanopia' | 'deuteranopia' | 'tritanopia';

interface AccessibilityContextValue {
    highContrast: boolean;
    fontScale: number;
    colorblindMode: ColorblindMode;
    toggleHighContrast: () => void;
    setHighContrast: (value: boolean) => void;
    setFontScale: (value: number) => void;
    setColorblindMode: (mode: ColorblindMode) => void;
}

const AccessibilityContext = createContext<AccessibilityContextValue | null>(null);

export function AccessibilityProvider({ children }: { children: ReactNode }) {
    const [highContrast, setHighContrastState] = useState(() =>
        document.documentElement.classList.contains('high-contrast')
    );
    const [fontScale, setFontScaleState] = useState(100);
    const [colorblindMode, setColorblindModeState] = useState<ColorblindMode>('none');

    const applyColorblindMode = (mode: ColorblindMode) => {
        document.documentElement.style.filter = mode === 'none' ? '' : `url(#a11y-${mode})`;
        setColorblindModeState(mode);
    };

    const applyHighContrast = (value: boolean) => {
        document.documentElement.classList.toggle('high-contrast', value);
        setHighContrastState(value);
    };

    const applyFontScale = (value: number) => {
        document.documentElement.style.zoom = `${value}%`;
        setFontScaleState(value);
    };

    return (
        <AccessibilityContext.Provider
            value={{
                highContrast,
                fontScale,
                colorblindMode,
                toggleHighContrast: () => applyHighContrast(!highContrast),
                setHighContrast: applyHighContrast,
                setFontScale: applyFontScale,
                setColorblindMode: applyColorblindMode,
            }}
        >
            {children}
            <svg width="0" height="0" style={{ position: 'absolute' }} aria-hidden="true">
                <defs>
                    <filter id="a11y-protanopia">
                        <feColorMatrix type="matrix" values="0.567,0.433,0,0,0  0.558,0.442,0,0,0  0,0.242,0.758,0,0  0,0,0,1,0" />
                    </filter>
                    <filter id="a11y-deuteranopia">
                        <feColorMatrix type="matrix" values="0.625,0.375,0,0,0  0.7,0.3,0,0,0  0,0.3,0.7,0,0  0,0,0,1,0" />
                    </filter>
                    <filter id="a11y-tritanopia">
                        <feColorMatrix type="matrix" values="0.95,0.05,0,0,0  0,0.433,0.567,0,0  0,0.475,0.525,0,0  0,0,0,1,0" />
                    </filter>
                </defs>
            </svg>
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

function cx(...classes: (string | false | undefined)[]) {
    return classes.filter(Boolean).join(' ');
}

interface AccessibilityDialProps {
    onOpenChat?: () => void;
}

export function AccessibilityDial({ onOpenChat }: AccessibilityDialProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [isDismissed, setIsDismissed] = useState(false);
    const [isHovered, setIsHovered] = useState(false);

    const { highContrast, fontScale, colorblindMode, setHighContrast, setFontScale, setColorblindMode } = useAccessibilitySettings();

    return (
        <div
            onMouseEnter={() => {
                setIsHovered(true);
                if (isDismissed) setIsDismissed(false);
            }}
            onMouseLeave={() => setIsHovered(false)}
            className={cx(styles.wrapper, isDismissed && styles.dismissed)}
        >
            {!isOpen && !isDismissed && (
                <div className={styles.welcomeBubble}>
                    Come Posso Aiutarti? 🦉
                </div>
            )}

            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        className={styles.panel}
                        initial={{ opacity: 0, y: 24, scale: 0.92 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 16, scale: 0.94 }}
                        transition={{ type: 'spring', stiffness: 380, damping: 28 }}
                    >
                        <header className={styles.panelHeader}>
                            <span className={styles.panelTitle}>Menu di Accessibilità</span>
                            <button
                                onClick={() => setIsOpen(false)}
                                aria-label="Chiudi menu accessibilità"
                                className={styles.panelClose}
                            >
                                ✕
                            </button>
                        </header>

                        <div className={styles.fontRow}>
                            <span className={styles.fontRowLabel}>
                                <span className={styles.fontRowIcon}>Aa</span> Dimensione carattere
                            </span>
                            <button onClick={() => setFontScale(100)} className={styles.resetButton}>
                                ↺ Ripristina
                            </button>
                        </div>

                        <div className={styles.fontSlider}>
                            <button
                                onClick={() => setFontScale(Math.max(100, fontScale - 5))}
                                disabled={fontScale <= 100}
                                aria-label="Riduci dimensione testo"
                                className={styles.sliderBtn}
                            >
                                −
                            </button>

                            <input
                                type="range"
                                min={100}
                                max={150}
                                step={5}
                                value={fontScale}
                                onChange={(e) => setFontScale(Number(e.target.value))}
                                aria-label="Dimensione carattere"
                                className={styles.sliderInput}
                            />

                            <span className={styles.sliderValue}>{fontScale}%</span>

                            <button
                                onClick={() => setFontScale(Math.min(150, fontScale + 5))}
                                disabled={fontScale >= 150}
                                aria-label="Aumenta dimensione testo"
                                className={styles.sliderBtn}
                            >
                                +
                            </button>
                        </div>

                        <div className={styles.optionsGrid}>
                            <button
                                onClick={() => setHighContrast(!highContrast)}
                                className={cx(styles.optionCard, highContrast && styles.optionCardActive)}
                            >
                                <span className={styles.optionIcon}>{highContrast ? '☀️' : '👁️'}</span>
                                <span>{highContrast ? 'Contrasto standard' : 'Alto contrasto'}</span>
                            </button>

                            <div className={styles.colorblindBlock}>
                                <span className={styles.colorblindLabel}>🎨 Regolazione per daltonici</span>
                                <div className={styles.colorblindChips}>
                                    {([
                                        { mode: 'protanopia', label: 'Protanopia' },
                                        { mode: 'deuteranopia', label: 'Deuteranopia' },
                                        { mode: 'tritanopia', label: 'Tritanopia' },
                                    ] as const).map(({ mode, label }) => (
                                        <button
                                            key={mode}
                                            onClick={() => setColorblindMode(colorblindMode === mode ? 'none' : mode)}
                                            className={cx(styles.colorblindChip, colorblindMode === mode && styles.colorblindChipActive)}
                                        >
                                            {label}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <button
                                onClick={() => {
                                    onOpenChat?.();
                                    setIsOpen(false);
                                }}
                                className={styles.optionCard}
                            >
                                <span className={styles.optionIcon}>💬</span>
                                <span>Chatta con Iris</span>
                            </button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            <div className={styles.buttonAnchor}>
                {isHovered && !isDismissed && !isOpen && (
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            setIsDismissed(true);
                        }}
                        title="Rendi trasparente"
                        aria-label="Nascondi dial"
                        className={styles.dismissButton}
                    >
                        ✕
                    </button>
                )}

                <button
                    onClick={() => setIsOpen(!isOpen)}
                    title="Opzioni di Accessibilità"
                    aria-label="Apri menu accessibilità"
                    className={cx(styles.mainButton, isOpen && styles.open)}
                >
                    <img src={owlMascot} alt="Mascotte Gufo Iris" className={styles.mainImage} />
                </button>
            </div>
        </div>
    );
}