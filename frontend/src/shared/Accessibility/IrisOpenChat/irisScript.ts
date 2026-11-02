import { findFamilyMembers } from './family/findFamilyMembers';
import type { FamilyMember, IrisReply, NavTarget, QuickReply, ScriptNode } from './types';

/* ------------------------------------------------------------------ */
/* Helper per scrivere le risposte rapide                              */
/* ------------------------------------------------------------------ */

const say = (label: string, text: string = label): QuickReply => ({ label, kind: 'send', text });
const go = (label: string, target: NavTarget): QuickReply => ({ label, kind: 'go', target });

export const MAIN_REPLIES: QuickReply[] = [
  say('Racconta una storia', 'Voglio creare un post'),
  say('Trova un familiare', 'Voglio trovare un familiare'),
  say('Come funziona il sito?'),
];

/* ------------------------------------------------------------------ */
/* Tabella statica delle risposte                                      */
/* Markup ammesso: **grassetto**. Segnaposto: {name}.                  */
/* ------------------------------------------------------------------ */

export type NodeId =
  | 'greeting'
  | 'greet'
  | 'thanks'
  | 'capabilities'
  | 'fallback'
  | 'askStory'
  | 'storyTooShort'
  | 'storyCancelled'
  | 'askPerson'
  | 'personCancelled'
  | 'info.sections'
  | 'info.tree'
  | 'info.search'
  | 'info.postSection'
  | 'info.add'
  | 'info.profile'
  | 'info.accessibility'
  | 'info.listen'
  | 'info.suggestion'
  | 'info.iris';

export const SCRIPT: Record<NodeId, ScriptNode> = {
  greeting: {
    hello: 'Ciao {name}!',
    text: 'Sono **Iris**, la tua guida su MemoryBridge. Posso aiutarti a **raccontare una storia**, **ritrovare un familiare** o spiegarti come funziona il sito. Scrivimi, oppure tocca il microfono e parlami.',
    quickReplies: MAIN_REPLIES,
  },
  greet: {
    text: 'Ciao {name}! Dimmi pure cosa ti serve.',
    quickReplies: MAIN_REPLIES,
  },
  thanks: {
    text: 'Di nulla. Se ti serve altro, sono qui.',
    quickReplies: MAIN_REPLIES,
  },
  capabilities: {
    text: 'Ecco cosa posso fare per te:',
    list: [
      '**Creare un post**: mi racconti la storia, scritta o a voce, e ti porto alla pagina per pubblicarla.',
      '**Trovare un familiare**: mi dici chi cerchi e ti porto al suo profilo.',
      '**Spiegarti il sito**: sezioni, albero genealogico e funzionalità.',
    ],
    quickReplies: MAIN_REPLIES,
  },
  fallback: {
    text: 'Non ho capito bene, ma posso aiutarti con queste cose:',
    quickReplies: MAIN_REPLIES,
  },

  /* --- Crea post --- */
  askStory: {
    text: 'Volentieri. Raccontami la tua storia: **scrivila** qui sotto oppure **dettala** col microfono. Quando hai finito ti porto alla pagina dove diventa un post.',
    quickReplies: [say('Annulla')],
    mode: 'awaiting_story',
  },
  storyTooShort: {
    text: 'Mi piacerebbe saperne di più. Puoi aggiungere qualche dettaglio? Bastano un paio di frasi.',
    mode: 'awaiting_story',
  },
  storyCancelled: {
    text: 'Nessun problema. Quando vorrai raccontare qualcosa, sono qui.',
    quickReplies: MAIN_REPLIES,
  },

  /* --- Trova familiare --- */
  askPerson: {
    text: 'Certo. Chi stai cercando? Scrivimi un nome o un legame di parentela, per esempio «Mario» o «mia nonna».',
    quickReplies: [say('Mia madre'), say('Mio nonno'), say('Shila')],
    mode: 'awaiting_person',
  },
  personCancelled: {
    text: 'Va bene, nessun problema. Cosa posso fare per te?',
    quickReplies: MAIN_REPLIES,
  },

  /* --- Info sul sito --- */
  'info.sections': {
    text: '**MemoryBridge** è il tuo archivio di storie di famiglia. In alto trovi quattro sezioni:',
    list: [
      '**Home**: i ricordi della famiglia e i miei suggerimenti.',
      "**Albero Genealogico**: l'albero interattivo con tutti i familiari.",
      "**Ricerca**: per cercare all'interno dell'archivio.",
      '**Racconta un ricordo**: per scrivere o dettare una storia.',
    ],
    quickReplies: [
      go("Vai all'Albero", { to: 'albero' }),
      go('Vai a Racconta un ricordo', { to: 'post' }),
      say("Come funziona l'albero?", "Come funziona l'albero genealogico?"),
    ],
  },
  'info.tree': {
    text: "Nell'**Albero Genealogico** ogni persona è una scheda: toccandola, il pannello laterale mostra la sua storia e i **familiari stretti**.",
    list: [
      'La linea continua collega genitore e figlio.',
      'La linea tratteggiata con il rombo indica una coppia.',
      'Chi non c\'è più porta la dicitura «In memoria».',
    ],
    quickReplies: [go("Apri l'albero", { to: 'albero' }), say('Come aggiungo un familiare?')],
  },
  'info.search': {
    text: "Dalla pagina dell'albero puoi usare la **barra di ricerca**: scrivi un nome e le schede che non corrispondono si attenuano. C'è anche la sezione **Ricerca** nel menu. Oppure dimmi qui chi cerchi e ti porto al suo profilo.",
    quickReplies: [say('Trova un familiare', 'Voglio trovare un familiare'), go('Vai a Ricerca', { to: 'ricerca' })],
  },
  'info.postSection': {
    text: 'In **Racconta un ricordo** condividi una storia di famiglia scrivendola o dettandola col **microfono**. Se vuoi, la raccogliamo insieme qui e poi ti accompagno alla pagina giusta.',
    quickReplies: [
      say('Crea un post con Iris', 'Voglio creare un post'),
      go('Vai a Racconta un ricordo', { to: 'post' }),
    ],
  },
  'info.add': {
    text: "Per inserire una persona usa **Aggiungi familiare**, in alto nella pagina dell'albero.",
    quickReplies: [go('Vai ad Aggiungi familiare', { to: 'aggiungi' })],
  },
  'info.profile': {
    text: 'Ogni persona ha un **profilo completo** con la sua storia. Dall\'albero seleziona la scheda e tocca «Vedi profilo completo». Oppure dimmi il nome e ti ci porto io.',
    quickReplies: [say('Trova un familiare', 'Voglio trovare un familiare')],
  },
  'info.accessibility': {
    text: 'Dal **Menu di Accessibilità** puoi:',
    list: [
      'ingrandire o ridurre il **carattere** con il cursore;',
      "attivare l'**alto contrasto**;",
      'scegliere la **regolazione per daltonici** (protanopia, deuteranopia, tritanopia).',
    ],
    quickReplies: [{ label: 'Torna al menu', kind: 'close' }],
  },
  'info.listen': {
    text: 'Sotto ogni ricordo trovi **Ascolta Racconto A Voce**: ti permette di ascoltare la storia invece di leggerla.',
    quickReplies: [say('Cosa puoi fare?')],
  },
  'info.suggestion': {
    text: 'In cima alla home lascio un **suggerimento**: una domanda pensata per far nascere un ricordo, con il pulsante **Crea Ricordo** per trasformarla subito in una storia.',
    quickReplies: [say('Racconta una storia', 'Voglio creare un post')],
  },
  'info.iris': {
    text: "Sono **Iris**, l'assistente di MemoryBridge: ti guido nel sito, ti aiuto a ritrovare i familiari e a raccogliere le tue storie. Nell'albero trovi anche la **Guida Iris**, un breve percorso sulle zone della pagina.",
    quickReplies: [say('Cosa puoi fare?')],
  },
};

