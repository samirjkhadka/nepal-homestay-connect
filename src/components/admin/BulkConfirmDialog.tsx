import { useState, ReactNode } from 'react';
import {
  Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogDescription,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Check, X, AlertTriangle, Loader2 } from 'lucide-react';

export interface BulkTarget {
  id: string;
  label: string;
}

export interface BulkItemResult {
  id: string;
  label: string;
  ok: boolean;
  message: string;
}

interface BulkConfirmDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description?: ReactNode;
  confirmLabel?: string;
  destructive?: boolean;
  targets: BulkTarget[];
  requireReason?: boolean;
  reasonLabel?: string;
  /** Runs the action for a single target, returning a per-item result. */
  onConfirmItem: (target: BulkTarget, reason: string) => BulkItemResult;
  /** Called once after all items processed (e.g. to log an audit summary). */
  onComplete?: (results: BulkItemResult[], reason: string) => void;
}

export function BulkConfirmDialog({
  open, onOpenChange, title, description, confirmLabel = 'Confirm',
  destructive, targets, requireReason, reasonLabel = 'Reason',
  onConfirmItem, onComplete,
}: BulkConfirmDialogProps) {
  const [reason, setReason] = useState('');
  const [phase, setPhase] = useState<'confirm' | 'running' | 'done'>('confirm');
  const [results, setResults] = useState<BulkItemResult[]>([]);

  const reset = () => { setReason(''); setPhase('confirm'); setResults([]); };
  const close = () => { onOpenChange(false); setTimeout(reset, 150); };

  const run = () => {
    if (requireReason && !reason.trim()) return;
    setPhase('running');
    const out = targets.map(t => onConfirmItem(t, reason.trim()));
    setResults(out);
    setPhase('done');
    onComplete?.(out, reason.trim());
  };

  const okCount = results.filter(r => r.ok).length;
  const failCount = results.length - okCount;

  return (
    <Dialog open={open} onOpenChange={(o) => { if (!o) close(); }}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            {destructive && <AlertTriangle className="w-5 h-5 text-destructive" />}
            {phase === 'done' ? 'Results' : title}
          </DialogTitle>
          {description && phase === 'confirm' && <DialogDescription>{description}</DialogDescription>}
        </DialogHeader>

        {phase !== 'done' && (
          <div className="space-y-3">
            <p className="text-sm text-muted-foreground">
              {targets.length} item{targets.length === 1 ? '' : 's'} will be affected:
            </p>
            <ScrollArea className="max-h-40 rounded-md border border-border p-2">
              <ul className="space-y-1 text-sm">
                {targets.map(t => (
                  <li key={t.id} className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-muted-foreground/50" />{t.label}
                  </li>
                ))}
              </ul>
            </ScrollArea>
            {requireReason && (
              <div>
                <Label className="text-xs">{reasonLabel}</Label>
                <Textarea value={reason} onChange={e => setReason(e.target.value)} placeholder="Provide a reason…" rows={3} />
              </div>
            )}
          </div>
        )}

        {phase === 'done' && (
          <div className="space-y-3">
            <div className="flex items-center gap-4 text-sm">
              <span className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400"><Check className="w-4 h-4" />{okCount} succeeded</span>
              {failCount > 0 && <span className="flex items-center gap-1 text-destructive"><X className="w-4 h-4" />{failCount} skipped</span>}
            </div>
            <ScrollArea className="max-h-56 rounded-md border border-border p-2">
              <ul className="space-y-1.5 text-sm">
                {results.map(r => (
                  <li key={r.id} className="flex items-start gap-2">
                    {r.ok
                      ? <Check className="w-4 h-4 text-emerald-500 mt-0.5 shrink-0" />
                      : <X className="w-4 h-4 text-destructive mt-0.5 shrink-0" />}
                    <span><span className="font-medium">{r.label}</span> — <span className="text-muted-foreground">{r.message}</span></span>
                  </li>
                ))}
              </ul>
            </ScrollArea>
          </div>
        )}

        <DialogFooter>
          {phase === 'confirm' && (
            <>
              <Button variant="outline" onClick={close}>Cancel</Button>
              <Button variant={destructive ? 'destructive' : 'default'} onClick={run} disabled={requireReason && !reason.trim()}>
                {confirmLabel}
              </Button>
            </>
          )}
          {phase === 'running' && <Button disabled><Loader2 className="w-4 h-4 mr-2 animate-spin" />Processing…</Button>}
          {phase === 'done' && <Button onClick={close}>Done</Button>}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
