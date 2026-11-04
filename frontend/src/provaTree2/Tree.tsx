import React from 'react';
import { useIrisTour } from '@/provaTree2/IrisGuide/useIrisTour';
import { GuidedTour } from './Components/GuidedTour';
import { PersonDetailPanel } from './Panels/PersonDetailPanel';
import { Button } from './Components/Buttons';
import styles from './App.module.css';
import AddRelativeModal, { NewRelativeData } from '@/provaTree2/Panels/AddRelative';
import { FamilyTree } from './Panels/FamilyTree';
import {
    Person,
    addRelative,
    getRelationBlockers,
    matchesQuery,
    toOptions,
    toPersonData,
} from './Panels/types';
import Navbar from './Panels/Navbar';

// Cognome della famiglia: le persone con un cognome diverso hanno la card "acquisita"
const FAMILY_NAME = 'Han';

// I legami stanno nei dati: parentIds (max 2) e partnerId. L'albero viene ricavato da qui.
// Nota: in ogni coppia metti per primo chi "guida" il ramo (es. Giuseppe prima di Maria).
const INITIAL_PEOPLE: Person[] = [
    {
        id: 'giuseppe', firstName: 'Giuseppe', lastName: 'Han', sex: 'uomo', birthYear: 1932, job: 'Falegname',
        bio: "Giuseppe è stato il padre di Orazio e un artigiano molto conosciuto nel paese. Ha trascorso gran parte della sua vita nella propria bottega, realizzando mobili e oggetti in legno. Ha insegnato a Orazio il mestiere di falegname.",
        parentIds: [], partnerId: 'maria',
    },
    {
        id: 'maria', firstName: 'Maria', lastName: 'Rossi', sex: 'donna', birthYear: 1935, job: 'Sarta',
        bio: "Maria è stata una donna forte e laboriosa. Ha lavorato per molti anni come sarta, realizzando abiti per le famiglie del paese. Ha cresciuto Orazio insegnandogli il valore della pazienza, dell'umiltà e dell'indipendenza.",
        parentIds: [], partnerId: 'giuseppe',
    },
    {
        id: 'orazio', firstName: 'Orazio', lastName: 'Han', sex: 'uomo', birthYear: 1960, job: 'Artigiano',
        bio: "Orazio è cresciuto in una famiglia umile, senza mai perdere la voglia di lavorare con le mani. Ha imparato il mestiere di falegname da suo padre e non lo ha più lasciato. Ha incontrato Clara al mercato del paese: si sono sposati due anni dopo.",
        parentIds: ['giuseppe', 'maria'], partnerId: 'clara',
    },
    {
        id: 'clara', firstName: 'Clara', lastName: 'Shin', sex: 'donna', birthYear: 1962, job: 'Insegnante',
        bio: "Clara è cresciuta in una famiglia numerosa. Ha conosciuto Orazio al mercato del paese e si è innamorata della sua semplicità e determinazione. Dopo il matrimonio ha continuato a dedicarsi all'insegnamento e alla famiglia.",
        parentIds: [], partnerId: 'orazio',
    },
    {
        id: 'shila', firstName: 'Shila', lastName: 'Han', sex: 'donna', birthYear: 1985, job: 'Architetta',
        bio: "Shila è la primogenita di Orazio e Clara. Fin da piccola ha mostrato una particolare attenzione per il disegno e la progettazione. Dopo gli studi universitari è diventata architetta, specializzandosi nella ristrutturazione di edifici storici.",
        parentIds: ['orazio', 'clara'],
    },
    {
        id: 'mario', firstName: 'Mario', lastName: 'Han', sex: 'uomo', birthYear: 1989, job: 'Ingegnere informatico',
        bio: "Mario è il secondogenito di Orazio e Clara. Fin da ragazzo ha mostrato una forte curiosità per la tecnologia e il funzionamento dei computer. Dopo la laurea in informatica ha iniziato a lavorare come ingegnere informatico.",
        parentIds: ['orazio', 'clara'],
    },
];

export default function Tree() {
    const { isOpen, stepIndex, steps, startTour, closeTour, nextStep, prevStep, refs } = useIrisTour();
    const [isAddOpen, setIsAddOpen] = React.useState(false);

    const [people, setPeople] = React.useState<Person[]>(INITIAL_PEOPLE);
    const [selectedId, setSelectedId] = React.useState('orazio');
    const [query, setQuery] = React.useState('');

    const selectedPerson = toPersonData(people, selectedId);

    // Aggiunge il familiare, lo collega all'albero e lo seleziona (l'albero lo porta in vista)
    const handleAddRelative = (data: NewRelativeData) => {
        const res = addRelative(people, data);
        setPeople(res.people);
        setSelectedId(res.newId);
    };

    // Invio nella ricerca: seleziona il primo risultato
    const handleSearchKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key !== 'Enter') return;
        const first = people.find((p) => matchesQuery(p, query));
        if (first) setSelectedId(first.id);
    };

    return (
        <div className={styles.appContainer}>

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
                        <input
                            type="search"
                            placeholder="Cerca un familiare per nome"
                            aria-label="Cerca un familiare per nome"
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                            onKeyDown={handleSearchKeyDown}
                        />
                    </div>
                    <Button variant="primary" onClick={() => setIsAddOpen(true)}>Aggiungi familiare</Button>
                </div>
            </section>

            {/* Workspace: Pannello Dettaglio a SINISTRA, Area Albero a DESTRA */}
            <main className={styles.workspace}>
                {selectedPerson && (
                    <PersonDetailPanel
                        ref={refs.detailPanelRef}
                        person={selectedPerson}
                        onSelectFamilyMember={setSelectedId}
                        onOpenMemoryModal={() => console.log('Ricordo')}
                        onOpenFullProfile={() => console.log('Profilo')}
                    />
                )}

                <FamilyTree
                    people={people}
                    familyName={FAMILY_NAME}
                    selectedId={selectedId}
                    query={query}
                    onSelect={setSelectedId}
                />
            </main>

            <AddRelativeModal
                isOpen={isAddOpen}
                people={toOptions(people)}
                initialRelatedId={selectedId}
                relationBlockers={(id) => getRelationBlockers(people, id)}
                onClose={() => setIsAddOpen(false)}
                onSubmit={handleAddRelative}
            />

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
