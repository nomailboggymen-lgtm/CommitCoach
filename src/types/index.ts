export type ProjectType = 'Web app' | 'Mobile app' | 'Game' | 'AI tool' | 'Other';

export type ExperienceLevel = 'Complete beginner' | 'Beginner' | 'Some experience';

export type LearningGoal = 'React' | 'JavaScript' | 'APIs' | 'Databases' | 'UI/UX' | 'Git & GitHub';

export type MissionStatus = 'locked' | 'active' | 'completed';

export interface Project {
  name: string;
  type: ProjectType;
  experience: ExperienceLevel;
  goals: LearningGoal[];
  createdAt: string;
  completedAt: string | null;
  missions: Mission[];
}

export interface Mission {
  id: string;
  order: number;
  title: string;
  shortDescription: string;
  concept: string;
  whatYouLearn: string;
  challenge: string;
  explanation: string;
  hint: string;
  stuckGuidance: string;
  status: MissionStatus;
  estimatedMinutes: number;
  completedAt: string | null;
}

export interface Reflection {
  missionId: string;
  whatWentWrong: string;
  whatYouChanged: string;
  whatYouLearned: string;
  savedAt: string;
}

export interface JourneyEntry {
  missionTitle: string;
  completedAt: string;
  concept: string;
  reflectionSummary: string;
}

export interface DashboardSummary {
  missionsCompleted: number;
  totalMissions: number;
  conceptsLearned: number;
  reflectionsWritten: number;
  currentStreak: number;
}
