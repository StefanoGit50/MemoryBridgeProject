// src/shared/components/IrisOwlMascot.tsx
import { motion } from "framer-motion";
import styles from "./iris.module.css";

export function IrisOwlMascot() {
    return (
        <motion.div
            className={styles.wrapper}
            animate={{ y: [-10, 10, -10], rotate: [-1, 2, -1] }}
            transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
        >
            <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className={styles.svg}>
                <motion.path
                    d="M 15 50 C 5 35, 10 20, 30 35 C 20 50, 15 50, 15 50 Z"
                    fill="url(#owlGradient)"
                    animate={{ rotate: [-8, 8, -8] }}
                    transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
                    style={{ transformOrigin: "30px 35px" }}
                />
                <motion.path
                    d="M 85 50 C 95 35, 90 20, 70 35 C 80 50, 85 50, 85 50 Z"
                    fill="url(#owlGradient)"
                    animate={{ rotate: [8, -8, 8] }}
                    transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
                    style={{ transformOrigin: "70px 35px" }}
                />

                <path
                    d="M 30 30 C 30 15, 70 15, 70 30 C 75 50, 65 80, 50 85 C 35 80, 25 50, 30 30 Z"
                    fill="#0f172a"
                    stroke="#06b6d4"
                    strokeWidth="2.5"
                />

                <path d="M 32 20 L 25 5 L 40 18 Z" fill="#06b6d4" />
                <path d="M 68 20 L 75 5 L 60 18 Z" fill="#06b6d4" />

                <circle cx="40" cy="38" r="10" fill="#030712" stroke="#38bdf8" strokeWidth="2" />
                <circle cx="60" cy="38" r="10" fill="#030712" stroke="#38bdf8" strokeWidth="2" />

                <motion.circle
                    cx="40" cy="38" r="4" fill="#06b6d4"
                    animate={{ scale: [1, 1.3, 1] }}
                    transition={{ repeat: Infinity, duration: 2 }}
                />
                <motion.circle
                    cx="60" cy="38" r="4" fill="#06b6d4"
                    animate={{ scale: [1, 1.3, 1] }}
                    transition={{ repeat: Infinity, duration: 2 }}
                />

                <polygon points="50,44 46,52 54,52" fill="#f59e0b" />

                <path d="M 42 62 L 50 70 L 58 62" stroke="#8b5cf6" strokeWidth="2" strokeLinecap="round" />
                <path d="M 45 70 L 50 75 L 55 70" stroke="#06b6d4" strokeWidth="1.5" strokeLinecap="round" />

                <defs>
                    <linearGradient id="owlGradient" x1="0" y1="0" x2="100" y2="100">
                        <stop offset="0%" stopColor="#06b6d4" />
                        <stop offset="100%" stopColor="#8b5cf6" />
                    </linearGradient>
                </defs>
            </svg>
        </motion.div>
    );
}