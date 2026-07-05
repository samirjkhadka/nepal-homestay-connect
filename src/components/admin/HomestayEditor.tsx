import { useEffect, useMemo, useState } from 'react';
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription,
} from '@/components/ui/dialog';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { ArrowUp, ArrowDown, X, Star, Plus, AlertCircle } from 'lucide-react';
import { Homestay } from '@/data/homestays';

export const PROVINCES = [
  'Koshi Province', 'Madhesh Province', 'Bagmati Province', 'Gandaki Province',
  'Lumbini Province', 'Karnali Province', 'Sudurpashchim Province', 'Province 1', 'Province 2',
];

export const HOMESTAY_TYPES = ['Homestay', 'Farmstay', 'Heritage Home', 'Eco Lodge', 'Mountain Retreat'];

export const AMENITY_OPTIONS: { id: string; label: string }[] = [
  { id: 'wifi', label: 'WiFi' },
  { id: 'meals', label: 'Home-cooked Meals' },
  { id: 'breakfast', label: 'Breakfast' },
  { id: 'mountainView', label: 'Mountain View' },
  { id: 'hotWater', label: 'Hot Water' },
  { id: 'heating', label: 'Heating' },
  { id: 'garden', label: 'Garden' },
  { id: 'terrace', label: 'Terrace' },
  { id: 'culturalProgram', label: 'Cultural Program' },
  { id: 'familyFriendly', label: 'Family Friendly' },
  { id: 'parking', label: 'Parking' },
  { id: 'cleaning', label: 'Daily Cleaning' },
];

type FormState = {
  name: string;
  type: string;
  description: string;
  longDescription: string;
  location: string;
  province: string;
  lat: string;
  lng: string;
  hostName: string;
  hostSince: string;
  isSuperhost: boolean;
  languages: string;
  expertise: string;
  hostBio: string;
  pricePerNight: string;
  maxGuests: string;
  bedrooms: string;
  bathrooms: string;
  amenities: string[];
  images: string[];
};

const emptyForm: FormState = {
  name: '', type: 'Homestay', description: '', longDescription: '',
  location: '', province: '', lat: '', lng: '',
  hostName: '', hostSince: '', isSuperhost: false, languages: '', expertise: '', hostBio: '',
  pricePerNight: '', maxGuests: '', bedrooms: '', bathrooms: '',
  amenities: [], images: [],
};

const toForm = (h: Homestay): FormState => ({
  name: h.name, type: h.type || 'Homestay', description: h.description, longDescription: h.longDescription,
  location: h.location, province: h.province,
  lat: String(h.coordinates?.lat ?? ''), lng: String(h.coordinates?.lng ?? ''),
  hostName: h.host?.name ?? '', hostSince: h.host?.since ?? '', isSuperhost: !!h.host?.isSuperhost,
  languages: (h.host?.languages ?? []).join(', '), expertise: (h.host?.expertise ?? []).join(', '),
  hostBio: h.host?.bio ?? '',
  pricePerNight: String(h.pricePerNight ?? ''), maxGuests: String(h.maxGuests ?? ''),
  bedrooms: String(h.bedrooms ?? ''), bathrooms: String(h.bathrooms ?? ''),
  amenities: h.amenities ?? [], images: h.images ?? [],
});

interface Props {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  initial: Homestay | null;
  onSave: (data: Partial<Homestay>) => void;
}

