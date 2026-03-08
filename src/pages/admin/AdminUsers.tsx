import { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, Shield, UserCheck, UserX, Mail } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

const users = [
  { id: '1', name: 'Suraj Admin', email: 'admin@nepali.com', role: 'admin', status: 'active', joinDate: '2024-01-15', bookings: 0 },
  { id: '2', name: 'Ram Gurung', email: 'host@nepali.com', role: 'host', status: 'active', joinDate: '2024-03-20', bookings: 45 },
  { id: '3', name: 'Sarah Johnson', email: 'guest@nepali.com', role: 'guest', status: 'active', joinDate: '2025-06-10', bookings: 3 },
  { id: '4', name: 'Sita Tamang', email: 'sita@nepali.com', role: 'host', status: 'active', joinDate: '2024-08-05', bookings: 32 },
  { id: '5', name: 'Bhim Thapa', email: 'bhim@nepali.com', role: 'host', status: 'pending', joinDate: '2026-02-28', bookings: 0 },
  { id: '6', name: 'Emma Müller', email: 'emma@example.com', role: 'guest', status: 'active', joinDate: '2025-11-12', bookings: 5 },
  { id: '7', name: 'Takeshi Yamamoto', email: 'takeshi@example.com', role: 'guest', status: 'active', joinDate: '2025-09-08', bookings: 2 },
  { id: '8', name: 'Maya Sherpa', email: 'maya@nepali.com', role: 'host', status: 'inactive', joinDate: '2024-05-15', bookings: 18 },
];

const roleColors: Record<string, string> = {
  admin: 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400',
  host: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
  guest: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
};

const statusColors: Record<string, string> = {
  active: 'text-green-600',
  pending: 'text-yellow-600',
  inactive: 'text-muted-foreground',
};

export default function AdminUsers() {
  const [search, setSearch] = useState('');
  const filtered = users.filter(u =>
    u.name.toLowerCase().includes(search.toLowerCase()) || u.email.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">User Management</h1>
        <p className="text-muted-foreground text-sm mt-1">{users.length} total users</p>
      </div>

      {/* Quick stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { label: 'Admins', count: users.filter(u => u.role === 'admin').length, icon: Shield },
          { label: 'Hosts', count: users.filter(u => u.role === 'host').length, icon: UserCheck },
          { label: 'Guests', count: users.filter(u => u.role === 'guest').length, icon: UserCheck },
          { label: 'Pending', count: users.filter(u => u.status === 'pending').length, icon: UserX },
        ].map(s => (
          <Card key={s.label} className="p-4 flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center">
              <s.icon className="w-4 h-4 text-primary" />
            </div>
            <div>
              <p className="text-xl font-bold text-foreground">{s.count}</p>
              <p className="text-xs text-muted-foreground">{s.label}</p>
            </div>
          </Card>
        ))}
      </div>

      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input placeholder="Search users..." value={search} onChange={e => setSearch(e.target.value)} className="pl-9" />
      </div>

      <Card className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-muted/50">
              <tr className="text-left text-muted-foreground">
                <th className="p-4 font-medium">User</th>
                <th className="p-4 font-medium">Role</th>
                <th className="p-4 font-medium hidden md:table-cell">Status</th>
                <th className="p-4 font-medium hidden lg:table-cell">Joined</th>
                <th className="p-4 font-medium hidden md:table-cell">Bookings</th>
                <th className="p-4 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((u, i) => (
                <motion.tr key={u.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.03 }}
                  className="border-t border-border hover:bg-muted/30"
                >
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold text-xs">
                        {u.name.charAt(0)}
                      </div>
                      <div>
                        <p className="font-medium text-foreground">{u.name}</p>
                        <p className="text-xs text-muted-foreground">{u.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="p-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium capitalize ${roleColors[u.role]}`}>
                      {u.role}
                    </span>
                  </td>
                  <td className={`p-4 capitalize font-medium hidden md:table-cell ${statusColors[u.status]}`}>{u.status}</td>
                  <td className="p-4 text-muted-foreground hidden lg:table-cell">{u.joinDate}</td>
                  <td className="p-4 hidden md:table-cell">{u.bookings}</td>
                  <td className="p-4 text-right">
                    <Button variant="ghost" size="sm">
                      <Mail className="w-4 h-4 mr-1" />
                      Contact
                    </Button>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
