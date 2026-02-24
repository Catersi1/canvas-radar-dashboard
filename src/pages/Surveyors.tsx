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
  AlertCircle
} from 'lucide-react';
import { MOCK_SURVEYORS, Surveyor } from '../types';
import { cn } from '../lib/utils';

export default function Surveyors() {
  const [searchTerm, setSearchTerm] = useState('');

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

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Surveyors</h2>
          <p className="text-text-muted mt-1">Monitor performance and manage your field team.</p>
        </div>
        <button className="btn-primary">
          <Plus className="w-4 h-4" />
          Onboard Surveyor
        </button>
      </div>

      {/* Search */}
      <div className="relative max-w-md">
        <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" />
        <input 
          type="text" 
          placeholder="Search by name or territory..." 
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full bg-card border border-card-border rounded-lg pl-10 pr-4 py-2 text-sm focus:outline-none focus:border-accent/50 transition-all"
        />
      </div>

      {/* Grid */}
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
                <span className="text-text-muted flex items-center gap-2"><TrendingUp className="w-4 h-4" /> Monthly Earnings</span>
                <span className="font-bold text-accent">${surveyor.earningsMonth.toLocaleString()}</span>
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
    </div>
  );
}
