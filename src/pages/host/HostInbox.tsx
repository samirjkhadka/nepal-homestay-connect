import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useHostData } from '@/contexts/HostDataContext';
import { Send } from 'lucide-react';

const uid = () => `m-${Math.random().toString(36).slice(2, 8)}`;

export default function HostInbox() {
  const { data, update } = useHostData();
  const [activeId, setActiveId] = useState(data.threads[0]?.id ?? '');
  const [draft, setDraft] = useState('');

  const messages = data.messages[activeId] ?? [];
  const active = data.threads.find(t => t.id === activeId);

  const send = () => {
    if (!draft.trim() || !activeId) return;
    update('messages', {
      ...data.messages,
      [activeId]: [...messages, { id: uid(), threadId: activeId, from: 'host', body: draft, at: new Date().toISOString() }],
    });
    update('threads', data.threads.map(t => t.id === activeId ? { ...t, unread: false, lastAt: new Date().toISOString() } : t));
    setDraft('');
  };

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Inbox</h1>
        <p className="text-muted-foreground text-sm mt-1">Conversations with your guests.</p>
      </div>

      <div className="grid md:grid-cols-[280px_1fr] gap-4 h-[600px]">
        <Card className="p-2 overflow-y-auto">
          {data.threads.map(t => (
            <button key={t.id} onClick={() => setActiveId(t.id)}
              className={`w-full text-left p-3 rounded-lg mb-1 transition-colors ${activeId === t.id ? 'bg-primary/10' : 'hover:bg-muted'}`}
            >
              <div className="flex items-center justify-between">
                <span className="font-medium text-foreground text-sm">{t.guest}</span>
                {t.unread && <span className="w-2 h-2 rounded-full bg-primary" />}
              </div>
              <p className="text-xs text-muted-foreground truncate">{t.propertyName}</p>
            </button>
          ))}
        </Card>

        <Card className="flex flex-col">
          {active ? (
            <>
              <div className="p-4 border-b border-border">
                <p className="font-semibold text-foreground">{active.guest}</p>
                <p className="text-xs text-muted-foreground">{active.propertyName}</p>
              </div>
              <div className="flex-1 overflow-y-auto p-4 space-y-3">
                {messages.map(m => (
                  <div key={m.id} className={`max-w-[75%] ${m.from === 'host' ? 'ml-auto' : ''}`}>
                    <div className={`px-3 py-2 rounded-2xl text-sm ${m.from === 'host' ? 'bg-primary text-primary-foreground' : 'bg-muted text-foreground'}`}>
                      {m.body}
                    </div>
                    <p className="text-[10px] text-muted-foreground mt-1 px-2">{new Date(m.at).toLocaleString()}</p>
                  </div>
                ))}
              </div>
              <div className="p-3 border-t border-border flex gap-2">
                <Input value={draft} onChange={e => setDraft(e.target.value)} onKeyDown={e => e.key === 'Enter' && send()} placeholder="Type a message..." />
                <Button onClick={send}><Send className="w-4 h-4" /></Button>
              </div>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center text-muted-foreground text-sm">No conversation selected</div>
          )}
        </Card>
      </div>
    </div>
  );
}
