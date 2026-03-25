import React, { useMemo } from 'react';
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
  ArrowUpRight,
  Plus,
  TrendingUp,
  PieChart,
  MapPin,
  ShieldCheck
} from 'lucide-react';
import { cn } from '../lib/utils';
import MetricCard from '../components/MetricCard';
import { MOCK_CUSTOMERS, MOCK_SURVEYS } from '../types';
import { ResponsiveContainer, PieChart as RePieChart, Pie, Cell, Tooltip as ReTooltip, BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts';

export default function CustomerDashboard() {
  // Simulate current customer (Greystar)
  const customer = MOCK_CUSTOMERS[0];
  const mySurveys = MOCK_SURVEYS.filter(s => s.customer_id === customer.id);

  const stats = useMemo(() => {
    const completed = mySurveys.filter(s => s.status === 'Completed' || s.status === 'complete').length;
    const inProgress = mySurveys.filter(s => s.status === 'In Progress' || s.status === 'pending').length;
    
    return {
      totalSurveys: mySurveys.length,
      monthlyLimit: 200,
      completed,
      inProgress,
      teamMembers: 8,
      nextRenewal: 'Mar 15, 2026',
      totalSpend: '$4,500.00'
    };
  }, [mySurveys]);

  const conditionData = [
    { name: 'Excellent', value: 45, color: '#10b981' },
    { name: 'Good', value: 30, color: '#3b82f6' },
    { name: 'Fair', value: 15, color: '#f59e0b' },
    { name: 'Poor', value: 10, color: '#ef4444' },
  ];

  const usageData = [
    { month: 'Oct', count: 120 },
    { month: 'Nov', count: 145 },
    { month: 'Dec', count: 160 },
    { month: 'Jan', count: 185 },
    { month: 'Feb', count: 120 },
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-white">{customer.name} Portal</h2>
          <p className="text-slate-400 mt-1">Welcome back. Here's your property survey overview.</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="btn-secondary">
            <Download className="w-4 h-4" />
            Export Data
          </button>
          <button className="btn-primary">
            <Plus className="w-4 h-4" />
            Request New Survey
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard 
          label="Total Surveys" 
          value={stats.totalSurveys} 
          change="+12%" 
          trend="up" 
          icon={FileText} 
          color="blue"
        />
        <MetricCard 
          label="Monthly Limit" 
          value={stats.monthlyLimit} 
          change="60% used" 
          trend="neutral" 
          icon={CheckCircle2} 
          color="emerald"
        />
        <MetricCard 
          label="Team Members" 
          value={stats.teamMembers} 
          change="Active" 
          trend="up" 
          icon={Users} 
          color="purple"
        />
        <MetricCard 
          label="Total Spend" 
          value={stats.totalSpend} 
          change="Next: Mar 15" 
          trend="neutral" 
          icon={Wallet} 
          color="amber"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Usage Trend */}
        <div className="lg:col-span-2 bg-[#0f0f11] border border-slate-800 rounded-2xl p-6 shadow-xl">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h3 className="font-bold text-white flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-accent" />
                Survey Usage Trend
              </h3>
              <p className="text-xs text-slate-500 mt-1">Monthly volume of property inspections</p>
            </div>
          </div>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={usageData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                <XAxis 
                  dataKey="month" 
                  stroke="#64748b" 
                  fontSize={12} 
                  tickLine={false} 
                  axisLine={false} 
                />
                <YAxis 
                  stroke="#64748b" 
                  fontSize={12} 
                  tickLine={false} 
                  axisLine={false}
                />
                <ReTooltip 
                  contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #1e293b', borderRadius: '8px' }}
                />
                <Bar 
                  dataKey="count" 
                  fill="#f27d26" 
                  radius={[4, 4, 0, 0]} 
                  barSize={40}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Property Condition Breakdown */}
        <div className="bg-[#0f0f11] border border-slate-800 rounded-2xl p-6 shadow-xl">
          <h3 className="font-bold text-white mb-6 flex items-center gap-2">
            <PieChart className="w-4 h-4 text-accent" />
            Portfolio Condition
          </h3>
          <div className="h-[200px] w-full relative">
            <ResponsiveContainer width="100%" height="100%">
              <RePieChart>
                <Pie
                  data={conditionData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {conditionData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <ReTooltip />
              </RePieChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-6 space-y-3">
            {conditionData.map((item) => (
              <div key={item.name} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full" style={{ backgroundColor: item.color }}></div>
                  <span className="text-xs text-slate-400">{item.name}</span>
                </div>
                <span className="text-xs font-bold text-slate-200">{item.value}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recent Surveys */}
        <div className="lg:col-span-2 space-y-4">
          <h3 className="font-bold text-xl text-white flex items-center gap-2">
            <FileText className="w-5 h-5 text-accent" />
            Recent Surveys
          </h3>
          <div className="bg-[#0f0f11] border border-slate-800 rounded-2xl divide-y divide-slate-800 overflow-hidden">
            {mySurveys.slice(0, 5).map((survey, i) => (
              <div key={i} className="p-4 flex items-center justify-between hover:bg-accent/5 transition-colors cursor-pointer group">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-lg bg-slate-800 flex items-center justify-center text-slate-400 group-hover:text-accent transition-colors">
                    <MapPin className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="font-semibold text-slate-200 group-hover:text-accent transition-colors">{survey.address}</p>
                    <p className="text-xs text-slate-500">{survey.date}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <span className={cn(
                    "px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider",
                    survey.status === 'Completed' || survey.status === 'complete' ? "bg-emerald-500/20 text-emerald-400" : 
                    survey.status === 'In Progress' || survey.status === 'pending' ? "bg-blue-500/20 text-blue-400" : "bg-red-500/20 text-red-400"
                  )}>
                    {survey.status}
                  </span>
                  <ArrowUpRight className="w-4 h-4 text-slate-500 opacity-0 group-hover:opacity-100 transition-all" />
                </div>
              </div>
            ))}
          </div>
          <button className="text-accent text-sm font-medium hover:underline">View all surveys</button>
        </div>

        {/* Quick Actions / Info */}
        <div className="space-y-6">
          <div className="bg-[#0f0f11] border border-slate-800 rounded-2xl p-6 shadow-xl">
            <h4 className="font-bold text-white mb-4 flex items-center gap-2">
              <Key className="w-4 h-4 text-accent" />
              API Access
            </h4>
            <p className="text-sm text-slate-400 mb-4">Integrate CanvasRadar data directly into your CRM or MLS platform.</p>
            <button className="btn-secondary w-full justify-center">Manage API Keys</button>
          </div>

          <div className="bg-[#0f0f11] border border-slate-800 rounded-2xl p-6 shadow-xl">
            <h4 className="font-bold text-white mb-4 flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-accent" />
              Compliance
            </h4>
            <p className="text-sm text-slate-400 mb-4">All surveys meet the latest safety and quality standards.</p>
            <div className="flex items-center gap-2 text-emerald-400 text-xs font-bold">
              <CheckCircle2 className="w-3 h-3" />
              Verified Portfolio
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
