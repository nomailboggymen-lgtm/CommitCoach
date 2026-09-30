import { useState, useEffect } from 'react';
import {
  Github,
  Search,
  Loader2,
  GitCommit,
  Calendar,
  FileCode,
  CheckCircle2,
  ArrowRight,
  AlertCircle,
  GitBranch,
} from 'lucide-react';
import { Button } from '@/components/Button';
import { Card } from '@/components/Card';
import { GitHubTimeline } from '@/components/GitHubTimeline';
import { parseGitHubUrl, analyzeRepository, errorToMessage } from '@/services/github';
import {
  getGitHubAnalysis,
  saveGitHubAnalysis,
} from '@/services/storage';
import { navigate } from '@/hooks/useRoute';
import type { GitHubAnalysis, GitHubError } from '@/types/github';

export function GitHubPage() {
  const [repoUrl, setRepoUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<GitHubError | null>(null);
  const [urlError, setUrlError] = useState('');
  const [analysis, setAnalysis] = useState<GitHubAnalysis | null>(null);

  useEffect(() => {
    const saved = getGitHubAnalysis();
    if (saved) setAnalysis(saved);
  }, []);

  const handleAnalyze = async () => {
    setUrlError('');
    const parsed = parseGitHubUrl(repoUrl);
    if (!parsed) {
      setUrlError('Enter a valid public GitHub repository URL.');
      return;
    }

    setLoading(true);
    setError(null);
    const { data, error: err } = await analyzeRepository(parsed.owner, parsed.repo);
    setLoading(false);

    if (err) {
      setError(err);
      return;
    }

    if (data) {
      saveGitHubAnalysis(data);
      setAnalysis(data);
      setRepoUrl('');
    }
  };

  const handleAnalyzeAgain = async () => {
    if (!analysis) return;
    setLoading(true);
    setError(null);
    const { data, error: err } = await analyzeRepository(analysis.owner, analysis.repo);
    setLoading(false);
    if (err) {
      setError(err);
      return;
    }
    if (data) {
      saveGitHubAnalysis(data);
      setAnalysis(data);
    }
  };

  const formatDate = (date: string) =>
    new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });

  if (loading) {
    return (
      <div>
        <header className="mb-6 flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-neutral-900 text-white">
            <Github className="h-5 w-5" />
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-tight">GitHub</h1>
            <p className="text-xs text-neutral-500">Analyzing repository</p>
          </div>
        </header>
        <Card className="flex flex-col items-center py-12 text-center">
          <Loader2 className="h-8 w-8 animate-spin text-neutral-400" />
          <p className="mt-4 text-sm font-semibold text-neutral-700">
            Reading your project history…
          </p>
          <p className="mt-1 text-xs text-neutral-400">
            Looking at public commits and repository activity.
          </p>
        </Card>
      </div>
    );
  }

  if (analysis && !error) {
    return (
      <div>
        <header className="mb-6 flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-neutral-900 text-white">
            <Github className="h-5 w-5" />
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-tight">Project connected</h1>
            <p className="text-xs text-neutral-500">{analysis.owner}/{analysis.repo}</p>
          </div>
        </header>

        <Card className="mb-4">
          <div className="mb-3 flex items-center gap-2">
            <span className="text-xs font-semibold uppercase tracking-wide text-neutral-400">
              Project Journey
            </span>
          </div>
          <h2 className="text-lg font-bold text-neutral-900">{analysis.name}</h2>
          {analysis.description && (
            <p className="mt-1 text-sm text-neutral-500">{analysis.description}</p>
          )}

          <div className="mt-4 grid grid-cols-2 gap-3">
            <div className="flex items-center gap-2">
              <GitCommit className="h-4 w-4 text-neutral-400" />
              <div>
                <p className="text-sm font-bold">{analysis.analyzedCommitCount}</p>
                <p className="text-[10px] text-neutral-400">commits analyzed</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-neutral-400" />
              <div>
                <p className="text-sm font-bold">{analysis.activeDays}</p>
                <p className="text-[10px] text-neutral-400">active days</p>
              </div>
            </div>
            {analysis.language && (
              <div className="flex items-center gap-2">
                <FileCode className="h-4 w-4 text-neutral-400" />
                <div>
                  <p className="text-sm font-bold">{analysis.language}</p>
                  <p className="text-[10px] text-neutral-400">language</p>
                </div>
              </div>
            )}
            <div className="flex items-center gap-2">
              <GitBranch className="h-4 w-4 text-neutral-400" />
              <div>
                <p className="text-sm font-bold">{analysis.defaultBranch}</p>
                <p className="text-[10px] text-neutral-400">branch</p>
              </div>
            </div>
          </div>
        </Card>

        {analysis.latestCommit && (
          <Card className="mb-4">
            <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-neutral-400">
              Latest commit
            </p>
            <p className="text-sm font-semibold text-neutral-900">
              {analysis.latestCommit.message}
            </p>
            <p className="mt-1 text-xs text-neutral-400">
              {formatDate(analysis.latestCommit.date)} · {analysis.latestCommit.author}
            </p>
          </Card>
        )}

        {analysis.signals.length > 0 && (
          <Card className="mb-4">
            <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-neutral-400">
              Repository signals
            </p>
            <div className="space-y-2">
              {analysis.signals.map((signal, i) => (
                <div key={i} className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-600" />
                  <p className="text-sm text-neutral-700">{signal}</p>
                </div>
              ))}
            </div>
          </Card>
        )}

        <div className="mb-6 flex gap-2">
          <Button variant="secondary" onClick={handleAnalyzeAgain} className="flex-1">
            Analyze Again
          </Button>
          <Button onClick={() => navigate('/shipped')} className="flex-1">
            See My Journey
            <ArrowRight className="h-4 w-4" />
          </Button>
        </div>

        <h2 className="mb-3 text-sm font-semibold text-neutral-900">Repository activity</h2>
        <GitHubTimeline commits={analysis.commits} />
      </div>
    );
  }

  if (error) {
    return (
      <div>
        <header className="mb-6 flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-neutral-900 text-white">
            <Github className="h-5 w-5" />
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-tight">GitHub</h1>
            <p className="text-xs text-neutral-500">Connect your repository</p>
          </div>
        </header>
        <Card className="flex flex-col items-center py-8 text-center">
          <AlertCircle className="mb-3 h-8 w-8 text-neutral-400" />
          <p className="mb-4 text-sm text-neutral-600">{errorToMessage(error)}</p>
          <Button variant="secondary" onClick={() => setError(null)} className="w-full">
            Try again
          </Button>
        </Card>
      </div>
    );
  }

  return (
    <div>
      <header className="mb-6 flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-neutral-900 text-white">
          <Github className="h-5 w-5" />
        </div>
        <div>
          <h1 className="text-xl font-bold tracking-tight">GitHub</h1>
          <p className="text-xs text-neutral-500">Connect your repository</p>
        </div>
      </header>

      <h2 className="mb-1 text-lg font-bold tracking-tight text-neutral-900">
        Show your project's journey
      </h2>
      <p className="mb-4 text-sm text-neutral-500">
        Connect a public GitHub repository to see the iterations behind your project.
      </p>

      <Card className="mb-4">
        <label htmlFor="repo-url" className="mb-2 block text-xs font-semibold uppercase tracking-wide text-neutral-400">
          Repository URL
        </label>
        <input
          id="repo-url"
          value={repoUrl}
          onChange={(e) => setRepoUrl(e.target.value)}
          placeholder="https://github.com/username/project"
          className="w-full rounded-xl border border-neutral-200 bg-white px-4 py-3 text-sm outline-none transition-colors focus:border-neutral-400 focus:ring-2 focus:ring-neutral-100"
        />
        {urlError && (
          <p className="mt-2 text-xs text-red-500">{urlError}</p>
        )}
        <Button onClick={handleAnalyze} disabled={!repoUrl.trim()} className="mt-3 w-full">
          <Search className="h-4 w-4" />
          Analyze Repository
        </Button>
        <p className="mt-3 text-center text-xs text-neutral-400">
          Public repositories only. CommitCoach uses read-only public GitHub data.
        </p>
      </Card>

      {analysis && (
        <Card className="mb-4 border-neutral-200 bg-neutral-50">
          <p className="text-xs text-neutral-400">Last analyzed repository</p>
          <p className="text-sm font-medium text-neutral-700">
            {analysis.owner}/{analysis.repo}
          </p>
          <Button variant="ghost" onClick={() => setError(null)} className="mt-2 px-0 text-xs">
            View previous analysis
          </Button>
        </Card>
      )}
    </div>
  );
}
