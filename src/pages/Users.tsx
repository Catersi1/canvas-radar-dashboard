import React, { useState } from 'react';
import { 
  Search, 
  Plus, 
  User, 
  Shield, 
  Zap, 
  Building, 
  MoreVertical, 
  Mail, 
  ShieldCheck,
  UserPlus,
  X,
  RefreshCw
} from 'lucide-react';
import { cn } from '../lib/utils';

interface UserData {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'power_user' | 'employer' | 'surveyor';
  status: 'active' | 'pending' | 'inactive';
  lastActive: string;
}

const MOCK_USERS: UserData[] = [
  { id: '1', name: 'Admin User', email: 'admin@canvasradar.com', role: 'admin', status: 'active', lastActive: '2 mins ago' },
  { id: '2', name: 'Power User One', email: 'power@canvasradar.com', role: 'power_user', status: 'active', lastActive: '1 hour ago' },
  { id: '3', name: 'Employer Alpha', email: 'employer@alpha.com', role: 'employer', status: 'active', lastActive: 'Yesterday' },
  { id: '4', name: 'Surveyor John', email: 'john@survey.com', role: 'surveyor', status: 'active', lastActive: '5 mins ago' },
  { id: '5', name: 'Pending Admin', email: 'new@admin.com', role: 'admin', status: 'pending', lastActive: 'Never' },
];

