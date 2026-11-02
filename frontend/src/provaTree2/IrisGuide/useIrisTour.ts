import { useState, useRef } from 'react';
import { getIrisTourSteps } from './IrisTourStep';

export function useIrisTour() {
    const [isOpen, setIsOpen] = useState<boolean>(false);
    const [stepIndex, setStepIndex] = useState<number>(0);

    // Creazione dei ref da associare ai componenti della pagina
    const topbarRef = useRef<HTMLElement | null>(null);
    const heroRef = useRef<HTMLElement | null>(null);
    const detailPanelRef = useRef<HTMLElement | null>(null);

    const steps = getIrisTourSteps({
        topbarRef,
        heroRef,
        detailPanelRef,
    });

    const startTour = () => {
        setStepIndex(0);
        setIsOpen(true);
    };

    const closeTour = () => {
        setIsOpen(false);
    };

    const nextStep = () => {
        if (stepIndex < steps.length - 1) {
            setStepIndex((prev) => prev + 1);
        } else {
            setIsOpen(false);
        }
    };

    const prevStep = () => {
        if (stepIndex > 0) {
            setStepIndex((prev) => prev - 1);
        }
    };

    return {
        isOpen,
        stepIndex,
        steps,
        startTour,
        closeTour,
        nextStep,
        prevStep,
        refs: {
            topbarRef,
            heroRef,
            detailPanelRef,
        },
    };
}