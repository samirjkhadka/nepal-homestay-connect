import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useHostData, HostProperty } from '@/contexts/HostDataContext';
import { Plus, Edit, Trash2, Star, MapPin, Eye, EyeOff, ArrowUp, ArrowDown, X as XIcon, ImageIcon, AlertCircle } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

const AMENITIES = ['WiFi', 'Hot Water', 'Breakfast', 'Mountain View', 'Parking', 'Heater', 'Laundry', 'Bonfire', 'Yoga Mat', 'Pet Friendly'];
const BADGES = ['Eco-certified', 'Female-led', 'Family-run', 'Cultural Heritage', 'Adventure Hub', 'Wellness Retreat'];
const TYPES = ['Traditional', 'Heritage', 'Eco', 'Farm Stay', 'Lodge', 'Cottage'];

const uid = () => `hp-${Math.random().toString(36).slice(2, 8)}`;
const empty = (): HostProperty => ({
  id: uid(), name: 'New Property', location: '', province: 'Bagmati Province', type: 'Traditional',
  description: '', pricePerNight: 2000, weekendUplift: 300, cleaningFee: 200,
  maxGuests: 2, bedrooms: 1, bathrooms: 1, amenities: [], badges: [],
  images: ['/placeholder.svg'], coverImage: '/placeholder.svg',
  rules: { checkIn: '14:00', checkOut: '11:00', houseRules: '' },
  published: false, createdAt: new Date().toISOString().slice(0, 10),
});

