import { NAV_ITEMS, NAV_BRAND } from './NavConfig';
import styles from './Navbar.module.css';

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
                <svg className={styles.brandMark} viewBox="0 0 44 44" aria-hidden="true">
                    <defs>
                        <linearGradient id="bridgeIconGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                            <stop offset="0%" stopColor="#94a3b8" />
                            <stop offset="100%" stopColor="#4378EE" />
                        </linearGradient>
                    </defs>
                    {/* campata ad arco del ponte */}
                    <path
                        d="M6,30 Q22,10 38,30"
                        stroke="url(#bridgeIconGradient)"
                        strokeWidth="3"
                        fill="none"
                        strokeLinecap="round"
                    />
                    {/* piloni verticali */}
                    <line x1="6" y1="30" x2="6" y2="37" stroke="url(#bridgeIconGradient)" strokeWidth="3" strokeLinecap="round" />
                    <line x1="38" y1="30" x2="38" y2="37" stroke="url(#bridgeIconGradient)" strokeWidth="3" strokeLinecap="round" />
                    {/* impalcato/base del ponte */}
                    <line x1="4" y1="30" x2="40" y2="30" stroke="url(#bridgeIconGradient)" strokeWidth="2.4" strokeLinecap="round" />
                </svg>

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