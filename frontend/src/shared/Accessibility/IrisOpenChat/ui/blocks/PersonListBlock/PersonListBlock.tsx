import type { ChatActions, FamilyMember } from '../../../types';
import { memberMeta } from '../../../family/findFamilyMembers';
import { Avatar } from '../../Avatar/Avatar';
import styles from './PersonListBlock.module.css';

interface PersonListBlockProps {
  people: FamilyMember[];
  actions: ChatActions;
}

export function PersonListBlock({ people, actions }: PersonListBlockProps) {
  return (
    <ul className={styles.list}>
      {people.map((person) => (
        <li key={person.id} className={styles.row}>
          <Avatar variant="person" size="2.2rem" muted={person.deceased} />
          <div className={styles.text}>
            <div className={styles.name}>{person.name}</div>
            <div className={styles.meta}>{memberMeta(person)}</div>
          </div>
          <button
            type="button"
            className={styles.link}
            aria-label={`Apri il profilo di ${person.name}`}
            onClick={() => actions.go({ to: 'profile', id: person.id })}
          >
            Profilo
          </button>
        </li>
      ))}
    </ul>
  );
}
