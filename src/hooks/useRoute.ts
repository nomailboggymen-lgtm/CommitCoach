import { useEffect, useState } from 'react';

export type Route =
  | { name: 'home' }
  | { name: 'setup' }
  | { name: 'dashboard' }
  | { name: 'mission'; id: string }
  | { name: 'github' }
  | { name: 'shipped' };

export function parseHash(hash: string): Route {
  const path = hash.replace(/^#/, '').split('?')[0];
  const parts = path.split('/').filter(Boolean);

  if (parts.length === 0) return { name: 'home' };
  if (parts[0] === 'setup') return { name: 'setup' };
  if (parts[0] === 'dashboard') return { name: 'dashboard' };
  if (parts[0] === 'github') return { name: 'github' };
  if (parts[0] === 'shipped') return { name: 'shipped' };
  if (parts[0] === 'mission' && parts[1]) return { name: 'mission', id: parts[1] };

  return { name: 'home' };
}

export function useRoute(): Route {
  const [route, setRoute] = useState<Route>(() => parseHash(window.location.hash));

  useEffect(() => {
    const onChange = () => setRoute(parseHash(window.location.hash));
    window.addEventListener('hashchange', onChange);
    return () => window.removeEventListener('hashchange', onChange);
  }, []);

  return route;
}

export function navigate(path: string) {
  window.location.hash = path;
  window.scrollTo(0, 0);
}
