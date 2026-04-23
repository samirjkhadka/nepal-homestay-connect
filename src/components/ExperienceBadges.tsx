import { badgeMeta, ExperienceBadge } from '@/data/communityMock';
import { cn } from '@/lib/utils';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

interface Props {
  badges: ExperienceBadge[];
  size?: 'sm' | 'md';
  showLabels?: boolean;
  className?: string;
}

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
                    'inline-flex items-center gap-1 rounded-full border font-medium',
                    meta.tone,
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