export default function HostListings() {
  const { data, update } = useHostData();
  const [editing, setEditing] = useState<HostProperty | null>(null);

  const remove = (id: string) => {
    update('properties', data.properties.filter(p => p.id !== id));
    toast({ title: 'Property deleted' });
  };

  const togglePublish = (id: string) => {
    update('properties', data.properties.map(p => p.id === id ? { ...p, published: !p.published } : p));
  };

  const validate = (p: HostProperty, requirePublishReady = false): string[] => {
    const errors: string[] = [];
    if (!p.name.trim()) errors.push('Name is required');
    if (!p.location.trim()) errors.push('Location is required');
    if (!p.province.trim()) errors.push('Province is required');
    if (!p.description.trim() || p.description.trim().length < 20) errors.push('Description must be at least 20 characters');
    if (!p.pricePerNight || p.pricePerNight <= 0) errors.push('Price per night must be greater than 0');
    if (!p.maxGuests || p.maxGuests < 1) errors.push('Max guests must be at least 1');
    if (!p.bedrooms || p.bedrooms < 1) errors.push('At least 1 bedroom required');
    if (!p.coverImage.trim()) errors.push('Cover image is required');
    if (requirePublishReady) {
      if (p.images.length < 1) errors.push('Add at least 1 gallery image to publish');
      if (p.amenities.length === 0) errors.push('Select at least one amenity to publish');
    }
    return errors;
  };

  const save = (publish?: boolean) => {
    if (!editing) return;
    const errors = validate(editing, publish === true);
    if (errors.length) {
      toast({ title: 'Please fix the following', description: errors.join(' • '), variant: 'destructive' as any });
      return;
    }
    const next = publish === undefined ? editing : { ...editing, published: publish };
    const exists = data.properties.find(p => p.id === next.id);
    update('properties', exists
      ? data.properties.map(p => p.id === next.id ? next : p)
      : [...data.properties, next]
    );
    toast({ title: publish === false ? 'Saved as draft' : publish === true ? 'Published' : 'Saved', description: next.name });
    setEditing(null);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">My Listings</h1>
          <p className="text-muted-foreground text-sm mt-1">{data.properties.length} properties</p>
        </div>
        <Button onClick={() => setEditing(empty())}><Plus className="w-4 h-4 mr-2" />Add Property</Button>
      </div>

      <div className="grid gap-4">
        {data.properties.map(p => (
          <Card key={p.id} className="p-4 flex flex-col sm:flex-row gap-4">
            <div className="w-full sm:w-32 h-28 rounded-lg overflow-hidden shrink-0 bg-muted">
              <img src={p.coverImage} alt={p.name} className="w-full h-full object-cover" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <h3 className="font-semibold text-foreground">{p.name}</h3>
                  <p className="text-sm text-muted-foreground flex items-center gap-1">
                    <MapPin className="w-3 h-3" />{p.location}, {p.province}
                  </p>
                </div>
                <span className={`text-xs px-2 py-1 rounded-full ${p.published ? 'bg-green-100 text-green-700' : 'bg-muted text-muted-foreground'}`}>
                  {p.published ? 'Published' : 'Draft'}
                </span>
              </div>
              <p className="text-sm text-muted-foreground line-clamp-2 mt-1">{p.description}</p>
              <div className="flex items-center justify-between mt-3 gap-2 flex-wrap">
                <p className="text-sm font-semibold text-foreground">NPR {p.pricePerNight.toLocaleString()}/night</p>
                <div className="flex gap-1">
                  <Button size="sm" variant="ghost" onClick={() => togglePublish(p.id)}>
                    {p.published ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </Button>
                  <Button size="sm" variant="ghost" onClick={() => setEditing(p)}><Edit className="w-4 h-4" /></Button>
                  <Button size="sm" variant="ghost" className="text-destructive" onClick={() => remove(p.id)}><Trash2 className="w-4 h-4" /></Button>
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>

      <Dialog open={!!editing} onOpenChange={(o) => !o && setEditing(null)}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader><DialogTitle>{editing && data.properties.find(p => p.id === editing.id) ? 'Edit' : 'New'} Property</DialogTitle></DialogHeader>
          {editing && <PropertyEditor property={editing} onChange={setEditing} onSaveDraft={() => save(false)} onPublish={() => save(true)} />}
        </DialogContent>
      </Dialog>
    </div>
  );
}

function PropertyEditor({ property, onChange, onSaveDraft, onPublish }: { property: HostProperty; onChange: (p: HostProperty) => void; onSaveDraft: () => void; onPublish: () => void }) {
  const set = (patch: Partial<HostProperty>) => onChange({ ...property, ...patch });
  const setRules = (patch: Partial<HostProperty['rules']>) => onChange({ ...property, rules: { ...property.rules, ...patch } });

  const toggleArr = (field: 'amenities' | 'badges', val: string) => {
    const arr = property[field];
    set({ [field]: arr.includes(val) ? arr.filter(x => x !== val) : [...arr, val] } as any);
  };

  return (
    <Tabs defaultValue="basics" className="mt-2">
      <TabsList className="grid grid-cols-5 w-full">
        <TabsTrigger value="basics">Basics</TabsTrigger>
        <TabsTrigger value="photos">Photos</TabsTrigger>
        <TabsTrigger value="amenities">Amenities</TabsTrigger>
        <TabsTrigger value="pricing">Pricing</TabsTrigger>
        <TabsTrigger value="rules">Rules</TabsTrigger>
      </TabsList>

      <TabsContent value="basics" className="space-y-3 pt-4">
        <div className="grid sm:grid-cols-2 gap-3">
          <div><Label>Name</Label><Input value={property.name} onChange={e => set({ name: e.target.value })} /></div>
          <div><Label>Type</Label>
            <select value={property.type} onChange={e => set({ type: e.target.value })} className="w-full h-10 px-3 rounded-md border border-input bg-background text-sm">
              {TYPES.map(t => <option key={t}>{t}</option>)}
            </select>
          </div>
          <div><Label>Location</Label><Input value={property.location} onChange={e => set({ location: e.target.value })} /></div>
          <div><Label>Province</Label><Input value={property.province} onChange={e => set({ province: e.target.value })} /></div>
          <div><Label>Max guests</Label><Input type="number" value={property.maxGuests} onChange={e => set({ maxGuests: +e.target.value })} /></div>
          <div><Label>Bedrooms</Label><Input type="number" value={property.bedrooms} onChange={e => set({ bedrooms: +e.target.value })} /></div>
        </div>
        <div><Label>Description</Label><Textarea rows={4} value={property.description} onChange={e => set({ description: e.target.value })} /></div>
      </TabsContent>

      <TabsContent value="photos" className="space-y-3 pt-4">
        <div>
          <Label>Cover image URL <span className="text-destructive">*</span></Label>
          <Input value={property.coverImage} onChange={e => set({ coverImage: e.target.value })} />
        </div>
        <div className="flex items-center justify-between">
          <Label>Gallery images ({property.images.length})</Label>
          <Button type="button" size="sm" variant="outline" onClick={() => {
            const url = window.prompt('Image URL:', '/placeholder.svg');
            if (url && url.trim()) set({ images: [...property.images, url.trim()] });
          }}><Plus className="w-3 h-3 mr-1" />Add image</Button>
        </div>
        {property.images.length === 0 && (
          <div className="rounded-lg border border-dashed border-border p-6 text-center text-sm text-muted-foreground">
            <ImageIcon className="w-6 h-6 mx-auto mb-2 opacity-50" />
            No gallery images yet. Add at least one before publishing.
          </div>
        )}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {property.images.map((u, i) => {
            const move = (dir: -1 | 1) => {
              const j = i + dir;
              if (j < 0 || j >= property.images.length) return;
              const next = [...property.images];
              [next[i], next[j]] = [next[j], next[i]];
              set({ images: next });
            };
            const remove = () => set({ images: property.images.filter((_, k) => k !== i) });
            const setAsCover = () => set({ coverImage: u });
            return (
              <div key={`${u}-${i}`} className="relative group rounded-lg overflow-hidden bg-muted border border-border">
                <div className="aspect-square">
                  <img src={u} alt={`Gallery ${i + 1}`} className="w-full h-full object-cover" />
                </div>
                <div className="absolute top-1 left-1 px-1.5 py-0.5 rounded bg-background/80 text-xs font-medium">
                  {i + 1}{property.coverImage === u && ' · cover'}
                </div>
                <div className="absolute inset-x-0 bottom-0 p-1.5 flex items-center justify-between gap-1 bg-gradient-to-t from-black/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
                  <div className="flex gap-1">
                    <Button type="button" size="icon" variant="secondary" className="h-7 w-7" disabled={i === 0} onClick={() => move(-1)}>
                      <ArrowUp className="w-3 h-3" />
                    </Button>
                    <Button type="button" size="icon" variant="secondary" className="h-7 w-7" disabled={i === property.images.length - 1} onClick={() => move(1)}>
                      <ArrowDown className="w-3 h-3" />
                    </Button>
                  </div>
                  <div className="flex gap-1">
                    <Button type="button" size="sm" variant="secondary" className="h-7 text-xs" onClick={setAsCover}>Cover</Button>
                    <Button type="button" size="icon" variant="destructive" className="h-7 w-7" onClick={remove}>
                      <XIcon className="w-3 h-3" />
                    </Button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
        <p className="text-xs text-muted-foreground">Use ↑/↓ to reorder. The first image is shown first in the listing gallery.</p>
      </TabsContent>

      <TabsContent value="amenities" className="space-y-4 pt-4">
        <div>
          <Label className="block mb-2">Amenities</Label>
          <div className="flex flex-wrap gap-2">
            {AMENITIES.map(a => (
              <button key={a} type="button" onClick={() => toggleArr('amenities', a)}
                className={`px-3 py-1.5 rounded-full text-sm border ${property.amenities.includes(a) ? 'bg-primary text-primary-foreground border-primary' : 'border-border'}`}
              >{a}</button>
            ))}
          </div>
        </div>
        <div>
          <Label className="block mb-2">Experience badges</Label>
          <div className="flex flex-wrap gap-2">
            {BADGES.map(a => (
              <button key={a} type="button" onClick={() => toggleArr('badges', a)}
                className={`px-3 py-1.5 rounded-full text-sm border ${property.badges.includes(a) ? 'bg-accent text-accent-foreground border-accent' : 'border-border'}`}
              >{a}</button>
            ))}
          </div>
        </div>
      </TabsContent>

      <TabsContent value="pricing" className="space-y-3 pt-4">
        <div className="grid sm:grid-cols-3 gap-3">
          <div><Label>Per night (NPR)</Label><Input type="number" value={property.pricePerNight} onChange={e => set({ pricePerNight: +e.target.value })} /></div>
          <div><Label>Weekend uplift</Label><Input type="number" value={property.weekendUplift} onChange={e => set({ weekendUplift: +e.target.value })} /></div>
          <div><Label>Cleaning fee</Label><Input type="number" value={property.cleaningFee} onChange={e => set({ cleaningFee: +e.target.value })} /></div>
        </div>
      </TabsContent>

      <TabsContent value="rules" className="space-y-3 pt-4">
        <div className="grid sm:grid-cols-2 gap-3">
          <div><Label>Check-in</Label><Input value={property.rules.checkIn} onChange={e => setRules({ checkIn: e.target.value })} /></div>
          <div><Label>Check-out</Label><Input value={property.rules.checkOut} onChange={e => setRules({ checkOut: e.target.value })} /></div>
        </div>
        <div><Label>House rules</Label><Textarea rows={4} value={property.rules.houseRules} onChange={e => setRules({ houseRules: e.target.value })} /></div>
        <div className="flex items-center justify-between pt-3 border-t border-border">
          <Label>Published</Label>
          <Switch checked={property.published} onCheckedChange={(v) => set({ published: v })} />
        </div>
      </TabsContent>

      <div className="pt-4 border-t border-border mt-4 flex flex-col sm:flex-row gap-2">
        <Button variant="outline" onClick={onSaveDraft} className="flex-1">Save as Draft</Button>
        <Button onClick={onPublish} className="flex-1">{property.published ? 'Update & Publish' : 'Publish Property'}</Button>
      </div>
    </Tabs>
  );
}
