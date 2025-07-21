import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { Buffer } from 'buffer';
import "./index.css";
import App from "./App.tsx";

// Polyfill Buffer for Solana wallet adapters
window.Buffer = Buffer;

// Add error handling for wallet extension conflicts
window.addEventListener('error', (event) => {
  if (event.filename && event.filename.includes('chrome-extension://')) {
    console.warn('Wallet extension error caught and ignored:', event.error);
    event.preventDefault();
    return false;
  }
});

window.addEventListener('unhandledrejection', (event) => {
  if (event.reason && event.reason.message && event.reason.message.includes('register')) {
    console.warn('Wallet extension promise rejection caught and ignored:', event.reason);
    event.preventDefault();
    return false;
  }
});

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
