import React, { useState } from 'react';
import { 
  Search, 
  Plus, 
  Star, 
  MapPin, 
  Phone, 
  Mail, 
  TrendingUp, 
  Award,
  MoreVertical,
  CheckCircle2,
  Clock,
  AlertCircle,
  Map as MapIcon,
  Target,
  Coins,
  ArrowUpRight,
  ShieldCheck
} from 'lucide-react';
import { MOCK_SURVEYORS, MOCK_TERRITORIES, Surveyor, Territory } from '../types';
import { cn } from '../lib/utils';

export default function Surveyors() {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState<'surveyors' | 'territories'>('surveyors');

  const filteredSurveyors = MOCK_SURVEYORS.filter(s => 
    s.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    s.territory.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Active': return <CheckCircle2 className="w-3 h-3 text-accent" />;
      case 'On Break': return <Clock className="w-3 h-3 text-yellow-400" />;
      case 'Inactive': return <AlertCircle className="w-3 h-3 text-red-400" />;
      default: return null;
    }
  };

  const getCoverageColor = (pct: number) => {
    if (pct >= 95) return 'text-emerald-400';
    if (pct >= 80) return 'text-yellow-400';
    return 'text-red-400';
  };

  const getCoverageBg = (pct: number) => {
    if (pct >= 95) return 'bg-emerald-500';
    if (pct >= 80) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Field Operations</h2>
          <p className="text-text-muted mt-1">Manage surveyors, territories, and performance bonuses.</p>
        </div>
        <div className="flex gap-3">
          <button className="btn-secondary">
            <MapIcon className="w-4 h-4" />
            Optimize Routes
          </button>
          <button className="btn-primary">
            <Plus className="w-4 h-4" />
            Onboard Surveyor
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-card-border">
        <button 
          onClick={() => setActiveTab('surveyors')}
          className={cn(
            "px-6 py-3 text-sm font-medium transition-all relative",
            activeTab === 'surveyors' ? "text-accent" : "text-text-muted hover:text-text"
          )}
        >
          Surveyors
          {activeTab === 'surveyors' && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-accent" />}
        </button>
        <button 
          onClick={() => setActiveTab('territories')}
          className={cn(
            "px-6 py-3 text-sm font-medium transition-all relative",
            activeTab === 'territories' ? "text-accent" : "text-text-muted hover:text-text"
          )}
        >
          Territories
          {activeTab === 'territories' && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-accent" />}
        </button>
      </div>

      {/* Search */}
      <div className="relative max-w-md">
        <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" />
        <input 
          type="text" 
          placeholder={activeTab === 'surveyors' ? "Search by name or territory..." : "Search territories..."}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full bg-card border border-card-border rounded-lg pl-10 pr-4 py-2 text-sm focus:outline-none focus:border-accent/50 transition-all"
        />
      </div>

      {activeTab === 'surveyors' ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredSurveyors.map((surveyor) => (
            <div key={surveyor.id} className="glass-card p-6 flex flex-col hover:border-accent/30 transition-all group">
              <div className="flex justify-between items-start mb-6">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-full bg-background border border-card-border flex items-center justify-center text-text-muted overflow-hidden">
                    <img 
                      src={`https://picsum.photos/seed/${surveyor.id}/100/100`} 
                      alt={surveyor.name} 
                      className="w-full h-full object-cover"
                      referrerPolicy="no-referrer"
                    />
                  </div>
                  <div>
                    <h3 className="font-bold text-lg group-hover:text-accent transition-colors">{surveyor.name}</h3>
                    <div className="flex items-center gap-1.5 text-xs text-text-muted">
                      {getStatusIcon(surveyor.status)}
                      {surveyor.status} • {surveyor.territory}
                    </div>
                  </div>
                </div>
                <button className="p-1.5 hover:bg-background rounded-lg transition-colors">
                  <MoreVertical className="w-4 h-4 text-text-muted" />
                </button>
              </div>

              {/* Progress & Bonus Section */}
              <div className="bg-background/30 rounded-xl p-4 border border-card-border mb-6 space-y-4">
                <div className="flex justify-between items-end">
                  <div>
                    <p className="text-[10px] text-text-muted uppercase tracking-wider mb-1">Monthly Coverage</p>
                    <p className={cn("text-xl font-bold", getCoverageColor(surveyor.coverage_pct))}>
                      {surveyor.coverage_pct}%
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-[10px] text-text-muted uppercase tracking-wider mb-1">Projected Bonus</p>
                    <p className="text-xl font-bold text-emerald-400">
                      +${surveyor.projected_bonus.toLocaleString()}
                    </p>
                  </div>
                </div>
                <div className="w-full h-1.5 bg-card-border rounded-full overflow-hidden">
                  <div 
                    className={cn("h-full transition-all duration-500", getCoverageBg(surveyor.coverage_pct))}
                    style={{ width: `${surveyor.coverage_pct}%` }}
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4 mb-6">
                <div className="text-center p-2 bg-background/50 rounded-lg border border-card-border">
                  <p className="text-[10px] text-text-muted uppercase tracking-wider">Today</p>
                  <p className="font-bold text-lg">{surveyor.surveysCompletedToday}</p>
                </div>
                <div className="text-center p-2 bg-background/50 rounded-lg border border-card-border">
                  <p className="text-[10px] text-text-muted uppercase tracking-wider">Week</p>
                  <p className="font-bold text-lg">{surveyor.surveysCompletedWeek}</p>
                </div>
                <div className="text-center p-2 bg-background/50 rounded-lg border border-card-border">
                  <p className="text-[10px] text-text-muted uppercase tracking-wider">Month</p>
                  <p className="font-bold text-lg">{surveyor.surveysCompletedMonth}</p>
                </div>
              </div>

              <div className="space-y-3 mb-6">
                <div className="flex justify-between items-center text-sm">
                  <span className="text-text-muted flex items-center gap-2"><Coins className="w-4 h-4" /> Total Earnings</span>
                  <span className="font-bold text-accent">${(surveyor.earningsMonth + surveyor.projected_bonus).toLocaleString()}</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-text-muted flex items-center gap-2"><Star className="w-4 h-4" /> Rating</span>
                  <span className="font-bold flex items-center gap-1">{surveyor.rating} <span className="text-yellow-400 text-xs">★</span></span>
                </div>
              </div>

              <div className="mt-auto pt-4 border-t border-card-border flex gap-3">
                <button className="btn-secondary flex-1 py-1.5 text-xs">View Profile</button>
                <button className="btn-primary flex-1 py-1.5 text-xs">Assign Task</button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="glass-card overflow-hidden">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-background/50 border-b border-card-border">
                <th className="px-6 py-4 text-xs font-bold text-text-muted uppercase tracking-wider">Territory</th>
                <th className="px-6 py-4 text-xs font-bold text-text-muted uppercase tracking-wider">Assigned Surveyor</th>
                <th className="px-6 py-4 text-xs font-bold text-text-muted uppercase tracking-wider">Monthly Coverage</th>
                <th className="px-6 py-4 text-xs font-bold text-text-muted uppercase tracking-wider">Status</th>
                <th className="px-6 py-4 text-xs font-bold text-text-muted uppercase tracking-wider text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-card-border">
              {MOCK_TERRITORIES.map((territory) => {
                const surveyor = MOCK_SURVEYORS.find(s => s.id === territory.assigned_surveyor_id);
                return (
                  <tr key={territory.id} className="hover:bg-accent/5 transition-colors group">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-accent/10 rounded-lg text-accent">
                          <Target className="w-4 h-4" />
                        </div>
                        <span className="font-bold">{territory.name}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded-full overflow-hidden border border-card-border">
                          <img 
                            src={`https://picsum.photos/seed/${surveyor?.id}/50/50`} 
                            alt={surveyor?.name} 
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <span className="text-sm">{surveyor?.name}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-4">
                        <div className="flex-1 h-1.5 bg-card-border rounded-full overflow-hidden max-w-[100px]">
                          <div 
                            className={cn("h-full transition-all duration-500", getCoverageBg(territory.coverage_pct))}
                            style={{ width: `${territory.coverage_pct}%` }}
                          />
                        </div>
                        <span className={cn("text-xs font-bold", getCoverageColor(territory.coverage_pct))}>
                          {territory.completed_properties}/{territory.total_properties} ({territory.coverage_pct}%)
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={cn(
                        "text-[10px] font-bold px-2 py-0.5 rounded-full uppercase",
                        territory.status === 'Healthy' ? "text-emerald-400 bg-emerald-500/10" :
                        territory.status === 'Warning' ? "text-yellow-400 bg-yellow-500/10" : "text-red-400 bg-red-500/10"
                      )}>
                        {territory.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end gap-2">
                        <button className="p-1.5 hover:bg-background rounded-lg transition-colors text-text-muted hover:text-accent">
                          <ArrowUpRight className="w-4 h-4" />
                        </button>
                        <button className="p-1.5 hover:bg-background rounded-lg transition-colors text-text-muted hover:text-accent">
                          <MoreVertical className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          {MOCK_TERRITORIES.some(t => t.status === 'Critical') && (
            <div className="p-4 bg-red-500/10 border-t border-red-500/20 flex items-center justify-between">
              <div className="flex items-center gap-3 text-red-400">
                <AlertCircle className="w-4 h-4" />
                <span className="text-xs font-bold">Critical coverage gaps detected in Downtown and Austin East.</span>
              </div>
              <button className="text-xs font-bold text-red-400 hover:underline">Recruit Surveyors</button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
