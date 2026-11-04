import { useEffect, useId, useRef, useState } from 'react';
import type { KeyboardEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, useReducedMotion } from 'framer-motion'; // se usi il pacchetto "motion": from 'motion/react'
import styles from './NavbarSearch.module.css';

export interface UserResult {
    id: string;
    name: string;
    subtitle?: string;   // es. "Nato nel 1960" o la città
    avatarUrl?: string;
}

interface NavbarSearchProps {
    /** Cerca gli utenti: può essere una fetch al tuo backend */
    onSearch: (query: string) => Promise<UserResult[]> | UserResult[];
    /** Dove portare l'utente quando sceglie un risultato */
    getHref?: (user: UserResult) => string;
    /** restoreFocus = true quando chiudi da tastiera (Esc o scelta) */
    onClose: (restoreFocus?: boolean) => void;
}

const SLOT_WIDTH = 300;   // larghezza della barra aperta
const GAP = 16;           // distanza dal logo
const MIN_CHARS = 2;
const DEBOUNCE_MS = 250;

const initials = (name: string) =>
    name.split(' ').filter(Boolean).slice(0, 2).map((w) => w[0]).join('').toUpperCase();

export function NavbarSearch({ onSearch, getHref = (u) => `/timeline/${u.id}`, onClose }: NavbarSearchProps) {
    const navigate = useNavigate();
    const reduceMotion = useReducedMotion();
    const listId = useId();
    const rootRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);

    // Così onSearch può cambiare identità senza rilanciare la ricerca
    const searchRef = useRef(onSearch);
    searchRef.current = onSearch;

    const [query, setQuery] = useState('');
    const [results, setResults] = useState<UserResult[]>([]);
    const [status, setStatus] = useState<'idle' | 'loading' | 'done' | 'error'>('idle');
    const [active, setActive] = useState(0);

    const q = query.trim();

    // Focus nel campo appena si apre
    useEffect(() => {
        inputRef.current?.focus({ preventScroll: true });
    }, []);

    // Ricerca dinamica con debounce; le risposte vecchie vengono ignorate
    useEffect(() => {
        if (q.length < MIN_CHARS) {
            setResults([]);
            setStatus('idle');
            return;
        }
        setStatus('loading');
        let stale = false;
        const timer = setTimeout(async () => {
            try {
                const found = await searchRef.current(q);
                if (stale) return;
                setResults(found.slice(0, 6));
                setActive(0);
                setStatus('done');
            } catch {
                if (!stale) setStatus('error');
            }
        }, DEBOUNCE_MS);
        return () => {
            stale = true;
            clearTimeout(timer);
        };
    }, [q]);

    // Click fuori: chiude (ma non se il click è sul simbolo Ricerca, che fa già il toggle)
    useEffect(() => {
        const onDown = (e: PointerEvent) => {
            const target = e.target as Element;
            if (rootRef.current?.contains(target) || target.closest('[data-search-toggle]')) return;
            onClose(false);
        };
        document.addEventListener('pointerdown', onDown);
        return () => document.removeEventListener('pointerdown', onDown);
    }, [onClose]);

    // Tiene visibile l'opzione attiva quando la lista scorre
    useEffect(() => {
        document.getElementById(`${listId}-${active}`)?.scrollIntoView({ block: 'nearest' });
    }, [active, listId]);

    const pick = (user: UserResult) => {
        navigate(getHref(user));
        onClose(true);
    };

    const onKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'ArrowDown') {
            e.preventDefault();
            setActive((i) => Math.max(0, Math.min(i + 1, results.length - 1)));
        } else if (e.key === 'ArrowUp') {
            e.preventDefault();
            setActive((i) => Math.max(i - 1, 0));
        } else if (e.key === 'Enter') {
            e.preventDefault();
            if (results[active]) pick(results[active]);
        } else if (e.key === 'Escape') {
            e.preventDefault();
            onClose(true);
        }
    };

    let message = '';
    if (q.length > 0 && q.length < MIN_CHARS) message = `Scrivi almeno ${MIN_CHARS} lettere.`;
    else if (status === 'error') message = 'Ricerca non riuscita. Riprova.';
    else if (status === 'loading' && results.length === 0) message = 'Cerco…';
    else if (status === 'done' && results.length === 0) message = `Nessun utente trovato per “${q}”.`;

    const hasResults = results.length > 0;

    return (
        <div ref={rootRef} id="navbar-search" className={styles.wrap} role="search" aria-label="Cerca utenti">
    <motion.div
        className={styles.slot}
    initial={{ width: 0, marginLeft: 0, opacity: 0 }}
    animate={{ width: SLOT_WIDTH, marginLeft: GAP, opacity: 1 }}
    exit={{ width: 0, marginLeft: 0, opacity: 0 }}
    transition={reduceMotion ? { duration: 0 } : { type: 'spring', stiffness: 380, damping: 36 }}
        >
        {/* Stessa struttura della barra "Cerca un familiare" dell'hero */}
        <div className={styles.field}>
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <circle cx="11" cy="11" r="7" />
    <path d="M21 21l-4.3-4.3" />
        </svg>
        <input
    ref={inputRef}
    type="search"
    role="combobox"
    aria-expanded={hasResults}
    aria-controls={hasResults ? listId : undefined}
    aria-autocomplete="list"
    aria-activedescendant={hasResults ? `${listId}-${active}` : undefined}
    aria-label="Cerca un utente per nome"
    placeholder="Cerca un utente per nome"
    autoComplete="off"
    spellCheck={false}
    enterKeyHint="search"
    value={query}
    onChange={(e) => setQuery(e.target.value)}
    onKeyDown={onKeyDown}
    />
    </div>
    </motion.div>

    {q && (hasResults || message) && (
        <div className={styles.list}>
            {hasResults ? (
                    <ul id={listId} role="listbox" aria-label="Utenti trovati">
                    {results.map((user, i) => (
                            <li
                                key={user.id}
                        id={`${listId}-${i}`}
                role="option"
                aria-selected={i === active}
        className={styles.option}
        onMouseDown={(e) => e.preventDefault()} // il focus resta nel campo
        onMouseEnter={() => setActive(i)}
        onClick={() => pick(user)}
    >
        <span className={styles.avatar} aria-hidden="true">
        {user.avatarUrl ? <img src={user.avatarUrl} alt="" /> : initials(user.name)}
        </span>
        <span className={styles.text}>
    <span className={styles.name}>{user.name}</span>
        {user.subtitle && <span className={styles.sub}>{user.subtitle}</span>}
            </span>
            </li>
        ))}
        </ul>
    ) : (
        <p className={styles.msg}>{message}</p>
    )}
        </div>
    )}

        {/* Annuncio per gli screen reader */}
        <span role="status" className={styles.srOnly}>
    {status === 'done' ? `${results.length} risultati` : ''}
        </span>
        </div>
    );
    }

    export default NavbarSearch;