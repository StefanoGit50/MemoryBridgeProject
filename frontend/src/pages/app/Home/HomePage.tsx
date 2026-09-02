import { Navbar } from '@/shared/Navbar/Navbar';
import { useHomeFeed } from './hooks/useHomeFeed';
import { MemoryFeed } from './Section/MemoryFeed';
import styles from './HomePage.module.css';

export default function HomePage() {
    const { posts, addComment } = useHomeFeed();
    const userAvatarUrl = 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=120&q=80';

    return (
        <div className={styles.page}>
            <Navbar
                activeHref="/"
                ctaLabel="Nuovo Ricordo"
                onCtaClick={() => {/* apre il box di creazione già presente in pagina */}}
                avatarUrl={userAvatarUrl}
                avatarAlt="Il tuo profilo"
            />


            <main className={styles.main}>
                <MemoryFeed posts={posts} onAddComment={addComment} />
            </main>
        </div>
    );
}