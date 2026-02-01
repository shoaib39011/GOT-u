import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'

console.log("main.jsx: Attempting to mount React...");

window.onerror = function (msg, url, line, col, error) {
    console.error("GLOBAL ERROR:", msg, "at", url, ":", line);
    document.body.innerHTML = `<div style="color:red; background:white; padding:20px; font-family:sans-serif;">
        <h1>App Crash</h1>
        <p>${msg}</p>
        <p>At line ${line}, col ${col} of ${url}</p>
    </div>`;
    return false;
};

const rootElement = document.getElementById('root');
if (!rootElement) {
    console.error("main.jsx: Root element not found!");
} else {
    ReactDOM.createRoot(rootElement).render(
        <React.StrictMode>
            <App />
        </React.StrictMode>,
    )
    console.log("main.jsx: Render called.");
}
