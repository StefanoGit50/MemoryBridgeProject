import { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import type { NavState, NavTarget } from '../types';

/**
 * TODO: allinea questi percorsi al router reale dell'app.
 * Sono l'unico punto in cui la chat conosce gli URL.
 */
const ROUTES = {
  post: '/racconta-ricordo',
  albero: '/albero',
  ricerca: '/ricerca',
  aggiungi: '/albero#aggiungi',
  profile: (id: string) => `/profilo/${encodeURIComponent(id)}`,
  tree: (id: string) => `/albero?focus=${encodeURIComponent(id)}`,
} as const;

function pathFor(target: NavTarget): string {
  switch (target.to) {
    case 'post':
      return ROUTES.post;
    case 'albero':
      return ROUTES.albero;
    case 'ricerca':
      return ROUTES.ricerca;
    case 'aggiungi':
      return ROUTES.aggiungi;
    case 'profile':
      return ROUTES.profile(target.id);
    case 'tree':
      return ROUTES.tree(target.id);
  }
}

/**
 * Navigazione della chat. La bozza del post viaggia nello state del router:
 * la pagina "Racconta un ricordo" la legge con `useLocation().state?.draft`.
 */
export function useIrisNavigation() {
  const navigate = useNavigate();
  return useCallback(
    (target: NavTarget, state?: NavState) => {
      navigate(pathFor(target), state ? { state } : undefined);
    },
    [navigate],
  );
}
