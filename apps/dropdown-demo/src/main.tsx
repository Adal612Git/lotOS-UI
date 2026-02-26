import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import '@lotosui/claude-arm/styles.css';
import './index.css';
import App from './App.tsx';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
