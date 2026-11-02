import { useEffect, useRef, useState } from 'react';
import type { WizardStep } from '../types';

const PROCESSING_DELAY_MS = 1500;

export function useCreateMemoryWizard() {
    const [step, setStep] = useState<WizardStep>(1);
    const [isProcessing, setIsProcessing] = useState(false);
    const processingTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    // Ripulisce il timeout pendente allo smontaggio (nell'originale non veniva ripulito).
    useEffect(() => {
        return () => {
            if (processingTimeoutRef.current) clearTimeout(processingTimeoutRef.current);
        };
    }, []);

    function goToStep(nextStep: WizardStep) {
        setStep(nextStep);
    }

    function goToPreviewWithProcessing() {
        setStep(3);
        setIsProcessing(true);
        processingTimeoutRef.current = setTimeout(() => {
            setIsProcessing(false);
        }, PROCESSING_DELAY_MS);
    }

    return { step, isProcessing, goToStep, goToPreviewWithProcessing };
}
