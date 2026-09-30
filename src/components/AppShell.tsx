import { type ReactNode } from 'react';
import { BottomNav } from '@/components/BottomNav';
import type { Route } from '@/hooks/useRoute';

interface AppShellProps {
  route: Route;
  children: ReactNode;
  showNav?: boolean;
}

export function AppShell({ route, children, showNav = true }: AppShellProps) {
  return (
    <div className="min-h-screen bg-neutral-50 text-neutral-900">
      <main className={`mx-auto max-w-md px-5 ${showNav ? 'pb-24 pt-8' : 'pt-8'}`}>
        {children}
      </main>
      {showNav && <BottomNav route={route} />}
    </div>
  );
}
