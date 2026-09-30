import { Compass, ArrowRight, Lightbulb, Layers, Rocket } from 'lucide-react';
import { Button } from '@/components/Button';
import { navigate } from '@/hooks/useRoute';

const steps = [
  { num: '01', icon: Lightbulb, title: 'Choose an idea' },
  { num: '02', icon: Layers, title: 'Build one step at a time' },
  { num: '03', icon: Rocket, title: 'Ship your first project' },
];

export function LandingPage() {
  return (
    <div className="flex min-h-screen flex-col bg-neutral-50">
      <header className="flex items-center justify-between px-6 pt-6">
        <div className="flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-neutral-900 text-white">
            <Compass className="h-5 w-5" />
          </div>
          <span className="text-sm font-bold tracking-tight">CommitCoach</span>
        </div>
      </header>

      <main className="flex flex-1 flex-col justify-center px-6 py-10">
        <div className="mx-auto w-full max-w-md">
          <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-neutral-200 bg-white px-3 py-1">
            <span className="h-2 w-2 rounded-full bg-emerald-500" />
            <span className="text-xs font-medium text-neutral-500">
              Build your first project
            </span>
          </div>

          <h1 className="text-4xl font-bold leading-[1.1] tracking-tight text-neutral-900">
            Your first project starts here.
          </h1>
          <p className="mt-4 text-lg leading-relaxed text-neutral-500">
            Build it yourself. Learn why it works. See your journey grow.
          </p>

          <div className="mt-8 flex flex-col gap-3">
            <Button onClick={() => navigate('/setup')} className="w-full">
              Start Building
              <ArrowRight className="h-4 w-4" />
            </Button>
            <Button variant="secondary" onClick={() => navigate('/setup')} className="w-full">
              See how it works
            </Button>
          </div>

          <div className="mt-10 space-y-3">
            {steps.map((step) => (
              <div key={step.num} className="flex items-center gap-4 rounded-2xl border border-neutral-200 bg-white p-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-neutral-100">
                  <step.icon className="h-5 w-5 text-neutral-700" />
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-xs font-bold text-neutral-300">{step.num}</span>
                  <span className="text-sm font-semibold text-neutral-900">{step.title}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>

      <footer className="px-6 pb-8 text-center">
        <p className="text-xs text-neutral-400">
          CommitCoach — learn by building, one mission at a time.
        </p>
      </footer>
    </div>
  );
}
