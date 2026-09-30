import { useState } from 'react';
import { ArrowLeft, Check } from 'lucide-react';
import { Button } from '@/components/Button';
import { navigate } from '@/hooks/useRoute';
import { useApp } from '@/context/AppContext';
import { generateMissions } from '@/data/missionTemplates';
import type { ProjectType, ExperienceLevel, LearningGoal, Project } from '@/types';

const projectTypes: ProjectType[] = ['Web app', 'Mobile app', 'Game', 'AI tool', 'Other'];
const experienceLevels: ExperienceLevel[] = ['Complete beginner', 'Beginner', 'Some experience'];
const learningGoals: LearningGoal[] = ['React', 'JavaScript', 'APIs', 'Databases', 'UI/UX', 'Git & GitHub'];

export function SetupPage() {
  const { setProject } = useApp();

  const [name, setName] = useState('');
  const [type, setType] = useState<ProjectType | ''>('');
  const [experience, setExperience] = useState<ExperienceLevel | ''>('');
  const [goals, setGoals] = useState<LearningGoal[]>([]);

  const toggleGoal = (g: LearningGoal) =>
    setGoals((prev) => (prev.includes(g) ? prev.filter((x) => x !== g) : [...prev, g]));

  const canSubmit = name.trim() && type && experience;

  const handleSubmit = () => {
    if (!canSubmit) return;
    const project: Project = {
      name: name.trim(),
      type: type as ProjectType,
      experience: experience as ExperienceLevel,
      goals,
      createdAt: new Date().toISOString(),
      completedAt: null,
      missions: generateMissions(type as ProjectType),
    };
    setProject(project);
    navigate('/dashboard');
  };

  return (
    <div className="min-h-screen bg-neutral-50">
      <header className="flex items-center gap-3 px-5 pt-6">
        <button onClick={() => navigate('/')} className="text-neutral-400 hover:text-neutral-900">
          <ArrowLeft className="h-5 w-5" />
        </button>
        <span className="text-sm font-semibold">Set up your project</span>
      </header>

      <main className="mx-auto max-w-md px-5 py-6">
        <p className="mb-6 text-sm text-neutral-500">
          Tell us about your project and we'll build a learning plan around it.
        </p>

        <div className="space-y-6">
          <div>
            <label className="mb-2 block text-xs font-semibold uppercase tracking-wide text-neutral-400">
              Project name
            </label>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. My first web app"
              className="w-full rounded-xl border border-neutral-200 bg-white px-4 py-3 text-sm outline-none transition-colors focus:border-neutral-400"
            />
          </div>

          <div>
            <label className="mb-2 block text-xs font-semibold uppercase tracking-wide text-neutral-400">
              Project type
            </label>
            <div className="grid grid-cols-2 gap-2">
              {projectTypes.map((t) => (
                <button
                  key={t}
                  onClick={() => setType(t)}
                  className={`rounded-xl border px-4 py-3 text-sm font-medium transition-all ${type === t ? 'border-neutral-900 bg-neutral-900 text-white' : 'border-neutral-200 bg-white text-neutral-700 hover:border-neutral-300'}`}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="mb-2 block text-xs font-semibold uppercase tracking-wide text-neutral-400">
              Experience level
            </label>
            <div className="space-y-2">
              {experienceLevels.map((e) => (
                <button
                  key={e}
                  onClick={() => setExperience(e)}
                  className={`flex w-full items-center justify-between rounded-xl border px-4 py-3 text-sm font-medium transition-all ${experience === e ? 'border-neutral-900 bg-neutral-900 text-white' : 'border-neutral-200 bg-white text-neutral-700 hover:border-neutral-300'}`}
                >
                  {e}
                  {experience === e && <Check className="h-4 w-4" />}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="mb-2 block text-xs font-semibold uppercase tracking-wide text-neutral-400">
              Learning goals
            </label>
            <div className="flex flex-wrap gap-2">
              {learningGoals.map((g) => (
                <button
                  key={g}
                  onClick={() => toggleGoal(g)}
                  className={`rounded-full border px-4 py-2 text-sm font-medium transition-all ${goals.includes(g) ? 'border-neutral-900 bg-neutral-900 text-white' : 'border-neutral-200 bg-white text-neutral-600 hover:border-neutral-300'}`}
                >
                  {g}
                </button>
              ))}
            </div>
          </div>

          <Button onClick={handleSubmit} disabled={!canSubmit} className="w-full">
            Create My Plan
          </Button>
        </div>
      </main>
    </div>
  );
}
