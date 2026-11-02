import { useMemo } from 'react';
import type { CurrentUser } from '../types';

function buildUser(fullName: string, photoUrl?: string): CurrentUser {
  const words = fullName.trim().split(/\s+/).filter(Boolean);
  return {
    name: words[0] ?? '',
    fullName,
    initials: words
      .slice(0, 2)
      .map((w) => w[0])
      .join('')
      .toUpperCase(),
    photoUrl,
  };
}

/**
 * TODO: collega all'autenticazione reale (context, store, query…).
 * Qui basta restituire nome completo ed eventuale URL della foto profilo.
 */
export function useCurrentUser(): CurrentUser {
  return useMemo(() => buildUser('Arianna Han'), []);
}
