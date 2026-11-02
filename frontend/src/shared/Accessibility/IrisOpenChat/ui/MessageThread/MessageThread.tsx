import { useEffect, useRef } from 'react';
import type { ChatActions, CurrentUser, Message } from '../../types';
import { LiveDraft } from '../LiveDraft/LiveDraft';
import { MessageRow } from '../MessageRow/MessageRow';
import { TypingIndicator } from '../TypingIndicator/TypingIndicator';
import styles from './MessageThread.module.css';

interface MessageThreadProps {
  messages: Message[];
  /** Iris sta scrivendo. */
  typing: boolean;
  /** Testo in corso di scrittura/dettatura dell'utente. */
  draftText: string;
  listening: boolean;
  user: CurrentUser;
  actions: ChatActions;
}

export function MessageThread({ messages, typing, draftText, listening, user, actions }: MessageThreadProps) {
  const scroller = useRef<HTMLDivElement>(null);

  // Segue la conversazione: nuovi messaggi, "sta scrivendo" e anteprima della bozza.
  useEffect(() => {
    const el = scroller.current;
    if (!el) return;
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    el.scrollTo({ top: el.scrollHeight, behavior: reduceMotion ? 'auto' : 'smooth' });
  }, [messages.length, typing, draftText]);

  return (
    <div className={styles.scroller} ref={scroller}>
      <div className={styles.column}>
        <div className={styles.messages} role="log" aria-live="polite" aria-label="Conversazione con Iris">
          {messages.map((message, index) => (
            <MessageRow
              key={message.id}
              message={message}
              user={user}
              isLast={index === messages.length - 1}
              busy={typing}
              actions={actions}
            />
          ))}
          {typing && <TypingIndicator />}
        </div>
        <LiveDraft text={draftText} listening={listening} user={user} />
      </div>
    </div>
  );
}
