import { Home, Github, Rocket } from 'lucide-react';
import { navigate } from '@/hooks/useRoute';
import type { Route } from '@/hooks/useRoute';

interface BottomNavProps {
  route: Route;
}

const items = [
  { name: 'dashboard' as const, label: 'Home', icon: Home, path: '/dashboard' },
  { name: 'github' as const, label: 'GitHub', icon: Github, path: '/github' },
  { name: 'shipped' as const, label: 'Shipped', icon: Rocket, path: '/shipped' },
];

export function BottomNav({ route }: BottomNavProps) {
  const activeName =
    route.name === 'mission' ? 'dashboard' : route.name === 'home' ? 'dashboard' : route.name;

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 border-t border-neutral-200 bg-white/90 backdrop-blur-lg">
      <div className="mx-auto flex max-w-md items-center justify-around px-4 py-2">
        {items.map(({ name, label, icon: Icon, path }) => {
          const active = activeName === name;
          return (
            <button
              key={name}
              onClick={() => navigate(path)}
              aria-label={label}
              aria-current={active ? 'page' : undefined}
              className={`flex flex-col items-center gap-1 rounded-lg px-5 py-1.5 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-neutral-400 ${active ? 'text-neutral-900' : 'text-neutral-400 hover:text-neutral-600'}`}
            >
              <Icon className="h-5 w-5" />
              <span className="text-[10px] font-medium">{label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
