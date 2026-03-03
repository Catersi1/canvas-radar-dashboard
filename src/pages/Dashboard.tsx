import React, { useState, useEffect, useMemo } from 'react';
import { 
  ClipboardList, 
  DollarSign, 
  CheckCircle2, 
  Zap,
  Download,
  Filter,
  RefreshCcw,
  AlertCircle
} from 'lucide-react';
import { supabase } from '../lib/supabase';
import { Property, Survey } from '../types/dashboard';
import { generateMockData } from '../lib/mockData';
import MetricCard from '../components/MetricCard';
import Trends from '../components/Trends';
import SurveyTable from '../components/SurveyTable';
import SurveyDetail from '../components/SurveyDetail';
import { format, subDays, startOfDay, isAfter } from 'date-fns';
import { cn } from '../lib/utils';

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState('overview');
  const [properties, setProperties] = useState<Property[]>([]);
  const [surveys, setSurveys] = useState<Survey[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedSurvey, setSelectedSurvey] = useState<Survey | null>(null);

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
        
        // Try to fetch from Supabase
        const { data: propData, error: propError } = await supabase
          .from('properties')
          .select('*');
          
        const { data: survData, error: survError } = await supabase
          .from('surveys')
          .select('*, properties(*)');

        if (propError || survError || !propData || propData.length === 0) {
          console.log('Using mock data...');
          const { properties: mockProps, surveys: mockSurv } = generateMockData();
          setProperties(mockProps);
          setSurveys(mockSurv);
        } else {
          setProperties(propData);
          setSurveys(survData);
        }
      } catch (err) {
        console.error('Error fetching data:', err);
        setError('Failed to connect to data source.');
        // Fallback to mock data
        const { properties: mockProps, surveys: mockSurv } = generateMockData();
        setProperties(mockProps);
        setSurveys(mockSurv);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  // Derived Stats
  const stats = useMemo(() => {
    const totalSurveys = surveys.length;
    const totalEarnings = surveys.reduce((acc, s) => acc + s.earnings, 0);
    const completionRate = totalSurveys > 0 
      ? (surveys.filter(s => s.status === 'complete').length / totalSurveys) * 100 
      : 0;
    
    const today = startOfDay(new Date());
    const todayActivity = surveys.filter(s => isAfter(new Date(s.submitted_at), today)).length;

    return {
      totalSurveys,
      totalEarnings: `$${totalEarnings.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
      completionRate: `${completionRate.toFixed(1)}%`,
      todayActivity
    };
  }, [surveys]);

  // Chart Data
  const chartData = useMemo(() => {
    // Last 30 days survey volume
    const volume = [];
    for (let i = 29; i >= 0; i--) {
      const date = subDays(new Date(), i);
      const dateStr = format(date, 'MMM d');
      const count = surveys.filter(s => format(new Date(s.submitted_at), 'MMM d') === dateStr).length;
      volume.push({ date: dateStr, count });
    }

    // Roof condition distribution
    const conditions = [
      { condition: 'Good', count: surveys.filter(s => s.roof_condition === 'Good').length, color: '#10b981' },
      { condition: 'Fair', count: surveys.filter(s => s.roof_condition === 'Fair').length, color: '#f59e0b' },
      { condition: 'Poor', count: surveys.filter(s => s.roof_condition === 'Poor').length, color: '#ef4444' },
    ];

    return { volume, conditions };
  }, [surveys]);

  const handleExport = () => {
    const headers = ['ID', 'Address', 'Type', 'Status', 'Earnings', 'Roof Condition', 'Submitted At'];
    const rows = surveys.map(s => [
      s.id,
      s.properties?.address,
      s.type,
      s.status,
      s.earnings,
      s.roof_condition,
      s.submitted_at
    ]);
    
    const csvContent = [headers, ...rows].map(e => e.join(",")).join("\n");
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", `canvasradar_export_${format(new Date(), 'yyyy-MM-dd')}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-full gap-4">
        <RefreshCcw className="w-10 h-10 text-emerald-500 animate-spin" />
        <p className="text-slate-400 font-medium">Initializing Mission Control...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* Executive Summary */}
      <section>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <Zap className="w-5 h-5 text-emerald-500" />
            Executive Summary
          </h2>
          <div className="flex items-center gap-2 text-xs text-slate-500 bg-slate-900 px-3 py-1.5 rounded-lg border border-slate-800">
            <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></span>
            Live System Status: Operational
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <MetricCard 
            label="Total Surveys" 
            value={stats.totalSurveys} 
            change="+12.5%" 
            trend="up" 
            icon={ClipboardList} 
            color="emerald"
          />
          <MetricCard 
            label="Total Earnings" 
            value={stats.totalEarnings} 
            change="+8.2%" 
            trend="up" 
            icon={DollarSign} 
            color="blue"
          />
          <MetricCard 
            label="Completion Rate" 
            value={stats.completionRate} 
            change="+2.4%" 
            trend="up" 
            icon={CheckCircle2} 
            color="purple"
          />
          <MetricCard 
            label="Today's Activity" 
            value={stats.todayActivity} 
            change="+4" 
            trend="up" 
            icon={Zap} 
            color="amber"
          />
        </div>
      </section>

      {/* Main Grid: Map & Trends */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        <div className="xl:col-span-2 space-y-8">
          <section>
            <h2 className="text-xl font-bold text-white mb-6">Property Density Heatmap</h2>
            <div className="h-[500px] bg-[#0f0f11] rounded-xl border border-slate-800 relative overflow-hidden p-8">
              {/* Abstract Heatmap Visual */}
              <div className="absolute inset-0 opacity-20 pointer-events-none">
                <div className="absolute top-1/4 left-1/3 w-64 h-64 bg-emerald-500 rounded-full blur-[100px]"></div>
                <div className="absolute bottom-1/3 right-1/4 w-80 h-80 bg-blue-500 rounded-full blur-[120px]"></div>
                <div className="absolute top-1/2 right-1/2 w-48 h-48 bg-purple-500 rounded-full blur-[80px]"></div>
              </div>
              
              <div className="relative h-full flex flex-col">
                <div className="flex justify-between items-start mb-8">
                  <div>
                    <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-1">Visual Distribution</p>
                    <p className="text-sm text-slate-300">Showing relative density of surveyed properties across active regions.</p>
                  </div>
                  <div className="flex gap-4">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-emerald-500"></div>
                      <span className="text-xs text-slate-400">High Density</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                      <span className="text-xs text-slate-400">Medium Density</span>
                    </div>
                  </div>
                </div>

                <div className="flex-1 grid grid-cols-8 grid-rows-6 gap-2">
                  {Array.from({ length: 48 }).map((_, i) => (
                    <div 
                      key={i} 
                      className={cn(
                        "rounded-md border border-slate-800/50 transition-all duration-500",
                        i % 7 === 0 ? "bg-emerald-500/20 border-emerald-500/30" : 
                        i % 5 === 0 ? "bg-blue-500/10 border-blue-500/20" : 
                        "bg-slate-900/30"
                      )}
                    ></div>
                  ))}
                </div>
                
                <div className="mt-6 flex justify-between items-center text-[10px] text-slate-500 uppercase font-bold tracking-tighter">
                  <span>Region: North West</span>
                  <span>Region: Central Hub</span>
                  <span>Region: South East</span>
                </div>
              </div>
            </div>
          </section>
          
          <section>
            <Trends 
              surveyVolumeData={chartData.volume} 
              conditionData={chartData.conditions} 
            />
          </section>
        </div>

        <div className="xl:col-span-1">
          <section className="h-full">
            <h2 className="text-xl font-bold text-white mb-6">Recent Submissions</h2>
            <div className="bg-[#0f0f11] border border-slate-800 rounded-xl p-6 h-[calc(100%-3rem)] overflow-y-auto custom-scrollbar">
              <div className="space-y-4">
                {surveys.slice(0, 10).map((survey) => (
                  <div 
                    key={survey.id}
                    onClick={() => setSelectedSurvey(survey)}
                    className="p-4 bg-slate-900/50 border border-slate-800 rounded-xl hover:border-emerald-500/50 transition-all cursor-pointer group"
                  >
                    <div className="flex justify-between items-start mb-2">
                      <p className="text-sm font-bold text-slate-200 group-hover:text-emerald-400 transition-colors truncate pr-2">
                        {survey.properties?.address}
                      </p>
                      <span className={cn(
                        "text-[10px] font-bold px-2 py-0.5 rounded-full uppercase",
                        survey.type === 'residential' ? "text-blue-400 bg-blue-500/10" : "text-purple-400 bg-purple-500/10"
                      )}>
                        {survey.type}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <p className="text-xs text-slate-500">{survey.properties?.city}, {survey.properties?.state}</p>
                      <p className="text-xs font-mono text-slate-400">{format(new Date(survey.submitted_at), 'HH:mm')}</p>
                    </div>
                  </div>
                ))}
              </div>
              <button className="w-full mt-6 py-2 text-xs font-bold text-slate-400 hover:text-emerald-400 transition-colors border-t border-slate-800 pt-4">
                View All Submissions
              </button>
            </div>
          </section>
        </div>
      </div>

      {/* Data Explorer Table */}
      <section>
        <SurveyTable 
          surveys={surveys} 
          onSelectSurvey={setSelectedSurvey} 
          onExport={handleExport}
        />
      </section>

      {/* Detail Modal */}
      {selectedSurvey && (
        <SurveyDetail 
          survey={selectedSurvey} 
          onClose={() => setSelectedSurvey(null)} 
        />
      )}
    </div>
  );
}
