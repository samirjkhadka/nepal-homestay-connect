import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle, X, Send } from 'lucide-react';
import { toast } from 'sonner';

export function WhatsAppWidget() {
  const [open, setOpen] = useState(false);
  const [msg, setMsg] = useState('');

  const send = () => {
    if (!msg.trim()) return;
    toast.success('Message sent! The host will reply soon.');
    setMsg('');
    setOpen(false);
  };

  return (
    <>
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setOpen(true)}
        className="fixed bottom-6 left-6 z-30 bg-emerald-600 text-white rounded-full shadow-elevated p-4 hover:bg-emerald-700 transition-colors"
        aria-label="Chat with a host"
      >
        <MessageCircle className="w-5 h-5" />
      </motion.button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="fixed bottom-24 left-6 z-40 w-80 bg-card border border-border rounded-2xl shadow-elevated overflow-hidden"
          >
            <div className="bg-emerald-600 text-white p-4 flex items-center justify-between">
              <div>
                <p className="font-semibold">Chat with a host</p>
                <p className="text-xs text-white/80">Typically replies in 1 hour</p>
              </div>
              <button onClick={() => setOpen(false)} aria-label="Close chat">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-4 space-y-3 bg-muted/30 min-h-[140px]">
              <div className="bg-card border border-border rounded-2xl rounded-tl-none px-3 py-2 text-sm max-w-[80%]">
                Namaste! 👋 How can I help plan your stay?
              </div>
            </div>
            <div className="p-3 border-t border-border flex items-center gap-2">
              <input
                value={msg}
                onChange={e => setMsg(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && send()}
                placeholder="Type your message…"
                className="flex-1 bg-muted/50 rounded-full px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
              />
              <button
                onClick={send}
                className="bg-primary text-primary-foreground p-2 rounded-full hover:bg-primary/90"
                aria-label="Send message"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
