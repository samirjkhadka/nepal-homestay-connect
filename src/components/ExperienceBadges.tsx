import { badgeMeta, ExperienceBadge } from '@/data/communityMock';
import { cn } from '@/lib/utils';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

interface Props {
  badges: ExperienceBadge[];
  size?: 'sm' | 'md';
  showLabels?: boolean;
  className?: string;
}

// Per-badge themed colored backgrounds (light + dark mode aware).
const toneOverride: Record<ExperienceBadge, string> = {
  'verified-local':
    'bg-primary/15 text-primary border-primary/40 dark:bg-primary/25 dark:text-primary-foreground',
  'organic-meals':
    'bg-secondary/20 text-secondary border-secondary/40 dark:bg-secondary/30 dark:text-secondary-foreground',
  'eco-certified':
    'bg-emerald-500/15 text-emerald-700 border-emerald-500/40 dark:bg-emerald-400/20 dark:text-emerald-200 dark:border-emerald-400/40',
  'female-led':
    'bg-pink-500/15 text-pink-700 border-pink-500/40 dark:bg-pink-400/20 dark:text-pink-200 dark:border-pink-400/40',
  'indigenous-owned':
    'bg-amber-500/15 text-amber-800 border-amber-500/40 dark:bg-amber-400/20 dark:text-amber-200 dark:border-amber-400/40',
  'cultural-heritage':
    'bg-accent/25 text-foreground border-accent/50 dark:bg-accent/30 dark:text-accent-foreground',
};

export function ExperienceBadges({ badges, size = 'sm', showLabels = false, className }: Props) {
  if (!badges?.length) return null;
  return (
    <TooltipProvider delayDuration={150}>
      <div className={cn('flex flex-wrap gap-1.5', className)}>
        {badges.map(b => {
          const meta = badgeMeta[b];
          return (
            <Tooltip key={b}>
              <TooltipTrigger asChild>
                <span
                  className={cn(
                    'inline-flex items-center gap-1 rounded-full border font-medium shadow-sm backdrop-blur-sm transition-transform hover:-translate-y-0.5',
                    toneOverride[b],
                    size === 'sm' ? 'px-2 py-0.5 text-[10px]' : 'px-2.5 py-1 text-xs',
                  )}
                  aria-label={meta.label}
                >
                  <span aria-hidden>{meta.emoji}</span>
                  {showLabels && <span>{meta.label}</span>}
                </span>
              </TooltipTrigger>
              <TooltipContent side="top" className="max-w-[200px] text-xs">
                <p className="font-semibold mb-0.5">{meta.label}</p>
                <p className="text-muted-foreground">{meta.description}</p>
              </TooltipContent>
            </Tooltip>
          );
        })}
      </div>
    </TooltipProvider>
  );
}
