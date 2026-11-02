import { Avatar } from '../Avatar/Avatar';
import { SpeechBubble } from '../SpeechBubble/SpeechBubble';
import styles from './TypingIndicator.module.css';

export function TypingIndicator() {
  return (
    <div className={styles.turn} role="status">
      <div className={styles.avatarSlot}>
        <Avatar variant="iris" state="think" />
      </div>
      <div className={styles.stack}>
        <span className={styles.who}>Iris IA</span>
        <SpeechBubble author="iris">
          <span className={styles.dots} aria-hidden="true">
            <i />
            <i />
            <i />
          </span>
          <span className={styles.srOnly}>Iris sta scrivendo</span>
        </SpeechBubble>
      </div>
    </div>
  );
}
