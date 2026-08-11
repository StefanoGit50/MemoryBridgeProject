// src/public/presentazione/content.ts

export const navContent = {
    brand: "IRIS",
    links: ["MemoryBridge", "Vision AI", "Mascotte"],
    cta: "Provalo Ora",
};

export const heroContent = {
    eyebrow: "Incontra Iris & MemoryBridge",
    headline: "Memory isn't about looking back. It's about understanding where you are.",
    subheadline: "\"Iris: The bridge between yesterday's moments and today's mind.\"",
};

export interface FeatureCardData {
    icon: string;
    title: string;
    description: string;
    accentColor: "cyan" | "purple" | "amber";
}

export const featuresContent = {
    eyebrow: "UN RIVOLUZIONARIO PASSO AVANTI",
    headline: "\"Oggi non vi presentiamo un software. Non vi presentiamo un'IA. E non vi presentiamo un archivio.\"",
    subheadline: "Vi presentiamo tutte e tre le cose insieme: Iris.",
    cards: [
        {
            icon: "🧠",
            title: "Riavvolta",
            description: "Iris indicizza ogni istante del tuo passato rendendolo accessibile in un battito di ciglia.",
            accentColor: "cyan",
        },
        {
            icon: "✨",
            title: "Rivissuta",
            description: "Il ponte MemoryBridge restituisce luce, contesto ed emozione ai tuoi ricordi sbiaditi.",
            accentColor: "purple",
        },
        {
            icon: "🔮",
            title: "Ricordata",
            description: "Non un semplice archivio, ma una guida intelligente per capire chi sei oggi.",
            accentColor: "amber",
        },
    ] satisfies FeatureCardData[],
};

export const closingBannerContent = {
    eyebrow: "ONE MORE THING...",
    headline: "\"It doesn't just store your past. It brings it back.\"",
    description: "Riconnettiti con ciò che conta. Sperimenta la memoria intelligente con Iris.",
    cta: "Inizia il Viaggio",
};

export const heroVisualContent = {
    pastImageUrl: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=1200",
    futureImageUrl: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=1200", // TODO: verificare, sembra duplicata rispetto all'originale
    pastLabel: "📷 IL PASSATO: CUSTODITO",
    futureLabel: "✦ IL FUTURO: RIVISSUTO",
    mascotLabel: "IRIS AI",
};