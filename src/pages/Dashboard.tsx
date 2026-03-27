import React, { useState, useEffect, useMemo } from 'react';
import { 
  ClipboardList, 
  DollarSign, 
  CheckCircle2, 
  Zap,
  Download,
  Filter,
  RefreshCcw,
  AlertCircle,
  Globe,
  TrendingUp,
  Search
} from 'lucide-react';
import { supabase } from '../lib/supabase';
import { Property, Survey } from '../types/dashboard';
import { generateMockData } from '../lib/mockData';
import MetricCard from '../components/MetricCard';
import Trends from '../components/Trends';
import SurveyTable from '../components/SurveyTable';
import SurveyDetail from '../components/SurveyDetail';
import DiscoveryModal from '../components/DiscoveryModal';
import { findPropertyPhoto } from '../services/propertySearch';
import { enrichPropertyData } from '../services/propertyEnrichment';
import { DiscoveredProperty } from '../services/propertyDiscovery';
import { saveToCache } from '../lib/cache';
import { format, subDays, startOfDay, isAfter } from 'date-fns';
import { cn } from '../lib/utils';

export default function AdminDashboard({ onViewAsCustomer }: { onViewAsCustomer?: () => void }) {
  const [activeTab, setActiveTab] = useState('overview');
  const [properties, setProperties] = useState<Property[]>([]);
  const [surveys, setSurveys] = useState<Survey[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedSurvey, setSelectedSurvey] = useState<Survey | null>(null);
  const [showDiscovery, setShowDiscovery] = useState(false);
  const [dismissedWarnings, setDismissedWarnings] = useState<Set<string>>(new Set());
  const [notification, setNotification] = useState<{ message: string; type: 'success' | 'error' | 'info' } | null>(null);

  const [isAutoFetching, setIsAutoFetching] = useState(false);
  const [isAutoEnriching, setIsAutoEnriching] = useState(false);

  const hasApiKey = useMemo(() => {
    const key = process.env.GEMINI_API_KEY || 
                process.env.VITE_GEMINI_API_KEY ||
                (import.meta as any).env?.VITE_GEMINI_API_KEY || 
                (import.meta as any).env?.GEMINI_API_KEY || 
                '';
    return key && key !== 'undefined' && key !== 'null' && key.trim() !== '';
  }, []);

  const hasMapsKey = useMemo(() => {
    const key = process.env.GOOGLE_MAPS_PLATFORM_KEY || 
                (import.meta as any).env?.VITE_GOOGLE_MAPS_PLATFORM_KEY || 
                '';
    return key && key !== 'undefined' && key !== 'null' && key.trim() !== '';
  }, []);

  const autoEnrichProperties = async (surveysList: Survey[], force: boolean = false) => {
    if (isAutoEnriching) return;
    
    const toEnrich = surveysList.filter(s => 
      force ? (s.enrichment_status === 'none' || s.enrichment_status === 'failed') : s.enrichment_status === 'none'
    ).slice(0, 3);

    if (toEnrich.length === 0) {
      if (force) {
        setNotification({ message: "No properties found that need enrichment.", type: 'info' });
        setTimeout(() => setNotification(null), 3000);
      }
      return;
    }

    setIsAutoEnriching(true);
    console.log(`Dashboard: Auto-enriching ${toEnrich.length} properties... (Force: ${force})`);

    let successCount = 0;
    for (const survey of toEnrich) {
      try {
        const fullAddress = `${survey.properties?.address || ''}, ${survey.properties?.city || ''}, ${survey.properties?.state || ''} ${survey.properties?.zip || ''}`;
        const result = await enrichPropertyData(fullAddress);
        if (result.data) {
          successCount++;
          await handleUpdateSurvey(survey.id, {
            sqft: result.data.sqft,
            year_built: result.data.year_built,
            last_sale_price: result.data.last_sale_price,
            last_sale_date: result.data.last_sale_date,
            lot_size: result.data.lot_size,
            bedrooms: result.data.bedrooms,
            bathrooms: result.data.bathrooms,
            property_tax: result.data.property_tax,
            estimated_value: result.data.estimated_value,
            neighborhood_rating: result.data.neighborhood_rating,
            closest_grocery: result.data.closest_grocery,
            closest_highway: result.data.closest_highway,
            closest_elementary: result.data.closest_elementary,
            closest_middle: result.data.closest_middle,
            closest_high: result.data.closest_high,
            closest_gas: result.data.closest_gas,
            closest_walmart: result.data.closest_walmart,
            closest_restaurant: result.data.closest_restaurant,
            safety_rating: result.data.safety_rating,
            safety_notes: result.data.safety_notes,
            enrichment_source: result.data.source_url,
            enrichment_status: 'complete',
            enrichment_error: undefined
          });
        } else {
          await handleUpdateSurvey(survey.id, {
            enrichment_status: 'failed',
            enrichment_error: result.error || "Failed to enrich property data"
          });
        }
      } catch (e) {
        console.error(`Failed to auto-enrich survey ${survey.id}:`, e);
      }
    }
    setIsAutoEnriching(false);
    if (successCount > 0) {
      setNotification({ message: `Successfully enriched ${successCount} properties.`, type: 'success' });
    } else if (toEnrich.length > 0) {
      setNotification({ message: `Failed to enrich ${toEnrich.length} properties. Check API keys.`, type: 'error' });
    }
    setTimeout(() => setNotification(null), 5000);
  };

  const fetchMissingPhotos = async (surveysList: Survey[]) => {
    if (isAutoFetching) return;
    setIsAutoFetching(true);
    
    const surveysToFetch = surveysList.filter(s => !s.external_photo_url).slice(0, 5);
    for (const survey of surveysToFetch) {
      try {
        const fullAddress = `${survey.properties?.address || ''}, ${survey.properties?.city || ''}, ${survey.properties?.state || ''} ${survey.properties?.zip || ''}`;
        const result = await findPropertyPhoto(
          fullAddress,
          survey.properties?.lat,
          survey.properties?.lng
        );
        
        if (result.imageUrl) {
          handleUpdateSurvey(survey.id, {
            external_photo_url: result.imageUrl,
            external_source_url: result.sourceUrl
          });
          
          // Update Supabase if possible
          await supabase
            .from('surveys')
            .update({ 
              external_photo_url: result.imageUrl,
              external_source_url: result.sourceUrl
            })
            .eq('id', survey.id);
        }
      } catch (e) {
        console.error(`Failed to fetch photo for survey ${survey.id}:`, e);
      }
    }
    setIsAutoFetching(false);
  };

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

        let finalSurveys: Survey[] = [];
        if (propError || survError || !propData || propData.length === 0) {
          console.log('Using mock data...');
          const { properties: mockProps, surveys: mockSurv } = generateMockData();
          setProperties(mockProps);
          finalSurveys = mockSurv;
          setSurveys(mockSurv);
        } else {
          setProperties(propData);
          finalSurveys = survData;
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

  useEffect(() => {
    if (surveys.length > 0 && !loading) {
      fetchMissingPhotos(surveys);
      
      const hasUnenriched = surveys.some(s => s.enrichment_status === 'none');
      if (hasUnenriched && !isAutoEnriching) {
        autoEnrichProperties(surveys);
      }
    }
  }, [surveys, isAutoEnriching, loading]);

  // Derived Stats
  const stats = useMemo(() => {
    const totalSurveys = surveys.length;
    const totalEarnings = surveys.reduce((acc, s) => acc + (s.earnings || 0), 0);
    const completionRate = totalSurveys > 0 
      ? (surveys.filter(s => s.status === 'complete').length / totalSurveys) * 100 
      : 0;
    
    const today = startOfDay(new Date());
    const todayActivity = surveys.filter(s => {
      try {
        return s.submitted_at && isAfter(new Date(s.submitted_at), today);
      } catch (e) {
        return false;
      }
    }).length;

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
      const count = surveys.filter(s => {
        try {
          return s.submitted_at && format(new Date(s.submitted_at), 'MMM d') === dateStr;
        } catch (e) {
          return false;
        }
      }).length;
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

  const handleApproveSurvey = async (surveyId: string) => {
    try {
      // Update local state
      setSurveys(prev => prev.map(s => 
        s.id === surveyId ? { ...s, status: 'complete' as const } : s
      ));
      
      // Save to cache
      saveToCache(surveyId, { status: 'complete' });
      
      // Update selected survey to reflect changes immediately
      if (selectedSurvey?.id === surveyId) {
        setSelectedSurvey({ ...selectedSurvey, status: 'complete' as const });
      }
      
      // Update Supabase if possible
      const { error } = await supabase
        .from('surveys')
        .update({ status: 'complete' })
        .eq('id', surveyId);
        
      if (error) {
        console.warn('Supabase update failed, but local state updated:', error);
      }
      
      // Close modal after a short delay to show success state
      setTimeout(() => {
        setSelectedSurvey(null);
      }, 1000);
    } catch (err) {
      console.error('Error approving survey:', err);
    }
  };

  const handleUpdateSurvey = async (id: string, updates: Partial<Survey>) => {
    // Update local state
    setSurveys(prev => prev.map(s => s.id === id ? { ...s, ...updates } : s));
    
    // Save to cache for persistence across mock data resets
    saveToCache(id, updates);
    
    // Update selected survey if it's the one being updated
    setSelectedSurvey(prev => {
      if (prev?.id === id) {
        return { ...prev, ...updates };
      }
      return prev;
    });

    // Update Supabase
    try {
      // If updates contains property data, update the properties table
      if (updates.properties && updates.properties.id) {
        const { id: propId, ...propUpdates } = updates.properties;
        const { error: propError } = await supabase
          .from('properties')
          .update(propUpdates)
          .eq('id', propId);
        
        if (propError) {
          console.warn('Supabase property update failed:', propError);
        }
      }

      // Remove properties from updates before updating surveys table to avoid errors
      const { properties, ...surveyUpdates } = updates as any;
      
      if (Object.keys(surveyUpdates).length > 0) {
        const { error } = await supabase
          .from('surveys')
          .update(surveyUpdates)
          .eq('id', id);
        
        if (error) {
          console.warn('Supabase survey update failed:', error);
        }
      }
    } catch (err) {
      console.error('Error updating Supabase:', err);
    }
  };

  const handleAddDiscoveredProperty = async (prop: DiscoveredProperty) => {
    try {
      // 1. Create property in Supabase
      const { data: newProp, error: propError } = await supabase
        .from('properties')
        .insert({
          address: prop.address,
          city: prop.city,
          state: prop.state,
          zip: prop.zip,
          lat: prop.lat,
          lng: prop.lng
        })
        .select()
        .single();

      if (propError) throw propError;

      // 2. Create survey for this property
      const { data: newSurvey, error: survError } = await supabase
        .from('surveys')
        .insert({
          property_id: newProp.id,
          type: prop.type,
          status: 'pending',
          earnings: prop.type === 'residential' ? 3 : 6,
          enrichment_status: 'none'
        })
        .select('*, properties(*)')
        .single();

      if (survError) throw survError;

      // 3. Update local state
      setProperties(prev => [...prev, newProp]);
      setSurveys(prev => [newSurvey, ...prev]);

      return Promise.resolve();
    } catch (err) {
      console.error('Error adding discovered property:', err);
      // Even if Supabase fails, we can add to local state for the demo
      const mockId = Math.random().toString(36).substr(2, 9);
      const newProp: Property = {
        id: mockId,
        address: prop.address,
        city: prop.city,
        state: prop.state,
        zip: prop.zip,
        lat: prop.lat,
        lng: prop.lng,
        type: prop.type,
        created_at: new Date().toISOString()
      };
      
      const newSurvey: Survey = {
        id: `s-${mockId}`,
        property_id: mockId,
        surveyor_id: 'mock-surveyor',
        type: prop.type,
        status: 'pending',
        earnings: prop.type === 'residential' ? 3 : 6,
        progress: 0,
        roof_condition: 'Unknown',
        house_condition: 'Unknown',
        paint_condition: 'Unknown',
        vehicle_count: 0,
        has_solar_panels: 'No',
        is_for_sale: 'No',
        is_for_rent: 'No',
        is_abandoned: 'No',
        notes: '',
        created_at: new Date().toISOString(),
        submitted_at: new Date().toISOString(),
        enrichment_status: 'none',
        properties: newProp
      };

      setProperties(prev => [...prev, newProp]);
      setSurveys(prev => [newSurvey, ...prev]);
      
      return Promise.resolve();
    }
  };

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
      {notification && (
        <div className={cn(
          "fixed top-4 right-4 z-[60] p-4 rounded-xl border shadow-2xl animate-in slide-in-from-top-4 duration-300 flex items-center gap-3",
          notification.type === 'success' ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-400" :
          notification.type === 'error' ? "bg-red-500/10 border-red-500/20 text-red-400" :
          "bg-blue-500/10 border-blue-500/20 text-blue-400"
        )}>
          <AlertCircle className="w-5 h-5" />
          <p className="text-sm font-medium">{notification.message}</p>
        </div>
      )}

      {!hasApiKey && !dismissedWarnings.has('gemini') && (
        <div className="bg-amber-500/10 border border-amber-500/20 rounded-xl p-4 flex items-start gap-3 mb-4 relative group">
          <AlertCircle className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
          <div className="flex-1">
            <h3 className="text-sm font-bold text-amber-500">Gemini API Key Missing</h3>
            <p className="text-xs text-amber-200/70 mt-1 leading-relaxed">
              Data enrichment and photo search are currently disabled. Please add your <code className="bg-amber-500/20 px-1 rounded text-amber-400">GEMINI_API_KEY</code> to the AI Studio Secrets (⚙️ Settings → Secrets) to enable these features.
            </p>
          </div>
          <button 
            onClick={() => setDismissedWarnings(prev => new Set(prev).add('gemini'))}
            className="p-1 text-amber-500/50 hover:text-amber-500 transition-colors"
          >
            <RefreshCcw className="w-4 h-4 rotate-45" />
          </button>
        </div>
      )}

      {!hasMapsKey && !dismissedWarnings.has('maps') && (
        <div className="bg-blue-500/10 border border-blue-500/20 rounded-xl p-4 flex items-start gap-3 mb-4 relative group">
          <Globe className="w-5 h-5 text-blue-500 shrink-0 mt-0.5" />
          <div className="flex-1">
            <h3 className="text-sm font-bold text-blue-500">Google Maps API Key Missing</h3>
            <p className="text-xs text-blue-200/70 mt-1 leading-relaxed">
              Street View pictures are currently using a fallback. Please add your <code className="bg-blue-500/20 px-1 rounded text-blue-400">GOOGLE_MAPS_PLATFORM_KEY</code> to the AI Studio Secrets to enable high-quality Street View images.
            </p>
          </div>
          <button 
            onClick={() => setDismissedWarnings(prev => new Set(prev).add('maps'))}
            className="p-1 text-blue-500/50 hover:text-blue-500 transition-colors"
          >
            <RefreshCcw className="w-4 h-4 rotate-45" />
          </button>
        </div>
      )}

      {/* Executive Summary */}
      <section>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <Zap className="w-5 h-5 text-emerald-500" />
            Executive Summary
          </h2>
          <div className="flex items-center gap-3">
            {onViewAsCustomer && (
              <button 
                onClick={onViewAsCustomer}
                className="flex items-center gap-2 text-xs text-purple-400 bg-purple-500/10 px-3 py-1.5 rounded-lg border border-purple-500/20 hover:bg-purple-500/20 transition-all"
              >
                <Globe className="w-3.5 h-3.5" />
                View as Customer
              </button>
            )}
            <button 
              onClick={() => setShowDiscovery(true)}
              className="flex items-center gap-2 text-xs text-blue-400 bg-blue-500/10 px-3 py-1.5 rounded-lg border border-blue-500/20 hover:bg-blue-500/20 transition-all"
            >
              <Search className="w-3.5 h-3.5" />
              Discover Properties
            </button>
            <button 
              onClick={() => autoEnrichProperties(surveys, true)}
              disabled={isAutoEnriching}
              className="flex items-center gap-2 text-xs text-emerald-400 bg-emerald-500/10 px-3 py-1.5 rounded-lg border border-emerald-500/20 hover:bg-emerald-500/20 transition-all disabled:opacity-50"
            >
              <TrendingUp className={cn("w-3.5 h-3.5", isAutoEnriching && "animate-spin")} />
              {isAutoEnriching ? 'Enriching...' : 'Enrich All Data'}
            </button>
            <button 
              onClick={() => fetchMissingPhotos(surveys)}
              disabled={isAutoFetching}
              className="flex items-center gap-2 text-xs text-blue-400 bg-blue-500/10 px-3 py-1.5 rounded-lg border border-blue-500/20 hover:bg-blue-500/20 transition-all disabled:opacity-50"
            >
              <Globe className={cn("w-3.5 h-3.5", isAutoFetching && "animate-spin")} />
              {isAutoFetching ? 'Fetching Photos...' : 'Fetch Missing Photos'}
            </button>
            <div className="flex items-center gap-2 text-xs text-slate-500 bg-slate-900 px-3 py-1.5 rounded-lg border border-slate-800">
              <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></span>
              Live System Status: Operational
            </div>
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
                      <p className="text-xs font-mono text-slate-400">
                        {survey.submitted_at ? format(new Date(survey.submitted_at), 'MMM d, HH:mm') : 'N/A'}
                      </p>
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
          onApprove={handleApproveSurvey}
          onUpdate={handleUpdateSurvey}
        />
      )}

      {/* Discovery Modal */}
      {showDiscovery && (
        <DiscoveryModal 
          onClose={() => setShowDiscovery(false)}
          onAddProperty={handleAddDiscoveredProperty}
        />
      )}
    </div>
  );
}
