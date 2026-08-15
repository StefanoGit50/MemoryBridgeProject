import { createRoot } from "react-dom/client";
import MemoriesPage from "@/pages/app/InteractiveTimeline/MemoriesPage";
import "@/styles/token2.css";

const container = document.getElementById("root");
if (container) {
    createRoot(container).render(<MemoriesPage />);
}