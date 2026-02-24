import React from 'react';
import { 
  ArrowLeft, 
  LayoutDashboard, 
  FileText, 
  Users, 
  Wallet, 
  Key, 
  Download,
  CheckCircle2,
  Clock,
  ArrowUpRight
} from 'lucide-react';
import { cn } from '../lib/utils';

interface CustomerPortalProps {
  onBack: () => void;
}

export default function CustomerPortal({ onBack }: CustomerPortalProps) {
  const customerStats = [
    { label: 'Total Surveys', value: '120', icon: FileText },
    { label: 'Monthly Limit', value: '200', icon: CheckCircle2 },
    { label: 'Team Members', value: '8', icon: Users },
    { label: 'Next Renewal', value: 'Mar 15', icon: Clock },
  ];

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button 
            onClick={onBack}
            className="p-2 hover:bg-card rounded-full transition-colors text-text-muted hover:text-text-primary"
          >
            <ArrowLeft className="w-6 h-6" />
          </button>
          <div>
            <h2 className="text-3xl font-bold tracking-tight">Greystar Portal</h2>
            <p className="text-text-muted mt-1">Welcome back, Sarah. Here's your property survey overview.</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button className="btn-secondary">
            <Download className="w-4 h-4" />
            Export Data
          </button>
          <button className="btn-primary">
            Request New Survey
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {customerStats.map((stat, i) => (
          <div key={i} className="glass-card p-6">
            <div className="p-2 bg-accent/10 rounded-lg text-accent w-fit mb-4">
              <stat.icon className="w-5 h-5" />
            </div>
            <p className="text-sm text-text-muted uppercase tracking-wider font-medium">{stat.label}</p>
            <h3 className="text-2xl font-bold mt-1">{stat.value}</h3>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recent Surveys */}
        <div className="lg:col-span-2 space-y-4">
          <h3 className="font-bold text-xl flex items-center gap-2">
            <FileText className="w-5 h-5 text-accent" />
            Recent Surveys
          </h3>
          <div className="glass-card divide-y divide-card-border">
            {[
              { address: '742 Evergreen Terrace', status: 'Completed', date: 'Feb 22, 2026' },
              { address: '123 Maple Avenue', status: 'In Progress', date: 'Feb 21, 2026' },
              { address: '456 Oak Street', status: 'Review Required', date: 'Feb 20, 2026' },
            ].map((survey, i) => (
              <div key={i} className="p-4 flex items-center justify-between hover:bg-accent/5 transition-colors cursor-pointer group">
                <div>
                  <p className="font-semibold group-hover:text-accent transition-colors">{survey.address}</p>
                  <p className="text-xs text-text-muted">{survey.date}</p>
                </div>
                <div className="flex items-center gap-4">
                  <span className={cn(
                    "px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider",
                    survey.status === 'Completed' ? "bg-accent/20 text-accent" : 
                    survey.status === 'In Progress' ? "bg-blue-500/20 text-blue-400" : "bg-red-500/20 text-red-400"
                  )}>
                    {survey.status}
                  </span>
                  <ArrowUpRight className="w-4 h-4 text-text-muted opacity-0 group-hover:opacity-100 transition-all" />
                </div>
              </div>
            ))}
          </div>
          <button className="text-accent text-sm font-medium hover:underline">View all surveys</button>
        </div>

        {/* Quick Actions / Info */}
        <div className="space-y-6">
          <div className="glass-card p-6">
            <h4 className="font-bold mb-4 flex items-center gap-2">
              <Key className="w-4 h-4 text-accent" />
              API Access
            </h4>
            <p className="text-sm text-text-muted mb-4">Integrate CanvasRadar data directly into your CRM or MLS platform.</p>
            <button className="btn-secondary w-full justify-center">Manage API Keys</button>
          </div>

          <div className="glass-card p-6">
            <h4 className="font-bold mb-4 flex items-center gap-2">
              <Wallet className="w-4 h-4 text-accent" />
              Billing
            </h4>
            <div className="space-y-3 mb-4">
              <div className="flex justify-between text-sm">
                <span className="text-text-muted">Current Plan</span>
                <span className="font-bold">Enterprise</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-text-muted">Next Invoice</span>
                <span className="font-bold">$4,500.00</span>
              </div>
            </div>
            <button className="btn-secondary w-full justify-center">View Invoices</button>
          </div>
        </div>
      </div>
    </div>
  );
}
