import React from 'react';
import irisAvatar from '@/shared/Iris/Iris.png';
import styles from './IrisDailySuggestion.module.css';

interface IrisDailySuggestionProps {
    /** Testo dello spunto generato da Iris IA */
    quote: string;
    /** Callback invocata al click su "Crea Ricordo" */
    onCreateMemory: () => void;
}

export default function IrisDailySuggestion({ quote, onCreateMemory }: IrisDailySuggestionProps) {
    return (
        <section className={styles.section}>
            <img src={irisAvatar} alt="Iris IA" className={styles.avatar} />

            <div className={styles.textWrap}>
                <span className={styles.labelRow}>
                    <span className={styles.label}>Iris IA consiglia :</span>
                    <span className={styles.badge}>AI</span>
                </span>
                <p className={styles.quote}>"{quote}"</p>
            </div>

            <button className={styles.button} onClick={onCreateMemory}>
                ✨ Crea Ricordo
            </button>
        </section>
    );
}