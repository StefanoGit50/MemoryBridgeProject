import React, { useEffect, useId, useRef, useState } from 'react';
import styles from './AddRelative.module.css';

export type RelationType = 'coniuge' | 'figlio' | 'genitore' | 'fratello';
export type Sex = 'donna' | 'uomo';

export interface PersonOption {
    id: string;
    name: string;
    meta?: string; // es. "Nato nel 1960"
}

export interface NewRelativeData {
    relatedId: string;      // familiare a cui viene collegato
    relation: RelationType; // legame del NUOVO familiare verso relatedId (es. "figlio di")
    firstName: string;
    lastName: string;
    sex: Sex;
    birthYear?: number;
    deathYear?: number;
    job?: string;
    bio?: string;
}

interface Props {
    isOpen: boolean;
    people: PersonOption[];
    initialRelatedId?: string; // es. la persona selezionata nel pannello
    // Legami non possibili per la persona scelta (con il motivo), es. da getRelationBlockers()
    relationBlockers?: (relatedId: string) => Partial<Record<RelationType, string>>;
    onClose: () => void;
    onSubmit: (data: NewRelativeData) => void;
}

// [neutro, donna, uomo]: l'etichetta dipende dal sesso, il valore salvato no
const RELATIONS: Record<RelationType, [string, string, string]> = {
    coniuge: ['Coniuge', 'Moglie', 'Marito'],
    figlio: ['Figlio/a', 'Figlia', 'Figlio'],
    genitore: ['Genitore', 'Madre', 'Padre'],
    fratello: ['Fratello/sorella', 'Sorella', 'Fratello'],
};
const SEXES: { value: Sex; label: string }[] = [
    { value: 'donna', label: 'Donna' },
    { value: 'uomo', label: 'Uomo' },
];

const BIO_MAX = 400;
const THIS_YEAR = new Date().getFullYear();
const norm = (s: string) => s.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();

interface FormState {
    relatedId: string;
    firstName: string;
    lastName: string;
    sex: Sex | '';
    relation: RelationType | '';
    birthYear: string;
    isLiving: boolean;
    deathYear: string;
    job: string;
    bio: string;
}
type Key = keyof FormState;

const EMPTY: FormState = {
    relatedId: '', firstName: '', lastName: '', sex: '', relation: '',
    birthYear: '', isLiving: true, deathYear: '', job: '', bio: '',
};

function validate(v: FormState): Partial<Record<Key, string>> {
    const e: Partial<Record<Key, string>> = {};
    if (!v.relatedId) e.relatedId = 'Scegli un familiare dall’elenco.';
    if (!v.firstName.trim()) e.firstName = 'Inserisci il nome.';
    if (!v.lastName.trim()) e.lastName = 'Inserisci il cognome.';
    if (!v.sex) e.sex = 'Indica il sesso.';
    if (!v.relation) e.relation = 'Scegli il legame di parentela.';

    const by = Number(v.birthYear);
    if (v.birthYear && (v.birthYear.length !== 4 || by < 1800 || by > THIS_YEAR)) {
        e.birthYear = `Inserisci un anno tra 1800 e ${THIS_YEAR}.`;
    }
    if (!v.isLiving && v.deathYear) {
        const dy = Number(v.deathYear);
        if (v.deathYear.length !== 4 || dy > THIS_YEAR) e.deathYear = `Inserisci un anno valido, al massimo ${THIS_YEAR}.`;
        else if (v.birthYear && !e.birthYear && dy < by) e.deathYear = 'L’anno di morte non può precedere quello di nascita.';
    }
    return e;
}

