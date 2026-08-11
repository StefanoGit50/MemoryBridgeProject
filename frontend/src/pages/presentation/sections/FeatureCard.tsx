import { motion } from "framer-motion";
import type { FeatureCardData } from "@/pages/presentation/components/FeatureCard";
import styles from "./FeatureCard.module.css";

export function FeatureCard({ icon, title, description, accentColor }: FeatureCardData) {
    return (
        <motion.div
            whileHover={{ y: -6 }}
            className={styles.card}
            style={{ "--card-accent": `var(--color-accent-${accentColor})` } as React.CSSProperties}
        >
            <div className={styles.icon}>{icon}</div>
            <h3 className={styles.title}>{title}</h3>
            <p className={styles.description}>{description}</p>
        </motion.div>
    );
}