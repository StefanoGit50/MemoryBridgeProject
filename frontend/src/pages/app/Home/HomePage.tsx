import { Navbar } from '@/shared/Navbar/Navbar';
import { useHomeFeed } from './hooks/useHomeFeed';
import { MemoryFeed } from './Section/MemoryFeed';
import { AccessibilityDial } from "@/shared/Accessibility/AccessibilityDial";
import styles from './HomePage.module.css';

export default function HomePage() {
    const { posts, addComment } = useHomeFeed();
    const userAvatarUrl = 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=120&q=80';

    const handleOpenChat = () => {
        // Logica per aprire la modale/sidebar della chat con Iris
        console.log("Apertura chat con Iris...");
    };

    return (
        <div className={styles.page}>
            <Navbar
                activeHref="/"
                ctaLabel="Nuovo Ricordo"
                onCtaClick={() => {/* apre il box di creazione */}}
                avatarUrl={userAvatarUrl}
                avatarAlt="Il tuo profilo"
            />

            <main className={styles.main}>
                <MemoryFeed posts={posts} onAddComment={addComment} />
            </main>

            {/* Menu accessibilità flottante */}
            <AccessibilityDial onOpenChat={handleOpenChat} />
        </div>
    );
}