import { forwardRef, useCallback, useRef, useState } from 'react';
import type { ReactNode } from 'react';
import { Link, NavLink } from 'react-router-dom'; // CAMBIATO: import del router
import { UserIcon } from 'lucide-react';
import styles from './Navbar2.module.css';

import logoImg from '@/shared/Navbar/Logo.png';
import { AnimatePresence } from 'framer-motion'; // NUOVO
import { NavbarSearch } from '@/shared/Navbar/NavbarSearch'; // NUOVO
import type { UserResult } from '@/shared/Navbar/NavbarSearch'; // NUOVO

/* ---------- Icone ---------- */
const svgProps = {
    viewBox: '0 0 24 24',
    fill: 'none',
    stroke: 'currentColor',
    strokeWidth: 1.7,
    strokeLinecap: 'round' as const,
    strokeLinejoin: 'round' as const,
};

const HomeIcon = () => (
    <svg {...svgProps}>
        <path d="M3 11l9-7 9 7" />
        <path d="M5 10v9a1 1 0 001 1h4v-6h4v6h4a1 1 0 001-1v-9" />
    </svg>
);

const TreeIcon = () => (
    <svg {...svgProps}>
        <path d="M12 21V11" />
        <path d="M12 11c0-3 2-4 5-5" />
        <path d="M12 14c0-2.5-1.8-3.4-4.5-4.2" />
        <circle cx="17" cy="5" r="1.4" />
        <circle cx="7.5" cy="9" r="1.4" />
    </svg>
);

const SearchIcon = () => (
    <svg {...svgProps}>
        <circle cx="11" cy="11" r="7" />
        <path d="M21 21l-4.3-4.3" />
    </svg>
);

const HeartIcon = () => (
    <svg {...svgProps}>
        <path d="M12 20s-7-4.3-9.5-8.4C1 8.5 2.4 5 6 5c2 0 3.3 1 4.5 2.6C11.7 6 13 5 15 5c3.6 0 5 3.5 3.5 6.6C16 16.7 12 20 12 20z" />
    </svg>
);

const HelpIcon = () => (
    <svg
        viewBox="0 0 24 24"
        width="15"
        height="15"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
    >
        <circle cx="12" cy="12" r="10" />
        <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
        <line x1="12" y1="17" x2="12.01" y2="17" />
    </svg>
);

/* ---------- Tipi ---------- */
export interface NavItem {
    label: string;
    href: string;
    icon?: ReactNode;
    /** 'search': la voce apre la barra di ricerca invece di cambiare pagina */ // NUOVO
    action?: 'search';
}

export interface NavbarProps {
    /** Id dell'utente: serve per il link all'albero (/familyTree/:userId) */
    userId: string; // CAMBIATO
    // CAMBIATO: tolta la prop activeHref. La voce attiva la calcola NavLink dall'URL.
    /** Testo del bottone di azione principale */
    ctaLabel: string;
    onCtaClick: () => void;
    /** Immagine profilo. Se vuota, mostra l'icona utente */
    avatarUrl: string;
    avatarAlt: string;
    /** Voci di navigazione. Se omesso usa quelle di default */
    items?: NavItem[];
    /** Nome mostrato accanto all'avatar. Se omesso, solo l'avatar */
    userName?: string;
    /** Se passato, mostra il bottone "Guida IRIS" */
    onStartTour?: () => void;
    /** NUOVO: se passato, "Ricerca" apre la barra animata che cerca gli utenti */
    onSearchUsers?: (query: string) => Promise<UserResult[]> | UserResult[];
    /** NUOVO: dove portare l'utente scelto (default: /timeline/:id) */
    getUserHref?: (user: UserResult) => string;
    className?: string;
}

