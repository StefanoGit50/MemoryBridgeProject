import { createRoot } from "react-dom/client";
import MemoriesPage from "@/pages/app/InteractiveTimeline/MemoriesPage";
import '@/styles/global.css'
const container = document.getElementById('root');

if (container) {
    const root = createRoot(container);
    root.render(<MemoriesPage />);
}