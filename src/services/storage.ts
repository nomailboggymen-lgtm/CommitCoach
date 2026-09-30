import type { Project, Reflection } from '@/types';
import type { GitHubAnalysis } from '@/types/github';

const PROJECT_KEY = 'commitcoach.project';
const REFLECTIONS_KEY = 'commitcoach.reflections';
const GITHUB_KEY = 'commitcoach.github';

function safeParse<T>(raw: string | null, fallback: T): T {
  if (!raw) return fallback;
  try {
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

function isProject(value: unknown): value is Project {
  if (!value || typeof value !== 'object') return false;
  const p = value as Record<string, unknown>;
  return (
    typeof p.name === 'string' &&
    typeof p.type === 'string' &&
    typeof p.experience === 'string' &&
    Array.isArray(p.goals) &&
    typeof p.createdAt === 'string' &&
    Array.isArray(p.missions)
  );
}

export function getProject(): Project | null {
  try {
    const raw = localStorage.getItem(PROJECT_KEY);
    const parsed = safeParse<unknown>(raw, null);
    return isProject(parsed) ? parsed : null;
  } catch {
    return null;
  }
}

export function saveProject(project: Project): void {
  try {
    localStorage.setItem(PROJECT_KEY, JSON.stringify(project));
  } catch {
    // storage full or unavailable
  }
}

export function clearProject(): void {
  try {
    localStorage.removeItem(PROJECT_KEY);
  } catch {
    // no-op
  }
}

export function getReflections(): Record<string, Reflection> {
  try {
    return safeParse<Record<string, Reflection>>(localStorage.getItem(REFLECTIONS_KEY), {});
  } catch {
    return {};
  }
}

export function saveReflection(reflection: Reflection): void {
  try {
    const all = getReflections();
    all[reflection.missionId] = reflection;
    localStorage.setItem(REFLECTIONS_KEY, JSON.stringify(all));
  } catch {
    // storage full or unavailable
  }
}

export function clearReflections(): void {
  try {
    localStorage.removeItem(REFLECTIONS_KEY);
  } catch {
    // no-op
  }
}

export function getGitHubAnalysis(): GitHubAnalysis | null {
  try {
    const raw = localStorage.getItem(GITHUB_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (parsed && typeof parsed.owner === 'string' && typeof parsed.repo === 'string' && Array.isArray(parsed.commits)) {
      return parsed as GitHubAnalysis;
    }
    return null;
  } catch {
    return null;
  }
}

export function saveGitHubAnalysis(analysis: GitHubAnalysis): void {
  try {
    localStorage.setItem(GITHUB_KEY, JSON.stringify(analysis));
  } catch {
    // storage full or unavailable
  }
}

export function clearGitHubAnalysis(): void {
  try {
    localStorage.removeItem(GITHUB_KEY);
  } catch {
    // no-op
  }
}
