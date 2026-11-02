import { useEffect, useLayoutEffect, useRef, type KeyboardEvent } from 'react';
import styles from './Composer.module.css';

const MAX_HEIGHT_PX = 112;

interface ComposerProps {
  value: string;
  onChange: (value: string) => void;
  onSubmit: () => void;
  /** Iris sta scrivendo: l'invio è sospeso. */
  busy: boolean;
  listening: boolean;
  dictationSupported: boolean;
  /** Messaggio d'errore della dettatura (es. permesso negato). */
  dictationNotice: string | null;
  onToggleDictation: () => void;
}

export function Composer({
  value,
  onChange,
  onSubmit,
  busy,
  listening,
  dictationSupported,
  dictationNotice,
  onToggleDictation,
}: ComposerProps) {
  const textarea = useRef<HTMLTextAreaElement>(null);
  const canSend = !busy && value.trim().length > 0;

  // Focus sul campo quando la finestra ha finito di aprirsi.
  useEffect(() => {
    const id = window.setTimeout(() => textarea.current?.focus({ preventScroll: true }), 350);
    return () => window.clearTimeout(id);
  }, []);

  // Il campo cresce con il testo, fino a un massimo.
  useLayoutEffect(() => {
    const el = textarea.current;
    if (!el) return;
    el.style.height = 'auto';
    el.style.height = `${Math.min(el.scrollHeight, MAX_HEIGHT_PX)}px`;
  }, [value]);

  const handleKeyDown = (event: KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === 'Enter' && !event.shiftKey && !event.nativeEvent.isComposing) {
      event.preventDefault();
      if (canSend) onSubmit();
    }
  };

  return (
    <div className={styles.composer}>
      <div className={styles.inner}>
        <div className={[styles.pill, listening && styles.listening].filter(Boolean).join(' ')}>
          <span className={styles.wave} aria-hidden="true">
            <i />
            <i />
            <i />
            <i />
            <i />
          </span>
          <textarea
            ref={textarea}
            className={styles.input}
            rows={1}
            value={value}
            placeholder={listening ? 'Ti ascolto…' : 'Scrivi a Iris…'}
            aria-label="Scrivi a Iris"
            onChange={(event) => onChange(event.target.value)}
            onKeyDown={handleKeyDown}
          />
          <button
            type="button"
            className={[styles.round, styles.mic, listening && styles.recording].filter(Boolean).join(' ')}
            disabled={!dictationSupported}
            aria-pressed={listening}
            aria-label={
              !dictationSupported
                ? 'La dettatura non è supportata da questo browser'
                : listening
                  ? 'Ferma la dettatura'
                  : 'Detta con il microfono'
            }
            onClick={onToggleDictation}
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
              <rect x="9" y="3" width="6" height="11" rx="3" />
              <path d="M5 11a7 7 0 0014 0" />
              <path d="M12 18v3" />
            </svg>
          </button>
          <button type="button" className={[styles.round, styles.send].join(' ')} disabled={!canSend} aria-label="Invia" onClick={onSubmit}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 19V5" />
              <path d="M5 12l7-7 7 7" />
            </svg>
          </button>
        </div>
        <p className={styles.hint} role="status">
          {dictationNotice ?? 'Iris può sbagliare. Controlla le informazioni importanti.'}
        </p>
      </div>
    </div>
  );
}
