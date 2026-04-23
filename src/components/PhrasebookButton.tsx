import { useState } from 'react';
import { Languages, Volume2, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { phrasebook } from '@/data/communityMock';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';

export function PhrasebookButton() {
  const [open, setOpen] = useState(false);

  const speak = (text: string) => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;
    const u = new SpeechSynthesisUtterance(text);
    u.lang = 'ne-NP';
    window.speechSynthesis.speak(u);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <button
          className="fixed bottom-24 right-6 z-30 bg-secondary text-secondary-foreground rounded-full shadow-elevated p-4 hover:bg-secondary/90 transition-colors"
          aria-label="Open Nepali phrasebook"
        >
          <Languages className="w-5 h-5" />
        </button>
      </DialogTrigger>
      <DialogContent className="max-w-lg max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Languages className="w-5 h-5" /> Learn Nepali — essential phrases
          </DialogTitle>
        </DialogHeader>
        <ul className="divide-y divide-border">
          {phrasebook.map((p, i) => (
            <motion.li
              key={p.english}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.02 }}
              className="py-3 flex items-center justify-between gap-3"
            >
              <div className="flex-1">
                <p className="text-sm text-muted-foreground">{p.english}</p>
                <p className="font-display text-lg text-foreground">{p.nepali}</p>
                <p className="text-xs italic text-muted-foreground">{p.pronunciation}</p>
              </div>
              <button
                onClick={() => speak(p.nepali)}
                className="p-2 rounded-full hover:bg-muted transition-colors text-primary"
                aria-label={`Hear pronunciation of ${p.english}`}
              >
                <Volume2 className="w-5 h-5" />
              </button>
            </motion.li>
          ))}
        </ul>
      </DialogContent>
    </Dialog>
  );
}
