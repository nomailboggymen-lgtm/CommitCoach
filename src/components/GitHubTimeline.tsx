import { GitCommit, ExternalLink } from 'lucide-react';
import type { GitHubCommit } from '@/types/github';
import { Card } from '@/components/Card';

interface GitHubTimelineProps {
  commits: GitHubCommit[];
}

function formatDate(date: string): string {
  try {
    return new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  } catch {
    return date;
  }
}

export function GitHubTimeline({ commits }: GitHubTimelineProps) {
  const chronological = [...commits].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
  );

  return (
    <div className="space-y-2">
      {chronological.map((commit) => (
        <Card key={commit.sha} className="flex items-start gap-3 py-3">
          <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-neutral-100">
            <GitCommit className="h-4 w-4 text-neutral-600" />
          </div>
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-semibold text-neutral-900">
              {commit.message}
            </p>
            <div className="mt-0.5 flex items-center gap-2 text-xs text-neutral-400">
              <span>{formatDate(commit.date)}</span>
              <span>·</span>
              <span>{commit.author}</span>
              {commit.filesChanged != null && (
                <>
                  <span>·</span>
                  <span>{commit.filesChanged} {commit.filesChanged === 1 ? 'file' : 'files'} changed</span>
                </>
              )}
            </div>
          </div>
          {commit.url && (
            <a
              href={commit.url}
              target="_blank"
              rel="noopener noreferrer"
              className="shrink-0 text-neutral-300 hover:text-neutral-700"
            >
              <ExternalLink className="h-4 w-4" />
            </a>
          )}
        </Card>
      ))}
    </div>
  );
}
