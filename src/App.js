import { useEffect } from 'react';
import { useLocation, useNavigationType, useRoutes } from 'react-router-dom';
import './App.css';
import {ROUTES} from './routes/routes'
import { UploadProvider } from './uploads/UploadProvider';

/**
 * Start each newly opened page at the top. Going Back keeps the browser's position,
 * and links to a section (like #rsvp) still jump to that section.
 */
function useScrollToTopOnNavigate() {
  const { pathname, hash } = useLocation();
  const navigationType = useNavigationType();
  useEffect(() => {
    if (navigationType === 'POP' || hash) return;
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
  }, [pathname, hash, navigationType]);
}

function App() {
  useScrollToTopOnNavigate();
  const routes = useRoutes(ROUTES);
  // Uploads run here, above the pages, so they continue while guests move around the site.
  return <UploadProvider>{routes}</UploadProvider>;
}

export default App;
