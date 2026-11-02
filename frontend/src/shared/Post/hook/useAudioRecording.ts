import { useEffect, useRef, useState } from 'react';
import { CREATE_MEMORY_CONTENT } from '../content';

export function useAudioRecording(onRecorded: (file: File, url: string) => void) {
    const [isRecording, setIsRecording] = useState(false);
    const [audioRecorded, setAudioRecorded] = useState(false);
    const [recordingTime, setRecordingTime] = useState(0);
    const [isPlayingPreview, setIsPlayingPreview] = useState(false);

    const mediaRecorderRef = useRef<MediaRecorder | null>(null);
    const audioChunksRef = useRef<Blob[]>([]);
    const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
    const streamRef = useRef<MediaStream | null>(null);
    const previewAudioRef = useRef<HTMLAudioElement | null>(null);

    // Cleanup completo allo smontaggio: nell'originale veniva fermato solo il timer,
    // lasciando il microfono attivo se il componente si smontava a metà registrazione.
    useEffect(() => {
        return () => {
            if (timerRef.current) clearInterval(timerRef.current);
            streamRef.current?.getTracks().forEach((track) => track.stop());
        };
    }, []);

    async function startRecording() {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            streamRef.current = stream;

            const mediaRecorder = new MediaRecorder(stream);
            mediaRecorderRef.current = mediaRecorder;
            audioChunksRef.current = [];

            mediaRecorder.ondataavailable = (event) => {
                if (event.data.size > 0) {
                    audioChunksRef.current.push(event.data);
                }
            };

            mediaRecorder.onstop = () => {
                const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
                const audioUrl = URL.createObjectURL(audioBlob);
                const audioFile = new File([audioBlob], 'nota-vocale.webm', { type: 'audio/webm' });

                onRecorded(audioFile, audioUrl);
                setAudioRecorded(true);

                streamRef.current?.getTracks().forEach((track) => track.stop());
                streamRef.current = null;
            };

            mediaRecorder.start();
            setIsRecording(true);
            setAudioRecorded(false);
            setRecordingTime(0);

            timerRef.current = setInterval(() => {
                setRecordingTime((prev) => prev + 1);
            }, 1000);
        } catch (err) {
            console.error('Errore microfono:', err);
            alert(CREATE_MEMORY_CONTENT.contentTypeStep.audio.micPermissionError);
        }
    }

    function stopRecording() {
        if (mediaRecorderRef.current && isRecording) {
            mediaRecorderRef.current.stop();
            setIsRecording(false);
            if (timerRef.current) clearInterval(timerRef.current);
        }
    }

    // Resetta solo lo stato locale della registrazione (flag, timer, player).
    // Non tocca file/preview condivisi: quello resta responsabilità di chi chiama
    // (vedi useMediaSelection.resetMedia), per non far dipendere un hook dall'altro.
    function resetRecordingState() {
        setAudioRecorded(false);
        setRecordingTime(0);
        setIsPlayingPreview(false);
    }

    function togglePlayPreview() {
        if (!previewAudioRef.current) return;
        if (isPlayingPreview) {
            previewAudioRef.current.pause();
            setIsPlayingPreview(false);
        } else {
            previewAudioRef.current.play();
            setIsPlayingPreview(true);
        }
    }

    function formatTime(seconds: number) {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }

    return {
        isRecording,
        audioRecorded,
        recordingTime,
        isPlayingPreview,
        previewAudioRef,
        startRecording,
        stopRecording,
        resetRecordingState,
        togglePlayPreview,
        formatTime,
    };
}
