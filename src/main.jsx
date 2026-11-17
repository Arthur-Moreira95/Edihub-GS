import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { HashRouter } from 'react-router-dom';
import '@fontsource-variable/fraunces';
import '@fontsource-variable/instrument-sans';
import './index.css';
import App from './App.jsx';
import { AppProvider } from './context/AppContext.jsx';
import { ToastProvider } from './context/ToastContext.jsx';
import { ThemeProvider } from './context/ThemeContext.jsx';
import { LembretesProvider } from './context/LembretesContext.jsx';

// HashRouter: funciona em hospedagem estática (GitHub Pages) sem configurar rewrites
createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ThemeProvider>
      <HashRouter>
        <ToastProvider>
          <AppProvider>
            <LembretesProvider>
              <App />
            </LembretesProvider>
          </AppProvider>
        </ToastProvider>
      </HashRouter>
    </ThemeProvider>
  </StrictMode>,
);
