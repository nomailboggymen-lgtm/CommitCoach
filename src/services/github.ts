import type { GitHubAnalysis, GitHubCommit, GitHubError } from '@/types/github';

const ANALYZE_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/github-analyze`;

export function parseGitHubUrl(url: string): { owner: string; repo: string } | null {
  const trimmed = url.trim();
  if (!trimmed) return null;

  const match = trimmed.match(
    /^https?:\/\/github\.com\/([a-zA-Z0-9][a-zA-Z0-9-]*[a-zA-Z0-9])\/([a-zA-Z0-9._-]+?)(?:\/|\.git)?$/,
  );
  if (!match) return null;

  const owner = match[1];
  const repo = match[2].replace(/\.git$/, '');
  if (!owner || !repo) return null;

  return { owner, repo };
}

export async function analyzeRepository(
  owner: string,
  repo: string,
): Promise<{ data: GitHubAnalysis | null; error: GitHubError | null }> {
  try {
    const res = await fetch(ANALYZE_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
      },
      body: JSON.stringify({ owner, repo }),
      signal: AbortSignal.timeout(30000),
    });

    if (!res.ok) {
      const body = await res.json().catch(() => ({}));
      const errCode = body?.error as GitHubError | undefined;
      if (errCode === 'not-found') return { data: null, error: 'not-found' };
      if (errCode === 'private') return { data: null, error: 'private' };
      if (errCode === 'rate-limit') return { data: null, error: 'rate-limit' };
      if (errCode === 'invalid-url') return { data: null, error: 'invalid-url' };
      return { data: null, error: 'network' };
    }

    const data = (await res.json()) as GitHubAnalysis;
    if (!data || typeof data.owner !== 'string' || !Array.isArray(data.commits)) {
      return { data: null, error: 'network' };
    }
    return { data, error: null };
  } catch {
    return { data: null, error: 'network' };
  }
}

export function errorToMessage(error: GitHubError): string {
  switch (error) {
    case 'not-found':
      return "We couldn't find that public repository. Check the URL and try again.";
    case 'private':
      return "This repository isn't publicly accessible. Use a public GitHub repository for analysis.";
    case 'rate-limit':
      return 'GitHub is temporarily limiting requests. Try again later.';
    case 'invalid-url':
      return 'Enter a valid public GitHub repository URL.';
    case 'network':
      return "We couldn't analyze the repository right now. Your CommitCoach project is still safe.";
  }
}
