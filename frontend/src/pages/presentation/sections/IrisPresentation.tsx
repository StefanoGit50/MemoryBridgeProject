// src/pages/IrisPresentationPage.tsx
import { motion } from "framer-motion";
import { MemoryBridgeHeroVisual } from "@/pages/presentation/components/HeroVisual/HeroVisual";
import { FeatureCard } from "@/pages/presentation/components/FeatureCard";
import { featureCardsData } from "@/data/presentationData";
import styles from "./IrisPage.module.css";

export function IrisPresentationPage() {
    return (
        <div className={styles.pageWrapper}>
            {/* NAVBAR */}
            <nav className={styles.navbar}>
                <div className={styles.brand}>
                    <div className={styles.brandDot} />
                    <span className={styles.brandName}>IRIS</span>
                </div>

                <div className={styles.navLinks}>
                    <span className={styles.activeLink}>MemoryBridge</span>
                    <span className={styles.link}>Vision AI</span>
                    <span className={styles.link}>Mascotte</span>
                </div>

                <button className={styles.ctaButton}>Provalo Ora</button>
            </nav>

            {/* HERO SECTION */}
            <section className={styles.heroSection}>
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
                    <span className={styles.heroTag}>Incontra Iris & MemoryBridge</span>
                    <h1 className={styles.heroTitle}>
                        Memory isn't about looking back. It’s about understanding where you are.
                    </h1>
                    <p className={styles.heroSubtitle}>
                        "Iris: The bridge between yesterday's moments and today's mind."
                    </p>
                </motion.div>

                <MemoryBridgeHeroVisual />
            </section>

            {/* FEATURES SECTION */}
            <section className={styles.featuresSection}>
                <div className={styles.sectionHeader}>
                    <span className={styles.sectionTag}>UN RIVOLUZIONARIO PASSO AVANTI</span>
                    <h2 className={styles.sectionTitle}>
                        "Oggi non vi presentiamo un software. Non vi presentiamo un'IA. E non vi presentiamo un archivio."
                    </h2>
                    <p className={styles.sectionSubtitle}>
                        Vi presentiamo tutte e tre le cose insieme: <span className={styles.underline}>Iris</span>.
                    </p>
                </div>

                <div className={styles.cardsGrid}>
                    {featureCardsData.map((card, i) => (
                        <FeatureCard key={i} card={card} />
                    ))}
                </div>
            </section>

            {/* BANNER ONE MORE THING */}
            <section className={styles.bannerSection}>
                <div className={styles.bannerBox}>
                    <span className={styles.bannerTag}>ONE MORE THING...</span>
                    <h2 className={styles.bannerTitle}>
                        "It doesn't just store your past. It brings it back."
                    </h2>
                    <p className={styles.bannerText}>
                        Riconnettiti con ciò che conta. Sperimenta la memoria intelligente con Iris.
                    </p>
                    <button className={styles.bannerButton}>Inizia il Viaggio</button>
                </div>
            </section>
        </div>
    );
}