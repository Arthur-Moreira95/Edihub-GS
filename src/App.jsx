import { lazy, Suspense } from 'react';
import { Route, Routes } from 'react-router-dom';
import { AppLayout } from './components/layout/AppLayout.jsx';
import HomePage from './pages/HomePage.jsx';

// Páginas internas carregadas sob demanda
const EditaisPage = lazy(() => import('./pages/EditaisPage.jsx'));
const CalendarioPage = lazy(() => import('./pages/CalendarioPage.jsx'));
const RadarPage = lazy(() => import('./pages/RadarPage.jsx'));
const PlanosPage = lazy(() => import('./pages/PlanosPage.jsx'));
const EscolasPage = lazy(() => import('./pages/EscolasPage.jsx'));
const NotFoundPage = lazy(() => import('./pages/NotFoundPage.jsx'));

function PageFallback() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8" aria-busy="true">
      <div className="h-10 w-64 animate-pulse rounded-lg bg-raised" />
      <div className="mt-4 h-4 w-96 max-w-full animate-pulse rounded bg-raised" />
    </div>
  );
}

export default function App() {
  return (
    <Suspense fallback={<PageFallback />}>
      <Routes>
        <Route element={<AppLayout />}>
          <Route index element={<HomePage />} />
          <Route path="editais" element={<EditaisPage />} />
          <Route path="calendario" element={<CalendarioPage />} />
          <Route path="radar" element={<RadarPage />} />
          <Route path="planos" element={<PlanosPage />} />
          <Route path="escolas" element={<EscolasPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Route>
      </Routes>
    </Suspense>
  );
}
