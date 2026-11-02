import type { CSSProperties } from 'react';
import irisImage from '@/shared/Iris/Iris.png';
import styles from './Avatar.module.css';

interface AvatarProps {
  variant: 'iris' | 'me' | 'person';
  /** Animazione: `hop` quando arriva un messaggio, `think` mentre scrive, `listening` durante la dettatura. */
  state?: 'idle' | 'hop' | 'think' | 'listening';
  /** `header` = anello bianco, per stare sulla barra colorata. */
  tone?: 'default' | 'header';
  /** Lato come lunghezza CSS (default: variabile `--iris-ava` della finestra). */
  size?: string;
  initials?: string;
  photoUrl?: string;
  /** Persona non più in vita: sfondo neutro. */
  muted?: boolean;
}

export function Avatar({ variant, state = 'idle', tone = 'default', size, initials, photoUrl, muted = false }: AvatarProps) {
  const className = [
    styles.avatar,
    styles[variant],
    tone === 'header' && styles.header,
    state !== 'idle' && styles[state],
    muted && styles.muted,
  ]
    .filter(Boolean)
    .join(' ');
  const style = size ? ({ '--avatar-size': size } as CSSProperties) : undefined;

  return (
    <span className={className} style={style} aria-hidden="true">
      {variant === 'iris' && <img src={irisImage} alt="" />}
      {variant === 'me' && (photoUrl ? <img src={photoUrl} alt="" /> : initials)}
      {variant === 'person' && (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="8" r="3.6" />
          <path d="M4.5 20c0-3.9 3.4-6.5 7.5-6.5s7.5 2.6 7.5 6.5" />
        </svg>
      )}
    </span>
  );
}