export function HomestayEditor({ open, onOpenChange, initial, onSave }: Props) {
  const [form, setForm] = useState<FormState>(emptyForm);
  const [tab, setTab] = useState('basics');
  const [newImage, setNewImage] = useState('');
  const [touched, setTouched] = useState(false);

  useEffect(() => {
    if (open) {
      setForm(initial ? toForm(initial) : emptyForm);
      setTab('basics');
      setTouched(false);
      setNewImage('');
    }
  }, [open, initial]);

  const set = (patch: Partial<FormState>) => setForm(f => ({ ...f, ...patch }));

  const errors = useMemo(() => {
    const e: Record<string, string> = {};
    if (!form.name.trim()) e.name = 'Name is required';
    if (!form.location.trim()) e.location = 'Location is required';
    if (!form.province) e.province = 'Province is required';
    if (!(Number(form.pricePerNight) > 0)) e.pricePerNight = 'Price must be greater than 0';
    if (!(Number(form.maxGuests) >= 1)) e.maxGuests = 'At least 1 guest';
    if (form.images.length === 0) e.images = 'Add at least one photo';
    return e;
  }, [form]);

  const isValid = Object.keys(errors).length === 0;

  const tabErrors: Record<string, boolean> = {
    basics: !!errors.name,
    location: !!errors.location || !!errors.province,
    pricing: !!errors.pricePerNight || !!errors.maxGuests,
    photos: !!errors.images,
  };

  const addImage = () => {
    const url = newImage.trim();
    if (!url) return;
    set({ images: [...form.images, url] });
    setNewImage('');
  };

  const moveImage = (i: number, dir: -1 | 1) => {
    const j = i + dir;
    if (j < 0 || j >= form.images.length) return;
    const next = [...form.images];
    [next[i], next[j]] = [next[j], next[i]];
    set({ images: next });
  };

  const removeImage = (i: number) => set({ images: form.images.filter((_, idx) => idx !== i) });

  const setCover = (i: number) => {
    if (i === 0) return;
    const next = [...form.images];
    const [img] = next.splice(i, 1);
    next.unshift(img);
    set({ images: next });
  };

  const toggleAmenity = (id: string) =>
    set({ amenities: form.amenities.includes(id) ? form.amenities.filter(a => a !== id) : [...form.amenities, id] });

  const handleSave = () => {
    setTouched(true);
    if (!isValid) return;
    const data: Partial<Homestay> = {
      name: form.name.trim(),
      type: form.type,
      description: form.description.trim(),
      longDescription: form.longDescription.trim(),
      location: form.location.trim(),
      province: form.province,
      coordinates: { lat: Number(form.lat) || 0, lng: Number(form.lng) || 0 },
      host: {
        name: form.hostName.trim(),
        since: form.hostSince.trim(),
        isSuperhost: form.isSuperhost,
        responseRate: initial?.host?.responseRate ?? 95,
        responseTime: initial?.host?.responseTime ?? 'within a day',
        bio: form.hostBio.trim(),
        languages: form.languages.split(',').map(s => s.trim()).filter(Boolean),
        expertise: form.expertise.split(',').map(s => s.trim()).filter(Boolean),
      },
      pricePerNight: Number(form.pricePerNight),
      maxGuests: Number(form.maxGuests),
      bedrooms: Number(form.bedrooms) || 0,
      bathrooms: Number(form.bathrooms) || 0,
      amenities: form.amenities,
      images: form.images,
    };
    onSave(data);
    onOpenChange(false);
  };

  const showErr = (key: string) => touched && errors[key];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle>{initial ? 'Edit homestay' : 'Add homestay'}</DialogTitle>
          <DialogDescription>
            {initial ? 'Update the details of this listing.' : 'New listings start as pending until approved.'}
          </DialogDescription>
        </DialogHeader>

        <Tabs value={tab} onValueChange={setTab} className="flex-1 overflow-hidden flex flex-col">
          <TabsList className="grid grid-cols-6 w-full">
            {[
              { v: 'basics', l: 'Basics' },
              { v: 'location', l: 'Location' },
              { v: 'host', l: 'Host' },
              { v: 'pricing', l: 'Pricing' },
              { v: 'amenities', l: 'Amenities' },
              { v: 'photos', l: 'Photos' },
            ].map(t => (
              <TabsTrigger key={t.v} value={t.v} className="relative text-xs">
                {t.l}
                {tabErrors[t.v] && touched && (
                  <span className="absolute -top-1 -right-0.5 w-2 h-2 rounded-full bg-destructive" />
                )}
              </TabsTrigger>
            ))}
          </TabsList>

          <div className="overflow-y-auto flex-1 py-4 pr-1">
            <TabsContent value="basics" className="space-y-4 mt-0">
              <Field label="Name" error={showErr('name')}>
                <Input value={form.name} onChange={e => set({ name: e.target.value })} placeholder="Mountain View Retreat" />
              </Field>
              <Field label="Type">
                <Select value={form.type} onValueChange={v => set({ type: v })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {HOMESTAY_TYPES.map(t => <SelectItem key={t} value={t}>{t}</SelectItem>)}
                  </SelectContent>
                </Select>
              </Field>
              <Field label="Short description">
                <Textarea value={form.description} onChange={e => set({ description: e.target.value })} rows={2} placeholder="A stunning traditional homestay..." />
              </Field>
              <Field label="Full description">
                <Textarea value={form.longDescription} onChange={e => set({ longDescription: e.target.value })} rows={5} />
              </Field>
            </TabsContent>

            <TabsContent value="location" className="space-y-4 mt-0">
              <Field label="Location / town" error={showErr('location')}>
                <Input value={form.location} onChange={e => set({ location: e.target.value })} placeholder="Sarangkot" />
              </Field>
              <Field label="Province" error={showErr('province')}>
                <Select value={form.province} onValueChange={v => set({ province: v })}>
                  <SelectTrigger><SelectValue placeholder="Select province" /></SelectTrigger>
                  <SelectContent>
                    {PROVINCES.map(p => <SelectItem key={p} value={p}>{p}</SelectItem>)}
                  </SelectContent>
                </Select>
              </Field>
              <div className="grid grid-cols-2 gap-3">
                <Field label="Latitude">
                  <Input value={form.lat} onChange={e => set({ lat: e.target.value })} placeholder="28.2436" />
                </Field>
                <Field label="Longitude">
                  <Input value={form.lng} onChange={e => set({ lng: e.target.value })} placeholder="83.9456" />
                </Field>
              </div>
            </TabsContent>

            <TabsContent value="host" className="space-y-4 mt-0">
              <div className="grid grid-cols-2 gap-3">
                <Field label="Host name">
                  <Input value={form.hostName} onChange={e => set({ hostName: e.target.value })} />
                </Field>
                <Field label="Hosting since">
                  <Input value={form.hostSince} onChange={e => set({ hostSince: e.target.value })} placeholder="2015" />
                </Field>
              </div>
              <div className="flex items-center justify-between rounded-lg border border-border p-3">
                <div>
                  <Label>Superhost</Label>
                  <p className="text-xs text-muted-foreground">Highlight as a top-rated host.</p>
                </div>
                <Switch checked={form.isSuperhost} onCheckedChange={v => set({ isSuperhost: v })} />
              </div>
              <Field label="Languages (comma separated)">
                <Input value={form.languages} onChange={e => set({ languages: e.target.value })} placeholder="Nepali, English, Hindi" />
              </Field>
              <Field label="Expertise (comma separated)">
                <Input value={form.expertise} onChange={e => set({ expertise: e.target.value })} placeholder="Trekking Guide, Cultural Expert" />
              </Field>
              <Field label="Host bio">
                <Textarea value={form.hostBio} onChange={e => set({ hostBio: e.target.value })} rows={4} />
              </Field>
            </TabsContent>

            <TabsContent value="pricing" className="space-y-4 mt-0">
              <div className="grid grid-cols-2 gap-3">
                <Field label="Price per night (NPR)" error={showErr('pricePerNight')}>
                  <Input type="number" value={form.pricePerNight} onChange={e => set({ pricePerNight: e.target.value })} />
                </Field>
                <Field label="Max guests" error={showErr('maxGuests')}>
                  <Input type="number" value={form.maxGuests} onChange={e => set({ maxGuests: e.target.value })} />
                </Field>
                <Field label="Bedrooms">
                  <Input type="number" value={form.bedrooms} onChange={e => set({ bedrooms: e.target.value })} />
                </Field>
                <Field label="Bathrooms">
                  <Input type="number" value={form.bathrooms} onChange={e => set({ bathrooms: e.target.value })} />
                </Field>
              </div>
            </TabsContent>

            <TabsContent value="amenities" className="mt-0">
              <div className="flex flex-wrap gap-2">
                {AMENITY_OPTIONS.map(a => {
                  const active = form.amenities.includes(a.id);
                  return (
                    <button
                      key={a.id}
                      type="button"
                      onClick={() => toggleAmenity(a.id)}
                      className={cn(
                        'px-3 py-1.5 rounded-full text-sm border transition-colors',
                        active ? 'bg-primary text-primary-foreground border-primary' : 'bg-background border-border hover:border-primary/50',
                      )}
                    >
                      {a.label}
                    </button>
                  );
                })}
              </div>
            </TabsContent>

            <TabsContent value="photos" className="space-y-4 mt-0">
              <div className="flex gap-2">
                <Input
                  value={newImage}
                  onChange={e => setNewImage(e.target.value)}
                  onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); addImage(); } }}
                  placeholder="Paste image URL..."
                />
                <Button type="button" variant="secondary" onClick={addImage}><Plus className="w-4 h-4" /></Button>
              </div>
              {showErr('images') && <p className="text-xs text-destructive flex items-center gap-1"><AlertCircle className="w-3 h-3" />{errors.images}</p>}
              <div className="space-y-2">
                {form.images.map((u, i) => (
                  <div key={`${u}-${i}`} className="flex items-center gap-3 p-2 rounded-lg border border-border">
                    <img src={u} alt={`Photo ${i + 1}`} className="w-16 h-12 rounded object-cover bg-muted" />
                    <div className="flex-1 min-w-0">
                      <p className="text-xs truncate text-muted-foreground">{u}</p>
                      {i === 0 && <Badge className="mt-1 text-[10px] py-0"><Star className="w-3 h-3 mr-1" />Cover</Badge>}
                    </div>
                    <div className="flex items-center gap-1">
                      {i !== 0 && (
                        <Button type="button" size="icon" variant="ghost" className="h-7 w-7" title="Set as cover" onClick={() => setCover(i)}>
                          <Star className="w-4 h-4" />
                        </Button>
                      )}
                      <Button type="button" size="icon" variant="ghost" className="h-7 w-7" onClick={() => moveImage(i, -1)} disabled={i === 0}>
                        <ArrowUp className="w-4 h-4" />
                      </Button>
                      <Button type="button" size="icon" variant="ghost" className="h-7 w-7" onClick={() => moveImage(i, 1)} disabled={i === form.images.length - 1}>
                        <ArrowDown className="w-4 h-4" />
                      </Button>
                      <Button type="button" size="icon" variant="ghost" className="h-7 w-7 text-destructive" onClick={() => removeImage(i)}>
                        <X className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                ))}
                {form.images.length === 0 && (
                  <p className="text-sm text-muted-foreground text-center py-6">No photos yet. The first image becomes the cover.</p>
                )}
              </div>
            </TabsContent>
          </div>
        </Tabs>

        <DialogFooter className="border-t border-border pt-3">
          {touched && !isValid && (
            <p className="text-xs text-destructive mr-auto flex items-center gap-1">
              <AlertCircle className="w-3 h-3" /> Please fix the highlighted fields.
            </p>
          )}
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button onClick={handleSave}>{initial ? 'Save changes' : 'Create homestay'}</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function Field({ label, error, children }: { label: string; error?: string | false; children: React.ReactNode }) {
  return (
    <div className="space-y-1.5">
      <Label className="text-sm">{label}</Label>
      {children}
      {error && <p className="text-xs text-destructive flex items-center gap-1"><AlertCircle className="w-3 h-3" />{error}</p>}
    </div>
  );
}
