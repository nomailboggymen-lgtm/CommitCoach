import { AppProvider } from '@/context/AppProvider';
import { useRoute } from '@/hooks/useRoute';
import { AppShell } from '@/components/AppShell';
import { LandingPage } from '@/pages/LandingPage';
import { SetupPage } from '@/pages/SetupPage';
import { DashboardPage } from '@/pages/DashboardPage';
import { MissionPage } from '@/pages/MissionPage';
import { GitHubPage } from '@/pages/GitHubPage';
import { ShippedPage } from '@/pages/ShippedPage';

function Router() {
  const route = useRoute();

  switch (route.name) {
    case 'home':
      return <LandingPage />;
    case 'setup':
      return <SetupPage />;
    case 'dashboard':
      return (
        <AppShell route={route}>
          <DashboardPage />
        </AppShell>
      );
    case 'mission':
      return (
        <AppShell route={route}>
          <MissionPage missionId={route.id} />
        </AppShell>
      );
    case 'github':
      return (
        <AppShell route={route}>
          <GitHubPage />
        </AppShell>
      );
    case 'shipped':
      return (
        <AppShell route={route}>
          <ShippedPage />
        </AppShell>
      );
  }
}

function App() {
  return (
    <AppProvider>
      <Router />
    </AppProvider>
  );
}

export default App;
