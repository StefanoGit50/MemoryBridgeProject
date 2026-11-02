import React, { useEffect, useState, RefObject } from 'react';
import styles from './GuidedTour.module.css';
import { Button } from './Buttons';

export interface TourStep {
    targetRef: RefObject<HTMLElement | null>;
    content: string;
}

interface GuidedTourProps {
    isOpen: boolean;
    stepIndex: number;
    steps: TourStep[];
    onClose: () => void;
    onNext: () => void;
    onPrev: () => void;
    assistantAvatarSrc?: string;
    assistantName?: string;
}

export function GuidedTour({
                               isOpen,
                               stepIndex,
                               steps = [],
                               onClose,
                               onNext,
                               onPrev,
                               assistantAvatarSrc,
                               assistantName = "Guide"
                           }: GuidedTourProps) {
    const [dialogStyle, setDialogStyle] = useState<React.CSSProperties>({});
    const currentStep = steps[stepIndex];

    useEffect(() => {
        if (!isOpen || !currentStep || !currentStep.targetRef?.current) return;

        const element = currentStep.targetRef.current;
        element.classList.add(styles.highlighted);

        const rect = element.getBoundingClientRect();
        let top = rect.bottom + 15;
        let left = rect.left + 20;

        if (top + 200 > window.innerHeight) top = window.innerHeight - 210;
        if (top < 10) top = 10;
        if (left + 400 > window.innerWidth - 20) left = window.innerWidth - 420;
        if (left < 10) left = 10;

        setDialogStyle({ top: `${top}px`, left: `${left}px` });

        return () => {
            element.classList.remove(styles.highlighted);
        };
    }, [isOpen, stepIndex, currentStep]);

    if (!isOpen || !currentStep) return null;

    return (
        <>
            <div className={styles.backdrop} onClick={onClose} />
            <div className={styles.dialogBox} style={dialogStyle}>
                {assistantAvatarSrc && (
                    <div className={styles.avatarWrap}>
                        <img src={assistantAvatarSrc} alt={assistantName} />
                    </div>
                )}
                <div className={styles.bubble}>
                    <div className={styles.headerRow}>
                        <span className={styles.title}>{assistantName}</span>
                        <button className={styles.closeBtn} onClick={onClose}>&times;</button>
                    </div>
                    <p className={styles.text}>{currentStep.content}</p>
                    <div className={styles.footerRow}>
                        <span className={styles.counter}>{stepIndex + 1} / {steps.length}</span>
                        <div className={styles.buttonsGroup}>
                            <Button
                                variant="secondary"
                                size="small"
                                onClick={onPrev}
                                disabled={stepIndex === 0}
                            >
                                Indietro
                            </Button>
                            <Button
                                variant="primary"
                                size="small"
                                onClick={onNext}
                            >
                                {stepIndex === steps.length - 1 ? 'Fine' : 'Avanti'}
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}