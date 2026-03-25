import React from 'react';
import { 
  TrendingUp, 
  Users, 
  Target, 
  Map, 
  ArrowUpRight, 
  BarChart3,
  PieChart as PieChartIcon,
  Activity
} from 'lucide-react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  LineChart,
  Line,
  Cell,
  PieChart,
  Pie
} from 'recharts';
import { REVENUE_BY_SEGMENT } from '../types';
import { cn } from '../lib/utils';

const COLORS = ['#4ade80', '#22c55e', '#16a34a', '#15803d', '#14532d'];

export default function Analytics() {
  const ltvData = [
    { segment: 'Real Estate', ltv: 8500, cac: 1200 },
    { segment: 'Insurance', ltv: 15000, cac: 2500 },
    { segment: 'Solar', ltv: 9200, cac: 1800 },
    { segment: 'Home Services', ltv: 4500, cac: 800 },
    { segment: 'Government', ltv: 45000, cac: 5000 },
  ];

  const bonusTrendData = [
    { month: 'Oct', payout: 4200, surveyors: 12 },
    { month: 'Nov', payout: 5800, surveyors: 15 },
    { month: 'Dec', payout: 8500, surveyors: 18 },
    { month: 'Jan', payout: 7200, surveyors: 20 },
    { month: 'Feb', payout: 9800, surveyors: 22 },
    { month: 'Mar', payout: 12500, surveyors: 25 },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Advanced Analytics</h2>
        <p className="text-text-muted mt-1">Deep dive into platform growth and efficiency metrics.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* LTV vs CAC */}
        <div className="glass-card p-6">
          <h3 className="font-bold text-lg mb-8 flex items-center gap-2">
            <Target className="w-5 h-5 text-accent" />
            LTV vs CAC by Segment
          </h3>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={ltvData} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="#3a453a" horizontal={true} vertical={false} />
                <XAxis type="number" stroke="#86a386" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis dataKey="segment" type="category" stroke="#86a386" fontSize={12} tickLine={false} axisLine={false} width={100} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#252b25', border: '1px solid #3a453a', borderRadius: '8px' }}
                />
                <Bar dataKey="ltv" fill="#4ade80" radius={[0, 4, 4, 0]} name="Lifetime Value" />
                <Bar dataKey="cac" fill="#86a386" radius={[0, 4, 4, 0]} name="Acquisition Cost" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Bonus Payout Trends */}
        <div className="glass-card p-6">
          <h3 className="font-bold text-lg mb-8 flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-accent" />
            Surveyor Bonus Payout Trends
          </h3>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={bonusTrendData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#3a453a" vertical={false} />
                <XAxis dataKey="month" stroke="#86a386" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="#86a386" fontSize={12} tickLine={false} axisLine={false} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#252b25', border: '1px solid #3a453a', borderRadius: '8px' }}
                />
                <Line 
                  type="monotone" 
                  dataKey="payout" 
                  stroke="#4ade80" 
                  strokeWidth={3} 
                  dot={{ fill: '#4ade80', strokeWidth: 2, r: 4 }} 
                  activeDot={{ r: 6, strokeWidth: 0 }}
                  name="Total Payout ($)"
                />
                <Line 
                  type="monotone" 
                  dataKey="surveyors" 
                  stroke="#86a386" 
                  strokeWidth={2} 
                  strokeDasharray="5 5"
                  dot={{ fill: '#86a386', r: 3 }}
                  name="Eligible Surveyors"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Coverage Gaps */}
      <div className="glass-card p-6">
        <h3 className="font-bold text-lg mb-6 flex items-center gap-2">
          <Map className="w-5 h-5 text-accent" />
          Geographic Coverage Gaps
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {[
            { region: 'North Austin', demand: 'High', supply: 'Low', action: 'Recruit' },
            { region: 'Round Rock', demand: 'Medium', supply: 'Medium', action: 'Stable' },
            { region: 'San Marcos', demand: 'High', supply: 'None', action: 'Urgent' },
            { region: 'Cedar Park', demand: 'Low', supply: 'High', action: 'Reassign' },
          ].map((gap, i) => (
            <div key={i} className="p-4 bg-background/50 rounded-xl border border-card-border">
              <p className="font-bold mb-1">{gap.region}</p>
              <div className="flex justify-between text-xs mb-3">
                <span className="text-text-muted">Demand: <span className="text-text-primary">{gap.demand}</span></span>
                <span className="text-text-muted">Supply: <span className="text-text-primary">{gap.supply}</span></span>
              </div>
              <span className={cn(
                "text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 rounded",
                gap.action === 'Urgent' ? "bg-red-500/20 text-red-400" : 
                gap.action === 'Recruit' ? "bg-accent/20 text-accent" : "bg-card text-text-muted"
              )}>
                {gap.action}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
