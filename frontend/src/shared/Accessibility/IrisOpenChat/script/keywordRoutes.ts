import { normalizeText } from '../family/findFamilyMembers';
import type { Mode } from '../types';
import type { NodeId } from './irisScript';

export type Route = { kind: 'node'; id: NodeId } | { kind: 'person' } | { kind: 'story' };

const node = (id: NodeId): Route => ({ kind: 'node', id });

/* Tutte le chiavi sono già normalizzate (minuscolo, senza accenti). */

const GREET_WORDS = ['ciao', 'salve', 'buongiorno', 'buonasera', 'hey', 'ehi'];
const THANKS_KEYS = ['grazie', 'ti ringrazio'];
const CANCEL_KEYS = ['annulla', 'lascia stare', 'non voglio'];

/** Richieste esplicite di spiegazione: rispondono col tema più adatto o con "cosa posso fare". */
const HELP_KEYS = [
  'come funziona',
  'spiega',
  ' cos e ',
  ' cosa e ',
  'che cos',
  'a cosa serve',
  'cosa puoi',
  'cosa sai',
  'cosa posso',
  'aiuto',
  'help',
  'informazion',
  'cosa trovo',
  'chi sei',
  'funzionalit',
];

/** Voglia di raccontare qualcosa → flusso "crea post". */
const POST_KEYS = ['post', 'storia', 'storie', 'ricordo', 'raccont', 'scriver', 'pubblic', 'condivid', 'dettar'];

/** Cerca una persona → flusso "trova familiare". */
const FIND_KEYS = ['trov', 'cerc', 'dov e', 'dove', 'chi e', 'mostra', 'profilo', 'apri', 'vedere', 'familiar'];

/** Temi del sito. Vince la prima voce che corrisponde: le più specifiche stanno in alto. */
const TOPIC_ROUTES: ReadonlyArray<{ id: NodeId; keys: readonly string[] }> = [
  { id: 'info.add', keys: ['aggiung', 'nuovo familiare', 'inserire un familiare'] },
  { id: 'info.tree', keys: ['albero', 'genealogic', 'generazion', 'coppia', 'in memoria', 'schede'] },
  { id: 'info.search', keys: ['ricerca', 'barra di ricerca'] },
  { id: 'info.listen', keys: ['ascolta', 'racconto a voce', 'ad alta voce', 'leggere'] },
  {
    id: 'info.accessibility',
    keys: ['accessibil', 'carattere', 'font', 'contrast', 'daltonic', 'protanopia', 'deuteranopia', 'tritanopia'],
  },
  { id: 'info.postSection', keys: ['racconta un ricordo', 'sezione ricordo', 'microfono', 'audio', 'vocale'] },
  { id: 'info.suggestion', keys: ['consiglia', 'spunt', 'suggeriment'] },
  { id: 'info.profile', keys: ['profilo completo', 'biografia', 'storia di'] },
  { id: 'info.iris', keys: ['chi sei', 'iris', 'guida', 'tutorial', 'assistente'] },
  { id: 'info.sections', keys: ['sezion', 'menu', 'navigazion', 'memorybridge', 'sito', 'piattaforma'] },
];

const includesAny = (text: string, keys: readonly string[]) => keys.some((k) => text.includes(k));

function matchTopic(padded: string): NodeId | null {
  return TOPIC_ROUTES.find((r) => includesAny(padded, r.keys))?.id ?? null;
}

/** Tutto tranne "trova familiare" e fallback. null = nessuna parola chiave riconosciuta. */
function routeKeywords(t: string, hasPersonMatch: boolean): Route | null {
  const padded = ` ${t} `;
  const words = t ? t.split(' ') : [];

  if (words.length <= 3 && GREET_WORDS.includes(words[0])) return node('greet');
  if (includesAny(t, THANKS_KEYS)) return node('thanks');

  if (includesAny(padded, HELP_KEYS)) return node(matchTopic(padded) ?? 'capabilities');

  const wantsPost = includesAny(t, POST_KEYS);
  if (hasPersonMatch && !wantsPost) return { kind: 'person' };
  if (wantsPost) return node('askStory');

  const topic = matchTopic(padded);
  return topic ? node(topic) : null;
}

/**
 * Sceglie la risposta al testo libero con semplici `includes` su tabelle statiche.
 * `hasPersonMatch` dice se findFamilyMembers ha trovato qualcuno nel testo.
 */
export function routeText(text: string, mode: Mode, hasPersonMatch: boolean): Route {
  const t = normalizeText(text);

  if (mode === 'awaiting_story') {
    return includesAny(t, CANCEL_KEYS) ? node('storyCancelled') : { kind: 'story' };
  }

  if (mode === 'awaiting_person') {
    if (includesAny(t, CANCEL_KEYS)) return node('personCancelled');
    if (hasPersonMatch) return { kind: 'person' };
    // Se sembra un'altra richiesta la gestiamo normalmente, altrimenti è un nome non trovato.
    return routeKeywords(t, false) ?? { kind: 'person' };
  }

  const found = routeKeywords(t, hasPersonMatch);
  if (found) return found;
  if (includesAny(t, FIND_KEYS)) return node('askPerson');
  return node('fallback');
}
