import type { ChatActions } from '../../../types';
import styles from './PostDraftBlock.module.css';

const EXCERPT_LENGTH = 150;

function excerptOf(text: string): string {
  return text.length > EXCERPT_LENGTH ? `${text.slice(0, EXCERPT_LENGTH).replace(/\s+\S*$/, '')}…` : text;
}

interface PostDraftBlockProps {
  draft: string;
  actions: ChatActions;
}

export function PostDraftBlock({ draft, actions }: PostDraftBlockProps) {
  return (
    <div className={styles.draft}>
      <div className={styles.kicker}>La tua bozza</div>
      <p className={styles.excerpt}>«{excerptOf(draft)}»</p>
      {/* La bozza viaggia nello state del router: la pagina la legge con useLocation().state?.draft */}
      <button type="button" className={styles.cta} onClick={() => actions.go({ to: 'post' }, { draft })}>
        Continua in Racconta un ricordo
      </button>
    </div>
  );
}
