import { RefObject } from 'react';
import { TourStep } from '../Components/GuidedTour';

export interface IrisTourRefs {
    topbarRef: RefObject<HTMLElement | null>;
    heroRef: RefObject<HTMLElement | null>;
    detailPanelRef: RefObject<HTMLElement | null>;
}

export function getIrisTourSteps(refs: IrisTourRefs): TourStep[] {
    return [
        {
            targetRef: refs.topbarRef,
            content: "TODO: Benvenuto in IRIS (Topbar). Qui trovi le opzioni di navigazione e ricerca principale.",
        },
        {
            targetRef: refs.heroRef,
            content: "TODO: Sezione Hero. Panoramica generale e statistiche chiave del progetto.",
        },
        {
            targetRef: refs.detailPanelRef,
            content: "TODO: Pannello Dettaglio Persona. Qui puoi consultare la biografia, i familiari stretti e compiere azioni rapide.",
        },
    ];
}