export default function Users() {
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [isInviting, setIsInviting] = useState(false);
  const [emailLogs, setEmailLogs] = useState<{id: string, to: string, subject: string, sentAt: string}[]>([]);
  const [newUser, setNewUser] = useState({ name: '', email: '', role: 'surveyor' as UserData['role'] });
  const [users, setUsers] = useState<UserData[]>(MOCK_USERS);

  const handleInvite = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsInviting(true);
    
    // Simulate API call and email sending
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    const newId = (users.length + 1).toString();
    const userToAdd: UserData = {
      id: newId,
      name: newUser.name,
      email: newUser.email,
      role: newUser.role,
      status: 'pending',
      lastActive: 'Never'
    };

    setUsers([userToAdd, ...users]);
    setEmailLogs([
      {
        id: Math.random().toString(36).substr(2, 9),
        to: newUser.email,
        subject: 'Welcome to CanvasRadar - Invitation to Join',
        sentAt: new Date().toLocaleTimeString()
      },
      ...emailLogs
    ]);
    
    setIsInviting(false);
    setShowAddModal(false);
    setNewUser({ name: '', email: '', role: 'surveyor' });
  };

  const filteredUsers = users.filter(u => 
    u.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    u.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getRoleIcon = (role: UserData['role']) => {
    switch (role) {
      case 'admin': return <Shield className="w-4 h-4 text-purple-400" />;
      case 'power_user': return <Zap className="w-4 h-4 text-amber-400" />;
      case 'employer': return <Building className="w-4 h-4 text-blue-400" />;
      case 'surveyor': return <User className="w-4 h-4 text-emerald-400" />;
    }
  };

  const getRoleLabel = (role: UserData['role']) => {
    return role.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase());
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">User Management</h2>
          <p className="text-text-muted mt-1">Manage platform access for admins, employers, and surveyors.</p>
        </div>
        <button 
          onClick={() => setShowAddModal(true)}
          className="btn-primary"
        >
          <UserPlus className="w-4 h-4" />
          Add New User
        </button>
      </div>

      <div className="relative max-w-md">
        <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" />
        <input 
          type="text" 
          placeholder="Search users by name or email..." 
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full bg-card border border-card-border rounded-lg pl-10 pr-4 py-2 text-sm focus:outline-none focus:border-accent/50 transition-all"
        />
      </div>

      <div className="bg-card border border-card-border rounded-xl overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-background/50 border-b border-card-border">
              <th className="px-6 py-4 text-xs font-bold text-text-muted uppercase tracking-widest">User</th>
              <th className="px-6 py-4 text-xs font-bold text-text-muted uppercase tracking-widest">Role</th>
              <th className="px-6 py-4 text-xs font-bold text-text-muted uppercase tracking-widest">Status</th>
              <th className="px-6 py-4 text-xs font-bold text-text-muted uppercase tracking-widest">Last Active</th>
              <th className="px-6 py-4 text-xs font-bold text-text-muted uppercase tracking-widest"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-card-border">
            {filteredUsers.map((u) => (
              <tr key={u.id} className="hover:bg-background/30 transition-colors">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-background border border-card-border flex items-center justify-center text-text-muted">
                      <User className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="text-sm font-bold">{u.name}</p>
                      <p className="text-xs text-text-muted">{u.email}</p>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2">
                    {getRoleIcon(u.role)}
                    <span className="text-xs font-medium">{getRoleLabel(u.role)}</span>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span className={cn(
                    "text-[10px] font-bold px-2 py-0.5 rounded-full uppercase",
                    u.status === 'active' ? "text-emerald-400 bg-emerald-500/10" : 
                    u.status === 'pending' ? "text-amber-400 bg-amber-500/10" : "text-red-400 bg-red-500/10"
                  )}>
                    {u.status}
                  </span>
                </td>
                <td className="px-6 py-4 text-xs text-text-muted">
                  {u.lastActive}
                </td>
                <td className="px-6 py-4 text-right">
                  <button className="p-1 hover:bg-background rounded transition-colors">
                    <MoreVertical className="w-4 h-4 text-text-muted" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Email Verification Log */}
      {emailLogs.length > 0 && (
        <div className="mt-8 space-y-4">
          <h3 className="text-xs font-bold text-text-muted uppercase tracking-widest flex items-center gap-2">
            <Mail className="w-3.5 h-3.5" />
            System Email Logs (Verification)
          </h3>
          <div className="bg-card border border-card-border rounded-xl p-4 space-y-3">
            {emailLogs.map(log => (
              <div key={log.id} className="flex items-center justify-between text-xs border-b border-card-border/50 pb-2 last:border-0 last:pb-0">
                <div className="flex items-center gap-3">
                  <div className="w-6 h-6 rounded bg-emerald-500/10 flex items-center justify-center text-emerald-500">
                    <ShieldCheck className="w-3 h-3" />
                  </div>
                  <div>
                    <p className="font-bold text-text-primary">Sent to: {log.to}</p>
                    <p className="text-text-muted">{log.subject}</p>
                  </div>
                </div>
                <span className="text-text-muted font-mono">{log.sentAt}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-black/80 backdrop-blur-sm">
          <div className="bg-card border border-card-border rounded-2xl w-full max-w-md p-8 shadow-2xl animate-in fade-in zoom-in duration-200">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold">Add New User</h3>
              <button onClick={() => setShowAddModal(false)} className="text-text-muted hover:text-text-primary">
                <X className="w-6 h-6" />
              </button>
            </div>
            
            <form className="space-y-4" onSubmit={handleInvite}>
              <div className="space-y-2">
                <label className="text-xs font-bold text-text-muted uppercase tracking-widest">Full Name</label>
                <input 
                  type="text" 
                  className="w-full bg-background border border-card-border rounded-xl px-4 py-2.5 focus:outline-none focus:border-accent" 
                  placeholder="Jane Smith"
                  value={newUser.name}
                  onChange={e => setNewUser({...newUser, name: e.target.value})}
                  required
                  disabled={isInviting}
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-text-muted uppercase tracking-widest">Email Address</label>
                <input 
                  type="email" 
                  className="w-full bg-background border border-card-border rounded-xl px-4 py-2.5 focus:outline-none focus:border-accent" 
                  placeholder="jane@example.com"
                  value={newUser.email}
                  onChange={e => setNewUser({...newUser, email: e.target.value})}
                  required
                  disabled={isInviting}
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-text-muted uppercase tracking-widest">Role</label>
                <select 
                  className="w-full bg-background border border-card-border rounded-xl px-4 py-2.5 focus:outline-none focus:border-accent"
                  value={newUser.role}
                  onChange={e => setNewUser({...newUser, role: e.target.value as UserData['role']})}
                  disabled={isInviting}
                >
                  <option value="admin">Admin</option>
                  <option value="power_user">Power User</option>
                  <option value="employer">Employer</option>
                  <option value="surveyor">Surveyor</option>
                </select>
              </div>
              
              <div className="pt-4">
                <button 
                  type="submit" 
                  className="btn-primary w-full justify-center py-3 disabled:opacity-50"
                  disabled={isInviting}
                >
                  {isInviting ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      Sending Invitation...
                    </>
                  ) : (
                    'Send Invitation'
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
