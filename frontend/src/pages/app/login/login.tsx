import { FormEvent, useEffect, useState } from "react";
import styles from "./Login.module.css";

const SECONDS = 5; // ogni quanti secondi cambia foto

// TODO: sostituisci `image` con le foto reali (import o URL)
const placeholder = (n: number, bg: string) =>
    `https://placehold.co/1600x1200/${bg}/2f2217?text=Foto+${n}`;

const SLIDES = [
    { title: "Estate 1965", sub: "Riunione di famiglia nel cortile", image: placeholder(1, "c8aa80") },
    { title: "Primavera 1948", sub: "Il giorno del matrimonio", image: placeholder(2, "cfb48d") },
    { title: "Natale 1972", sub: "I cugini, tutti insieme", image: placeholder(3, "bf9f74") },
    { title: "Agosto 1958", sub: "La casa dei nonni", image: placeholder(4, "e2cba3") },
];

export default function Login() {
    const [index, setIndex] = useState(0);
    const [paused, setPaused] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    // Rispetta prefers-reduced-motion: parte in pausa
    useEffect(() => {
        if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
            setPaused(true);
        }
    }, []);

    // Avanzamento automatico (si resetta a ogni cambio manuale)
    useEffect(() => {
        if (paused) return;
        const timer = setInterval(
            () => setIndex((i) => (i + 1) % SLIDES.length),
            SECONDS * 1000
        );
        return () => clearInterval(timer);
    }, [paused, index]);

    const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        // TODO: collega qui la tua autenticazione
    };

    return (
        <div className={styles.page}>
            {/* ================= SINISTRA: foto antiche che scorrono ================= */}
            <section
                className={styles.gallery}
                aria-roledescription="carousel"
                aria-label="Foto di famiglia d'epoca"
            >
                {SLIDES.map((slide, i) => (
                    <div
                        key={slide.title}
                        className={`${styles.slide} ${i === index ? styles.active : ""}`}
                        aria-hidden={i !== index}
                    >
                        <img className={styles.photo} src={slide.image} alt="" />
                    </div>
                ))}

                {/* Effetto fotografia antica */}
                <div className={styles.vignette} aria-hidden="true" />
                <svg className={styles.grain} aria-hidden="true">
                    <filter id="grana">
                        <feTurbulence
                            type="fractalNoise"
                            baseFrequency="0.9"
                            numOctaves={2}
                            stitchTiles="stitch"
                        />
                        <feColorMatrix type="saturate" values="0" />
                    </filter>
                    <rect width="100%" height="100%" filter="url(#grana)" />
                </svg>
                <div className={styles.shade} aria-hidden="true" />

                {/* Testi e comandi */}
                <div className={styles.overlay}>
                    <p className={styles.tagline}>Le storie di famiglia, custodite per sempre.</p>

                    <div className={styles.bottom}>
                        <div className={styles.captions}>
                            {SLIDES.map((slide, i) => (
                                <div
                                    key={slide.title}
                                    className={`${styles.cap} ${i === index ? styles.active : ""}`}
                                >
                                    <div className={styles.capTitle}>{slide.title}</div>
                                    <div className={styles.capSub}>{slide.sub}</div>
                                </div>
                            ))}
                        </div>

                        <div className={styles.controls}>
                            <button
                                type="button"
                                className={styles.ctl}
                                onClick={() => setPaused((p) => !p)}
                                aria-label={
                                    paused
                                        ? "Riprendi la presentazione delle foto"
                                        : "Metti in pausa la presentazione delle foto"
                                }
                            >
                                {paused ? (
                                    <svg aria-hidden="true" width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                                        <path d="M7 4.5v15a1 1 0 0 0 1.5.86l12-7.5a1 1 0 0 0 0-1.72l-12-7.5A1 1 0 0 0 7 4.5z" />
                                    </svg>
                                ) : (
                                    <svg aria-hidden="true" width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                                        <rect x="6" y="4" width="4.5" height="16" rx="1.2" />
                                        <rect x="13.5" y="4" width="4.5" height="16" rx="1.2" />
                                    </svg>
                                )}
                            </button>

                            {SLIDES.map((slide, i) => (
                                <button
                                    key={slide.title}
                                    type="button"
                                    className={`${styles.dot} ${i === index ? styles.on : ""}`}
                                    onClick={() => setIndex(i)}
                                    aria-label={`Vai alla foto ${i + 1}: ${slide.title}`}
                                    aria-current={i === index}
                                />
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* ================= DESTRA: login ================= */}
            <main className={styles.login}>
                <section className={styles.loginBox} aria-labelledby="titolo">
                    <div className={styles.brand}>
            <span className={styles.brandMark} role="img" aria-label="MemoryBridge">
              <svg
                  width="28"
                  height="28"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#ffffff"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
              >
                <path d="M3 18h18" />
                <path d="M5 18v-3a7 7 0 0 1 14 0v3" />
                <path d="M9 18v-3a3 3 0 0 1 6 0v3" />
              </svg>
            </span>
                    </div>

                    <div className={styles.welcome}>
                        <h1 id="titolo" className={styles.title}>
                            Benvenuto in <span>MemoryBridge</span>
                        </h1>
                        <p className={styles.lead}>Accedi per ritrovare le storie della tua famiglia.</p>
                    </div>

                    <form className={styles.form} onSubmit={handleSubmit}>
                        <div className={styles.group}>
                            <label className={styles.lbl} htmlFor="email">
                                Email
                            </label>
                            <div className={styles.field}>
                                <svg
                                    className={styles.ico}
                                    aria-hidden="true"
                                    width="20"
                                    height="20"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="#64748b"
                                    strokeWidth="1.9"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                >
                                    <rect x="3" y="5" width="18" height="14" rx="3" />
                                    <path d="M3.5 7l8.5 6 8.5-6" />
                                </svg>
                                <input
                                    id="email"
                                    type="email"
                                    autoComplete="email"
                                    placeholder="nome@esempio.it"
                                />
                            </div>
                        </div>

                        <div className={styles.group}>
                            <label className={styles.lbl} htmlFor="password">
                                Password
                            </label>
                            <div className={styles.field}>
                                <svg
                                    className={styles.ico}
                                    aria-hidden="true"
                                    width="20"
                                    height="20"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="#64748b"
                                    strokeWidth="1.9"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                >
                                    <rect x="4" y="10" width="16" height="10" rx="3" />
                                    <path d="M8 10V7a4 4 0 0 1 8 0v3" />
                                </svg>
                                <input
                                    id="password"
                                    className={styles.hasToggle}
                                    type={showPassword ? "text" : "password"}
                                    autoComplete="current-password"
                                    placeholder="La tua password"
                                />
                                <button
                                    type="button"
                                    className={styles.pwToggle}
                                    onClick={() => setShowPassword((s) => !s)}
                                    aria-label={showPassword ? "Nascondi password" : "Mostra password"}
                                    aria-pressed={showPassword}
                                >
                                    {showPassword ? (
                                        <svg
                                            aria-hidden="true"
                                            width="21"
                                            height="21"
                                            viewBox="0 0 24 24"
                                            fill="none"
                                            stroke="currentColor"
                                            strokeWidth="1.9"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                        >
                                            <path d="M3 3l18 18" />
                                            <path d="M10.6 6.1A9.8 9.8 0 0 1 12 6c6.4 0 10 6 10 6a17 17 0 0 1-3.2 3.9" />
                                            <path d="M6.5 7.6C3.9 9.3 2 12 2 12s3.6 6 10 6c1.4 0 2.7-.3 3.8-.7" />
                                            <path d="M9.9 9.9a3 3 0 0 0 4.2 4.2" />
                                        </svg>
                                    ) : (
                                        <svg
                                            aria-hidden="true"
                                            width="21"
                                            height="21"
                                            viewBox="0 0 24 24"
                                            fill="none"
                                            stroke="currentColor"
                                            strokeWidth="1.9"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                        >
                                            <path d="M2 12s3.6-7 10-7 10 7 10 7-3.6 7-10 7S2 12 2 12z" />
                                            <circle cx="12" cy="12" r="3" />
                                        </svg>
                                    )}
                                </button>
                            </div>
                        </div>

                        <div className={styles.row}>
                            <label className={styles.remember}>
                                <input type="checkbox" /> Ricordami
                            </label>
                            <a href="#">Password dimenticata?</a>
                        </div>

                        <button type="submit" className={styles.cta}>
                            Accedi
                            <svg
                                aria-hidden="true"
                                width="20"
                                height="20"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2.3"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            >
                                <path d="M5 12h14" />
                                <path d="M13 6l6 6-6 6" />
                            </svg>
                        </button>
                    </form>

                    <p className={styles.signup}>
                        Non hai ancora un account? <a href="#">Registrati</a>
                    </p>
                </section>
            </main>
        </div>
    );
}