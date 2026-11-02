import { useHomeFeed } from '../hooks/useHomeFeed';
import { MemoryFeed } from '../Section/MemoryFeed';
import { AccessibilityDial } from "@/shared/Accessibility/AccessibilityDial";
import styles from '../HomePage.module.css';
import {CommentsProvider} from "@/shared/Post/component/CommentContext";
import IrisDailySuggestion from "@/pages/app/Home/Component/IrisDailySuggestion";
import {useState} from "react";
import {MemoryDraft} from "@/shared/Post/types";

interface HomePageProps {
    onOpenCreate: () => void;
}

export default function HomePage({ onOpenCreate }: HomePageProps) {
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
                    <main className={styles.main}>
                        <IrisDailySuggestion
                            quote="Nonna Maria, ti va di raccontarci qual è stato il tuo primo viaggio importante?"
                            onCreateMemory={onOpenCreate}
                        />
                        <MemoryFeed posts={posts} onAddComment={addComment} />
                    </main>
                )
                <AccessibilityDial onOpenChat={handleOpenChat} />
            </div>
        </CommentsProvider>
    );
}