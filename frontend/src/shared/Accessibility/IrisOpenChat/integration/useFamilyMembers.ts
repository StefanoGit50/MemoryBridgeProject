import type { FamilyMember } from '../types';

/**
 * TODO: sostituisci questi dati di esempio (presi dal prototipo) con quelli reali dell'app.
 * Basta restituire un `FamilyMember[]` stabile (stessa referenza finché i dati non cambiano),
 * per esempio mappando il tuo hook/store/query dell'albero con useMemo.
 *
 * `relation` è la parentela rispetto all'utente loggato ("Nonno", "Madre", "Zia"…):
 * è ciò che permette di cercare con frasi come «mia nonna».
 */
const SAMPLE_MEMBERS: FamilyMember[] = [
  { id: 'orazio', name: 'Orazio Han', years: '1960', job: 'Artigiano', relation: 'Nonno' },
  { id: 'clara', name: 'Clara Shin', years: '1950–2020', job: 'Sarta', relation: 'Nonna', deceased: true },
  { id: 'shila', name: 'Shila Han', years: '1980', job: 'Designer', relation: 'Zia' },
  { id: 'mario', name: 'Mario Han', years: '1988', job: 'Designer', relation: 'Padre' },
  { id: 'lucia', name: 'Lucia Rossi', years: '1999', job: 'Bancaria', relation: 'Madre' },
  { id: 'arianna', name: 'Arianna Han', years: '2004', job: 'Studentessa', relation: 'Tu', isSelf: true },
  { id: 'elena', name: 'Elena Han', branch: 'Ramo Han' },
];

export function useFamilyMembers(): FamilyMember[] {
  return SAMPLE_MEMBERS;
}
