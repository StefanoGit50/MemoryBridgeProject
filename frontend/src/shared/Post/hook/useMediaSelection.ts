import { useEffect, useRef, useState } from 'react';
import type { ContentType } from '../types';

export function useMediaSelection() {
    const [contentType, setContentType] = useState<ContentType>('immagine');
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [previewUrl, setPreviewUrlState] = useState<string | null>(null);
    const previousUrlRef = useRef<string | null>(null);

    // Revoca l'ultimo object URL creato quando il componente si smonta
    // (nell'originale gli object URL non venivano mai rilasciati).
    useEffect(() => {
        return () => {
            if (previousUrlRef.current) URL.revokeObjectURL(previousUrlRef.current);
        };
    }, []);

    function setPreviewUrl(url: string | null) {
        if (previousUrlRef.current && previousUrlRef.current !== url) {
            URL.revokeObjectURL(previousUrlRef.current);
        }
        previousUrlRef.current = url;
        setPreviewUrlState(url);
    }

    function setMedia(file: File | null, url: string | null) {
        setSelectedFile(file);
        setPreviewUrl(url);
    }

    function resetMedia() {
        setMedia(null, null);
    }

    function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
        const file = e.target.files?.[0];
        if (!file) return;
        setMedia(file, URL.createObjectURL(file));
    }

    return {
        contentType,
        setContentType,
        selectedFile,
        previewUrl,
        setMedia,
        resetMedia,
        handleFileChange,
    };
}
