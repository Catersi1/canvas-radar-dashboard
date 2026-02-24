import React from 'react';
import { 
  Users, 
  FileText, 
  DollarSign, 
  TrendingUp, 
  Map, 
  ArrowUpRight, 
  ArrowDownRight,
  ExternalLink,
  Plus
} from 'lucide-react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  PieChart, 
  Pie, 
  Cell,
  LineChart,
  Line,
  AreaChart,
  Area
} from 'recharts';
import { REVENUE_BY_SEGMENT, SURVEYS_OVER_TIME } from '../types';
import { cn } from '../lib/utils';

const COLORS = ['#4ade80', '#22c55e', '#16a34a', '#15803d', '#14532d'];

interface DashboardProps {
  onViewAsCustomer: () => void;
}

export default function Dashboard({ onViewAsCustomer }: DashboardProps) {
  const stats = [
    { label: 'Total Surveys (MTD)', value: '1,284', change: '+12.5%', trend: 'up', icon: FileText },
    { label: 'Active Surveyors', value: '42', change: '+3', trend: 'up', icon: Users },
    { label: 'Monthly Revenue', value: '$64,500', change: '+8.2%', trend: 'up', icon: DollarSign },
    { label: 'Retention Rate', value: '98.4%', change: '-0.2%', trend: 'down', icon: TrendingUp },
  ];

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Platform Overview</h2>
          <p className="text-text-muted mt-1">Real-time performance metrics for CanvasRadar.</p>
        </div>
        <div className="flex items-center gap-3">
          <button onClick={onViewAsCustomer} className="btn-secondary">
            <ExternalLink className="w-4 h-4" />
            View as Customer
          </button>
          <button className="btn-primary">
            <Plus className="w-4 h-4" />
            New Survey
          </button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, i) => (
          <div key={i} className="glass-card p-6 group hover:border-accent/30 transition-colors">
            <div className="flex items-center justify-between mb-4">
              <div className="p-2 bg-accent/10 rounded-lg text-accent">
                <stat.icon className="w-5 h-5" />
              </div>
              <div className={`flex items-center gap-1 text-xs font-medium ${stat.trend === 'up' ? 'text-accent' : 'text-red-400'}`}>
                {stat.trend === 'up' ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
                {stat.change}
              </div>
            </div>
            <p className="text-sm text-text-muted uppercase tracking-wider font-medium">{stat.label}</p>
            <h3 className="text-2xl font-bold mt-1">{stat.value}</h3>
          </div>
        ))}
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Line Chart */}
        <div className="lg:col-span-2 glass-card p-6">
          <div className="flex items-center justify-between mb-8">
            <h3 className="font-bold text-lg">Survey Activity Trends</h3>
            <select className="bg-background border border-card-border rounded-lg px-3 py-1 text-xs focus:outline-none focus:border-accent">
              <option>Last 7 Days</option>
              <option>Last 30 Days</option>
              <option>Year to Date</option>
            </select>
          </div>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={SURVEYS_OVER_TIME}>
                <defs>
                  <linearGradient id="colorRes" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#4ade80" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#4ade80" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorCom" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#86a386" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#86a386" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#3a453a" vertical={false} />
                <XAxis 
                  dataKey="date" 
                  stroke="#86a386" 
                  fontSize={12} 
                  tickLine={false} 
                  axisLine={false}
                  tickFormatter={(val) => val.split('-').slice(1).join('/')}
                />
                <YAxis stroke="#86a386" fontSize={12} tickLine={false} axisLine={false} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#252b25', border: '1px solid #3a453a', borderRadius: '8px' }}
                  itemStyle={{ color: '#f0fdf4' }}
                />
                <Area type="monotone" dataKey="residential" stroke="#4ade80" fillOpacity={1} fill="url(#colorRes)" strokeWidth={2} />
                <Area type="monotone" dataKey="commercial" stroke="#86a386" fillOpacity={1} fill="url(#colorCom)" strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Pie Chart */}
        <div className="glass-card p-6">
          <h3 className="font-bold text-lg mb-8">Revenue by Segment</h3>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={REVENUE_BY_SEGMENT}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {REVENUE_BY_SEGMENT.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ backgroundColor: '#252b25', border: '1px solid #3a453a', borderRadius: '8px' }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-4 space-y-2">
            {REVENUE_BY_SEGMENT.map((item, i) => (
              <div key={i} className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[i % COLORS.length] }}></div>
                  <span className="text-text-muted">{item.name}</span>
                </div>
                <span className="font-medium">${item.value.toLocaleString()}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Territory Heatmap Mockup */}
      <div className="glass-card p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="font-bold text-lg">Geographic Activity</h3>
          <div className="flex items-center gap-2 text-xs text-text-muted">
            <Map className="w-4 h-4" />
            Top Territories: Austin, Dallas, Houston
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { city: 'Austin, TX', leads: 452, growth: '+18%', color: 'bg-accent' },
            { city: 'Dallas, TX', leads: 312, growth: '+12%', color: 'bg-accent/80' },
            { city: 'Houston, TX', leads: 284, growth: '+5%', color: 'bg-accent/60' },
          ].map((territory, i) => (
            <div key={i} className="p-4 bg-background/50 rounded-xl border border-card-border">
              <div className="flex justify-between items-start mb-2">
                <span className="font-semibold">{territory.city}</span>
                <span className="text-xs text-accent font-medium">{territory.growth}</span>
              </div>
              <div className="flex items-end gap-2">
                <span className="text-2xl font-bold">{territory.leads}</span>
                <span className="text-xs text-text-muted mb-1">surveys</span>
              </div>
              <div className="mt-3 h-1.5 w-full bg-card rounded-full overflow-hidden">
                <div className={cn("h-full rounded-full", territory.color)} style={{ width: `${(territory.leads / 500) * 100}%` }}></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
