import { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';

export type AuditActor = 'admin' | 'host' | 'guest' | 'system';
export type AuditAction =
  | 'create' | 'update' | 'delete' | 'login' | 'logout'
  | 'approve' | 'reject' | 'publish' | 'unpublish'
  | 'payout' | 'refund' | 'cancel' | 'message' | 'export';

export interface AuditEntry {
  id: string;
  at: string;            // ISO timestamp
  actor: AuditActor;
  actorName: string;
  action: AuditAction;
  entity: string;        // e.g. "Booking", "Listing", "Review"
  entityId?: string;
  summary: string;       // human-readable description
  ip: string;
  before?: unknown;
  after?: unknown;
}

const STORAGE_KEY = 'nh-audit-log-v1';
const MAX_ENTRIES = 500;

const uid = () => `al-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 7)}`;
const fakeIp = () => `103.${10 + Math.floor(Math.random() * 200)}.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}`;

const seed = (): AuditEntry[] => {
  const now = Date.now();
  const h = (n: number) => new Date(now - n * 3600_000).toISOString();
  return [
    { id: uid(), at: h(1), actor: 'admin', actorName: 'Suraj Admin', action: 'approve', entity: 'Host Application', entityId: 'app-204', summary: 'Approved host application for Anjali Tamang', ip: fakeIp() },
    { id: uid(), at: h(3), actor: 'host', actorName: 'Ram Host', action: 'update', entity: 'Listing', entityId: 'hp-1', summary: 'Updated nightly price from NPR 2,300 to NPR 2,500', ip: fakeIp(), before: { pricePerNight: 2300 }, after: { pricePerNight: 2500 } },
    { id: uid(), at: h(5), actor: 'guest', actorName: 'Sarah Guest', action: 'create', entity: 'Booking', entityId: 'b-8841', summary: 'Created booking at Mountain View Retreat (3 nights)', ip: fakeIp() },
    { id: uid(), at: h(9), actor: 'admin', actorName: 'Suraj Admin', action: 'payout', entity: 'Payout', entityId: 'po-31', summary: 'Approved payout of NPR 38,000 to Ram Host via eSewa', ip: fakeIp() },
    { id: uid(), at: h(14), actor: 'system', actorName: 'System', action: 'refund', entity: 'Booking', entityId: 'b-8790', summary: 'Auto-refund NPR 5,500 issued for cancelled booking', ip: '127.0.0.1' },
    { id: uid(), at: h(26), actor: 'admin', actorName: 'Suraj Admin', action: 'update', entity: 'Settings', summary: 'Changed platform service fee from 8% to 10%', ip: fakeIp(), before: { serviceFee: 8 }, after: { serviceFee: 10 } },
    { id: uid(), at: h(40), actor: 'host', actorName: 'Ram Host', action: 'message', entity: 'Thread', entityId: 't1', summary: 'Replied to guest Sarah Johnson', ip: fakeIp() },
  ];
};

interface AuditLogContextType {
  entries: AuditEntry[];
  log: (e: Omit<AuditEntry, 'id' | 'at' | 'ip'> & { ip?: string }) => void;
  clear: () => void;
}

const AuditLogContext = createContext<AuditLogContextType | null>(null);

export function AuditLogProvider({ children }: { children: ReactNode }) {
  const [entries, setEntries] = useState<AuditEntry[]>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) return JSON.parse(stored);
    } catch (e) { /* ignore */ }
    return seed();
  });

  useEffect(() => {
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(entries)); } catch (e) { /* ignore */ }
  }, [entries]);

  const log = useCallback((e: Omit<AuditEntry, 'id' | 'at' | 'ip'> & { ip?: string }) => {
    setEntries(prev => [
      { ...e, id: uid(), at: new Date().toISOString(), ip: e.ip ?? fakeIp() },
      ...prev,
    ].slice(0, MAX_ENTRIES));
  }, []);

  const clear = useCallback(() => setEntries([]), []);

  return (
    <AuditLogContext.Provider value={{ entries, log, clear }}>
      {children}
    </AuditLogContext.Provider>
  );
}

export function useAuditLog() {
  const ctx = useContext(AuditLogContext);
  if (!ctx) throw new Error('useAuditLog must be used within AuditLogProvider');
  return ctx;
}
