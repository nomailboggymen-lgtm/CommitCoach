export type MentorMode = 'explain' | 'hint' | 'stuck';

export type StuckType = 'crash' | 'no-change' | 'concept' | 'next-step' | null;

export interface MentorRequest {
  project: {
    name: string;
    type: string;
    experience: string;
    learningGoals: string[];
  };
  mission: {
    title: string;
    concept: string;
    challenge: string;
    whatYouLearn: string;
  };
  mode: MentorMode;
  hintLevel?: number;
  stuckType?: StuckType;
  userMessage?: string;
}

export interface MentorResponse {
  fallback: boolean;
  response: string;
}
