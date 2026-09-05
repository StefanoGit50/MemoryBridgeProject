import { Navbar } from '@/shared/Navbar/Navbar';
import { useHomeFeed } from './hooks/useHomeFeed';
import { MemoryFeed } from './Section/MemoryFeed';
import { AccessibilityDial } from "@/shared/Accessibility/AccessibilityDial";
import { useAccessibilitySettings } from '@/shared/Accessibility/AccessibilityDial'
import styles from './HomePage.module.css';
import {CommentsProvider} from "@/shared/Post/component/CommentContext";
import IrisDailySuggestion from "@/shared/Iris/IrisDailySuggestion";

export default function HomePage() {
    const { highContrast, largeFont } = useAccessibilitySettings();
    const { posts, addComment ,addReply} = useHomeFeed();
    const userAvatarUrl = 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=120&q=80';

    const handleOpenChat = () => {
        // Logica per aprire la modale/sidebar della chat con Iris
        console.log("Apertura chat con Iris...");
    };

    return (
        <CommentsProvider onAddReply={addReply}>
            <div className={styles.page}>
                <Navbar
                    activeHref="/"
                    ctaLabel="Nuovo Ricordo"
                    onCtaClick={() => {/* apre il box di creazione */}}
                    avatarUrl={userAvatarUrl}
                    avatarAlt="Il tuo profilo"
                />

                <main className={styles.main}>
                    <IrisDailySuggestion
                        quote="Nonna Maria, ti va di raccontarci qual è stato il tuo primo viaggio importante?"
                        onCreateMemory={() => {/* apre il box di creazione */}}
                    />
                    <MemoryFeed posts={posts} onAddComment={addComment} />
                </main>

                {/* Menu accessibilità flottante */}
                <AccessibilityDial onOpenChat={handleOpenChat} />
            </div>
        </CommentsProvider>
    );
}