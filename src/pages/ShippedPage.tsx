import {
  Github,
  GitCommit,
  Calendar,
  BookOpen,
  CheckCircle2,
  Rocket,
  ArrowRight,
} from 'lucide-react';
import { Card } from '@/components/Card';
import { Button } from '@/components/Button';
import { useApp } from '@/context/AppContext';
import { getJourney, getDashboardSummary } from '@/services/missionService';
import { getGitHubAnalysis } from '@/services/storage';
import { GitHubTimeline } from '@/components/GitHubTimeline';
import { navigate } from '@/hooks/useRoute';
import { useEffect, useState } from 'react';
import type { GitHubAnalysis } from '@/types/github';

export function ShippedPage() {
  const { project } = useApp();
  const [githubAnalysis, setGithubAnalysis] = useState<GitHubAnalysis | null>(null);

  useEffect(() => {
    setGithubAnalysis(getGitHubAnalysis());
  }, []);

  if (!project) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center px-6 text-center">
        <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-neutral-100">
          <Github className="h-8 w-8 text-neutral-400" />
        </div>
        <p className="mb-6 text-sm text-neutral-500">
          Start a project to track your journey.
        </p>
        <Button onClick={() => navigate('/setup')}>Create a project</Button>
      </div>
    );
  }

  const summary = getDashboardSummary(project);
  const journey = getJourney(project);
  const isComplete = project.completedAt != null;

  const stats = [
    { label: 'Missions completed', value: summary.missionsCompleted },
    { label: 'Concepts learned', value: summary.conceptsLearned },
    { label: 'Reflections written', value: summary.reflectionsWritten },
    {
      label: 'GitHub commits',
      value: githubAnalysis ? githubAnalysis.analyzedCommitCount : null,
    },
  ];

  return (
    <div>
      <header className="mb-6 flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-neutral-900 text-white">
          <Rocket className="h-5 w-5" />
        </div>
        <div>
          <h1 className="text-xl font-bold tracking-tight">You shipped your first project.</h1>
          <p className="text-xs text-neutral-500">Your building journey so far</p>
        </div>
      </header>

      {/* Stats */}
      <div className="mb-6 grid grid-cols-2 gap-3">
        {stats.map((s) => (
          <Card key={s.label} className="flex flex-col gap-1">
            <p className="text-3xl font-bold">{s.value ?? '—'}</p>
            <p className="text-xs text-neutral-500">{s.label}</p>
          </Card>
        ))}
      </div>

      {/* Learning Journey */}
      <h2 className="mb-3 text-sm font-semibold text-neutral-900">Your learning journey</h2>
      {journey.length === 0 ? (
        <Card className="mb-6 py-8 text-center">
          <p className="text-sm text-neutral-400">
            Your learning reflections will appear here.
          </p>
        </Card>
      ) : (
        <div className="mb-6 space-y-3">
          {journey.map((entry, i) => (
            <Card key={i} className="flex items-start gap-3">
              <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-neutral-100">
                <BookOpen className="h-4 w-4 text-neutral-600" />
              </div>
              <div className="min-w-0">
                <p className="text-sm font-semibold text-neutral-900">{entry.missionTitle}</p>
                <p className="text-xs text-neutral-400">
                  {new Date(entry.completedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                </p>
                <p className="mt-1 text-xs font-medium text-neutral-500">{entry.concept}</p>
                {entry.reflectionSummary && (
                  <p className="mt-1 text-sm text-neutral-600">{entry.reflectionSummary}</p>
                )}
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Project Journey (GitHub) */}
      {githubAnalysis ? (
        <>
          <h2 className="mb-3 text-sm font-semibold text-neutral-900">Your project journey</h2>
          <Card className="mb-3">
            <div className="flex items-center gap-2">
              <Github className="h-4 w-4 text-neutral-700" />
              <p className="text-sm font-bold text-neutral-900">
                {githubAnalysis.owner}/{githubAnalysis.repo}
              </p>
            </div>
            <div className="mt-2 flex flex-wrap gap-4 text-xs text-neutral-500">
              <span className="flex items-center gap-1">
                <GitCommit className="h-3.5 w-3.5" />
                {githubAnalysis.analyzedCommitCount} commits
              </span>
              <span className="flex items-center gap-1">
                <Calendar className="h-3.5 w-3.5" />
                {githubAnalysis.activeDays} active days
              </span>
              {githubAnalysis.language && <span>{githubAnalysis.language}</span>}
            </div>
          </Card>
          <GitHubTimeline commits={githubAnalysis.commits} />
        </>
      ) : (
        <Card className="mb-6 py-8 text-center">
          <Github className="mx-auto mb-3 h-8 w-8 text-neutral-300" />
          <p className="mb-4 text-sm text-neutral-400">
            Connect a GitHub repository to see your project journey.
          </p>
          <Button variant="secondary" onClick={() => navigate('/github')} className="w-full">
            Connect GitHub
            <ArrowRight className="h-4 w-4" />
          </Button>
        </Card>
      )}

      {/* Completion message */}
      {isComplete && (
        <Card className="mt-6 border-neutral-900 bg-neutral-900 text-white">
          <div className="flex items-start gap-3">
            <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-emerald-400" />
            <div>
              <p className="text-sm font-bold">
                You didn't just finish a project. You can explain how you built it.
              </p>
              <p className="mt-1 text-xs text-neutral-300">
                Every mission you completed, every reflection you wrote, and every commit
                you pushed is part of your journey.
              </p>
            </div>
          </div>
        </Card>
      )}
    </div>
  );
}
