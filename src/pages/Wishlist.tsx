import { useState } from 'react';
import { motion } from 'framer-motion';
import { Heart, Plus, Trash2, Edit2, Check, X } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { useWishlist } from '@/contexts/WishlistContext';
import { homestaysData } from '@/data/homestays';
import { useCurrency } from '@/contexts/CurrencyContext';

export default function Wishlist() {
  const { collections, createCollection, renameCollection, deleteCollection, toggleInCollection } = useWishlist();
  const { format } = useCurrency();
  const [newName, setNewName] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState('');

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="pt-28 pb-16">
        <div className="section-container">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-10">
            <span className="text-primary font-medium text-sm uppercase tracking-wider">Saved</span>
            <h1 className="font-display text-4xl md:text-5xl font-bold text-foreground mt-2 mb-4">
              My wishlist collections
            </h1>
            <p className="text-muted-foreground max-w-2xl">Organize the homestays you love into named trips.</p>
          </motion.div>

          {/* New collection */}
          <div className="flex gap-2 mb-8 max-w-md">
            <input
              value={newName}
              onChange={e => setNewName(e.target.value)}
              placeholder="New collection name…"
              className="flex-1 px-3 py-2 bg-card border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary"
            />
            <Button
              onClick={() => { if (newName.trim()) { createCollection(newName.trim()); setNewName(''); } }}
            >
              <Plus className="w-4 h-4 mr-1" /> Create
            </Button>
          </div>

          <div className="space-y-10">
            {collections.map(col => {
              const items = col.homestayIds.map(id => homestaysData[id]).filter(Boolean);
              return (
                <section key={col.id}>
                  <div className="flex items-center justify-between mb-4">
                    {editingId === col.id ? (
                      <div className="flex gap-2 flex-1 max-w-sm">
                        <input
                          value={editName}
                          onChange={e => setEditName(e.target.value)}
                          className="flex-1 px-3 py-1.5 bg-card border border-border rounded-lg text-sm"
                          autoFocus
                        />
                        <button onClick={() => { renameCollection(col.id, editName); setEditingId(null); }} className="p-2 hover:bg-muted rounded">
                          <Check className="w-4 h-4 text-primary" />
                        </button>
                        <button onClick={() => setEditingId(null)} className="p-2 hover:bg-muted rounded">
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    ) : (
                      <h2 className="font-display text-2xl font-bold text-foreground flex items-center gap-2">
                        <Heart className="w-5 h-5 text-primary fill-primary/30" />
                        {col.name}
                        <span className="text-sm font-normal text-muted-foreground">({items.length})</span>
                      </h2>
                    )}
                    {editingId !== col.id && (
                      <div className="flex items-center gap-1">
                        <button onClick={() => { setEditingId(col.id); setEditName(col.name); }} className="p-2 hover:bg-muted rounded text-muted-foreground" aria-label="Rename">
                          <Edit2 className="w-4 h-4" />
                        </button>
                        {col.id !== 'default' && (
                          <button onClick={() => deleteCollection(col.id)} className="p-2 hover:bg-muted rounded text-destructive" aria-label="Delete">
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    )}
                  </div>

                  {items.length === 0 ? (
                    <p className="text-muted-foreground text-sm py-6 text-center bg-muted/30 rounded-xl">
                      No saved homestays yet. Tap the heart icon on any homestay card to add.
                    </p>
                  ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                      {items.map(h => (
                        <Link key={h.id} to={`/homestay/${h.id}`}>
                          <div className="bg-card border border-border rounded-2xl overflow-hidden hover:shadow-soft transition-shadow">
                            <div className="relative aspect-[4/3]">
                              <img src={h.images[0]} alt={h.name} className="w-full h-full object-cover" />
                              <button
                                onClick={(e) => { e.preventDefault(); toggleInCollection(col.id, h.id); }}
                                className="absolute top-2 right-2 p-1.5 rounded-full bg-card/80 hover:bg-card text-destructive"
                                aria-label="Remove"
                              >
                                <X className="w-4 h-4" />
                              </button>
                            </div>
                            <div className="p-3">
                              <p className="font-semibold text-foreground text-sm truncate">{h.name}</p>
                              <p className="text-xs text-muted-foreground truncate">{h.location}</p>
                              <p className="text-sm font-semibold text-primary mt-1">{format(h.pricePerNight)}<span className="text-xs text-muted-foreground font-normal">/night</span></p>
                            </div>
                          </div>
                        </Link>
                      ))}
                    </div>
                  )}
                </section>
              );
            })}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
