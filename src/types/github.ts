export interface GitHubCommit {
  sha: string;
  message: string;
  author: string;
  date: string;
  filesChanged?: number;
  url?: string;
}

export interface GitHubAnalysis {
  owner: string;
  repo: string;
  name: string;
  description?: string;
  language?: string;
  defaultBranch: string;
  commits: GitHubCommit[];
  analyzedCommitCount: number;
  activeDays: number;
  firstCommit?: GitHubCommit;
  latestCommit?: GitHubCommit;
  hasReadme: boolean;
  signals: string[];
  analyzedAt: string;
}

export type GitHubError =
  | 'not-found'
  | 'private'
  | 'rate-limit'
  | 'network'
  | 'invalid-url';
