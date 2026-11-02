import React from 'react';
import { useIrisTour } from '@/provaTree2/IrisGuide/useIrisTour';
import { GuidedTour } from './Components/GuidedTour';
import { PersonDetailPanel, PersonData } from './Panels/PersonDetailPanel';
import { Button } from './Components/Buttons';
import styles from './App.module.css';
import {UserIcon} from "lucide-react";
export function App() {
    const { isOpen, stepIndex, steps, startTour, closeTour, nextStep, prevStep, refs } = useIrisTour();

    const mockPerson: PersonData = {
        name: "Orazio Han",
        years: "Nato nel 1960",
        job: "Artigiano",
        bio: "Orazio è cresciuto in una famiglia umile, senza mai perdere la voglia di lavorare con le mani. Ha imparato il mestiere di falegname da suo padre e non lo ha più lasciato. Ha incontrato Clara al mercato del paese: si sono sposati due anni dopo.",
        family: [
            { id: 'clara', name: 'Clara Shin', relation: 'Moglie' },
            { id: 'shila', name: 'Shila Han', relation: 'Figlia' },
            { id: 'mario', name: 'Mario Han', relation: 'Figlio' }
        ]
    };

    return (
        <div className={styles.appContainer}>
            {/* Topbar NAVBAR */}
            <header ref={refs.topbarRef} className={styles.topbar}>
                <div className={styles.brand}>
          <span className={styles.brandMark} aria-hidden="true">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><path d="M12 21V11"/><path d="M12 11c0-3 2-4 5-5"/><path d="M12 14c0-2.5-1.8-3.4-4.5-4.2"/><circle cx="17" cy="5" r="1.4"/><circle cx="7.5" cy="9" r="1.4"/><circle cx="12" cy="21" r="1.4"/></svg>
          </span>
                    <span className={styles.brandName}>Memory<em>Bridge</em></span>
                </div>

                <nav className={styles.navLinks} aria-label="Navigazione principale">
                    <a href="#">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><path d="M3 11l9-7 9 7"/><path d="M5 10v9a1 1 0 001 1h4v-6h4v6h4a1 1 0 001-1v-9"/></svg>
                        Home
                    </a>
                    <a href="#" aria-current="page">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><path d="M12 21V11"/><path d="M12 11c0-3 2-4 5-5"/><path d="M12 14c0-2.5-1.8-3.4-4.5-4.2"/><circle cx="17" cy="5" r="1.4"/><circle cx="7.5" cy="9" r="1.4"/></svg>
                        Albero Genealogico
                    </a>
                    <a href="#">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="7"/><path d="M21 21l-4.3-4.3"/></svg>
                        Ricerca
                    </a>
                    <a href="#">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><path d="M12 20s-7-4.3-9.5-8.4C1 8.5 2.4 5 6 5c2 0 3.3 1 4.5 2.6C11.7 6 13 5 15 5c3.6 0 5 3.5 3.5 6.6C16 16.7 12 20 12 20z"/></svg>
                        Racconta un ricordo
                    </a>
                </nav>

                <div className={styles.headerRight}>
                    <Button variant="secondary" size="small" onClick={startTour} className={styles.tourBtn}>
                        <svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{marginRight: '4px'}}><circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
                        Guida IRIS
                    </Button>
                    <div className={styles.profileChip}>
            <span className={styles.avatarSm} aria-hidden="true">
              <UserIcon width={17} height={17} />
            </span>
                        Arianna Han
                    </div>
                </div>
            </header>

            {/* Hero Section */}
            <section ref={refs.heroRef} className={styles.hero}>
                <svg className={styles.heroRings} viewBox="0 0 200 200" aria-hidden="true">
                    <circle cx="100" cy="100" r="94" fill="none" stroke="#f59e0b" strokeWidth="1"/>
                    <circle cx="100" cy="100" r="74" fill="none" stroke="#f59e0b" strokeWidth="1"/>
                    <circle cx="100" cy="100" r="54" fill="none" stroke="#f59e0b" strokeWidth="1"/>
                    <circle cx="100" cy="100" r="34" fill="none" stroke="#f59e0b" strokeWidth="1"/>
                </svg>
                <div className={styles.heroText}>
                    <h1>Storie di famiglia, radicate nel tempo</h1>
                    <p>Tocca una persona nell'albero per leggere la sua storia e scoprire chi le sta accanto.</p>
                </div>
                <div className={styles.heroActions}>
                    <div className={styles.searchField}>
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="7"/><path d="M21 21l-4.3-4.3"/></svg>
                        <input type="search" placeholder="Cerca un familiare per nome" aria-label="Cerca un familiare per nome" />
                    </div>
                    <Button variant="primary">Aggiungi familiare</Button>
                </div>
            </section>

            {/* Workspace: Pannello Dettaglio a SINISTRA, Area Albero a DESTRA */}
            <main className={styles.workspace}>
                <PersonDetailPanel
                    ref={refs.detailPanelRef}
                    person={mockPerson}
                    onSelectFamilyMember={(id) => console.log('Selezionato:', id)}
                    onOpenMemoryModal={() => console.log('Ricordo')}
                    onOpenFullProfile={() => console.log('Profilo')}
                />
                <div className={styles.treeAreaPlaceholder}>
                    <div className={styles.placeholderCard}>
                        <p>Seleziona un profilo per visualizzare la mappa delle connessioni.</p>
                    </div>
                </div>
            </main>

            {/* Tour guidato IRIS */}
            <GuidedTour
                isOpen={isOpen}
                stepIndex={stepIndex}
                steps={steps}
                onClose={closeTour}
                onNext={nextStep}
                onPrev={prevStep}
                assistantName="IRIS IA"
            />
        </div>
    );
}

export default App;