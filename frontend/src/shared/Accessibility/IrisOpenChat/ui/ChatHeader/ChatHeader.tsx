import type { ChatStatus } from '../../types';
import { Avatar } from '../Avatar/Avatar';
import styles from './ChatHeader.module.css';

const STATUS_LABEL: Record<ChatStatus, string> = {
  idle: 'Online',
  listening: 'ti ascolta…',
  thinking: 'sta scrivendo…',
};

interface ChatHeaderProps {
  status: ChatStatus;
  onReset: () => void;
  onClose: () => void;
}

export function ChatHeader({ status, onReset, onClose }: ChatHeaderProps) {
  return (
    <header className={styles.header}>
      <Avatar
        variant="iris"
        tone="header"
        size="3.8rem"
        state={status === 'listening' ? 'listening' : status === 'thinking' ? 'think' : 'idle'}
      />
      <div className={styles.identity}>
        <h2 className={styles.name}>Iris IA</h2>
        <span className={styles.status} role="status">
          {STATUS_LABEL[status]}
        </span>
      </div>
      <button type="button" className={styles.button} aria-label="Nuova conversazione" title="Nuova conversazione" onClick={onReset}>
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.1" strokeLinecap="round" strokeLinejoin="round">
          <path d="M3 12a9 9 0 109-9 9 9 0 00-6.4 2.7L3 8" />
          <path d="M3 3v5h5" />
        </svg>
      </button>
      <button type="button" className={styles.button} aria-label="Chiudi la chat" onClick={onClose}>
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round">
          <path d="M6 6l12 12M18 6L6 18" />
        </svg>
      </button>
    </header>
  );
}
