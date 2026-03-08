import { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, Plus, Edit, Trash2, Eye, MapPin, Star, MoreVertical } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { getAllHomestays } from '@/data/homestays';

export default function AdminHomestays() {
  const homestays = getAllHomestays();
  const [search, setSearch] = useState('');
  const filtered = homestays.filter(h =>
    h.name.toLowerCase().includes(search.toLowerCase()) || h.location.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Manage Homestays</h1>
          <p className="text-muted-foreground text-sm mt-1">{homestays.length} homestays listed</p>
        </div>
        <Button>
          <Plus className="w-4 h-4 mr-2" />
          Add Homestay
        </Button>
      </div>

      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input placeholder="Search homestays..." value={search} onChange={e => setSearch(e.target.value)} className="pl-9" />
      </div>

      <div className="grid gap-4">
        {filtered.map((h, i) => (
          <motion.div key={h.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
            <Card className="p-4 flex flex-col sm:flex-row items-start sm:items-center gap-4 hover:shadow-md transition-shadow">
              <div className="w-20 h-16 rounded-lg overflow-hidden shrink-0">
                <img src={h.images[0]} alt={h.name} className="w-full h-full object-cover" />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-foreground">{h.name}</h3>
                <p className="text-sm text-muted-foreground flex items-center gap-1">
                  <MapPin className="w-3 h-3" />{h.location}, {h.province}
                </p>
              </div>
              <div className="flex items-center gap-1 text-sm">
                <Star className="w-4 h-4 fill-accent text-accent" />
                <span className="font-medium">{h.rating}</span>
                <span className="text-muted-foreground">({h.reviews})</span>
              </div>
              <div className="text-sm font-semibold text-foreground">NPR {h.pricePerNight.toLocaleString()}/night</div>
              <div className="flex items-center gap-2">
                <Button variant="ghost" size="icon"><Eye className="w-4 h-4" /></Button>
                <Button variant="ghost" size="icon"><Edit className="w-4 h-4" /></Button>
                <Button variant="ghost" size="icon" className="text-destructive"><Trash2 className="w-4 h-4" /></Button>
              </div>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
