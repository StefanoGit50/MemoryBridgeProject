// src/public/presentazione/components/MemoryBridgeHeroVisual.tsx
import { useState } from "react";
import { IrisOwlMascot } from "@/shared/Iris";
import { heroVisualContent } from "@/pages/presentation/content";
import styles from "./HeroVisual.module.css";

export function MemoryBridgeHeroVisual() {
    const [sliderPos, setSliderPos] = useState(50);

    return (
        <div className={styles.container}>
            <div className={styles.mascotWrapper} style={{ left: `${sliderPos}%` }}>
                <IrisOwlMascot />
                <div className={styles.mascotLabel}>{heroVisualContent.mascotLabel}</div>
            </div>

            <div className={styles.frame}>
                <div
                    className={styles.futureLayer}
                    style={{ backgroundImage: `url("${heroVisualContent.futureImageUrl}")` }}
                >
                    <div className={styles.futureLabel}>{heroVisualContent.futureLabel}</div>
                </div>

                <div
                    className={styles.pastLayer}
                    style={{
                        width: `${sliderPos}%`,
                        backgroundImage: `url("${heroVisualContent.pastImageUrl}")`,
                    }}
                >
                    <div className={styles.pastLabel}>{heroVisualContent.pastLabel}</div>
                </div>

                <svg className={styles.bridgeSvg}>
                    <path
                        d={`M 100 400 Q ${sliderPos * 9.6} 80 860 400`}
                        fill="none"
                        stroke="url(#bridgeGlow)"
                        strokeWidth="4"
                        strokeDasharray="6 6"
                    />
                    <defs>
                        <linearGradient id="bridgeGlow" x1="0%" y1="0%" x2="100%" y2="0%">
                            <stop offset="0%" stopColor="#f59e0b" />
                            <stop offset="50%" stopColor="#06b6d4" />
                            <stop offset="100%" stopColor="#8b5cf6" />
                        </linearGradient>
                    </defs>
                </svg>

                <div className={styles.scanLine} style={{ left: `${sliderPos}%` }}>
                    <div className={styles.scanHandle}>↔</div>
                </div>

                <input
                    type="range"
                    min="10"
                    max="90"
                    value={sliderPos}
                    onChange={(e) => setSliderPos(Number(e.target.value))}
                    className={styles.rangeInput}
                />
            </div>
        </div>
    );
}