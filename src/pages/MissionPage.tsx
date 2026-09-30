import { useState } from 'react';
import {
  ArrowLeft,
  Lightbulb,
  BookOpen,
  HelpCircle,
  CheckCircle2,
  Clock,
  PartyPopper,
  ArrowRight,
  Lock,
  Check,
} from 'lucide-react';
import { Button } from '@/components/Button';
import { Card } from '@/components/Card';
import { MentorPanel } from '@/components/MentorPanel';
import { navigate } from '@/hooks/useRoute';
import { useApp } from '@/context/AppContext';
import type { Reflection } from '@/types';
import type { MentorMode } from '@/types/mentor';

interface MissionPageProps {
  missionId: string;
}

export function MissionPage({ missionId }: MissionPageProps) {
  const { project, reflections, completeMission, saveReflection } = useApp();
  const mission = project?.missions.find((m) => m.id === missionId);

  const existing = reflections[missionId];
  const [whatWentWrong, setWhatWentWrong] = useState(existing?.whatWentWrong ?? '');
  const [whatYouChanged, setWhatYouChanged] = useState(existing?.whatYouChanged ?? '');
  const [whatYouLearned, setWhatYouLearned] = useState(existing?.whatYouLearned ?? '');

  const [mentorMode, setMentorMode] = useState<MentorMode | null>(null);
  const [error, setError] = useState('');
  const [showComplete, setShowComplete] = useState(false);
  const [reflectionSaved, setReflectionSaved] = useState(false);

  if (!project || !mission) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center px-6 text-center">
        <p className="mb-4 text-sm text-neutral-500">Mission not found.</p>
        <Button onClick={() => navigate('/dashboard')}>Back to dashboard</Button>
      </div>
    );
  }

  if (mission.status === 'locked') {
    return (
      <div>
        <header className="mb-6 flex items-center gap-3">
          <button
            onClick={() => navigate('/dashboard')}
            aria-label="Back to dashboard"
            className="text-neutral-400 hover:text-neutral-900 focus:outline-none focus-visible:ring-2 focus-visible:ring-neutral-400 rounded-lg"
          >
            <ArrowLeft className="h-5 w-5" />
          </button>
          <span className="text-xs font-medium text-neutral-400">Mission {mission.order}</span>
        </header>
        <Card className="flex flex-col items-center py-10 text-center">
          <Lock className="mb-3 h-8 w-8 text-neutral-300" />
          <p className="text-sm font-semibold text-neutral-700">{mission.title}</p>
          <p className="mt-2 text-sm text-neutral-500">
            Complete the previous mission to unlock this step.
          </p>
          <Button variant="secondary" onClick={() => navigate('/dashboard')} className="mt-4">
            Back to dashboard
          </Button>
        </Card>
      </div>
    );
  }

  const isComplete = mission.status === 'completed';
  const total = project.missions.length;
  const nextMission = project.missions.find((m) => m.order === mission.order + 1);
  const isFinal = mission.order === total;
  const hasExistingReflection = existing != null;

  const handleComplete = () => {
    const hasContent =
      whatWentWrong.trim() || whatYouChanged.trim() || whatYouLearned.trim();
    if (!hasContent) {
      setError('Add a quick reflection before completing this mission.');
      return;
    }
    setError('');
    const reflection: Reflection = {
      missionId: mission.id,
      whatWentWrong,
      whatYouChanged,
      whatYouLearned,
      savedAt: new Date().toISOString(),
    };
    saveReflection(reflection);
    completeMission(mission.id);
    setShowComplete(true);
  };

  const handleSaveReflection = () => {
    const reflection: Reflection = {
      missionId: mission.id,
      whatWentWrong,
      whatYouChanged,
      whatYouLearned,
      savedAt: new Date().toISOString(),
    };
    saveReflection(reflection);
    setReflectionSaved(true);
    setTimeout(() => setReflectionSaved(false), 2500);
  };

  if (showComplete) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center px-6 text-center">
        <div className="animate-celebrate">
          <PartyPopper className="h-16 w-16 text-neutral-900" />
        </div>
        <h1 className="mt-6 text-2xl font-bold tracking-tight">Mission complete</h1>
        {isFinal ? (
          <>
            <p className="mt-2 text-sm text-neutral-500">
              You finished Mission {mission.order}: {mission.title}
            </p>
            <p className="mt-4 text-base font-semibold text-neutral-900">
              You finished your learning plan.
            </p>
            <Button onClick={() => navigate('/shipped')} className="mt-6 w-full max-w-xs">
              See My Journey
              <ArrowRight className="h-4 w-4" />
            </Button>
          </>
        ) : (
          <>
            <p className="mt-2 text-sm text-neutral-500">Next step unlocked.</p>
            <Button onClick={() => navigate(`/mission/${nextMission!.id}`)} className="mt-6 w-full max-w-xs">
              Continue to next mission
              <ArrowRight className="h-4 w-4" />
            </Button>
          </>
        )}
        <button
          onClick={() => navigate('/dashboard')}
          className="mt-4 text-sm text-neutral-400 hover:text-neutral-900"
        >
          Back to dashboard
        </button>
      </div>
    );
  }

  return (
    <div>
      <header className="mb-4 flex items-center gap-3">
        <button
          onClick={() => navigate('/dashboard')}
          aria-label="Back to dashboard"
          className="text-neutral-400 hover:text-neutral-900 focus:outline-none focus-visible:ring-2 focus-visible:ring-neutral-400 rounded-lg"
        >
          <ArrowLeft className="h-5 w-5" />
        </button>
        <span className="text-xs font-medium text-neutral-400">
          MISSION {String(mission.order).padStart(2, '0')} OF {String(total).padStart(2, '0')}
        </span>
      </header>

      <h1 className="text-2xl font-bold tracking-tight">{mission.title}</h1>
      <p className="mt-1 text-sm text-neutral-500">{mission.shortDescription}</p>

      <Card className="mt-4">
        <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-neutral-400">
          What you'll learn
        </p>
        <p className="text-sm text-neutral-700">{mission.whatYouLearn}</p>
      </Card>

      <Card className="mt-3">
        <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-neutral-400">
          Your challenge
        </p>
        <p className="text-sm text-neutral-700">{mission.challenge}</p>
      </Card>

      <div className="mt-3 flex items-center gap-2 text-sm text-neutral-500">
        <Clock className="h-4 w-4" />
        <span>Estimated time: {mission.estimatedMinutes} minutes</span>
      </div>

      <div className="mt-6">
        <h2 className="mb-3 text-sm font-semibold text-neutral-900">Need help?</h2>
        <div className="grid grid-cols-3 gap-2">
          <Button
            variant="secondary"
            onClick={() => setMentorMode('explain')}
            className="flex-col gap-1 py-3 text-xs"
          >
            <BookOpen className="h-4 w-4" />
            Explain this
          </Button>
          <Button
            variant="secondary"
            onClick={() => setMentorMode('hint')}
            className="flex-col gap-1 py-3 text-xs"
          >
            <Lightbulb className="h-4 w-4" />
            Give me a hint
          </Button>
          <Button
            variant="secondary"
            onClick={() => setMentorMode('stuck')}
            className="flex-col gap-1 py-3 text-xs"
          >
            <HelpCircle className="h-4 w-4" />
            I'm stuck
          </Button>
        </div>
      </div>

      <div className="mt-6">
        <h2 className="mb-1 text-sm font-semibold text-neutral-900">
          What happened while you built this?
        </h2>
        {hasExistingReflection && !reflectionSaved && (
          <p className="mb-3 flex items-center gap-1.5 text-xs text-neutral-400">
            <Check className="h-3.5 w-3.5" />
            Your previous reflection has been restored.
          </p>
        )}
        {reflectionSaved && (
          <p className="mb-3 flex items-center gap-1.5 text-xs text-emerald-600 animate-fade-in">
            <Check className="h-3.5 w-3.5" />
            Reflection saved
          </p>
        )}
        <div className="space-y-3">
          <div>
            <label htmlFor="ref-wrong" className="mb-1 block text-xs font-medium text-neutral-400">What went wrong?</label>
            <textarea
              id="ref-wrong"
              value={whatWentWrong}
              onChange={(e) => setWhatWentWrong(e.target.value)}
              rows={2}
              className="w-full resize-none rounded-xl border border-neutral-200 bg-white px-4 py-3 text-sm outline-none transition-colors focus:border-neutral-400 focus:ring-2 focus:ring-neutral-100"
              placeholder="Write your thoughts..."
            />
          </div>
          <div>
            <label htmlFor="ref-changed" className="mb-1 block text-xs font-medium text-neutral-400">What did you change?</label>
            <textarea
              id="ref-changed"
              value={whatYouChanged}
              onChange={(e) => setWhatYouChanged(e.target.value)}
              rows={2}
              className="w-full resize-none rounded-xl border border-neutral-200 bg-white px-4 py-3 text-sm outline-none transition-colors focus:border-neutral-400 focus:ring-2 focus:ring-neutral-100"
              placeholder="Write your thoughts..."
            />
          </div>
          <div>
            <label htmlFor="ref-learned" className="mb-1 block text-xs font-medium text-neutral-400">What did you learn?</label>
            <textarea
              id="ref-learned"
              value={whatYouLearned}
              onChange={(e) => setWhatYouLearned(e.target.value)}
              rows={2}
              className="w-full resize-none rounded-xl border border-neutral-200 bg-white px-4 py-3 text-sm outline-none transition-colors focus:border-neutral-400 focus:ring-2 focus:ring-neutral-100"
              placeholder="Write your thoughts..."
            />
          </div>
        </div>
        <Button variant="ghost" onClick={handleSaveReflection} className="mt-2 px-0 text-xs">
          Save Reflection
        </Button>
      </div>

      {error && (
        <p className="mt-3 rounded-lg border border-amber-200 bg-amber-50 px-4 py-2 text-sm text-amber-700">
          {error}
        </p>
      )}

      <div className="mt-6 pb-4">
        {isComplete ? (
          <div className="flex items-center gap-2 text-sm font-medium text-emerald-600">
            <CheckCircle2 className="h-5 w-5" />
            You completed this mission
          </div>
        ) : (
          <Button onClick={handleComplete} className="w-full py-3.5 text-base">
            <CheckCircle2 className="h-4 w-4" />
            Mark complete
          </Button>
        )}
      </div>

      {mentorMode && (
        <MentorPanel
          mode={mentorMode}
          mission={mission}
          project={project}
          onClose={() => setMentorMode(null)}
        />
      )}
    </div>
  );
}
