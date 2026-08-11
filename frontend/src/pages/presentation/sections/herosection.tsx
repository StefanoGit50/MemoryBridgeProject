// src/public/presentazione/sections/HeroSection.tsx
import { motion } from "framer-motion";
import { heroContent } from "@/pages/presentation/content";
import { MemoryBridgeHeroVisual } from "@/pages/presentation/components/HeroVisual/HeroVisual";
import styles from "./herosection.module.css";

export function HeroSection() {
    return (
        <section className={styles.section}>
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
            >
                <span className={styles.eyebrow}>{heroContent.eyebrow}</span>
                <h1 className={styles.headline}>{heroContent.headline}</h1>
                <p className={styles.subheadline}>{heroContent.subheadline}</p>
            </motion.div>

            <MemoryBridgeHeroVisual />
        </section>
    );
}