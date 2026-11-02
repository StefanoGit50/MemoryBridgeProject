import type { FamilyMember } from '../types';

/** Minuscolo, senza accenti né punteggiatura, spazi singoli. */
export function normalizeText(s: string): string {
  return s
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9]+/g, ' ')
    .trim();
}

/** Parola usata dall'utente → relazione canonica (confrontata con `FamilyMember.relation`). */
const RELATION_ALIASES: Record<string, string> = {
  papa: 'padre',
  babbo: 'padre',
  padre: 'padre',
  mamma: 'madre',
  madre: 'madre',
  nonno: 'nonno',
  nonna: 'nonna',
  zio: 'zio',
  zia: 'zia',
  fratello: 'fratello',
  sorella: 'sorella',
  figlio: 'figlio',
  figlia: 'figlia',
  marito: 'marito',
  moglie: 'moglie',
  cugino: 'cugino',
  cugina: 'cugina',
  nipote: 'nipote',
};

/**
 * Ricerca per nome o parentela. Restituisce i familiari col punteggio più alto
 * (relazione = 2 punti, token del nome = 1 punto), oppure [] se nessuno corrisponde.
 */
export function findFamilyMembers(query: string, members: readonly FamilyMember[]): FamilyMember[] {
  const tokens = normalizeText(query)
    .split(' ')
    .filter((t) => t.length >= 3);
  if (tokens.length === 0) return [];

  const scored = members.map((member) => {
    const nameTokens = normalizeText(member.name).split(' ');
    const relation = member.relation ? normalizeText(member.relation) : '';
    let score = 0;
    for (const token of tokens) {
      const alias = RELATION_ALIASES[token];
      if (alias && alias === relation) score += 2;
      if (nameTokens.some((nt) => nt === token || (token.length >= 4 && nt.startsWith(token)))) score += 1;
    }
    return { member, score };
  });

  const best = Math.max(0, ...scored.map((s) => s.score));
  return best === 0 ? [] : scored.filter((s) => s.score === best).map((s) => s.member);
}

/** Riga descrittiva: "Nonno · Artigiano · 1960 · In memoria". */
export function memberMeta(member: FamilyMember): string {
  const parts = [member.relation, member.job, member.years, member.branch].filter(Boolean) as string[];
  if (member.deceased) parts.push('In memoria');
  return parts.join(' · ');
}
