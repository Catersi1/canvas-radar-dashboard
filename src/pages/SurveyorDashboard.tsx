import React, { useMemo } from 'react';
import { 
  Zap, 
  DollarSign, 
  Star, 
  ClipboardList, 
  TrendingUp, 
  MapPin, 
  Clock,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import MetricCard from '../components/MetricCard';
import { MOCK_SURVEYORS, MOCK_SURVEYS, MOCK_TERRITORIES } from '../types';
import { format, startOfDay, isAfter } from 'date-fns';
import { cn } from '../lib/utils';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';

export default function SurveyorDashboard() {
  // Simulate current surveyor (Alex Rivera)
  const surveyor = MOCK_SURVEYORS[0];
  const mySurveys = MOCK_SURVEYS.filter(s => s.surveyor_id === surveyor.id);
  const myTerritory = MOCK_TERRITORIES.find(t => t.assigned_surveyor_id === surveyor.id);

  const stats = useMemo(() => {
    const today = startOfDay(new Date());
    const completedToday = mySurveys.filter(s => 
      (s.status === 'Completed' || s.status === 'complete') && 
      s.submitted_at && isAfter(new Date(s.submitted_at), today)
    ).length;

    return {
      earningsToday: surveyor.earningsToday,
      rating: surveyor.rating,
      completedMonth: surveyor.surveysCompletedMonth,
      territoryCoverage: surveyor.coverage_pct,
      completedToday
    };
  }, [mySurveys, surveyor]);

  const earningsData = [
    { day: 'Mon', amount: 18 },
    { day: 'Tue', amount: 24 },
    { day: 'Wed', amount: 21 },
    { day: 'Thu', amount: 30 },
    { day: 'Fri', amount: 24 },
    { day: 'Sat', amount: 15 },
    { day: 'Sun', amount: 0 },
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-white">Welcome back, {surveyor.name}</h2>
          <p className="text-slate-400">You're doing great! You've completed {stats.completedToday} surveys today.</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="px-4 py-2 bg-emerald-500/10 border border-emerald-500/20 rounded-xl flex items-center gap-2">
            <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
            <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider">Online & Active</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard 
          label="Today's Earnings" 
          value={`$${stats.earningsToday}`} 
          change="+15%" 
          trend="up" 
          icon={DollarSign} 
          color="emerald"
        />
        <MetricCard 
          label="Average Rating" 
          value={stats.rating} 
          change="+0.1" 
          trend="up" 
          icon={Star} 
          color="amber"
        />
        <MetricCard 
          label="Surveys This Month" 
          value={stats.completedMonth} 
          change="+8" 
          trend="up" 
          icon={ClipboardList} 
          color="blue"
        />
        <MetricCard 
          label="Territory Coverage" 
          value={`${stats.territoryCoverage}%`} 
          change="+2.4%" 
          trend="up" 
          icon={MapPin} 
          color="purple"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Earnings Trend */}
        <div className="lg:col-span-2 bg-[#0f0f11] border border-slate-800 rounded-2xl p-6 shadow-xl">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h3 className="font-bold text-white flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-emerald-500" />
                Weekly Earnings Trend
              </h3>
              <p className="text-xs text-slate-500 mt-1">Daily breakdown of your inspection revenue</p>
            </div>
          </div>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={earningsData}>
                <defs>
                  <linearGradient id="colorAmount" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                <XAxis 
                  dataKey="day" 
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
                  tickFormatter={(value) => `$${value}`}
                />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #1e293b', borderRadius: '8px' }}
                  itemStyle={{ color: '#10b981' }}
                />
                <Area 
                  type="monotone" 
                  dataKey="amount" 
                  stroke="#10b981" 
                  strokeWidth={3}
                  fillOpacity={1} 
                  fill="url(#colorAmount)" 
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Territory Progress */}
        <div className="bg-[#0f0f11] border border-slate-800 rounded-2xl p-6 shadow-xl">
          <h3 className="font-bold text-white mb-6 flex items-center gap-2">
            <MapPin className="w-4 h-4 text-purple-500" />
            Territory Progress
          </h3>
          <div className="space-y-6">
            <div>
              <div className="flex justify-between items-end mb-2">
                <div>
                  <p className="text-sm font-bold text-slate-200">{myTerritory?.name}</p>
                  <p className="text-[10px] text-slate-500 uppercase tracking-wider">Active Assignment</p>
                </div>
                <span className="text-sm font-bold text-emerald-400">{myTerritory?.coverage_pct}%</span>
              </div>
              <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-emerald-500 transition-all duration-1000" 
                  style={{ width: `${myTerritory?.coverage_pct}%` }}
                ></div>
              </div>
              <p className="text-[10px] text-slate-500 mt-2">
                {myTerritory?.completed_properties} of {myTerritory?.total_properties} properties surveyed
              </p>
            </div>

            <div className="pt-6 border-t border-slate-800 space-y-4">
              <h4 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Next Milestones</h4>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-blue-500/10 flex items-center justify-center text-blue-400 border border-blue-500/20">
                  <TrendingUp className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-300">Reach 98% Coverage</p>
                  <p className="text-[10px] text-slate-500">Bonus: $250.00</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-amber-500/10 flex items-center justify-center text-amber-400 border border-amber-500/20">
                  <Star className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-300">Maintain 4.9 Rating</p>
                  <p className="text-[10px] text-slate-500">Bonus: $100.00</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Pending Tasks */}
      <section>
        <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
          <Clock className="w-5 h-5 text-amber-500" />
          Pending Assignments
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {mySurveys.filter(s => s.status === 'Pending' || s.status === 'pending').slice(0, 3).map((survey) => (
            <div key={survey.id} className="bg-[#0f0f11] border border-slate-800 rounded-2xl p-5 hover:border-accent/50 transition-all group cursor-pointer">
              <div className="flex justify-between items-start mb-4">
                <div className="p-2 bg-slate-800 rounded-xl text-slate-400 group-hover:text-accent transition-colors">
                  <MapPin className="w-5 h-5" />
                </div>
                <span className="text-[10px] font-bold px-2 py-1 bg-amber-500/10 text-amber-500 rounded-full uppercase tracking-wider">
                  Pending
                </span>
              </div>
              <h4 className="font-bold text-slate-200 group-hover:text-accent transition-colors">{survey.address}</h4>
              <p className="text-xs text-slate-500 mt-1">{survey.customerName}</p>
              <div className="mt-6 pt-4 border-t border-slate-800 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Clock className="w-3 h-3 text-slate-500" />
                  <span className="text-[10px] text-slate-500">Assigned 2h ago</span>
                </div>
                <button className="text-xs font-bold text-accent hover:underline">Start Survey</button>
              </div>
            </div>
          ))}
          <div className="bg-slate-900/20 border border-dashed border-slate-800 rounded-2xl p-5 flex flex-col items-center justify-center text-center space-y-3">
            <div className="p-3 bg-slate-800/50 rounded-full">
              <AlertCircle className="w-6 h-6 text-slate-600" />
            </div>
            <div>
              <p className="text-sm font-bold text-slate-400">No more assignments</p>
              <p className="text-xs text-slate-600">Check back later for new properties in your territory.</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
