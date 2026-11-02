/**
 * Tipi minimi della Web Speech API (non presenti in lib.dom di tutte le versioni di TypeScript).
 * I nomi hanno il prefisso "Iris" per non andare in conflitto con eventuali tipi globali.
 */

interface IrisSpeechRecognitionAlternative {
  readonly transcript: string;
  readonly confidence: number;
}

interface IrisSpeechRecognitionResult {
  readonly length: number;
  readonly isFinal: boolean;
  [index: number]: IrisSpeechRecognitionAlternative;
}

interface IrisSpeechRecognitionResultList {
  readonly length: number;
  [index: number]: IrisSpeechRecognitionResult;
}

interface IrisSpeechRecognitionEvent extends Event {
  readonly resultIndex: number;
  readonly results: IrisSpeechRecognitionResultList;
}

interface IrisSpeechRecognitionErrorEvent extends Event {
  readonly error: string;
  readonly message: string;
}

interface IrisSpeechRecognition extends EventTarget {
  lang: string;
  continuous: boolean;
  interimResults: boolean;
  onresult: ((event: IrisSpeechRecognitionEvent) => void) | null;
  onerror: ((event: IrisSpeechRecognitionErrorEvent) => void) | null;
  onend: (() => void) | null;
  start(): void;
  stop(): void;
  abort(): void;
}

interface IrisSpeechRecognitionConstructor {
  new (): IrisSpeechRecognition;
}
