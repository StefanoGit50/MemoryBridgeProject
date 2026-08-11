import { Navbar } from "@/pages/presentation/sections/navbar";
import { HeroSection } from "@/pages/presentation/sections/herosection";
import { FeaturesSection } from "@/pages/presentation/sections/featuresection";
import { ClosingBanner } from "@/pages/presentation/sections/closingbanner";
import styles from "./Presentazione.module.css";

export function PresentazionePage() {
    return (
        <div className={styles.page}>
            <Navbar />
            <HeroSection />
            <FeaturesSection />
            <ClosingBanner />
        </div>
    );
}