/** Modalità della conversazione: cosa si aspetta Iris dal prossimo messaggio. */
export type Mode = 'idle' | 'awaiting_story' | 'awaiting_person';

export type ChatStatus = 'idle' | 'listening' | 'thinking';

/** Destinazioni astratte: solo `integration/useIrisNavigation` sa tradurle in URL. */
export type NavTarget =
  | { to: 'post' }
  | { to: 'albero' }
  | { to: 'ricerca' }
  | { to: 'aggiungi' }
  | { to: 'profile'; id: string }
  | { to: 'tree'; id: string };

/** Stato passato al router (`navigate(path, { state })`). La pagina "Racconta un ricordo" legge `draft`. */
export interface NavState {
  draft?: string;
}

export type QuickReply =
  | { label: string; kind: 'send'; text: string }
  | { label: string; kind: 'go'; target: NavTarget }
  | { label: string; kind: 'close' };

export interface FamilyMember {
  id: string;
  name: string;
  /** Relazione rispetto all'utente corrente: "Nonno", "Madre", "Zia"… */
  relation?: string;
  job?: string;
  years?: string;
  branch?: string;
  deceased?: boolean;
  isSelf?: boolean;
}

export interface CurrentUser {
  /** Nome di battesimo, usato nei saluti. */
  name: string;
  fullName: string;
  initials: string;
  photoUrl?: string;
}

export type Block =
  | { type: 'person'; person: FamilyMember }
  | { type: 'personList'; people: FamilyMember[] }
  | { type: 'postDraft'; draft: string };

/**
 * Nodo della tabella statica delle risposte.
 * I testi usano `**grassetto**` come unico markup e `{name}` come segnaposto.
 */
export interface ScriptNode {
  hello?: string;
  text: string;
  list?: string[];
  quickReplies?: QuickReply[];
  /** Modalità in cui entra la chat dopo questa risposta (default: idle). */
  mode?: Mode;
}

export type IrisReply = ScriptNode & { blocks?: Block[] };

export interface Message {
  id: string;
  author: 'iris' | 'user';
  createdAt: number;
  hello?: string;
  text: string;
  list?: string[];
  blocks?: Block[];
  quickReplies?: QuickReply[];
}

/** Azioni che la UI può innescare, passate dall'alto senza provider. */
export interface ChatActions {
  send(text: string): void;
  go(target: NavTarget, state?: NavState): void;
  close(): void;
}