/** Restituisce il nodo con i segnaposto sostituiti. */
export function renderNode(id: NodeId, vars: { name: string }): ScriptNode {
  const node = SCRIPT[id];
  const fill = (s: string) => s.split('{name}').join(vars.name);
  return {
    ...node,
    hello: node.hello ? fill(node.hello) : undefined,
    text: fill(node.text),
  };
}

/* ------------------------------------------------------------------ */
/* Risposte con parti dinamiche (persona trovata, bozza del post…)     */
/* ------------------------------------------------------------------ */

const stripMarkup = (s: string) => s.replace(/\*/g, '');

export function storyReceived(draft: string): IrisReply {
  return {
    text: 'Grazie, è un ricordo prezioso. Ho preparato la bozza: nella pagina **Racconta un ricordo** potrai completarla e pubblicarla.',
    quickReplies: [say("Racconta un'altra storia", 'Voglio creare un post'), say('Trova un familiare', 'Voglio trovare un familiare')],
    blocks: [{ type: 'postDraft', draft: draft.trim() }],
  };
}

function personFound(member: FamilyMember, userName: string): IrisReply {
  const lead = member.isSelf
    ? `Questo è il tuo profilo, ${userName}.`
    : `Ecco **${member.name}**${member.relation ? `, ${member.relation.toLowerCase()} nella tua famiglia` : ''}.${
        member.deceased ? ' La ricordiamo con affetto.' : ''
      }`;
  return {
    text: lead,
    quickReplies: [say("Cerca un'altra persona", 'Voglio trovare un familiare')],
    blocks: [{ type: 'person', person: member }],
  };
}

function manyPeople(people: FamilyMember[]): IrisReply {
  return {
    text: `Ho trovato **${people.length} persone** che corrispondono. Quale intendi?`,
    blocks: [{ type: 'personList', people }],
  };
}

function personNotFound(query: string): IrisReply {
  const shown = stripMarkup(query.trim().slice(0, 40));
  return {
    text: `Non trovo nessun familiare che corrisponda a «${shown}» nel tuo albero. Controlla il nome oppure aggiungi la persona.`,
    quickReplies: [go('Aggiungi familiare', { to: 'aggiungi' }), say('Riprova', 'Voglio trovare un familiare')],
  };
}

/** Risposta alla ricerca familiari: 0, 1 o più corrispondenze. */
export function personReply(query: string, members: readonly FamilyMember[], userName: string): IrisReply {
  const hits = findFamilyMembers(query, members);
  if (hits.length === 1) return personFound(hits[0], userName);
  if (hits.length > 1) return manyPeople(hits);
  return personNotFound(query);
}
