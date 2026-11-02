import { useState } from 'react';
import type { ChatActions, CurrentUser, Message } from '../../types';
import { Avatar } from '../Avatar/Avatar';
import { BlockRenderer } from '../blocks/BlockRenderer/BlockRenderer';
import { QuickReplies } from '../QuickReplies/QuickReplies';
import { RichText, SpeechBubble, countWords } from '../SpeechBubble/SpeechBubble';
import styles from './MessageRow.module.css';

/** Un messaggio è "fresco" (si anima) solo se è appena arrivato: riaprendo la chat quelli vecchi restano fermi. */
const FRESH_MS = 1500;

interface MessageRowProps {
  message: Message;
  user: CurrentUser;
  /** Ultimo messaggio della conversazione: solo qui le risposte rapide sono attive. */
  isLast: boolean;
  /** Iris sta scrivendo. */
  busy: boolean;
  actions: ChatActions;
}

export function MessageRow({ message, user, isLast, busy, actions }: MessageRowProps) {
  const [fresh] = useState(() => Date.now() - message.createdAt < FRESH_MS);

  if (message.author === 'user') {
    return (
      <div className={[styles.turn, styles.user, fresh && styles.fresh].filter(Boolean).join(' ')}>
        <div className={styles.stack}>
          <span className={styles.who}>Tu</span>
          <SpeechBubble author="user">{message.text}</SpeechBubble>
        </div>
        <div className={styles.avatarSlot}>
          <Avatar variant="me" initials={user.initials} photoUrl={user.photoUrl} />
        </div>
      </div>
    );
  }

  // Le voci della lista continuano l'animazione dalle parole già mostrate.
  let wordOffset = countWords(message.text);
  const listOffsets = (message.list ?? []).map((item) => {
    const start = wordOffset;
    wordOffset += countWords(item);
    return start;
  });

  return (
    <div className={[styles.turn, styles.iris, fresh && styles.fresh].filter(Boolean).join(' ')}>
      <div className={styles.avatarSlot}>
        <Avatar variant="iris" state={fresh ? 'hop' : 'idle'} />
      </div>
      <div className={styles.stack}>
        <span className={styles.who}>Iris IA</span>
        <SpeechBubble author="iris">
          <div>
            {message.hello && <span className={styles.hello}>{message.hello}</span>}
            <RichText text={message.text} animate={fresh} />
            {message.list && (
              <ul className={styles.list}>
                {message.list.map((item, i) => (
                  <li key={i}>
                    <RichText text={item} animate={fresh} offset={listOffsets[i]} />
                  </li>
                ))}
              </ul>
            )}
          </div>
          {message.blocks && message.blocks.length > 0 && (
            <div className={[styles.extra, fresh && styles.extraFresh].filter(Boolean).join(' ')}>
              <BlockRenderer blocks={message.blocks} actions={actions} />
            </div>
          )}
        </SpeechBubble>
        {message.quickReplies && message.quickReplies.length > 0 && (
          <QuickReplies replies={message.quickReplies} used={!isLast} disabled={busy} animate={fresh} actions={actions} />
        )}
      </div>
    </div>
  );
}
