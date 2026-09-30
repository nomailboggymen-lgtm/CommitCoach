import { createContext, useContext } from 'react';
import type { Project, Reflection } from '@/types';

export interface AppState {
  project: Project | null;
  reflections: Record<string, Reflection>;
  setProject: (p: Project | null) => void;
  completeMission: (missionId: string) => void;
  uncompleteMission: (missionId: string) => void;
  saveReflection: (r: Reflection) => void;
}

export const AppContext = createContext<AppState | null>(null);

export function useApp(): AppState {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
}
