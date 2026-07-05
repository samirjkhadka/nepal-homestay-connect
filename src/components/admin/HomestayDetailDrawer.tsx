import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import {
  MapPin, Star, Users, BedDouble, Bath, Check, X, Power, Edit, ShieldCheck,
} from 'lucide-react';
import { Homestay, HomestayStatus } from '@/data/homestays';
import { AMENITY_OPTIONS } from './HomestayEditor';
import { cn } from '@/lib/utils';

const statusStyle: Record<HomestayStatus, string> = {
  pending: 'bg-amber-500/15 text-amber-600 dark:text-amber-400',
  approved: 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400',
  rejected: 'bg-red-500/15 text-red-600 dark:text-red-400',
};

const amenityLabel = (id: string) => AMENITY_OPTIONS.find(a => a.id === id)?.label ?? id;

interface Props {
  homestay: Homestay | null;
  open: boolean;
  onOpenChange: (v: boolean) => void;
  onApprove: (h: Homestay) => void;
  onReject: (h: Homestay) => void;
  onToggleEnabled: (h: Homestay) => void;
  onEdit: (h: Homestay) => void;
}

export function HomestayDetailDrawer({ homestay, open, onOpenChange, onApprove, onReject, onToggleEnabled, onEdit }: Props) {
  if (!homestay) return null;
  const h = homestay;
  const status = (h.status ?? 'approved') as HomestayStatus;

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-full sm:max-w-lg overflow-y-auto">
        <SheetHeader>
          <SheetTitle>Homestay detail</SheetTitle>
        </SheetHeader>

        <div className="mt-4 space-y-5">
          <div className="grid grid-cols-3 gap-2">
            {h.images.slice(0, 6).map((img, i) => (
              <img key={i} src={img} alt={`${h.name} ${i + 1}`} className={cn('rounded-lg object-cover w-full h-20 bg-muted', i === 0 && 'col-span-3 h-40')} />
            ))}
          </div>

          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h2 className="text-xl font-bold text-foreground">{h.name}</h2>
              <Badge className={statusStyle[status]}>{status}</Badge>
              <Badge variant={h.enabled === false ? 'outline' : 'secondary'}>
                {h.enabled === false ? 'Disabled' : 'Enabled'}
              </Badge>
            </div>
            <p className="text-sm text-muted-foreground flex items-center gap-1 mt-1">
              <MapPin className="w-3.5 h-3.5" />{h.location}, {h.province}
            </p>
            {h.rejectionReason && (
              <p className="text-xs text-destructive mt-2">Rejection reason: {h.rejectionReason}</p>
            )}
          </div>

          <div className="flex items-center gap-4 text-sm">
            <span className="flex items-center gap-1"><Star className="w-4 h-4 fill-accent text-accent" />{h.rating || '—'} ({h.reviews})</span>
            <span className="font-semibold text-foreground">NPR {h.pricePerNight?.toLocaleString()}/night</span>
          </div>

          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <span className="flex items-center gap-1"><Users className="w-4 h-4" />{h.maxGuests} guests</span>
            <span className="flex items-center gap-1"><BedDouble className="w-4 h-4" />{h.bedrooms} bed</span>
            <span className="flex items-center gap-1"><Bath className="w-4 h-4" />{h.bathrooms} bath</span>
          </div>

          <Separator />

          <div>
            <h3 className="text-sm font-semibold mb-1.5 flex items-center gap-1.5"><ShieldCheck className="w-4 h-4 text-primary" />Host</h3>
            <p className="text-sm text-foreground">{h.host?.name} {h.host?.isSuperhost && <Badge className="ml-1 text-[10px] py-0">Superhost</Badge>}</p>
            <p className="text-xs text-muted-foreground mt-1">{h.host?.bio}</p>
          </div>

          {h.description && (
            <div>
              <h3 className="text-sm font-semibold mb-1.5">About</h3>
              <p className="text-sm text-muted-foreground">{h.description}</p>
            </div>
          )}

          {h.amenities?.length > 0 && (
            <div>
              <h3 className="text-sm font-semibold mb-2">Amenities</h3>
              <div className="flex flex-wrap gap-1.5">
                {h.amenities.map(a => <Badge key={a} variant="outline" className="text-xs">{amenityLabel(a)}</Badge>)}
              </div>
            </div>
          )}

          <Separator />

          <div className="flex flex-wrap gap-2 sticky bottom-0 bg-background py-2">
            {status === 'pending' && (
              <>
                <Button size="sm" onClick={() => onApprove(h)}><Check className="w-4 h-4 mr-1" />Approve</Button>
                <Button size="sm" variant="outline" className="text-destructive" onClick={() => onReject(h)}><X className="w-4 h-4 mr-1" />Reject</Button>
              </>
            )}
            <Button size="sm" variant="outline" onClick={() => onToggleEnabled(h)}>
              <Power className="w-4 h-4 mr-1" />{h.enabled === false ? 'Enable' : 'Disable'}
            </Button>
            <Button size="sm" variant="secondary" onClick={() => onEdit(h)}><Edit className="w-4 h-4 mr-1" />Edit</Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
