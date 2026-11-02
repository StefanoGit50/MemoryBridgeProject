import { useCallback, useEffect, useReducer, useRef } from 'react';
import { findFamilyMembers } from './family/findFamilyMembers';
import { renderNode, personReply, storyReceived } from './script/irisScript';
import { routeText } from './script/keywordRoutes';
import type { FamilyMember, IrisReply, Message, Mode } from './types';

/** Sotto questa lunghezza la storia è troppo breve per diventare una bozza. */
const MIN_STORY_LENGTH = 20;
/** Ritardo prima del saluto, il tempo che la finestra finisca di aprirsi. */
const GREETING_DELAY_MS = 450;

/* ------------------------------------------------------------------ */
/* Reducer                                                             */
/* ------------------------------------------------------------------ */

interface State {
  messages: Message[];
  mode: Mode;
  typing: boolean;
}

type Action =
  | { type: 'USER_MESSAGE'; message: Message }
  | { type: 'TYPING_START' }
  | { type: 'IRIS_MESSAGE'; message: Message; mode: Mode }
  | { type: 'RESET' };

const INITIAL_STATE: State = { messages: [], mode: 'idle', typing: false };

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case 'USER_MESSAGE':
      return { ...state, messages: [...state.messages, action.message] };
    case 'TYPING_START':
      return { ...state, typing: true };
    case 'IRIS_MESSAGE':
      return { messages: [...state.messages, action.message], mode: action.mode, typing: false };
    case 'RESET':
      return INITIAL_STATE;
  }
}

/* ------------------------------------------------------------------ */
/* Utilità                                                             */
/* ------------------------------------------------------------------ */

let sequence = 0;
const nextId = () => `iris-msg-${++sequence}`;

function toIrisMessage(reply: IrisReply): Message {
  const { mode: _mode, ...content } = reply;
  return { id: nextId(), author: 'iris', createdAt: Date.now(), ...content };
}

/** "Sta scrivendo" a tempo: più la risposta è lunga, più dura (max 0,9 s). */
function typingDelay(reply: IrisReply): number {
  const length = reply.text.length + (reply.list?.join('').length ?? 0);
  return Math.min(450 + length * 3, 900);
}

/* ------------------------------------------------------------------ */
/* Hook                                                                */
/* ------------------------------------------------------------------ */

interface UseIrisChatOptions {
  userName: string;
  members: readonly FamilyMember[];
}

export function useIrisChat({ userName, members }: UseIrisChatOptions) {
  const [state, dispatch] = useReducer(reducer, INITIAL_STATE);
  const timers = useRef<number[]>([]);
  const generation = useRef(0);
  const started = useRef(false);

  const clearTimers = useCallback(() => {
    generation.current += 1;
    timers.current.forEach((id) => window.clearTimeout(id));
    timers.current = [];
  }, []);

  /** Esegue `fn` dopo `delay`, a meno che nel frattempo la chat sia stata azzerata. */
  const schedule = useCallback((fn: () => void, delay: number) => {
    const gen = generation.current;
    const id = window.setTimeout(() => {
      if (gen === generation.current) fn();
    }, delay);
    timers.current.push(id);
  }, []);

  const reply = useCallback(
    (content: IrisReply) => {
      dispatch({ type: 'TYPING_START' });
      schedule(
        () => dispatch({ type: 'IRIS_MESSAGE', message: toIrisMessage(content), mode: content.mode ?? 'idle' }),
        typingDelay(content),
      );
    },
    [schedule],
  );

  const send = useCallback(
    (raw: string) => {
      const text = raw.trim();
      if (!text || state.typing) return;

      dispatch({ type: 'USER_MESSAGE', message: { id: nextId(), author: 'user', createdAt: Date.now(), text } });

      const hasPersonMatch = findFamilyMembers(text, members).length > 0;
      const route = routeText(text, state.mode, hasPersonMatch);

      switch (route.kind) {
        case 'node':
          reply(renderNode(route.id, { name: userName }));
          break;
        case 'person':
          reply(personReply(text, members, userName));
          break;
        case 'story':
          reply(text.length < MIN_STORY_LENGTH ? renderNode('storyTooShort', { name: userName }) : storyReceived(text));
          break;
      }
    },
    [members, reply, state.mode, state.typing, userName],
  );

  /** Mostra il saluto una sola volta (alla prima apertura). */
  const ensureGreeting = useCallback(() => {
    if (started.current) return;
    started.current = true;
    schedule(() => reply(renderNode('greeting', { name: userName })), GREETING_DELAY_MS);
  }, [reply, schedule, userName]);

  const reset = useCallback(() => {
    clearTimers();
    dispatch({ type: 'RESET' });
    started.current = true;
    reply(renderNode('greeting', { name: userName }));
  }, [clearTimers, reply, userName]);

  // All'smontaggio (o nel doppio mount di StrictMode) azzera timer e flag del saluto.
  useEffect(
    () => () => {
      clearTimers();
      started.current = false;
    },
    [clearTimers],
  );

  return {
    messages: state.messages,
    typing: state.typing,
    mode: state.mode,
    send,
    reset,
    ensureGreeting,
  };
}
