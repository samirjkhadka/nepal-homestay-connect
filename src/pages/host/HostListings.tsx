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
import { Plus, Edit, Trash2, Star, MapPin, Eye, EyeOff } from 'lucide-react';
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

  const save = () => {
    if (!editing) return;
    const exists = data.properties.find(p => p.id === editing.id);
    update('properties', exists
      ? data.properties.map(p => p.id === editing.id ? editing : p)
      : [...data.properties, editing]
    );
    toast({ title: 'Saved', description: editing.name });
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
          {editing && <PropertyEditor property={editing} onChange={setEditing} onSave={save} />}
        </DialogContent>
      </Dialog>
    </div>
  );
}

function PropertyEditor({ property, onChange, onSave }: { property: HostProperty; onChange: (p: HostProperty) => void; onSave: () => void }) {
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
        <div><Label>Cover image URL</Label><Input value={property.coverImage} onChange={e => set({ coverImage: e.target.value })} /></div>
        <div>
          <Label>Gallery URLs (one per line)</Label>
          <Textarea rows={6} value={property.images.join('\n')} onChange={e => set({ images: e.target.value.split('\n').filter(Boolean) })} />
        </div>
        <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
          {property.images.map((u, i) => (
            <div key={i} className="aspect-square rounded overflow-hidden bg-muted">
              <img src={u} alt="" className="w-full h-full object-cover" />
            </div>
          ))}
        </div>
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

      <div className="pt-4 border-t border-border mt-4">
        <Button onClick={onSave} className="w-full">Save Property</Button>
      </div>
    </Tabs>
  );
}
