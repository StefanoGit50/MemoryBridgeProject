import { AccessibilityProvider } from "@/shared/Accessibility/AccessibilityDial";
import { SpeechProvider } from "@/shared/Accessibility/SpeechContext";
import {createRoot} from "react-dom/client";
import "@/styles/global.css"
import MemoriesPage from "@/pages/app/InteractiveTimeline/MemoriesPage";
import HomePage from "@/pages/app/Home/HomePage";



const container = document.getElementById('root');
if (container) {
    const root = createRoot(container);
    root.render(
        <AccessibilityProvider>
            <SpeechProvider>
                <MemoriesPage/>
            </SpeechProvider>
        </AccessibilityProvider>
    );
}