import React, { useEffect, useRef } from 'react';
import { UserIcon } from 'lucide-react';
import styles from './FamilyTree.module.css';
import { Person, TreeNode, buildTree, fullName, isAcquired, matchesQuery } from './types';

interface Props {
    people: Person[];
    familyName: string;           // es. "Han"
    selectedId: string;
    query: string;                // testo della barra di ricerca
    onSelect: (id: string) => void;
}

const depth = (nodes: TreeNode[]): number =>
    nodes.length ? 1 + Math.max(...nodes.map((n) => depth(n.children))) : 0;

export function FamilyTree({ people, familyName, selectedId, query, onSelect }: Props) {
    const ref = useRef<HTMLDivElement>(null);
    const q = query.trim();
    const tree = buildTree(people);

    // Quando cambia la selezione (anche dopo "Aggiungi familiare") porta la card in vista
    useEffect(() => {
        const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        ref.current
            ?.querySelector(`[data-id="${selectedId}"]`)
            ?.scrollIntoView({ block: 'nearest', inline: 'center', behavior: reduce ? 'auto' : 'smooth' });
    }, [selectedId, people.length]);

    const card = (p: Person) => {
        const acquired = isAcquired(p, familyName);
        const dimmed = q !== '' && !matchesQuery(p, q);
        const cls = [
            styles.personCard,
            p.deathYear && styles.deceased,
            acquired && styles.acquired,
            p.id === selectedId && styles.isSelected,
            dimmed && styles.isDimmed,
        ].filter(Boolean).join(' ');

        return (
            <button type="button" data-id={p.id} className={cls} aria-pressed={p.id === selectedId} onClick={() => onSelect(p.id)}>
                <span className={styles.avatar} aria-hidden="true"><UserIcon width={26} height={26} /></span>
                <span className={styles.pName}>{fullName(p)}</span>
                <span className={styles.pYears}>{p.deathYear ? `${p.birthYear ?? '?'}–${p.deathYear}` : p.birthYear}</span>
                {p.deathYear && <span className={styles.pMemory}>In memoria</span>}
                {p.job && <span className={styles.pJob}>{p.job}</span>}
                {acquired && <span className={styles.srOnly}>, famiglia acquisita</span>}
            </button>
        );
    };

    const branch = (nodes: TreeNode[], isRoot = false): React.ReactElement => (
        <ul className={isRoot ? styles.tree : undefined}>
            {nodes.map((n) => (
                <li key={n.person.id}>
                    <div className={styles.couple}>
                        {card(n.person)}
                        {n.partner && (
                            <>
                                <span className={styles.coupleLink} aria-hidden="true">
                                    <span className={styles.coupleLine} /><span className={styles.coupleDiamond} /><span className={styles.coupleLine} />
                                </span>
                                {card(n.partner)}
                            </>
                        )}
                    </div>
                    {n.children.length > 0 && branch(n.children)}
                </li>
            ))}
        </ul>
    );

    return (
        <div className={styles.treeCanvasWrap}>
            <div className={styles.canvasHeader}>
                <p>{depth(tree)} generazioni, {people.length} persone in famiglia</p>
                <div className={styles.legend}>
                    <span className={styles.legendItem}><span className={styles.legendSwatch} aria-hidden="true" /> Genitore e figlio</span>
                    <span className={styles.legendItem}><span className={`${styles.legendSwatch} ${styles.partner}`} aria-hidden="true" /> Coppia</span>
                    <span className={styles.legendItem}><span className={styles.legendDot} aria-hidden="true" /> In memoria</span>
                    <span className={styles.legendItem}><span className={styles.legendDotAcquired} aria-hidden="true" /> Famiglia acquisita</span>
                </div>
            </div>
            <div ref={ref} className={styles.treeScroll}>{branch(tree, true)}</div>
        </div>
    );
}