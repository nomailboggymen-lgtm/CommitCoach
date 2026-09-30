import { useState, useCallback, useEffect } from 'react';
import { X, Loader2, BookOpen, Lightbulb, HelpCircle, AlertCircle, ArrowRight } from 'lucide-react';
import { Button } from '@/components/Button';
import { Card } from '@/components/Card';
import { callMentor } from '@/services/mentorApi';
import type { MentorMode, StuckType } from '@/types/mentor';
import type { Project, Mission } from '@/types';

interface MentorPanelProps {
  mode: MentorMode;
  mission: Mission;
  project: Project;
  onClose: () => void;
}

const stuckOptions: { value: Exclude<StuckType, null>; label: string }[] = [
  { value: 'crash', label: 'My app crashes' },
  { value: 'no-change', label: 'Nothing changes' },
  { value: 'concept', label: "I don't understand the concept" },
  { value: 'next-step', label: "I don't know what to try" },
];

export function MentorPanel({ mode, mission, project, onClose }: MentorPanelProps) {
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState('');
  const [isFallback, setIsFallback] = useState(false);
  const [fetched, setFetched] = useState(false);
  const [hintLevel, setHintLevel] = useState(1);
  const [stuckType, setStuckType] = useState<StuckType>(null);
  const [userMessage, setUserMessage] = useState('');
  const [showStuckForm, setShowStuckForm] = useState(mode === 'stuck');

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handleEsc);
    return () => document.removeEventListener('keydown', handleEsc);
  }, [onClose]);

  const buildRequest = useCallback(
    (overrides?: Partial<{ hintLevel: number; stuckType: StuckType; userMessage: string }>) => ({
      project: {
        name: project.name,
        type: project.type,
        experience: project.experience,
        learningGoals: project.goals,
      },
      mission: {
        title: mission.title,
        concept: mission.concept,
        challenge: mission.challenge,
        whatYouLearn: mission.whatYouLearn,
      },
      mode,
      hintLevel: overrides?.hintLevel ?? hintLevel,
      stuckType: overrides?.stuckType ?? stuckType,
      userMessage: overrides?.userMessage ?? userMessage,
    }),
    [project, mission, mode, hintLevel, stuckType, userMessage],
  );

  const fallbackContent = useCallback((): string => {
    if (mode === 'explain') return mission.explanation;
    if (mode === 'hint') return mission.hint;
    return mission.stuckGuidance;
  }, [mode, mission]);

  const fetchMentor = useCallback(
    async (opts?: Partial<{ hintLevel: number; stuckType: StuckType; userMessage: string }>) => {
      setLoading(true);
      setFetched(false);
      const req = buildRequest(opts);
      const res = await callMentor(req);
      if (res.fallback || !res.response) {
        setIsFallback(true);
        setResponse(fallbackContent());
      } else {
        setIsFallback(false);
        setResponse(res.response);
      }
      setLoading(false);
      setFetched(true);
    },
    [buildRequest, fallbackContent],
  );

  const modeConfig = {
    explain: { icon: BookOpen, title: 'Explain this' },
    hint: { icon: Lightbulb, title: 'Give me a hint' },
    stuck: { icon: HelpCircle, title: "I'm stuck" },
  } as const;

  const cfg = modeConfig[mode];

  const handleStuckSubmit = () => {
    fetchMentor({ stuckType, userMessage });
    setShowStuckForm(false);
  };

  const handleNextHint = () => {
    const next = Math.min(hintLevel + 1, 3);
    setHintLevel(next);
    fetchMentor({ hintLevel: next });
  };

  const renderHintButtons = () => {
    if (mode !== 'hint' || !fetched || loading) return null;
    if (hintLevel < 3) {
      return (
        <Button variant="secondary" onClick={handleNextHint} className="w-full">
          {hintLevel === 1 ? 'Need another hint' : 'Show a small example'}
        </Button>
      );
    }
    return (
      <p className="text-center text-xs text-neutral-400">
        That's the most specific hint available. Try the challenge yourself — you've got this.
      </p>
    );
  };

  const renderStuckForm = () => {
    if (mode !== 'stuck' || !showStuckForm) return null;
    return (
      <div className="space-y-3">
        <p className="text-sm font-medium text-neutral-700">What is happening?</p>
        <div className="space-y-2">
          {stuckOptions.map((opt) => (
            <button
              key={opt.value}
              onClick={() => setStuckType(opt.value)}
              className={`flex w-full items-center gap-3 rounded-xl border px-4 py-3 text-sm transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-neutral-400 ${stuckType === opt.value ? 'border-neutral-900 bg-neutral-900 text-white' : 'border-neutral-200 bg-white text-neutral-700 hover:border-neutral-300'}`}
            >
              <span className={`h-4 w-4 rounded-full border-2 ${stuckType === opt.value ? 'border-white' : 'border-neutral-300'}`} />
              {opt.label}
            </button>
          ))}
        </div>
        <div>
          <label htmlFor="stuck-desc" className="mb-1 block text-xs font-medium text-neutral-400">
            Tell your mentor what you see...
          </label>
          <textarea
            id="stuck-desc"
            value={userMessage}
            onChange={(e) => setUserMessage(e.target.value)}
            rows={2}
            className="w-full resize-none rounded-xl border border-neutral-200 bg-white px-4 py-3 text-sm outline-none transition-colors focus:border-neutral-400 focus:ring-2 focus:ring-neutral-100"
            placeholder="Describe what you're experiencing..."
          />
        </div>
        <Button onClick={handleStuckSubmit} disabled={!stuckType} className="w-full">
          Ask my mentor
          <ArrowRight className="h-4 w-4" />
        </Button>
      </div>
    );
  };

  const renderResponse = () => {
    if (!fetched || showStuckForm) return null;
    return (
      <div>
        {isFallback && (
          <div className="mb-2 flex items-center gap-1.5 text-xs font-medium text-neutral-400">
            <AlertCircle className="h-3.5 w-3.5" />
            Built-in mentor
          </div>
        )}
        {mode === 'hint' && (
          <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-neutral-400">
            Hint {hintLevel} of 3
          </p>
        )}
        <p className="whitespace-pre-line text-sm leading-relaxed text-neutral-700">
          {response}
        </p>
      </div>
    );
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-black/30 sm:items-center"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label={cfg.title}
    >
      <div
        className="max-h-[85vh] w-full max-w-md overflow-y-auto rounded-t-3xl bg-white p-5 shadow-xl sm:rounded-3xl animate-slide-up"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-neutral-900 text-white">
              <cfg.icon className="h-4 w-4" />
            </div>
            <span className="text-sm font-semibold">{cfg.title}</span>
          </div>
          <button
            onClick={onClose}
            aria-label="Close mentor panel"
            className="text-neutral-400 hover:text-neutral-900 focus:outline-none focus-visible:ring-2 focus-visible:ring-neutral-400 rounded-lg"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="mb-3 rounded-lg bg-neutral-50 px-3 py-2">
          <p className="text-xs text-neutral-400">Mission context</p>
          <p className="text-sm font-medium text-neutral-700">
            {mission.title} — {mission.concept}
          </p>
        </div>

        {renderStuckForm()}

        {loading && (
          <Card className="flex items-center gap-3 py-6">
            <Loader2 className="h-5 w-5 animate-spin text-neutral-400" />
            <span className="text-sm text-neutral-500">Your mentor is thinking…</span>
          </Card>
        )}

        {!loading && !showStuckForm && fetched && (
          <Card className="border-neutral-200 bg-neutral-50">
            {renderResponse()}
          </Card>
        )}

        {!loading && !showStuckForm && fetched && (
          <div className="mt-3">
            {renderHintButtons()}
          </div>
        )}

        {!loading && !showStuckForm && !fetched && mode !== 'stuck' && (
          <Card className="py-6 text-center">
            <p className="mb-4 text-sm text-neutral-500">
              {mode === 'explain'
                ? 'Get a beginner-friendly explanation of this concept.'
                : 'Get a hint to guide you without giving away the answer.'}
            </p>
            <Button onClick={() => fetchMentor()} className="w-full">
              Ask my mentor
            </Button>
          </Card>
        )}

        {!loading && !showStuckForm && fetched && (
          <Button variant="ghost" onClick={onClose} className="mt-3 w-full">
            Back to mission
          </Button>
        )}
      </div>
    </div>
  );
}
