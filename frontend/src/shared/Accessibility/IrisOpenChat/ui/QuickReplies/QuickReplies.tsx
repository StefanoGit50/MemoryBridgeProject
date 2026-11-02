import type { ChatActions, QuickReply } from '../../types';
import styles from './QuickReplies.module.css';

interface QuickRepliesProps {
  replies: QuickReply[];
  /** La conversazione è andata avanti: le risposte rapide restano visibili ma spente. */
  used: boolean;
  /** Iris sta scrivendo. */
  disabled: boolean;
  /** Anima la comparsa (solo per i messaggi appena arrivati). */
  animate: boolean;
  actions: ChatActions;
}

export function QuickReplies({ replies, used, disabled, animate, actions }: QuickRepliesProps) {
  const handle = (reply: QuickReply) => {
    switch (reply.kind) {
      case 'send':
        actions.send(reply.text);
        break;
      case 'go':
        actions.go(reply.target);
        break;
      case 'close':
        actions.close();
        break;
    }
  };

  const className = [styles.chips, animate && styles.animate, used && styles.used].filter(Boolean).join(' ');

  return (
    <div className={className} role="group" aria-label="Risposte rapide">
      {replies.map((reply) => (
        <button key={reply.label} type="button" className={styles.chip} disabled={used || disabled} onClick={() => handle(reply)}>
          {reply.label}
        </button>
      ))}
    </div>
  );
}
