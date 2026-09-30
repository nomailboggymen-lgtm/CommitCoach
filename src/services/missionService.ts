import type { Project, Mission, JourneyEntry, DashboardSummary, Reflection } from '@/types';
import { getReflections } from '@/services/storage';

export function updateMissionStatuses(project: Project, completedMissionId: string): Project {
  const missions = project.missions.map((m) => {
    if (m.id === completedMissionId) {
      return { ...m, status: 'completed' as const, completedAt: new Date().toISOString() };
    }
    return m;
  });

  const completedIndex = missions.findIndex((m) => m.id === completedMissionId);
  if (completedIndex >= 0 && completedIndex + 1 < missions.length) {
    const next = missions[completedIndex + 1];
    if (next.status === 'locked') {
      missions[completedIndex + 1] = { ...next, status: 'active' as const };
    }
  }

  const allDone = missions.every((m) => m.status === 'completed');
  return {
    ...project,
    missions,
    completedAt: allDone ? new Date().toISOString() : project.completedAt,
  };
}

export function getDashboardSummary(project: Project): DashboardSummary {
  const completed = project.missions.filter((m) => m.status === 'completed');
  const reflections = getReflections();
  const reflectionsWritten = project.missions.filter(
    (m) => reflections[m.id] != null,
  ).length;

  const dates = completed
    .map((m) => m.completedAt)
    .filter((d): d is string => d != null)
    .map((d) => d.split('T')[0])
    .sort();

  const uniqueDates = Array.from(new Set(dates));
  let streak = 0;
  if (uniqueDates.length > 0) {
    const today = new Date().toISOString().split('T')[0];
    const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];
    const last = uniqueDates[uniqueDates.length - 1];
    if (last === today || last === yesterday) {
      streak = 1;
      for (let i = uniqueDates.length - 2; i >= 0; i--) {
        const prev = new Date(uniqueDates[i + 1]);
        const curr = new Date(uniqueDates[i]);
        const diff = Math.round((prev.getTime() - curr.getTime()) / 86400000);
        if (diff === 1) streak++;
        else break;
      }
    }
  }

  return {
    missionsCompleted: completed.length,
    totalMissions: project.missions.length,
    conceptsLearned: completed.length,
    reflectionsWritten,
    currentStreak: streak,
  };
}

export function getJourney(project: Project): JourneyEntry[] {
  const reflections = getReflections();
  return project.missions
    .filter((m) => m.status === 'completed' && m.completedAt)
    .sort((a, b) => (a.order < b.order ? -1 : 1))
    .map((m) => {
      const r: Reflection | undefined = reflections[m.id];
      const summary = r
        ? [r.whatWentWrong, r.whatYouChanged, r.whatYouLearned]
            .filter((s) => s.trim())
            .join(' · ')
        : '';
      return {
        missionTitle: m.title,
        completedAt: m.completedAt!,
        concept: m.concept,
        reflectionSummary: summary,
      };
    });
}