export function AddRelativeModal({ isOpen, people, initialRelatedId, relationBlockers, onClose, onSubmit }: Props) {
    const uid = useId();
    const dialogRef = useRef<HTMLDialogElement>(null);
    const downOnBackdrop = useRef(false);

    const initial = () => {
        const p = people.find((x) => x.id === initialRelatedId);
        return { values: { ...EMPTY, relatedId: p?.id ?? '' }, query: p?.name ?? '' };
    };

    const [values, setValues] = useState<FormState>(EMPTY);
    const [query, setQuery] = useState('');
    const [listOpen, setListOpen] = useState(false);
    const [active, setActive] = useState(0);
    const [touched, setTouched] = useState<Partial<Record<Key, boolean>>>({});
    const [submitted, setSubmitted] = useState(false);

    const errors = validate(values);
    const init = initial();
    const dirty = JSON.stringify(values) !== JSON.stringify(init.values) || query !== init.query;
    const showError = (k: Key) => (touched[k] || submitted ? errors[k] : undefined);

    const related = people.find((p) => p.id === values.relatedId);
    const blockers = values.relatedId ? relationBlockers?.(values.relatedId) ?? {} : {};
    const matches = people.filter((p) => norm(p.name).includes(values.relatedId ? '' : norm(query.trim())));
    const activeIdx = Math.min(active, matches.length - 1);
    const optId = (id: string) => `${uid}-opt-${id}`;
    const sexIdx = values.sex === 'donna' ? 1 : values.sex === 'uomo' ? 2 : 0;

    useEffect(() => {
        const d = dialogRef.current;
        if (!d) return;
        if (isOpen && !d.open) {
            const i = initial();
            setValues(i.values); setQuery(i.query);
            setListOpen(false); setTouched({}); setSubmitted(false);
            d.showModal();
        } else if (!isOpen && d.open) {
            d.close();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isOpen]);

    const requestClose = () => {
        if (dirty && !window.confirm('Vuoi chiudere? Le informazioni inserite andranno perse.')) return;
        onClose();
    };

    const set = <K extends Key>(k: K, v: FormState[K]) => setValues((p) => ({ ...p, [k]: v }));
    const blur = (k: Key) => setTouched((p) => ({ ...p, [k]: true }));
    const digits = (k: 'birthYear' | 'deathYear') => (e: React.ChangeEvent<HTMLInputElement>) =>
        set(k, e.target.value.replace(/\D/g, ''));

    const pick = (p: PersonOption) => {
        // se cambi persona e il legame scelto non è più possibile, lo azzera
        setValues((v) => ({
            ...v,
            relatedId: p.id,
            relation: v.relation && relationBlockers?.(p.id)[v.relation] ? '' : v.relation,
        }));
        setQuery(p.name); setListOpen(false); blur('relatedId');
    };

    const onComboKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'ArrowDown') { e.preventDefault(); setListOpen(true); setActive(Math.min(activeIdx + 1, matches.length - 1)); }
        else if (e.key === 'ArrowUp') { e.preventDefault(); setActive(Math.max(activeIdx - 1, 0)); }
        else if (e.key === 'Enter' && listOpen && matches[activeIdx]) { e.preventDefault(); pick(matches[activeIdx]); }
        else if (e.key === 'Escape' && listOpen) { e.preventDefault(); setListOpen(false); } // non chiude la modale
    };

    const field = (k: Key) => ({
        id: `${uid}-${k}`,
        'aria-invalid': showError(k) ? true : undefined,
        'aria-describedby': `${uid}-${k}-msg`,
        onBlur: () => blur(k),
    });

    const msg = (k: Key, hint?: string) => {
        const err = showError(k);
        if (!err && !hint) return null;
        return (
            <p id={`${uid}-${k}-msg`} className={err ? styles.error : styles.hint} role={err ? 'alert' : undefined}>
                {err ?? hint}
            </p>
        );
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitted(true);
        const order: Key[] = ['relatedId', 'firstName', 'lastName', 'sex', 'relation', 'birthYear', 'deathYear'];
        const firstInvalid = order.find((k) => errors[k]);
        if (firstInvalid) {
            document.getElementById(`${uid}-${firstInvalid}`)?.focus();
            return;
        }
        onSubmit({
            relatedId: values.relatedId,
            relation: values.relation as RelationType,
            firstName: values.firstName.trim(),
            lastName: values.lastName.trim(),
            sex: values.sex as Sex,
            birthYear: values.birthYear ? Number(values.birthYear) : undefined,
            deathYear: !values.isLiving && values.deathYear ? Number(values.deathYear) : undefined,
            job: values.job.trim() || undefined,
            bio: values.bio.trim() || undefined,
        });
        onClose();
    };

    return (
        <dialog
            ref={dialogRef}
            className={styles.dialog}
            aria-labelledby={`${uid}-title`}
            onCancel={(e) => { e.preventDefault(); requestClose(); }}
            onMouseDown={(e) => { downOnBackdrop.current = e.target === e.currentTarget; }}
            onClick={(e) => { if (downOnBackdrop.current && e.target === e.currentTarget) requestClose(); }}
        >
            <form className={styles.form} onSubmit={handleSubmit} noValidate>
                <header className={styles.header}>
                    <h2 id={`${uid}-title`} className={styles.title}>Aggiungi un familiare</h2>
                    <p className={styles.subtitle}>Scegli a chi collegarlo e inserisci i suoi dati.</p>
                    <button type="button" className={styles.close} onClick={requestClose} aria-label="Chiudi">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M6 6l12 12M18 6L6 18" /></svg>
                    </button>
                </header>

                <div className={styles.body}>
                    <p className={styles.note}>I campi con <span className={styles.req}>*</span> sono obbligatori.</p>

                    {/* Ricerca del familiare (pattern ARIA combobox + listbox) */}
                    <div className={styles.field}>
                        <label className={styles.label} htmlFor={`${uid}-relatedId`}>Collega a<span className={styles.req} aria-hidden="true">*</span></label>
                        <div className={styles.combo}>
                            <svg className={styles.comboIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><circle cx="11" cy="11" r="7" /><path d="M21 21l-4.3-4.3" /></svg>
                            <input
                                className={`${styles.input} ${styles.comboInput}`}
                                {...field('relatedId')}
                                role="combobox"
                                aria-expanded={listOpen}
                                aria-controls={`${uid}-list`}
                                aria-autocomplete="list"
                                aria-activedescendant={listOpen && matches[activeIdx] ? optId(matches[activeIdx].id) : undefined}
                                autoComplete="off"
                                placeholder="Cerca un familiare per nome"
                                value={query}
                                onChange={(e) => { setQuery(e.target.value); set('relatedId', ''); setActive(0); setListOpen(true); }}
                                onFocus={() => setListOpen(true)}
                                onBlur={() => { setListOpen(false); blur('relatedId'); }}
                                onKeyDown={onComboKeyDown}
                            />
                            {listOpen && (matches.length ? (
                                <ul id={`${uid}-list`} role="listbox" className={styles.list}>
                                    {matches.map((p, i) => (
                                        <li key={p.id} id={optId(p.id)} role="option" aria-selected={i === activeIdx}
                                            className={styles.option}
                                            onMouseDown={(e) => e.preventDefault()} // mantiene il focus sull'input
                                            onClick={() => pick(p)}>
                                            <span>{p.name}</span>
                                            {p.meta && <span className={styles.optionMeta}>{p.meta}</span>}
                                        </li>
                                    ))}
                                </ul>
                            ) : (
                                <div className={`${styles.list} ${styles.empty}`} role="status">Nessun familiare trovato.</div>
                            ))}
                        </div>
                        {msg('relatedId', 'Cerca tra i familiari già presenti nell’albero.')}
                    </div>

                    <div className={styles.row}>
                        <div className={styles.field}>
                            <label className={styles.label} htmlFor={`${uid}-firstName`}>Nome<span className={styles.req} aria-hidden="true">*</span></label>
                            <input className={styles.input} {...field('firstName')} required autoComplete="off" placeholder="Es. Clara"
                                   value={values.firstName} onChange={(e) => set('firstName', e.target.value)} />
                            {msg('firstName')}
                        </div>
                        <div className={styles.field}>
                            <label className={styles.label} htmlFor={`${uid}-lastName`}>Cognome<span className={styles.req} aria-hidden="true">*</span></label>
                            <input className={styles.input} {...field('lastName')} required autoComplete="off" placeholder="Es. Shin"
                                   value={values.lastName} onChange={(e) => set('lastName', e.target.value)} />
                            {msg('lastName')}
                        </div>
                    </div>

                    <fieldset className={styles.group} aria-describedby={`${uid}-sex-msg`}>
                        <legend className={styles.legend}>Sesso<span className={styles.req} aria-hidden="true">*</span></legend>
                        <div className={styles.chips}>
                            {SEXES.map((s, i) => (
                                <label key={s.value} className={styles.chip}>
                                    <input type="radio" name={`${uid}-sex`} id={i === 0 ? `${uid}-sex` : undefined}
                                           value={s.value} checked={values.sex === s.value}
                                           onChange={() => { set('sex', s.value); blur('sex'); }} />
                                    <span>{s.label}</span>
                                </label>
                            ))}
                        </div>
                        {msg('sex')}
                    </fieldset>

                    <fieldset className={styles.group} aria-describedby={`${uid}-relation-msg`}>
                        <legend className={styles.legend}>
                            Chi è {values.firstName.trim() || 'il nuovo familiare'} per {related?.name ?? 'il familiare scelto'}?
                            <span className={styles.req} aria-hidden="true">*</span>
                        </legend>
                        <div className={styles.chips}>
                            {(Object.keys(RELATIONS) as RelationType[]).map((r, i) => (
                                <label key={r} className={styles.chip}>
                                    <input type="radio" name={`${uid}-relation`} id={i === 0 ? `${uid}-relation` : undefined}
                                           value={r} checked={values.relation === r} disabled={!!blockers[r]}
                                           onChange={() => { set('relation', r); blur('relation'); }} />
                                    <span>{RELATIONS[r][sexIdx]}</span>
                                </label>
                            ))}
                        </div>
                        {msg('relation', Object.values(blockers).join(' ') ||
                            (values.sex ? undefined : 'Indica il sesso per vedere il legame esatto (es. Madre o Padre).'))}
                    </fieldset>

                    <div className={styles.row}>
                        <div className={styles.field}>
                            <label className={styles.label} htmlFor={`${uid}-birthYear`}>Anno di nascita<span className={styles.opt}>facoltativo</span></label>
                            <input className={styles.input} {...field('birthYear')} inputMode="numeric" maxLength={4} autoComplete="off" placeholder="Es. 1962"
                                   value={values.birthYear} onChange={digits('birthYear')} />
                            {msg('birthYear')}
                        </div>
                        <div className={styles.field}>
                            <label className={styles.label} htmlFor={`${uid}-deathYear`}>Anno di morte<span className={styles.opt}>facoltativo</span></label>
                            <input className={styles.input} {...field('deathYear')} inputMode="numeric" maxLength={4} autoComplete="off" placeholder="Es. 2019"
                                   disabled={values.isLiving} value={values.deathYear} onChange={digits('deathYear')} />
                            {msg('deathYear', values.isLiving ? 'Disattivato: la persona è in vita.' : undefined)}
                        </div>
                    </div>

                    <label className={styles.check}>
                        <input type="checkbox" checked={values.isLiving}
                               onChange={(e) => setValues((p) => ({ ...p, isLiving: e.target.checked, deathYear: e.target.checked ? '' : p.deathYear }))} />
                        È ancora in vita
                    </label>

                    <div className={styles.field}>
                        <label className={styles.label} htmlFor={`${uid}-job`}>Professione<span className={styles.opt}>facoltativo</span></label>
                        <input className={styles.input} id={`${uid}-job`} autoComplete="off" placeholder="Es. Insegnante"
                               value={values.job} onChange={(e) => set('job', e.target.value)} />
                    </div>

                    <div className={styles.field}>
                        <label className={styles.label} htmlFor={`${uid}-bio`}>La sua storia<span className={styles.opt}>facoltativo</span></label>
                        <textarea className={styles.textarea} id={`${uid}-bio`} maxLength={BIO_MAX} aria-describedby={`${uid}-bio-msg`}
                                  placeholder="Qualche riga sulla sua vita, i luoghi, le passioni…"
                                  value={values.bio} onChange={(e) => set('bio', e.target.value)} />
                        <div className={styles.meta}>
                            <p id={`${uid}-bio-msg`} className={styles.hint}>Potrai completarla più tardi dal profilo.</p>
                            <span className={styles.counter} aria-hidden="true">{values.bio.length}/{BIO_MAX}</span>
                        </div>
                    </div>
                </div>

                <footer className={styles.footer}>
                    <button type="button" className={`${styles.btn} ${styles.secondary}`} onClick={requestClose}>Annulla</button>
                    <button type="submit" className={`${styles.btn} ${styles.primary}`}>Salva familiare</button>
                </footer>
            </form>
        </dialog>
    );
}

export default AddRelativeModal;