import React, { useState } from 'react';
import { 
  Search, 
  Filter, 
  Download, 
  MapPin, 
  Calendar, 
  User, 
  Building,
  CheckCircle2,
  Clock,
  AlertCircle,
  MoreVertical,
  Eye,
  Trash2
} from 'lucide-react';
import { MOCK_SURVEYS, SurveyStatus } from '../types';
import { cn } from '../lib/utils';

export default function Surveys() {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('All');

  const filteredSurveys = MOCK_SURVEYS.filter(s => {
    const matchesSearch = s.address.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         s.surveyorName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         s.customerName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'All' || s.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusConfig = (status: SurveyStatus) => {
    switch (status) {
      case 'Completed': return { icon: CheckCircle2, class: 'bg-accent/20 text-accent' };
      case 'In Progress': return { icon: Clock, class: 'bg-blue-500/20 text-blue-400' };
      case 'Pending': return { icon: AlertCircle, class: 'bg-yellow-500/20 text-yellow-400' };
      case 'Review Required': return { icon: AlertCircle, class: 'bg-red-500/20 text-red-400' };
      default: return { icon: Clock, class: 'bg-gray-500/20 text-gray-400' };
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Surveys</h2>
          <p className="text-text-muted mt-1">Track and review property survey progress.</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="btn-secondary">
            <Download className="w-4 h-4" />
            Export Data
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" />
          <input 
            type="text" 
            placeholder="Search by address, surveyor, or customer..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-card border border-card-border rounded-lg pl-10 pr-4 py-2 text-sm focus:outline-none focus:border-accent/50 transition-all"
          />
        </div>
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-text-muted" />
          <select 
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-card border border-card-border rounded-lg px-4 py-2 text-sm focus:outline-none focus:border-accent/50"
          >
            <option value="All">All Statuses</option>
            <option value="Pending">Pending</option>
            <option value="In Progress">In Progress</option>
            <option value="Completed">Completed</option>
            <option value="Review Required">Review Required</option>
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="glass-card overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-card-border bg-background/30">
              <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-text-muted">Property</th>
              <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-text-muted">Details</th>
              <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-text-muted">Status</th>
              <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-text-muted">Progress</th>
              <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-text-muted text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-card-border">
            {filteredSurveys.map((survey) => {
              const config = getStatusConfig(survey.status);
              return (
                <tr key={survey.id} className="hover:bg-accent/5 transition-colors group">
                  <td className="px-6 py-4">
                    <div className="flex items-start gap-3">
                      <div className="p-2 bg-background border border-card-border rounded-lg text-text-muted mt-1">
                        <MapPin className="w-4 h-4" />
                      </div>
                      <div>
                        <p className="font-semibold text-text-primary group-hover:text-accent transition-colors">{survey.address}</p>
                        <p className="text-xs text-text-muted">{survey.id} • {survey.type}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 text-sm">
                        <User className="w-3 h-3 text-accent" />
                        <span>{survey.surveyorName}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <Building className="w-3 h-3 text-text-muted" />
                        <span className="text-text-muted">{survey.customerName}</span>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className={cn("inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium", config.class)}>
                      <config.icon className="w-3 h-3" />
                      {survey.status}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="w-24">
                      <div className="flex justify-between text-[10px] mb-1">
                        <span>{survey.completionPercentage}%</span>
                      </div>
                      <div className="h-1.5 w-full bg-background rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-accent rounded-full" 
                          style={{ width: `${survey.completionPercentage}%` }}
                        ></div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button className="p-1.5 hover:bg-background rounded-lg text-text-muted hover:text-accent transition-colors">
                        <Eye className="w-4 h-4" />
                      </button>
                      <button className="p-1.5 hover:bg-background rounded-lg text-text-muted hover:text-red-400 transition-colors">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
