import { closingBannerContent } from "@/pages/presentation/content";
import styles from "./closingbanner.module.css";

export function ClosingBanner() {
    return (
        <section className={styles.section}>
            <div className={styles.panel}>
                <span className={styles.eyebrow}>{closingBannerContent.eyebrow}</span>
                <h2 className={styles.headline}>{closingBannerContent.headline}</h2>
                <p className={styles.description}>{closingBannerContent.description}</p>
                <button className={styles.cta}>{closingBannerContent.cta}</button>
            </div>
        </section>
    );
}