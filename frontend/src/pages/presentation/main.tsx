import { createRoot } from "react-dom/client";
import { PresentazionePage } from "@/pages/presentation/Presentazione";
import "@/styles/tokens.css";

const container = document.getElementById("root");
if (container) {
    createRoot(container).render(<PresentazionePage />);
}