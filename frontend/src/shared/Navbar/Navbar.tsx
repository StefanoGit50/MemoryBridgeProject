import { NAV_ITEMS, NAV_BRAND } from './NavConfig';
import styles from './Navbar.module.css';
import logoImg from '@/shared/Navbar/Logo.png';

interface NavbarProps {
    activeHref: string;
    ctaLabel: string;
    onCtaClick: () => void;
    avatarUrl: string;
    avatarAlt: string;

}

export function Navbar(props: NavbarProps) {
    const { activeHref, ctaLabel, onCtaClick, avatarUrl, avatarAlt } = props;

    return (
        <nav className={styles.nav}>
            <div className={styles.brand}>
                {/* Usi l'importazione oppure "/logo.png" se è nella cartella public */}
                <img
                    src={logoImg}
                    alt="Logo"
                    className={styles.brandMark}
                />

                <span className={styles.brandName}>
                    <span className={styles.brandPrefix}>{NAV_BRAND.namePrefix}</span>
                    <span className={styles.brandAccent}>{NAV_BRAND.nameAccent}</span>
                </span>
            </div>

            <div className={styles.links}>
                {NAV_ITEMS.map((item) => {
                    const isActive = item.href === activeHref;
                    return (
                        <a key={item.href} href={item.href} className={isActive ? styles.linkActive : styles.link}>
                            <span className={styles.linkIcon}>{item.icon}</span>
                            <span>{item.label}</span>
                        </a>
                    );
                })}
            </div>

            <div className={styles.actions}>
                <button type="button" onClick={onCtaClick} className={styles.cta}>
                    <span className={styles.ctaPlus}>+</span> {ctaLabel}
                </button>
                <img src={avatarUrl} alt={avatarAlt} className={styles.avatar} />
            </div>
        </nav>
    );
}