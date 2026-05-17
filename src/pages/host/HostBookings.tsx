import { useEffect, useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from '@/components/ui/sheet';
import { Input } from '@/components/ui/input';
import { useHostData, HostBooking } from '@/contexts/HostDataContext';
import { Check, X, MessageSquare, Calendar, Users, Mail, Send, Eye, Zap, Settings2, Plus, Trash2 } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

const READ_KEY = 'nh-host-thread-read-v1';
const loadRead = (): Record<string, string> => {
  try { return JSON.parse(localStorage.getItem(READ_KEY) || '{}'); } catch { return {}; }
};
const saveRead = (m: Record<string, string>) => {
  try { localStorage.setItem(READ_KEY, JSON.stringify(m)); } catch { /* ignore */ }
};

const statusColors: Record<string, string> = {
  confirmed: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
  pending: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400',
  completed: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
  cancelled: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
};

const uid = () => `m-${Math.random().toString(36).slice(2, 8)}`;

export default function HostBookings() {
  const { data, update } = useHostData();
  const [detail, setDetail] = useState<HostBooking | null>(null);
  const [chat, setChat] = useState<HostBooking | null>(null);
  const [draft, setDraft] = useState('');
  const [readMap, setReadMap] = useState<Record<string, string>>(() => loadRead());
  const [editTpl, setEditTpl] = useState(false);
  const [newTpl, setNewTpl] = useState('');

  const repliesFor = (propertyId: string): string[] => {
    const qr = data.quickReplies ?? {};
    return qr[propertyId] ?? qr._default ?? [];
  };
  const setRepliesFor = (propertyId: string, list: string[]) => {
    update('quickReplies', { ...(data.quickReplies ?? {}), [propertyId]: list });
  };

  const setStatus = (id: string, status: HostBooking['status']) => {
    update('bookings', data.bookings.map(b => b.id === id ? { ...b, status } : b));
    if (detail?.id === id) setDetail({ ...detail, status });
    toast({ title: `Booking ${status}` });
  };

  const threadIdFor = (b: HostBooking) => `booking-${b.id}`;
  const messagesFor = (b: HostBooking) => data.messages[threadIdFor(b)] ?? [];

  const unreadCountFor = (b: HostBooking) => {
    const tid = threadIdFor(b);
    const msgs = data.messages[tid] ?? [];
    const lastRead = readMap[tid] ?? '1970-01-01T00:00:00Z';
    return msgs.filter(m => m.from === 'guest' && m.at > lastRead).length;
  };

  const markRead = (b: HostBooking) => {
    const tid = threadIdFor(b);
    const next = { ...readMap, [tid]: new Date().toISOString() };
    setReadMap(next); saveRead(next);
  };

  // Mark thread read when chat drawer opens
  useEffect(() => { if (chat) markRead(chat); /* eslint-disable-next-line react-hooks/exhaustive-deps */ }, [chat?.id]);

  const sendMessage = (bodyOverride?: string) => {
    const body = (bodyOverride ?? draft).trim();
    if (!chat || !body) return;
    const tid = threadIdFor(chat);
    const next = {
      ...data.messages,
      [tid]: [...(data.messages[tid] ?? []), { id: uid(), threadId: tid, from: 'host' as const, body, at: new Date().toISOString() }],
    };
    update('messages', next);
    if (!bodyOverride) setDraft('');
  };

  const groups = {
    pending: data.bookings.filter(b => b.status === 'pending'),
    confirmed: data.bookings.filter(b => b.status === 'confirmed'),
    completed: data.bookings.filter(b => b.status === 'completed'),
    cancelled: data.bookings.filter(b => b.status === 'cancelled'),
  };

  const totalUnread = data.bookings.reduce((s, b) => s + unreadCountFor(b), 0);

  const renderList = (list: HostBooking[]) => (
    <div className="space-y-3">
      {list.length === 0 && <p className="text-sm text-muted-foreground py-8 text-center">No bookings here.</p>}
      {list.map(b => {
        const unread = unreadCountFor(b);
        return (
          <Card key={b.id} className="p-4 flex flex-col sm:flex-row sm:items-center gap-3">
            <button onClick={() => setDetail(b)} className="flex-1 text-left">
              <div className="flex items-center gap-2 flex-wrap">
                <p className="font-semibold text-foreground">{b.guest}</p>
                <span className={`text-xs px-2 py-0.5 rounded-full capitalize ${statusColors[b.status]}`}>{b.status}</span>
                {unread > 0 && (
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-primary text-primary-foreground">
                    {unread} new message{unread === 1 ? '' : 's'}
                  </span>
                )}
              </div>
              <p className="text-xs text-muted-foreground">{b.guestEmail}</p>
              <p className="text-sm text-muted-foreground mt-1">{b.checkIn} → {b.checkOut} · {b.guests} guests</p>
            </button>
            <div className="text-right">
              <p className="font-semibold text-foreground">NPR {b.amount.toLocaleString()}</p>
              <div className="flex gap-1 justify-end mt-2 flex-wrap">
                <Button size="sm" variant="ghost" onClick={() => setDetail(b)}><Eye className="w-3 h-3 mr-1" />Details</Button>
                {b.status === 'pending' && (
                  <>
                    <Button size="sm" variant="outline" onClick={() => setStatus(b.id, 'confirmed')}><Check className="w-3 h-3 mr-1" />Approve</Button>
                    <Button size="sm" variant="ghost" className="text-destructive" onClick={() => setStatus(b.id, 'cancelled')}><X className="w-3 h-3" /></Button>
                  </>
                )}
                <Button size="sm" variant={unread > 0 ? 'default' : 'ghost'} onClick={() => setChat(b)} className="relative">
                  <MessageSquare className="w-3 h-3 mr-1" />Message
                  {unread > 0 && <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-destructive" />}
                </Button>
              </div>
            </div>
          </Card>
        );
      })}
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between gap-3 flex-wrap">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Reservations</h1>
          <p className="text-muted-foreground text-sm mt-1">Approve, decline and track all your bookings.</p>
        </div>
        {totalUnread > 0 && (
          <span className="inline-flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-full bg-primary/10 text-primary border border-primary/20">
            <MessageSquare className="w-3 h-3" />
            {totalUnread} unread message{totalUnread === 1 ? '' : 's'}
          </span>
        )}
      </div>

      <Tabs defaultValue="pending">
        <TabsList>
          <TabsTrigger value="pending">Pending ({groups.pending.length})</TabsTrigger>
          <TabsTrigger value="confirmed">Upcoming ({groups.confirmed.length})</TabsTrigger>
          <TabsTrigger value="completed">Past ({groups.completed.length})</TabsTrigger>
          <TabsTrigger value="cancelled">Cancelled ({groups.cancelled.length})</TabsTrigger>
        </TabsList>
        <TabsContent value="pending" className="mt-4">{renderList(groups.pending)}</TabsContent>
        <TabsContent value="confirmed" className="mt-4">{renderList(groups.confirmed)}</TabsContent>
        <TabsContent value="completed" className="mt-4">{renderList(groups.completed)}</TabsContent>
        <TabsContent value="cancelled" className="mt-4">{renderList(groups.cancelled)}</TabsContent>
      </Tabs>

      {/* Booking detail drawer */}
      <Sheet open={!!detail} onOpenChange={(o) => !o && setDetail(null)}>
        <SheetContent className="sm:max-w-md overflow-y-auto">
          {detail && (
            <>
              <SheetHeader>
                <SheetTitle className="flex items-center gap-2">
                  {detail.guest}
                  <span className={`text-xs px-2 py-0.5 rounded-full capitalize ${statusColors[detail.status]}`}>{detail.status}</span>
                </SheetTitle>
                <SheetDescription>Booking #{detail.id}</SheetDescription>
              </SheetHeader>

              <div className="mt-6 space-y-4">
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div className="flex items-center gap-2 text-muted-foreground"><Mail className="w-4 h-4" />{detail.guestEmail}</div>
                  <div className="flex items-center gap-2 text-muted-foreground"><Users className="w-4 h-4" />{detail.guests} guests</div>
                  <div className="flex items-center gap-2 text-muted-foreground col-span-2"><Calendar className="w-4 h-4" />{detail.checkIn} → {detail.checkOut}</div>
                </div>

                <Card className="p-4">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Total amount</span>
                    <span className="font-semibold text-foreground">NPR {detail.amount.toLocaleString()}</span>
                  </div>
                </Card>

                <div className="flex flex-col gap-2 pt-2">
                  {detail.status === 'pending' && (
                    <>
                      <Button onClick={() => setStatus(detail.id, 'confirmed')}><Check className="w-4 h-4 mr-2" />Approve booking</Button>
                      <Button variant="destructive" onClick={() => setStatus(detail.id, 'cancelled')}><X className="w-4 h-4 mr-2" />Decline</Button>
                    </>
                  )}
                  {detail.status === 'confirmed' && (
                    <>
                      <Button onClick={() => setStatus(detail.id, 'completed')}>Mark completed</Button>
                      <Button variant="outline" className="text-destructive" onClick={() => setStatus(detail.id, 'cancelled')}>Cancel reservation</Button>
                    </>
                  )}
                  <Button variant="outline" onClick={() => { setChat(detail); }}>
                    <MessageSquare className="w-4 h-4 mr-2" />Message guest
                  </Button>
                </div>
              </div>
            </>
          )}
        </SheetContent>
      </Sheet>

      {/* Messaging drawer */}
      <Sheet open={!!chat} onOpenChange={(o) => { if (!o) { setChat(null); setDraft(''); } }}>
        <SheetContent className="sm:max-w-md flex flex-col">
          {chat && (
            <>
              <SheetHeader>
                <SheetTitle>Chat with {chat.guest}</SheetTitle>
                <SheetDescription>Booking #{chat.id} · {chat.checkIn} → {chat.checkOut}</SheetDescription>
              </SheetHeader>

              <div className="flex-1 overflow-y-auto py-4 space-y-2">
                {messagesFor(chat).length === 0 && (
                  <p className="text-sm text-muted-foreground text-center py-8">No messages yet — say hello!</p>
                )}
                {messagesFor(chat).map(m => (
                  <div key={m.id} className={`flex ${m.from === 'host' ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-[80%] px-3 py-2 rounded-2xl text-sm ${m.from === 'host' ? 'bg-primary text-primary-foreground' : 'bg-muted text-foreground'}`}>
                      {m.body}
                      <div className={`text-[10px] opacity-60 mt-1 ${m.from === 'host' ? 'text-primary-foreground' : ''}`}>
                        {new Date(m.at).toLocaleString()}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="border-t border-border pt-3 space-y-3">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-[11px] uppercase tracking-wide text-muted-foreground flex items-center gap-1">
                      <Zap className="w-3 h-3" /> Quick replies for this listing
                    </p>
                    <button
                      onClick={() => setEditTpl(v => !v)}
                      className="text-[11px] text-muted-foreground hover:text-foreground inline-flex items-center gap-1"
                    >
                      <Settings2 className="w-3 h-3" />{editTpl ? 'Done' : 'Edit'}
                    </button>
                  </div>
                  {!editTpl ? (
                    <div className="flex flex-wrap gap-1.5">
                      {repliesFor(chat.propertyId).length === 0 && (
                        <p className="text-xs text-muted-foreground italic">No templates yet — click Edit to add some.</p>
                      )}
                      {repliesFor(chat.propertyId).map((q, i) => (
                        <button
                          key={i}
                          onClick={() => sendMessage(q)}
                          className="text-xs px-2.5 py-1 rounded-full border border-border hover:bg-muted text-foreground transition-colors text-left max-w-full truncate"
                          title={q}
                        >
                          {q.length > 38 ? q.slice(0, 36) + '…' : q}
                        </button>
                      ))}
                    </div>
                  ) : (
                    <div className="space-y-1.5">
                      {repliesFor(chat.propertyId).map((q, i) => (
                        <div key={i} className="flex items-center gap-1.5">
                          <Input
                            value={q}
                            onChange={e => {
                              const next = [...repliesFor(chat.propertyId)];
                              next[i] = e.target.value;
                              setRepliesFor(chat.propertyId, next);
                            }}
                            className="h-8 text-xs"
                          />
                          <Button
                            size="icon" variant="ghost" className="h-8 w-8 shrink-0 text-destructive"
                            onClick={() => setRepliesFor(chat.propertyId, repliesFor(chat.propertyId).filter((_, k) => k !== i))}
                          >
                            <Trash2 className="w-3 h-3" />
                          </Button>
                        </div>
                      ))}
                      <div className="flex items-center gap-1.5">
                        <Input
                          value={newTpl}
                          onChange={e => setNewTpl(e.target.value)}
                          placeholder="New template…"
                          className="h-8 text-xs"
                          onKeyDown={e => {
                            if (e.key === 'Enter' && newTpl.trim()) {
                              setRepliesFor(chat.propertyId, [...repliesFor(chat.propertyId), newTpl.trim()]);
                              setNewTpl('');
                            }
                          }}
                        />
                        <Button
                          size="icon" variant="outline" className="h-8 w-8 shrink-0"
                          disabled={!newTpl.trim()}
                          onClick={() => {
                            setRepliesFor(chat.propertyId, [...repliesFor(chat.propertyId), newTpl.trim()]);
                            setNewTpl('');
                          }}
                        >
                          <Plus className="w-3 h-3" />
                        </Button>
                      </div>
                      <p className="text-[10px] text-muted-foreground">Templates are saved per listing.</p>
                    </div>
                  )}
                </div>
                <div className="flex gap-2">
                  <Input
                    value={draft}
                    onChange={e => setDraft(e.target.value)}
                    onKeyDown={e => { if (e.key === 'Enter') sendMessage(); }}
                    placeholder="Type a message…"
                  />
                  <Button onClick={() => sendMessage()} disabled={!draft.trim()}>
                    <Send className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </>
          )}
        </SheetContent>
      </Sheet>
    </div>
  );
}
