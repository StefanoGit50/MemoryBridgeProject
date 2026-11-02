import { useEffect, useRef } from 'react';
import type { CurrentUser } from '../../types';
import { Avatar } from '../Avatar/Avatar';
import { SpeechBubble } from '../SpeechBubble/SpeechBubble';
import styles from './LiveDraft.module.css';

interface LiveDraftProps {
  /** Testo che l'utente sta scrivendo o dettando. */
  text: string;
  listening: boolean;
  user: CurrentUser;
}

/** Anteprima in tempo reale del messaggio in corso, con l'avatar dell'utente. */
export function LiveDraft({ text, listening, user }: LiveDraftProps) {
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = scrollRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [text]);

  if (!text.trim()) return null;

  return (
    <div className={styles.turn} aria-hidden="true">
      <div className={styles.stack}>
        <span className={styles.who}>{listening ? 'Tu · stai dettando…' : 'Tu · stai scrivendo…'}</span>
        <SpeechBubble author="user" live>
          <div className={styles.scroll} ref={scrollRef}>
            {text}
          </div>
        </SpeechBubble>
      </div>
      <div className={styles.avatarSlot}>
        <Avatar variant="me" initials={user.initials} photoUrl={user.photoUrl} />
      </div>
    </div>
  );
}
