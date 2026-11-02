import { useCallback, useEffect, useMemo, useRef, useState, type KeyboardEvent, type RefObject } from 'react';
import { createPortal } from 'react-dom';
import { AnimatePresence, MotionConfig, motion } from 'framer-motion';
import { useCurrentUser } from './integration/useCurrentUser';
import { useFamilyMembers } from './integration/useFamilyMembers';
import { useIrisNavigation } from './integration/useIrisNavigation';
import { useIrisChat } from './state/useIrisChat';
import type { ChatActions, ChatStatus, NavState, NavTarget } from './types';
import { useSpeechDictation } from './voice/useSpeechDictation';
import { ChatHeader } from './ui/ChatHeader/ChatHeader';
import { Composer } from './ui/Composer/Composer';
import { MessageThread } from './ui/MessageThread/MessageThread';
import styles from './IrisChat.module.css';

export interface IrisChatProps {
  /** Visibilità: il componente resta montato, così la conversazione sopravvive a chiusura e riapertura. */
  open: boolean;
  onClose: () => void;
  /** Elemento da cui la finestra "nasce" (es. il bottone del Dial). Se manca, parte dall'angolo in basso a destra. */
  anchorRef?: RefObject<HTMLElement | null>;
}

interface Offset {
  x: number;
  y: number;
}

/** Distanza tra il centro dello schermo (dove sta la finestra) e il centro dell'ancora. */
function measureOffset(anchor: HTMLElement | null | undefined): Offset {
  const centerX = window.innerWidth / 2;
  const centerY = window.innerHeight / 2;
  if (anchor) {
    const rect = anchor.getBoundingClientRect();
    return { x: rect.left + rect.width / 2 - centerX, y: rect.top + rect.height / 2 - centerY };
  }
  return { x: centerX - 48, y: centerY - 120 };
}

const FOCUSABLE = 'button:not(:disabled), textarea:not(:disabled), a[href]';

export function IrisChat({ open, onClose, anchorRef }: IrisChatProps) {
  const user = useCurrentUser();
  const members = useFamilyMembers();
  const navigateTo = useIrisNavigation();
  const chat = useIrisChat({ userName: user.name, members });

  const [draft, setDraft] = useState('');
  const dictation = useSpeechDictation({ lang: 'it-IT', onTranscript: setDraft });
  const { stop: stopDictation } = dictation;

  const windowRef = useRef<HTMLElement>(null);
  const onCloseRef = useRef(onClose);
  useEffect(() => {
    onCloseRef.current = onClose;
  });

  const offset = useRef<Offset>({ x: 0, y: 0 });
  if (open && typeof window !== 'undefined') offset.current = measureOffset(anchorRef?.current);

  const { ensureGreeting } = chat;
  useEffect(() => {
    if (open) ensureGreeting();
  }, [open, ensureGreeting]);

  useEffect(() => {
    if (!open) stopDictation();
  }, [open, stopDictation]);

  // Mentre è aperta: Esc chiude e, alla chiusura, il focus torna dov'era.
  useEffect(() => {
    if (!open) return;
    const previouslyFocused = document.activeElement as HTMLElement | null;
    const onKeyDown = (event: globalThis.KeyboardEvent) => {
      if (event.key === 'Escape') onCloseRef.current();
    };
    document.addEventListener('keydown', onKeyDown);
    return () => {
      document.removeEventListener('keydown', onKeyDown);
      previouslyFocused?.focus?.();
    };
  }, [open]);

  const trapFocus = (event: KeyboardEvent<HTMLElement>) => {
    if (event.key !== 'Tab' || !windowRef.current) return;
    const focusable = Array.from(windowRef.current.querySelectorAll<HTMLElement>(FOCUSABLE));
    if (focusable.length === 0) return;
    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  };

  const actions = useMemo<ChatActions>(
    () => ({
      send: chat.send,
      go: (target: NavTarget, state?: NavState) => {
        navigateTo(target, state);
        onCloseRef.current(); // la conversazione resta: riaprendo la chat la ritrovi
      },
      close: () => onCloseRef.current(),
    }),
    [chat.send, navigateTo],
  );

  const submit = () => {
    const text = draft.trim();
    if (!text || chat.typing) return;
    stopDictation();
    setDraft('');
    chat.send(text);
  };

  const toggleDictation = useCallback(() => {
    if (dictation.listening) dictation.stop();
    else dictation.start(draft.trim() ? `${draft.trim()} ` : '');
  }, [dictation, draft]);

  const status: ChatStatus = dictation.listening ? 'listening' : chat.typing ? 'thinking' : 'idle';

  if (typeof document === 'undefined') return null;

  return createPortal(
    <MotionConfig reducedMotion="user">
      <AnimatePresence>
        {open && (
          <motion.div
            key="iris-scrim"
            className={styles.scrim}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.35 }}
            onMouseDown={(event) => {
              if (event.target === event.currentTarget) onClose();
            }}
          >
            <motion.section
              ref={windowRef}
              className={styles.window}
              role="dialog"
              aria-modal="true"
              aria-label="Chat con Iris"
              onKeyDown={trapFocus}
              initial={{ opacity: 0, scale: 0.2, x: offset.current.x, y: offset.current.y }}
              animate={{ opacity: 1, scale: 1, x: 0, y: 0 }}
              exit={{ opacity: 0, scale: 0.2, x: offset.current.x, y: offset.current.y, transition: { duration: 0.3 } }}
              transition={{ duration: 0.5, ease: [0.22, 0.9, 0.3, 1] }}
            >
              <ChatHeader status={status} onReset={chat.reset} onClose={onClose} />
              <MessageThread
                messages={chat.messages}
                typing={chat.typing}
                draftText={draft}
                listening={dictation.listening}
                user={user}
                actions={actions}
              />
              <Composer
                value={draft}
                onChange={setDraft}
                onSubmit={submit}
                busy={chat.typing}
                listening={dictation.listening}
                dictationSupported={dictation.supported}
                dictationNotice={dictation.error}
                onToggleDictation={toggleDictation}
              />
            </motion.section>
          </motion.div>
        )}
      </AnimatePresence>
    </MotionConfig>,
    document.body,
  );
}
