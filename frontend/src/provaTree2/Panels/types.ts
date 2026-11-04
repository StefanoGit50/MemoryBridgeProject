import type { NewRelativeData, PersonOption, RelationType, Sex } from './AddRelative';
import type { PersonData } from './PersonDetailPanel';

/* ---------- Modello: lista piatta, i legami stanno nei dati ---------- */
export interface Person {
    id: string;
    firstName: string;
    lastName: string;
    sex: Sex;
    birthYear?: number;
    deathYear?: number;
    job?: string;
    bio?: string;
    parentIds: string[];  // max 2
    partnerId?: string;
}

export interface TreeNode {
    person: Person;      // il "ramo" della famiglia
    partner?: Person;    // la persona acquisita, disegnata accanto
    children: TreeNode[];
}

/* ---------- Utilità ---------- */
export const fullName = (p: Person) => `${p.firstName} ${p.lastName}`;
export const norm = (s: string) => s.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
export const matchesQuery = (p: Person, q: string) => norm(fullName(p)).includes(norm(q.trim()));

// Persona "acquisita" = cognome diverso da quello della famiglia. Unico punto da cambiare se la regola evolve.
export const isAcquired = (p: Person, familyName: string) => norm(p.lastName) !== norm(familyName);

/* ---------- Dati -> albero ---------- */
export function buildTree(people: Person[]): TreeNode[] {
    const byId = new Map(people.map((p) => [p.id, p]));
    const order = new Map(people.map((p, i) => [p.id, i]));
    const partnerOf = (p: Person) => (p.partnerId ? byId.get(p.partnerId) : undefined);

    // In una coppia "guida" il ramo chi ha i genitori nell'albero; a parità, chi viene prima nella lista
    const startsNode = (p: Person) => {
        const s = partnerOf(p);
        if (!s) return true;
        if (p.parentIds.length !== s.parentIds.length) return p.parentIds.length > 0;
        return order.get(p.id)! < order.get(s.id)!;
    };

    const build = (p: Person): TreeNode => {
        const s = partnerOf(p);
        const kids = people.filter((c) => c.parentIds.some((id) => id === p.id || id === s?.id));
        return { person: p, partner: s, children: kids.map(build) };
    };

    return people.filter((p) => p.parentIds.length === 0 && startsNode(p)).map(build);
}

/* ---------- Aggiunta di un familiare ---------- */
// Legami non possibili per la persona scelta: la modale li disabilita e mostra il motivo
export function getRelationBlockers(people: Person[], relatedId: string): Partial<Record<RelationType, string>> {
    const rel = people.find((p) => p.id === relatedId);
    const b: Partial<Record<RelationType, string>> = {};
    if (!rel) return b;
    if (rel.partnerId) b.coniuge = `Coniuge non disponibile: ${rel.firstName} ha già un coniuge.`;
    if (rel.parentIds.length >= 2) b.genitore = `Genitore non disponibile: ${rel.firstName} ha già entrambi i genitori.`;
    else if (rel.parentIds.length === 1 && people.find((p) => p.id === rel.parentIds[0])?.partnerId) {
        b.genitore = 'Genitore non disponibile: l’altro genitore è già collegato a un altro coniuge.';
    }
    if (rel.parentIds.length === 0) b.fratello = `Fratello/sorella non disponibile: aggiungi prima un genitore di ${rel.firstName}.`;
    return b;
}

export function addRelative(people: Person[], d: NewRelativeData): { people: Person[]; newId: string } {
    const rel = people.find((p) => p.id === d.relatedId);
    if (!rel) return { people, newId: '' };

    const { relatedId, relation, ...info } = d;
    const created: Person = { id: crypto.randomUUID(), ...info, parentIds: [] };
    let next = people;
    const patch = (id: string, changes: Partial<Person>) => {
        next = next.map((p) => (p.id === id ? { ...p, ...changes } : p));
    };

    switch (relation) {
        case 'coniuge':
            created.partnerId = rel.id;
            patch(rel.id, { partnerId: created.id });
            break;
        case 'figlio': // figlio di rel e, se c'è, del suo partner
            created.parentIds = rel.partnerId ? [rel.id, rel.partnerId] : [rel.id];
            break;
        case 'fratello': // stessi genitori
            created.parentIds = [...rel.parentIds];
            break;
        case 'genitore': {
            const other = rel.parentIds[0]; // se c'è già un genitore, i due diventano coppia
            if (other) {
                created.partnerId = other;
                patch(other, { partnerId: created.id });
            }
            patch(rel.id, { parentIds: [...rel.parentIds, created.id] });
            break;
        }
    }
    return { people: [...next, created], newId: created.id };
}

/* ---------- Mapper verso pannello e modale ---------- */
export const toOptions = (people: Person[]): PersonOption[] =>
    people.map((p) => ({ id: p.id, name: fullName(p), meta: p.birthYear ? String(p.birthYear) : undefined }));

export function toPersonData(people: Person[], id: string): PersonData | undefined {
    const p = people.find((x) => x.id === id);
    if (!p) return undefined;
    const f = p.sex === 'donna';
    const years = p.deathYear
        ? `Vissut${f ? 'a' : 'o'} dal ${p.birthYear ?? '?'} al ${p.deathYear}`
        : p.birthYear ? `Nat${f ? 'a' : 'o'} nel ${p.birthYear}` : '';

    const label = (x: Person, [m, w]: [string, string]) => (x.sex === 'donna' ? w : m);
    const family: { id: string; name: string; relation: string }[] = [];
    const add = (x: Person | undefined, rel: [string, string]) =>
        x && family.push({ id: x.id, name: fullName(x), relation: label(x, rel) });

    add(people.find((x) => x.id === p.partnerId), ['Marito', 'Moglie']);
    p.parentIds.forEach((pid) => add(people.find((x) => x.id === pid), ['Padre', 'Madre']));
    people.filter((x) => x.parentIds.includes(p.id)).forEach((x) => add(x, ['Figlio', 'Figlia']));
    people
        .filter((x) => x.id !== p.id && x.parentIds.some((pid) => p.parentIds.includes(pid)))
        .forEach((x) => add(x, ['Fratello', 'Sorella']));

    return { name: fullName(p), years, job: p.job ?? '', bio: p.bio ?? '', family } as PersonData;
}