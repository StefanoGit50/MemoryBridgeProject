// src/public/presentazione/sections/FeaturesSection.tsx
import { featuresContent } from "@/pages/presentation/content";
import { FeatureCard } from "@/pages/presentation/components/FeatureCard";
import styles from "./featuresection.module.css";

export function FeaturesSection() {
    return (
        <section className={styles.section}>
            <div className={styles.header}>
                <span className={styles.eyebrow}>{featuresContent.eyebrow}</span>
                <h2 className={styles.headline}>{featuresContent.headline}</h2>
                <p className={styles.subheadline}>
                    {featuresContent.subheadline}
                </p>
            </div>

            <div className={styles.grid}>
                {featuresContent.cards.map((card) => (
                    <FeatureCard key={card.title} {...card} />
                ))}
            </div>
        </section>
    );
}