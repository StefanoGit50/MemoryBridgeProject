// src/public/presentazione/sections/Navbar.tsx
import { navContent } from "@/pages/presentation/content";
import styles from "./navbar.module.css";

export function Navbar() {
    return (
        <nav className={styles.nav}>
            <div className={styles.brand}>
                <span className={styles.brandDot} />
                <span className={styles.brandName}>{navContent.brand}</span>
            </div>

            <div className={styles.links}>
                {navContent.links.map((link, i) => (
                    <span key={link} className={i === 0 ? styles.linkActive : styles.link}>
            {link}
          </span>
                ))}
            </div>

            <button className={styles.cta}>{navContent.cta}</button>
        </nav>
    );
}