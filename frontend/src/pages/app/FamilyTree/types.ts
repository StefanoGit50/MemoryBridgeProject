
export type RelationType = 'parent' | 'child' | 'partner';
export interface FamilyMember {
    id: string;
    name: string;
    relation: string;
    birthYear?: number;  // <--- Aggiungi '?' qui
    deathYear?: number;  // <--- Utile rendere opzionale anche questo se presente
    avatar?: string;
    story?: string;
    memoriesCount: number;
    parents: string[];
    partnerId?: string;
    x: number;
    y: number;
}