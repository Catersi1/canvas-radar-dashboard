import React, { useState, useEffect, useMemo } from 'react';
import { 
  Users, 
  Building, 
  Phone, 
  Globe, 
  CheckCircle2, 
  Clock, 
  AlertCircle, 
  X, 
  Search, 
  Filter, 
  Download, 
  MoreVertical, 
  ExternalLink, 
  ChevronRight,
  Mail,
  User,
  MessageSquare,
  Briefcase,
  TrendingUp,
  RefreshCcw,
  MapPin
} from 'lucide-react';
import { supabase } from '../lib/supabase';
import { Property } from '../types';
import { cn } from '../lib/utils';
import { format } from 'date-fns';
import { motion, AnimatePresence } from 'motion/react';

export default function Leads() {
  const [leads, setLeads] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('All');
  const [industryFilter, setIndustryFilter] = useState<string>('All');
  const [selectedLead, setSelectedLead] = useState<Property | null>(null);
  const [isUpdating, setIsUpdating] = useState(false);
  const [notification, setNotification] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const fetchLeads = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('properties')
        .select('*')
        .not('business_name', 'is', null)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setLeads(data || []);
    } catch (err: any) {
      console.error('Error fetching leads:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLeads();
  }, []);

  useEffect(() => {
    if (notification) {
      const timer = setTimeout(() => setNotification(null), 5000);
      return () => clearTimeout(timer);
    }
  }, [notification]);

  const industries = useMemo(() => {
    const uniqueIndustries = Array.from(new Set(leads.map(l => l.industry).filter(Boolean)));
    return ['All', ...uniqueIndustries.sort()];
  }, [leads]);

  const stats = useMemo(() => {
    const total = leads.length;
    const counts = leads.reduce((acc: any, lead) => {
      const status = lead.lead_status || 'new';
      acc[status] = (acc[status] || 0) + 1;
      return acc;
    }, {});

    return {
      total,
      new: counts['new'] || 0,
      contacted: counts['contacted'] || 0,
      callback: counts['callback'] || 0,
      not_interested: counts['not_interested'] || 0,
      booked: counts['booked'] || 0
    };
  }, [leads]);

  const filteredLeads = useMemo(() => {
    return leads.filter(lead => {
      const matchesSearch = 
        (lead.business_name?.toLowerCase().includes(searchTerm.toLowerCase()) || false) ||
        (lead.industry?.toLowerCase().includes(searchTerm.toLowerCase()) || false) ||
        (lead.city?.toLowerCase().includes(searchTerm.toLowerCase()) || false) ||
        (lead.notes?.toLowerCase().includes(searchTerm.toLowerCase()) || false);
      
      const matchesStatus = statusFilter === 'All' || lead.lead_status === statusFilter;
      const matchesIndustry = industryFilter === 'All' || lead.industry === industryFilter;

      return matchesSearch && matchesStatus && matchesIndustry;
    });
  }, [leads, searchTerm, statusFilter, industryFilter]);

  const handleUpdateLead = async (id: string, updates: Partial<Property>) => {
    setIsUpdating(true);
    try {
      const { error } = await supabase
        .from('properties')
        .update(updates)
        .eq('id', id);

      if (error) throw error;

      setLeads(prev => prev.map(l => l.id === id ? { ...l, ...updates } : l));
      if (selectedLead?.id === id) {
        setSelectedLead({ ...selectedLead, ...updates });
      }
      setNotification({ type: 'success', message: 'Lead updated successfully' });
    } catch (err: any) {
      console.error('Error updating lead:', err);
      setNotification({ type: 'error', message: err.message });
    } finally {
      setIsUpdating(false);
    }
  };

  const getStatusColor = (status: string | undefined) => {
    switch (status) {
      case 'new': return 'bg-blue-500/10 text-blue-400 border-blue-500/20';
      case 'contacted': return 'bg-amber-500/10 text-amber-400 border-amber-500/20';
      case 'callback': return 'bg-purple-500/10 text-purple-400 border-purple-500/20';
      case 'not_interested': return 'bg-slate-500/10 text-slate-400 border-slate-500/20';
      case 'booked': return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20';
      default: return 'bg-slate-500/10 text-slate-400 border-slate-500/20';
    }
  };

  if (loading && leads.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full gap-4">
        <RefreshCcw className="w-10 h-10 text-accent animate-spin" />
        <p className="text-text-muted font-medium">Loading commercial leads...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-20">
      {notification && (
        <div className={cn(
          "fixed top-4 right-4 z-[60] p-4 rounded-xl border shadow-2xl animate-in slide-in-from-top-4 duration-300 flex items-center gap-3",
          notification.type === 'success' ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-400" : "bg-red-500/10 border-red-500/20 text-red-400"
        )}>
          <AlertCircle className="w-5 h-5" />
          <p className="text-sm font-medium">{notification.message}</p>
        </div>
      )}

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Commercial Leads</h2>
          <p className="text-text-muted mt-1">Manage and track commercial property acquisition leads.</p>
        </div>
        <div className="flex items-center gap-3">
          <button 
            onClick={fetchLeads}
            className="p-2 hover:bg-card rounded-lg text-text-muted hover:text-text-primary transition-colors"
            title="Refresh data"
          >
            <RefreshCcw className={cn("w-5 h-5", loading && "animate-spin")} />
          </button>
          <button className="btn-secondary">
            <Download className="w-4 h-4" />
            Export Leads
          </button>
        </div>
      </div>

      {/* Stats Bar */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        <div className="bg-card border border-card-border p-4 rounded-2xl">
          <p className="text-[10px] font-bold text-text-muted uppercase tracking-widest mb-1">Total Leads</p>
          <p className="text-2xl font-bold text-text-primary">{stats.total}</p>
        </div>
        <div className="bg-card border border-card-border p-4 rounded-2xl">
          <p className="text-[10px] font-bold text-blue-400 uppercase tracking-widest mb-1">New</p>
          <p className="text-2xl font-bold text-text-primary">{stats.new}</p>
        </div>
        <div className="bg-card border border-card-border p-4 rounded-2xl">
          <p className="text-[10px] font-bold text-amber-400 uppercase tracking-widest mb-1">Contacted</p>
          <p className="text-2xl font-bold text-text-primary">{stats.contacted}</p>
        </div>
        <div className="bg-card border border-card-border p-4 rounded-2xl">
          <p className="text-[10px] font-bold text-purple-400 uppercase tracking-widest mb-1">Callback</p>
          <p className="text-2xl font-bold text-text-primary">{stats.callback}</p>
        </div>
        <div className="bg-card border border-card-border p-4 rounded-2xl">
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Not Interested</p>
          <p className="text-2xl font-bold text-text-primary">{stats.not_interested}</p>
        </div>
        <div className="bg-card border border-card-border p-4 rounded-2xl">
          <p className="text-[10px] font-bold text-emerald-400 uppercase tracking-widest mb-1">Booked</p>
          <p className="text-2xl font-bold text-text-primary">{stats.booked}</p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col lg:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" />
          <input 
            type="text" 
            placeholder="Search leads by business, industry, city..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-card border border-card-border rounded-xl pl-10 pr-4 py-2.5 text-sm focus:outline-none focus:border-accent/50 transition-all"
          />
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-text-muted" />
            <select 
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="bg-card border border-card-border rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-accent/50 min-w-[140px]"
            >
              <option value="All">All Statuses</option>
              <option value="new">New</option>
              <option value="contacted">Contacted</option>
              <option value="callback">Callback</option>
              <option value="not_interested">Not Interested</option>
              <option value="booked">Booked</option>
            </select>
          </div>
          <select 
            value={industryFilter}
            onChange={(e) => setIndustryFilter(e.target.value)}
            className="bg-card border border-card-border rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-accent/50 min-w-[140px]"
          >
            {industries.map(industry => (
              <option key={industry} value={industry}>{industry === 'All' ? 'All Industries' : industry}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Leads Table */}
      <div className="bg-card border border-card-border rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-900/50 border-b border-card-border">
                <th className="px-6 py-4 text-[10px] font-bold text-text-muted uppercase tracking-widest">Business Name</th>
                <th className="px-6 py-4 text-[10px] font-bold text-text-muted uppercase tracking-widest">Industry</th>
                <th className="px-6 py-4 text-[10px] font-bold text-text-muted uppercase tracking-widest">Location</th>
                <th className="px-6 py-4 text-[10px] font-bold text-text-muted uppercase tracking-widest">Contact</th>
                <th className="px-6 py-4 text-[10px] font-bold text-text-muted uppercase tracking-widest">Est. Employees</th>
                <th className="px-6 py-4 text-[10px] font-bold text-text-muted uppercase tracking-widest">Status</th>
                <th className="px-6 py-4 text-[10px] font-bold text-text-muted uppercase tracking-widest">Added</th>
                <th className="px-6 py-4 text-[10px] font-bold text-text-muted uppercase tracking-widest text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-card-border">
              {filteredLeads.length > 0 ? (
                filteredLeads.map((lead) => (
                  <tr 
                    key={lead.id} 
                    className="hover:bg-slate-800/30 transition-colors cursor-pointer group"
                    onClick={() => setSelectedLead(lead)}
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-accent/10 flex items-center justify-center text-accent">
                          <Building className="w-4 h-4" />
                        </div>
                        <div>
                          <p className="text-sm font-bold text-text-primary group-hover:text-accent transition-colors">{lead.business_name}</p>
                          <p className="text-xs text-text-muted truncate max-w-[200px]">{lead.address}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-xs font-medium text-text-muted">{lead.industry || 'N/A'}</span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-1.5 text-xs text-text-muted">
                        <MapPin className="w-3 h-3" />
                        {lead.city}, {lead.state}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="space-y-1">
                        {lead.phone && (
                          <div className="flex items-center gap-1.5 text-xs text-text-muted">
                            <Phone className="w-3 h-3" />
                            <a href={`tel:${lead.phone}`} onClick={e => e.stopPropagation()} className="hover:text-accent transition-colors">{lead.phone}</a>
                          </div>
                        )}
                        {lead.website && (
                          <div className="flex items-center gap-1.5 text-xs text-text-muted">
                            <Globe className="w-3 h-3" />
                            <a href={lead.website.startsWith('http') ? lead.website : `https://${lead.website}`} target="_blank" rel="noopener noreferrer" onClick={e => e.stopPropagation()} className="hover:text-accent transition-colors flex items-center gap-1">
                              Website <ExternalLink className="w-2.5 h-2.5" />
                            </a>
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-xs font-mono text-text-muted">{lead.employee_count_est || 'N/A'}</span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={cn(
                        "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border",
                        getStatusColor(lead.lead_status)
                      )}>
                        {lead.lead_status || 'new'}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-xs text-text-muted font-mono">
                        {format(new Date(lead.created_at), 'MMM d, yyyy')}
                      </p>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button className="p-2 text-text-muted hover:text-accent transition-colors">
                        <ChevronRight className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={8} className="px-6 py-20 text-center">
                    <div className="flex flex-col items-center gap-3 text-text-muted">
                      <Search className="w-10 h-10 opacity-20" />
                      <p className="font-medium">No leads found matching your criteria.</p>
                      <button 
                        onClick={() => {
                          setSearchTerm('');
                          setStatusFilter('All');
                          setIndustryFilter('All');
                        }}
                        className="text-accent hover:underline text-sm"
                      >
                        Clear all filters
                      </button>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Edit Side Panel */}
      <AnimatePresence>
        {selectedLead && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedLead(null)}
              className="fixed inset-0 bg-background/80 backdrop-blur-sm z-[70]"
            />
            <motion.div 
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed top-0 right-0 bottom-0 w-full max-w-md bg-card border-l border-card-border z-[80] shadow-2xl flex flex-col"
            >
              <div className="p-6 border-b border-card-border flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-accent/10 flex items-center justify-center text-accent">
                    <Building className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-bold text-lg text-text-primary">Lead Details</h3>
                    <p className="text-xs text-text-muted">ID: {selectedLead.id.slice(0, 8)}</p>
                  </div>
                </div>
                <button 
                  onClick={() => setSelectedLead(null)}
                  className="p-2 hover:bg-slate-800 rounded-lg text-text-muted hover:text-text-primary transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-6 space-y-8">
                {/* Basic Info */}
                <section className="space-y-4">
                  <h4 className="text-[10px] font-bold text-text-muted uppercase tracking-widest">Business Information</h4>
                  <div className="space-y-4">
                    <div className="bg-slate-900/40 rounded-xl p-4 border border-slate-800/50">
                      <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Business Name</p>
                      <p className="text-sm font-medium text-text-primary">{selectedLead.business_name}</p>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-slate-900/40 rounded-xl p-4 border border-slate-800/50">
                        <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Industry</p>
                        <p className="text-sm font-medium text-text-primary">{selectedLead.industry || 'N/A'}</p>
                      </div>
                      <div className="bg-slate-900/40 rounded-xl p-4 border border-slate-800/50">
                        <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Employees</p>
                        <p className="text-sm font-medium text-text-primary">{selectedLead.employee_count_est || 'N/A'}</p>
                      </div>
                    </div>
                    <div className="bg-slate-900/40 rounded-xl p-4 border border-slate-800/50">
                      <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Address</p>
                      <p className="text-sm font-medium text-text-primary">{selectedLead.address}</p>
                      <p className="text-xs text-text-muted">{selectedLead.city}, {selectedLead.state} {selectedLead.zip}</p>
                    </div>
                  </div>
                </section>

                {/* Editable Fields */}
                <section className="space-y-4">
                  <h4 className="text-[10px] font-bold text-text-muted uppercase tracking-widest">Lead Management</h4>
                  <div className="space-y-4">
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Lead Status</label>
                      <select 
                        value={selectedLead.lead_status || 'new'}
                        onChange={(e) => handleUpdateLead(selectedLead.id, { lead_status: e.target.value as any })}
                        className="w-full bg-slate-900/50 border border-slate-800 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-accent/50"
                      >
                        <option value="new">New</option>
                        <option value="contacted">Contacted</option>
                        <option value="callback">Callback</option>
                        <option value="not_interested">Not Interested</option>
                        <option value="booked">Booked</option>
                      </select>
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Contact Name</label>
                      <div className="relative">
                        <User className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
                        <input 
                          type="text"
                          value={selectedLead.contact_name || ''}
                          onChange={(e) => handleUpdateLead(selectedLead.id, { contact_name: e.target.value })}
                          placeholder="Enter contact name"
                          className="w-full bg-slate-900/50 border border-slate-800 rounded-xl pl-10 pr-4 py-2.5 text-sm focus:outline-none focus:border-accent/50"
                        />
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Email Address</label>
                      <div className="relative">
                        <Mail className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
                        <input 
                          type="email"
                          value={selectedLead.email || ''}
                          onChange={(e) => handleUpdateLead(selectedLead.id, { email: e.target.value })}
                          placeholder="Enter email address"
                          className="w-full bg-slate-900/50 border border-slate-800 rounded-xl pl-10 pr-4 py-2.5 text-sm focus:outline-none focus:border-accent/50"
                        />
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Lead Notes</label>
                      <div className="relative">
                        <MessageSquare className="w-4 h-4 absolute left-3 top-3 text-slate-500" />
                        <textarea 
                          value={selectedLead.notes || ''}
                          onChange={(e) => handleUpdateLead(selectedLead.id, { notes: e.target.value })}
                          placeholder="Add notes about this lead..."
                          rows={4}
                          className="w-full bg-slate-900/50 border border-slate-800 rounded-xl pl-10 pr-4 py-2.5 text-sm focus:outline-none focus:border-accent/50 resize-none"
                        />
                      </div>
                    </div>
                  </div>
                </section>

                {/* Contact Quick Actions */}
                <section className="space-y-4">
                  <h4 className="text-[10px] font-bold text-text-muted uppercase tracking-widest">Quick Actions</h4>
                  <div className="grid grid-cols-2 gap-3">
                    {selectedLead.phone && (
                      <a 
                        href={`tel:${selectedLead.phone}`}
                        className="flex items-center justify-center gap-2 p-3 bg-accent/10 hover:bg-accent/20 text-accent rounded-xl transition-all font-bold text-xs"
                      >
                        <Phone className="w-4 h-4" />
                        Call Lead
                      </a>
                    )}
                    {selectedLead.email && (
                      <a 
                        href={`mailto:${selectedLead.email}`}
                        className="flex items-center justify-center gap-2 p-3 bg-blue-500/10 hover:bg-blue-500/20 text-blue-400 rounded-xl transition-all font-bold text-xs"
                      >
                        <Mail className="w-4 h-4" />
                        Email Lead
                      </a>
                    )}
                    {selectedLead.website && (
                      <a 
                        href={selectedLead.website.startsWith('http') ? selectedLead.website : `https://${selectedLead.website}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-center gap-2 p-3 bg-slate-800 hover:bg-slate-700 text-text-primary rounded-xl transition-all font-bold text-xs col-span-2"
                      >
                        <Globe className="w-4 h-4" />
                        Visit Website
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    )}
                  </div>
                </section>
              </div>

              <div className="p-6 border-t border-card-border bg-slate-900/50">
                <button 
                  onClick={() => setSelectedLead(null)}
                  className="w-full py-3 bg-accent text-background font-bold rounded-xl hover:bg-accent/90 transition-all shadow-lg shadow-accent/20 flex items-center justify-center gap-2"
                >
                  {isUpdating ? <RefreshCcw className="w-4 h-4 animate-spin" /> : <CheckCircle2 className="w-4 h-4" />}
                  Done Editing
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
