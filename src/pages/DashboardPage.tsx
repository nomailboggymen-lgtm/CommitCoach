import { ArrowRight, Rocket, Plus, BookOpen, MessageSquare, Flame } from 'lucide-react';
import { Button } from '@/components/Button';
import { Card } from '@/components/Card';
import { ProgressBar } from '@/components/ProgressBar';
import { MissionCard } from '@/components/MissionCard';
import { navigate } from '@/hooks/useRoute';
import { useApp } from '@/context/AppContext';
import { getDashboardSummary } from '@/services/missionService';
import { useState } from 'react';

export function DashboardPage() {
  const { project, reflections } = useApp();
  const [lockedNotice, setLockedNotice] = useState<string | null>(null);

  if (!project) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center px-6 text-center">
        <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-neutral-100">
          <Plus className="h-8 w-8 text-neutral-400" />
        </div>
        <h2 className="mb-2 text-xl font-bold tracking-tight">Start your first project</h2>
        <p className="mb-6 text-sm text-neutral-500">
          Set up a project and we'll generate a step-by-step learning plan for you.
        </p>
        <Button onClick={() => navigate('/setup')}>Create a project</Button>
      </div>
    );
  }

  const summary = getDashboardSummary(project);
  const pct = Math.round((summary.missionsCompleted / summary.totalMissions) * 100);
  const isComplete = project.completedAt != null;

  const handleMissionClick = (missionId: string) => {
    const mission = project.missions.find((m) => m.id === missionId);
    if (!mission) return;
    if (mission.status === 'locked') {
      setLockedNotice('Complete the previous mission to unlock this step.');
      setTimeout(() => setLockedNotice(null), 2500);
      return;
    }
    navigate(`/mission/${mission.id}`);
  };

  const summaryCards = [
    { icon: BookOpen, label: 'Concepts learned', value: summary.conceptsLearned },
    { icon: MessageSquare, label: 'Reflections', value: summary.reflectionsWritten },
    { icon: Flame, label: 'Day streak', value: summary.currentStreak },
  ];

  return (
    <div>
      <header className="mb-6">
        <p className="text-xs font-medium text-neutral-400">Your project</p>
        <h1 className="text-2xl font-bold tracking-tight">{project.name}</h1>
        <p className="mt-1 text-sm text-neutral-500">
          {project.type} · {project.experience}
        </p>
      </header>

      <Card className="mb-4">
        <div className="mb-3 flex items-end justify-between">
          <div>
            <p className="text-xs font-medium text-neutral-400">Your progress</p>
            <p className="text-2xl font-bold">
              {summary.missionsCompleted}<span className="text-neutral-400">/{summary.totalMissions}</span>
              <span className="ml-1 text-sm font-medium text-neutral-500">missions complete</span>
            </p>
          </div>
          <span className="text-sm font-semibold text-neutral-500">{pct}%</span>
        </div>
        <ProgressBar value={summary.missionsCompleted} max={summary.totalMissions} />
      </Card>

      <div className="mb-6 grid grid-cols-3 gap-2">
        {summaryCards.map((s) => (
          <Card key={s.label} className="flex flex-col items-center gap-1 py-3 text-center">
            <s.icon className="h-4 w-4 text-neutral-500" />
            <p className="text-lg font-bold">{s.value}</p>
            <p className="text-[10px] text-neutral-400">{s.label}</p>
          </Card>
        ))}
      </div>

      {isComplete && (
        <Card className="mb-6 border-emerald-200 bg-emerald-50">
          <div className="flex items-center gap-3">
            <Rocket className="h-5 w-5 text-emerald-600" />
            <div>
              <p className="text-sm font-semibold text-emerald-900">Learning plan complete</p>
              <p className="text-xs text-emerald-700">You finished every mission. Great work.</p>
            </div>
          </div>
          <Button variant="secondary" onClick={() => navigate('/shipped')} className="mt-3 w-full">
            See My Journey
          </Button>
        </Card>
      )}

      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-sm font-semibold text-neutral-900">Missions</h2>
        <span className="text-xs text-neutral-400">{summary.totalMissions} steps</span>
      </div>

      {lockedNotice && (
        <div className="mb-3 rounded-xl border border-neutral-200 bg-neutral-100 px-4 py-3 text-sm text-neutral-600">
          {lockedNotice}
        </div>
      )}

      <div className="space-y-3">
        {project.missions.map((m) => (
          <MissionCard key={m.id} mission={m} onClick={() => handleMissionClick(m.id)} />
        ))}
      </div>

      {!isComplete && (
        <div className="mt-8">
          <Button variant="secondary" onClick={() => navigate('/shipped')} className="w-full">
            View your shipped progress
            <ArrowRight className="h-4 w-4" />
          </Button>
        </div>
      )}
    </div>
  );
}
