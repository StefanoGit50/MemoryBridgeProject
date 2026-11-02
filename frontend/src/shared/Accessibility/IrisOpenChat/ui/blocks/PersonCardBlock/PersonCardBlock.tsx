import type { ChatActions, FamilyMember } from '../../../types';
import { memberMeta } from '../../../family/findFamilyMembers';
import { Avatar } from '../../Avatar/Avatar';
import styles from './PersonCardBlock.module.css';

interface PersonCardBlockProps {
  person: FamilyMember;
  actions: ChatActions;
}

export function PersonCardBlock({ person, actions }: PersonCardBlockProps) {
  return (
    <div className={styles.person}>
      <Avatar variant="person" size="3.3rem" muted={person.deceased} />
      <div>
        <div className={styles.name}>{person.name}</div>
        <div className={styles.meta}>{memberMeta(person)}</div>
        <div className={styles.links}>
          <button
            type="button"
            className={styles.link}
            aria-label={`Apri il profilo di ${person.name}`}
            onClick={() => actions.go({ to: 'profile', id: person.id })}
          >
            Apri profilo
          </button>
          <button
            type="button"
            className={`${styles.link} ${styles.soft}`}
            aria-label={`Vedi ${person.name} nell'albero`}
            onClick={() => actions.go({ to: 'tree', id: person.id })}
          >
            Vedi nell&apos;albero
          </button>
        </div>
      </div>
    </div>
  );
}
