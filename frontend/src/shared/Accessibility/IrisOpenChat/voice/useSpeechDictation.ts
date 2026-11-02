import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

interface UseSpeechDictationOptions {
  lang?: string;
  /** Riceve il testo completo: quello di partenza più quanto dettato finora. */
  onTranscript: (text: string) => void;
}

function getRecognitionConstructor(): IrisSpeechRecognitionConstructor | null {
  if (typeof window === 'undefined') return null;
  const w = window as unknown as {
    SpeechRecognition?: IrisSpeechRecognitionConstructor;
    webkitSpeechRecognition?: IrisSpeechRecognitionConstructor;
  };
  return w.SpeechRecognition ?? w.webkitSpeechRecognition ?? null;
}

function errorMessage(code: string): string | null {
  if (code === 'not-allowed' || code === 'service-not-allowed') {
    return 'Permesso al microfono negato: puoi comunque scrivere.';
  }
  if (code === 'aborted' || code === 'no-speech') return null;
  return 'Dettatura non disponibile, prova a scrivere.';
}

export function useSpeechDictation({ lang = 'it-IT', onTranscript }: UseSpeechDictationOptions) {
  const Recognition = useMemo(getRecognitionConstructor, []);
  const recognition = useRef<IrisSpeechRecognition | null>(null);
  const baseText = useRef('');
  const onTranscriptRef = useRef(onTranscript);
  const [listening, setListening] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    onTranscriptRef.current = onTranscript;
  });

  const start = useCallback(
    (initialText = '') => {
      if (!Recognition || recognition.current) return;
      setError(null);
      baseText.current = initialText;

      const rec = new Recognition();
      rec.lang = lang;
      rec.continuous = true;
      rec.interimResults = true;
      rec.onresult = (event) => {
        let transcript = '';
        for (let i = 0; i < event.results.length; i++) transcript += event.results[i][0].transcript;
        onTranscriptRef.current(baseText.current + transcript);
      };
      rec.onerror = (event) => setError(errorMessage(event.error));
      rec.onend = () => {
        recognition.current = null;
        setListening(false);
      };

      try {
        rec.start();
        recognition.current = rec;
        setListening(true);
      } catch {
        setError('Dettatura non disponibile, prova a scrivere.');
      }
    },
    [Recognition, lang],
  );

  const stop = useCallback(() => {
    recognition.current?.stop();
  }, []);

  useEffect(
    () => () => {
      const rec = recognition.current;
      if (rec) {
        rec.onend = null;
        rec.abort();
        recognition.current = null;
      }
    },
    [],
  );

  return { supported: Recognition !== null, listening, error, start, stop };
}
