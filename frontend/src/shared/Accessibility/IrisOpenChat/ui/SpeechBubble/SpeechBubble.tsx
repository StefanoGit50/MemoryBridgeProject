import type { ReactNode } from 'react';
import styles from './SpeechBubble.module.css';

interface SpeechBubbleProps {
  author: 'iris' | 'user';
  /** Anteprima in tempo reale: bordo tratteggiato. */
  live?: boolean;
  children: ReactNode;
}

export function SpeechBubble({ author, live = false, children }: SpeechBubbleProps) {
  const className = [styles.bubble, author === 'iris' ? styles.iris : styles.user, live && styles.live]
    .filter(Boolean)
    .join(' ');
  return <div className={className}>{children}</div>;
}

/** Numero di parole di un testo con markup `**…**` (serve a sfalsare le animazioni). */
export function countWords(text: string): number {
  return text.replace(/\*\*/g, '').split(/\s+/).filter(Boolean).length;
}

interface RichTextProps {
  /** Testo con `**grassetto**` come unico markup. */
  text: string;
  /** Rivela le parole una alla volta. */
  animate?: boolean;
  /** Indice della prima parola, per continuare un'animazione iniziata altrove. */
  offset?: number;
}

export function RichText({ text, animate = false, offset = 0 }: RichTextProps) {
  let index = offset;

  const renderChunk = (content: string) =>
    animate
      ? content.split(/(\s+)/).map((chunk, i) => {
          if (chunk === '' || /^\s+$/.test(chunk)) return chunk;
          const delay = Math.min(index++ * 22, 1600);
          return (
            <span key={i} className={styles.word} style={{ animationDelay: `${delay}ms` }}>
              {chunk}
            </span>
          );
        })
      : content;

  return (
    <>
      {text
        .split(/(\*\*[^*]+\*\*)/g)
        .filter(Boolean)
        .map((part, i) =>
          part.startsWith('**') && part.endsWith('**') && part.length > 4 ? (
            <b key={i}>{renderChunk(part.slice(2, -2))}</b>
          ) : (
            <span key={i}>{renderChunk(part)}</span>
          ),
        )}
    </>
  );
}
