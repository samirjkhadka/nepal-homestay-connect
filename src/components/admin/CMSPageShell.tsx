import { ReactNode } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';

interface Props {
  title: string;
  description?: string;
  action?: { label: string; onClick: () => void };
  children: ReactNode;
}

export function CMSPageShell({ title, description, action, children }: Props) {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-foreground">{title}</h1>
          {description && <p className="text-muted-foreground text-sm mt-1">{description}</p>}
        </div>
        {action && (
          <Button onClick={action.onClick}>
            <Plus className="w-4 h-4 mr-2" />{action.label}
          </Button>
        )}
      </div>
      <Card className="p-5">{children}</Card>
    </div>
  );
}
