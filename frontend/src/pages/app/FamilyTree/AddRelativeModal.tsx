import React, { useState } from 'react';
import type { FamilyMember, RelationType } from './types';
import styles from './AddRelative.module.css';

interface AddRelativeModalProps {
    targetMember: FamilyMember;
    relationType: RelationType;
    onClose: () => void;
    onSubmit: (data: Omit<FamilyMember, 'id' | 'memoriesCount' | 'x' | 'y'>) => void;
}

export function AddRelativeModal({ targetMember, relationType, onClose, onSubmit }: AddRelativeModalProps) {
    const [name, setName] = useState('');
    const [birthYear, setBirthYear] = useState<string>('');
    const [avatar, setAvatar] = useState('');
    const [story, setStory] = useState('');

    const getRelationLabel = () => {
        switch (relationType) {
            case 'parent': return `un Genitore a ${targetMember.name}`;
            case 'partner': return `il Partner di ${targetMember.name}`;
            case 'child': return `un/a Figlio/a a ${targetMember.name}`;
            default: return '';
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        // Invia i dati anche se vuoti (la logica di salvataggio in FamilyTree.tsx imposterà "Sconosciuto/a")
        onSubmit({
            name: name.trim(),
            relation: relationType === 'parent' ? 'Genitore' : relationType === 'partner' ? 'Partner' : 'Figlio/a',
            birthYear: birthYear ? parseInt(birthYear, 10) : undefined,
            avatar: avatar.trim(),
            story: story.trim(),
            parents: [],
        });
    };

    return (
        <div className={styles.overlay} onClick={onClose}>
            <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
                <div className={styles.header}>
                    <h2>Aggiungi {getRelationLabel()}</h2>
                    <button className={styles.closeBtn} onClick={onClose}>✕</button>
                </div>

                <form onSubmit={handleSubmit} className={styles.form}>
                    <p className={styles.hint}>
                        💡 Puoi lasciare i campi vuoti: la persona verrà salvata automaticamente come <strong>Sconosciuto/a</strong>.
                    </p>

                    <div className={styles.field}>
                        <label>Nome e Cognome (Opzionale)</label>
                        <input
                            type="text"
                            placeholder="Es. Mario Rossi (Lascia vuoto per Sconosciuto/a)"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            /* Nessun 'required' */
                        />
                    </div>

                    <div className={styles.field}>
                        <label>Anno di Nascita (Opzionale)</label>
                        <input
                            type="number"
                            placeholder="Es. 1980"
                            value={birthYear}
                            onChange={(e) => setBirthYear(e.target.value)}
                        />
                    </div>

                    <div className={styles.field}>
                        <label>URL Immagine / Avatar (Opzionale)</label>
                        <input
                            type="url"
                            placeholder="https://..."
                            value={avatar}
                            onChange={(e) => setAvatar(e.target.value)}
                        />
                    </div>

                    <div className={styles.field}>
                        <label>Nota o Storia (Opzionale)</label>
                        <textarea
                            placeholder="Aggiungi un ricordo o un dettaglio..."
                            value={story}
                            onChange={(e) => setStory(e.target.value)}
                            rows={3}
                        />
                    </div>

                    <div className={styles.actions}>
                        <button type="button" className={styles.btnCancel} onClick={onClose}>
                            Annulla
                        </button>
                        {/* Il pulsante è SEMPRE abilitato */}
                        <button type="submit" className={styles.btnSubmit}>
                            Aggiungi all'Albero
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}