// Gli href devono coincidere con i path delle <Route> in App
export const buildNavItems = (userId: string): NavItem[] => [
    { label: 'Home', href: '/', icon: <HomeIcon /> },
    { label: 'Albero Genealogico', href: `/familyTree/${userId}`, icon: <TreeIcon /> }, // CAMBIATO
    { label: 'Ricerca', href: '/ricerca', icon: <SearchIcon />, action: 'search' }, // NUOVO: action          // da collegare a una tua rotta
    { label: 'Racconta un ricordo', href: '/ricordo', icon: <HeartIcon /> }, // da collegare a una tua rotta
];

/* ---------- Componente ---------- */
const Navbar = forwardRef<HTMLElement, NavbarProps>(function Navbar(
    {
        // CAMBIATO: tolto activeHref, aggiunto userId (deve stare prima di items)
        userId,
        ctaLabel,
        onCtaClick,
        avatarUrl,
        avatarAlt,
        items = buildNavItems(userId),
        userName,
        onStartTour,
        onSearchUsers,
        getUserHref,
        className,
    },
    ref,
) {
    // NUOVO: stato della barra di ricerca
    const [searchOpen, setSearchOpen] = useState(false);
    const searchBtnRef = useRef<HTMLButtonElement>(null);
    const closeSearch = useCallback((restoreFocus?: boolean) => {
        setSearchOpen(false);
        if (restoreFocus) searchBtnRef.current?.focus();
    }, []);

    const rootClass = [styles.topbar, searchOpen && styles.searching, className].filter(Boolean).join(' ');

    return (
        <header ref={ref} id="site-navbar" className={rootClass}>
            {/* NUOVO: logo + barra di ricerca nello stesso gruppo. Quando la barra si apre
                il gruppo si allarga e spinge la navigazione verso destra */}
            <div className={styles.left}>
                <Link to="/" className={styles.brand}>
                    {/* Decorativo: il nome è già nel testo accanto */}
                    <img src={logoImg} alt="" className={styles.brandMark} />
                    <span className={styles.brandName}>
                        Memory<em>Bridge</em>
                    </span>
                </Link>

                <AnimatePresence initial={false}>
                    {searchOpen && onSearchUsers && (
                        <NavbarSearch
                            key="search"
                            onSearch={onSearchUsers}
                            getHref={getUserHref}
                            onClose={closeSearch}
                        />
                    )}
                </AnimatePresence>
            </div>

            <nav className={styles.navLinks} aria-label="Navigazione principale">
                {items.map((item) =>
                    item.action === 'search' && onSearchUsers ? (
                        // NUOVO: il simbolo Ricerca apre/chiude la barra
                        <button
                            key={item.href}
                            ref={searchBtnRef}
                            type="button"
                            data-search-toggle
                            className={styles.navLink}
                            aria-expanded={searchOpen}
                            aria-controls="navbar-search"
                            onClick={() => setSearchOpen((open) => !open)}
                        >
                            {item.icon}
                            <span className={styles.navLabel}>{item.label}</span>
                        </button>
                    ) : (
                        <NavLink
                            key={item.href}
                            to={item.href}
                            end={item.href === '/'}
                            className={styles.navLink}
                        >
                            {item.icon}
                            <span className={styles.navLabel}>{item.label}</span>
                        </NavLink>
                    ),
                )}
            </nav>

            <div className={styles.headerRight}>
                {onStartTour && (
                    <button type="button" onClick={onStartTour} className={styles.tourBtn}>
                        <HelpIcon />
                        Guida IRIS
                    </button>
                )}

                <button type="button" onClick={onCtaClick} className={styles.cta}>
                    <span className={styles.ctaPlus} aria-hidden="true">+</span>
                    {ctaLabel}
                </button>

                <div className={styles.profileChip}>
                    <span className={styles.avatarSm}>
                        {avatarUrl ? (
                            <img src={avatarUrl} alt={avatarAlt} className={styles.avatarImg} />
                        ) : (
                            <UserIcon width={17} height={17} aria-label={avatarAlt} />
                        )}
                    </span>
                    {userName}
                </div>
            </div>
        </header>
    );
});

export default Navbar;