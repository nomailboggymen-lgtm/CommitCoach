import { type ReactNode, useCallback, useEffect, useState } from 'react';
import type { Project, Reflection } from '@/types';
import {
  getProject,
  saveProject,
  clearProject,
  getReflections,
  saveReflection,
} from '@/services/storage';
import { updateMissionStatuses } from '@/services/missionService';
import { AppContext, type AppState } from '@/context/AppContext';

export function AppProvider({ children }: { children: ReactNode }) {
  const [project, setProject] = useState<Project | null>(() => getProject());
  const [reflections, setReflections] = useState<Record<string, Reflection>>(() =>
    getReflections(),
  );

  useEffect(() => {
    if (project) saveProject(project);
  }, [project]);

  const setProjectState = useCallback((p: Project | null) => {
    setProject(p);
    if (p) saveProject(p);
    else clearProject();
  }, []);

  const completeMission = useCallback((missionId: string) => {
    setProject((prev) => {
      if (!prev) return prev;
      const mission = prev.missions.find((m) => m.id === missionId);
      if (!mission || mission.status !== 'active') return prev;
      return updateMissionStatuses(prev, missionId);
    });
  }, []);

  const uncompleteMission = useCallback((missionId: string) => {
    setProject((prev) => {
      if (!prev) return prev;
      const missions = prev.missions.map((m) => {
        if (m.id === missionId) {
          return { ...m, status: 'active' as const, completedAt: null };
        }
        return m;
      });
      return { ...prev, missions, completedAt: null };
    });
  }, []);

  const saveReflectionState = useCallback((r: Reflection) => {
    saveReflection(r);
    setReflections((prev) => ({ ...prev, [r.missionId]: r }));
  }, []);

  const value: AppState = {
    project,
    reflections,
    setProject: setProjectState,
    completeMission,
    uncompleteMission,
    saveReflection: saveReflectionState,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}
