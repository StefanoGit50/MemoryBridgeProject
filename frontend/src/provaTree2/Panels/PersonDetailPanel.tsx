import React, { forwardRef } from 'react';
import styles from './PersonDetail.module.css';
import { Avatar } from '../Components/avatar';
import { Button } from '../Components/Buttons';
import { Badge } from '../Components/Badge';
import { ChevronIcon } from '../Components/Icons';

export interface FamilyMember {
    id: string;
    name: string;
    relation: string;
}

export interface PersonData {
    name: string;
    years: string;
    job: string;
    bio: string;
    family: FamilyMember[];
    avatarSrc?: string;
}

interface PersonDetailPanelProps {
    person: PersonData;
    onSelectFamilyMember: (id: string) => void;
    onOpenMemoryModal?: () => void;
    onOpenFullProfile?: () => void;
}

export const PersonDetailPanel = forwardRef<HTMLElement, PersonDetailPanelProps>(
    ({ person, onSelectFamilyMember, onOpenMemoryModal, onOpenFullProfile }, ref) => {
        return (
            <aside ref={ref} className={styles.detailPanel} aria-live="polite" aria-label="Dettagli della persona selezionata">
                <div className={styles.detailPerson}>
                    <Avatar src={person.avatarSrc} alt={person.name} size="lg" />
                    <div>
                        <h2 id="detailName">{person.name}</h2>
                        <p className={styles.detailYears}>{person.years}</p>
                        <Badge className={styles.jobBadge}>{person.job}</Badge>
                    </div>
                </div>

                <div className={styles.detailActions}>
                    <Button variant="primary" size="small" onClick={onOpenMemoryModal}>
                        Racconta un ricordo
                    </Button>
                    <Button variant="secondary" size="small" onClick={onOpenFullProfile}>
                        Vedi profilo completo
                    </Button>
                </div>

                <details className={styles.bioBlock} open>
                    <summary>
                        La sua storia
                        <ChevronIcon className={styles.chev} />
                    </summary>
                    <p>{person.bio}</p>
                    <a
                        href="#profilo"
                        className={styles.profileLinkAccent}
                        onClick={(e) => {
                            e.preventDefault();
                            onOpenFullProfile?.();
                        }}
                    >
                        vedi profilo per scoprire di più
                    </a>
                </details>

                <div className={styles.closeFamily}>
                    <h3>Familiari stretti</h3>
                    <ul>
                        {person.family.map((fam) => (
                            <li key={fam.id}>
                                <button
                                    type="button"
                                    onClick={() => onSelectFamilyMember(fam.id)}
                                >
                                    <span>{fam.name}</span>
                                    <span className={styles.relTag}>{fam.relation}</span>
                                </button>
                            </li>
                        ))}
                    </ul>
                </div>
            </aside>
        );
    }
);

PersonDetailPanel.displayName = 'PersonDetailPanel';