import React from 'react';
import { LucideIcon } from 'lucide-react';
import { cn } from '../lib/utils';

interface MetricCardProps {
  label: string;
  value: string | number;
  change?: string;
  trend?: 'up' | 'down' | 'neutral';
  icon: LucideIcon;
  color?: string;
}

export default function MetricCard({ label, value, change, trend, icon: Icon, color = 'emerald' }: MetricCardProps) {
  const colorClasses = {
    emerald: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20',
    blue: 'text-blue-400 bg-blue-500/10 border-blue-500/20',
    purple: 'text-purple-400 bg-purple-500/10 border-purple-500/20',
    amber: 'text-amber-400 bg-amber-500/10 border-amber-500/20',
  };

  return (
    <div className="bg-[#0f0f11] border border-slate-800 rounded-xl p-6 hover:border-slate-700 transition-all group">
      <div className="flex justify-between items-start mb-4">
        <div className={cn("p-2 rounded-lg border", colorClasses[color as keyof typeof colorClasses])}>
          <Icon className="w-5 h-5" />
        </div>
        {change && (
          <span className={cn(
            "text-xs font-bold px-2 py-1 rounded-full",
            trend === 'up' ? "text-emerald-400 bg-emerald-500/10" : 
            trend === 'down' ? "text-red-400 bg-red-500/10" : "text-slate-400 bg-slate-500/10"
          )}>
            {change}
          </span>
        )}
      </div>
      <div>
        <p className="text-slate-500 text-xs font-semibold uppercase tracking-wider mb-1">{label}</p>
        <h3 className="text-2xl font-bold text-white group-hover:text-emerald-400 transition-colors">{value}</h3>
      </div>
    </div>
  );
}
