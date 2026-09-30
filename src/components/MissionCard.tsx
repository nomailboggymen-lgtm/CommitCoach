import { CheckCircle, Circle, Lock, ChevronRight } from 'lucide-react';
import type { Mission } from '@/types';
import { Card } from '@/components/Card';

interface MissionCardProps {
  mission: Mission;
  onClick: () => void;
}

const statusConfig = {
  completed: { icon: CheckCircle, iconClass: 'text-emerald-600', label: 'Completed', labelClass: 'text-emerald-600' },
  active: { icon: Circle, iconClass: 'text-neutral-900', label: 'Continue', labelClass: 'text-neutral-900' },
  locked: { icon: Lock, iconClass: 'text-neutral-300', label: 'Locked', labelClass: 'text-neutral-400' },
} as const;

export function MissionCard({ mission, onClick }: MissionCardProps) {
  const cfg = statusConfig[mission.status];

  return (
    <Card onClick={onClick} className={`flex items-center gap-4 ${mission.status === 'active' ? 'border-neutral-900 ring-1 ring-neutral-900/5' : ''}`}>
      <div className="shrink-0">
        <cfg.icon className={`h-6 w-6 ${cfg.iconClass} ${mission.status === 'completed' ? 'animate-checkmark' : ''}`} />
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-xs font-medium text-neutral-400">
          Mission {mission.order}
        </p>
        <h3 className={`truncate text-sm font-semibold ${mission.status === 'locked' ? 'text-neutral-400' : 'text-neutral-900'}`}>
          {mission.title}
        </h3>
        <p className={`mt-0.5 text-xs font-medium ${cfg.labelClass}`}>
          {mission.status === 'completed' ? '✓ Completed' : mission.status === 'active' ? '● Continue' : '🔒 Locked'}
        </p>
      </div>
      {mission.status !== 'locked' && <ChevronRight className="h-5 w-5 shrink-0 text-neutral-300" />}
    </Card>
  );
}
