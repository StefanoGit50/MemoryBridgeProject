import { Navbar } from '@/shared/Navbar/Navbar';
import { useHomeFeed } from '../hooks/useHomeFeed';
import { MemoryFeed } from '../Section/MemoryFeed';
import { AccessibilityDial } from "@/shared/Accessibility/AccessibilityDial";
import styles from '../HomePage.module.css';
import {CommentsProvider} from "@/shared/Post/component/CommentContext";
import IrisDailySuggestion from "@/pages/app/Home/Component/IrisDailySuggestion";
import {useState} from "react";
import {MemoryDraft} from "@/shared/Post/types";
import {CreateMemoryScreen} from "@/pages/app/Home/Component/Creatememoryscreen";

export default function HomePage() {
    const { posts, addComment ,addReply} = useHomeFeed();
    const userAvatarUrl = 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=120&q=80';
    const [isCreateOpen, setIsCreateOpen] = useState(false);

    const handleOpenChat = () => {
        // Logica per aprire la modale/sidebar della chat con Iris
        console.log("Apertura chat con Iris...");
    };

    const handleSaveMemory = (memoryData: MemoryDraft) => {
        console.log("Nuovo ricordo creato:", memoryData);
        // Qui inserisci la logica per salvare il ricordo (es. chiamata API o aggiornamento dello stato feed)
        setIsCreateOpen(false);
    };

    return (
        <CommentsProvider onAddReply={addReply}>
            <div className={styles.page}>
                {/* La Navbar rimane visibile e fissa in cima */}
                <Navbar
                    activeHref="/"
                    ctaLabel="Nuovo Ricordo"
                    onCtaClick={() => setIsCreateOpen(true)}
                    avatarUrl={userAvatarUrl}
                    avatarAlt="Il tuo profilo"
                />

                {/* Switch fluido tra il Feed e la Schermata di Creazione */}
                {isCreateOpen ? (
                    <CreateMemoryScreen
                        onClose={() => setIsCreateOpen(false)}
                        onSave={(data) => {
                            console.log("Ricordo salvato:", data);
                            setIsCreateOpen(false);
                        }}
                    />
                ) : (
                    <main className={styles.main}>
                        <IrisDailySuggestion
                            quote="Nonna Maria, ti va di raccontarci qual è stato il tuo primo viaggio importante?"
                            onCreateMemory={() => setIsCreateOpen(true)}
                        />
                        <MemoryFeed posts={posts} onAddComment={addComment} />
                    </main>
                )}

                <AccessibilityDial onOpenChat={handleOpenChat} />
            </div>
        </CommentsProvider>
    );
}