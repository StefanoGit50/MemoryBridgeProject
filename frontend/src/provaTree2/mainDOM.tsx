import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css'; // Eventuali stili globali o variabili CSS

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
    <React.StrictMode>
        <App />
    </React.StrictMode>
);