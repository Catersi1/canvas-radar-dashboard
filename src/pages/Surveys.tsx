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
  Trash2,
  RefreshCcw,
  TrendingUp,
  Globe
} from 'lucide-react';
import { cn } from '../lib/utils';
import { format } from 'date-fns';
import { generateMockData } from '../lib/mockData';
import { Survey } from '../types/dashboard';
import SurveyDetail from '../components/SurveyDetail';
import { findPropertyPhoto } from '../services/propertySearch';
import { enrichPropertyData } from '../services/propertyEnrichment';
import { supabase } from '../lib/supabase';
import { saveToCache } from '../lib/cache';

export default function Surveys() {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('All');
  const [surveys, setSurveys] = useState<Survey[]>(() => generateMockData().surveys);
  const [selectedSurvey, setSelectedSurvey] = useState<Survey | null>(null);
  const [isAutoFetching, setIsAutoFetching] = useState(false);
  const [isAutoEnriching, setIsAutoEnriching] = useState(false);
  const [syncProgress, setSyncProgress] = useState<{ current: number; total: number } | null>(null);
  const [apiKeyMissing, setApiKeyMissing] = useState(false);

  React.useEffect(() => {
    const key = process.env.GEMINI_API_KEY;
    if (!key || key === 'undefined') {
      setApiKeyMissing(true);
    }
  }, []);

  const autoEnrichProperties = async (surveysList: Survey[], forceAll = false) => {
    if (isAutoEnriching || !!syncProgress || apiKeyMissing) return;
    
    const toEnrich = surveysList.filter(s => 
      s.enrichment_status === 'none' || (forceAll && s.enrichment_status === 'failed')
    ).slice(0, 3);
    
    if (toEnrich.length === 0) return;

    setIsAutoEnriching(true);
    console.log(`Auto-enriching ${toEnrich.length} properties...`);

    for (const survey of toEnrich) {
      try {
        const fullAddress = `${survey.properties?.address}, ${survey.properties?.city}, ${survey.properties?.state} ${survey.properties?.zip}`;
        console.log(`Attempting enrichment for: ${fullAddress}`);
        const result = await enrichPropertyData(fullAddress);
        if (result.data) {
          await handleUpdate(survey.id, {
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
          // Mark as failed so we don't keep retrying immediately
          await handleUpdate(survey.id, {
            enrichment_status: 'failed',
            enrichment_error: result.error || "Failed to enrich property data"
          });
        }
      } catch (e) {
        console.error(`Failed to auto-enrich survey ${survey.id}:`, e);
        await handleUpdate(survey.id, {
          enrichment_status: 'failed'
        });
      }
      // Small delay to avoid rate limits
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
    setIsAutoEnriching(false);
  };

  const fetchMissingPhotos = async (surveysList: Survey[]) => {
    if (isAutoFetching || !!syncProgress) return;
    setIsAutoFetching(true);
    
    const surveysToFetch = surveysList.filter(s => !s.external_photo_url).slice(0, 5);
    for (const survey of surveysToFetch) {
      try {
        const result = await findPropertyPhoto(
          survey.properties?.address || '',
          survey.properties?.lat,
          survey.properties?.lng
        );
        
        if (result.imageUrl) {
          handleUpdate(survey.id, {
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

  const syncLibrary = async () => {
    if (isAutoEnriching || isAutoFetching) return;
    
    const toProcess = surveys.filter(s => 
      s.enrichment_status !== 'complete' || !s.external_photo_url
    );
    
    if (toProcess.length === 0) {
      alert("Library is already fully enriched and has all photos.");
      return;
    }

    setSyncProgress({ current: 0, total: toProcess.length });
    
    for (let i = 0; i < toProcess.length; i++) {
      const survey = toProcess[i];
      setSyncProgress({ current: i + 1, total: toProcess.length });
      
      // 1. Enrich Data if needed
      if (survey.enrichment_status !== 'complete') {
        try {
          const fullAddress = `${survey.properties?.address}, ${survey.properties?.city}, ${survey.properties?.state} ${survey.properties?.zip}`;
          const result = await enrichPropertyData(fullAddress);
          if (result.data) {
            await handleUpdate(survey.id, {
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
            await handleUpdate(survey.id, { 
              enrichment_status: 'failed',
              enrichment_error: result.error || "Failed to enrich property data"
            });
          }
        } catch (e) {
          console.error("Sync enrichment error:", e);
        }
      }

      // 2. Fetch Photo if needed
      if (!survey.external_photo_url) {
        try {
          const result = await findPropertyPhoto(
            survey.properties?.address || '',
            survey.properties?.lat,
            survey.properties?.lng
          );
          if (result.imageUrl) {
            await handleUpdate(survey.id, {
              external_photo_url: result.imageUrl,
              external_source_url: result.sourceUrl
            });
          }
        } catch (e) {
          console.error("Sync photo error:", e);
        }
      }
      
      // Small delay to avoid rate limits
      await new Promise(resolve => setTimeout(resolve, 500));
    }
    
    setSyncProgress(null);
    alert("Library sync complete!");
  };

  React.useEffect(() => {
    if (surveys.length > 0 && !syncProgress) {
      fetchMissingPhotos(surveys);
      
      // Only trigger auto-enrich if not already enriching
      const hasUnenriched = surveys.some(s => s.enrichment_status === 'none');
      if (hasUnenriched && !isAutoEnriching) {
        autoEnrichProperties(surveys);
      }
    }
  }, [surveys, isAutoEnriching, syncProgress]);

  const handleApprove = (id: string) => {
    setSurveys(prev => prev.map(s => 
      s.id === id ? { ...s, status: 'complete' as const, progress: 100 } : s
    ));
    
    // Update selected survey to reflect changes immediately
    if (selectedSurvey?.id === id) {
      setSelectedSurvey({ ...selectedSurvey, status: 'complete' as const, progress: 100 });
    }
    
    // Close modal after a short delay to show success state
    setTimeout(() => {
      setSelectedSurvey(null);
    }, 1000);
  };

  const handleUpdate = async (id: string, updates: Partial<Survey>) => {
    console.log("Updating survey:", id, updates);
    
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
      const { error } = await supabase
        .from('surveys')
        .update(updates)
        .eq('id', id);
      
      if (error) {
        console.warn('Supabase update failed:', error);
      }
    } catch (err) {
      console.error('Error updating Supabase:', err);
    }
  };

  const filteredSurveys = surveys.filter(s => {
    const address = s.properties?.address || '';
    const surveyor = s.surveyor_id || '';
    const customer = s.property_id || '';
    
    const matchesSearch = address.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         surveyor.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         customer.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'All' || s.status === statusFilter.toLowerCase();
    return matchesSearch && matchesStatus;
  });

  const getStatusConfig = (status: string) => {
    switch (status) {
      case 'complete': return { icon: CheckCircle2, class: 'bg-accent/20 text-accent' };
      case 'pending': return { icon: Clock, class: 'bg-yellow-500/20 text-yellow-400' };
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
          {apiKeyMissing && (
            <div className="flex items-center gap-2 px-3 py-1.5 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-xs font-bold animate-pulse">
              <AlertCircle className="w-4 h-4" />
              API Key Missing
            </div>
          )}
          {syncProgress && (
            <div className="flex items-center gap-3 px-4 py-2 bg-accent/10 border border-accent/20 rounded-xl animate-pulse">
              <RefreshCcw className="w-4 h-4 text-accent animate-spin" />
              <div className="flex flex-col">
                <span className="text-[10px] font-bold text-accent uppercase tracking-widest">Syncing Library</span>
                <span className="text-xs text-white font-mono">{syncProgress.current} / {syncProgress.total}</span>
              </div>
            </div>
          )}
          <button 
            onClick={syncLibrary}
            disabled={isAutoEnriching || isAutoFetching || !!syncProgress}
            className="flex items-center gap-2 px-4 py-2 bg-accent hover:bg-accent/90 text-black text-sm font-bold rounded-xl transition-all shadow-lg shadow-accent/20 disabled:opacity-50"
          >
            <RefreshCcw className={cn("w-4 h-4", (isAutoEnriching || isAutoFetching || !!syncProgress) && "animate-spin")} />
            {syncProgress ? 'Syncing...' : 'Sync Library'}
          </button>
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
              <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-text-muted">Submitted</th>
              <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-text-muted">Progress</th>
              <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-text-muted text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-card-border">
            {filteredSurveys.map((survey) => {
              const config = getStatusConfig(survey.status);
              return (
                <tr 
                  key={survey.id} 
                  className="hover:bg-accent/5 transition-colors group cursor-pointer"
                  onClick={() => setSelectedSurvey(survey)}
                >
                  <td className="px-6 py-4">
                    <div className="flex items-start gap-3">
                      <div className="p-2 bg-background border border-card-border rounded-lg text-text-muted mt-1">
                        <MapPin className="w-4 h-4" />
                      </div>
                      <div>
                        <p className="font-semibold text-text-primary group-hover:text-accent transition-colors">{survey.properties?.address}</p>
                        <p className="text-xs text-text-muted">{survey.id} • {survey.type}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 text-sm">
                        <User className="w-3 h-3 text-accent" />
                        <span>{survey.surveyor_id}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <Building className="w-3 h-3 text-text-muted" />
                        <span className="text-text-muted">{survey.properties?.city}, {survey.properties?.state}</span>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className={cn("inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium", config.class)}>
                      <config.icon className="w-3 h-3" />
                      {survey.status === 'pending' ? 'Review Required' : survey.status}
                    </div>
                    {survey.enrichment_status === 'failed' && (
                      <div className="mt-1 flex flex-col gap-0.5">
                        <div className="flex items-center gap-1 text-[10px] text-red-400 font-medium">
                          <AlertCircle className="w-2.5 h-2.5" />
                          Enrichment Failed
                        </div>
                        {survey.enrichment_error && (
                          <span className="text-[9px] text-red-400/60 truncate max-w-[120px] font-mono" title={survey.enrichment_error}>
                            {survey.enrichment_error}
                          </span>
                        )}
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-4 text-sm text-text-muted">
                    {survey.submitted_at ? format(new Date(survey.submitted_at), 'MMM d, yyyy HH:mm') : 'N/A'}
                  </td>
                  <td className="px-6 py-4">
                    <div className="w-24">
                      <div className="flex justify-between text-[10px] mb-1">
                        <span>{Math.round(survey.progress)}%</span>
                      </div>
                      <div className="h-1.5 w-full bg-background rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-accent rounded-full" 
                          style={{ width: `${survey.progress}%` }}
                        ></div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      {survey.status !== 'complete' && (
                        <button 
                          onClick={(e) => {
                            e.stopPropagation();
                            handleApprove(survey.id);
                          }}
                          className="p-1.5 hover:bg-background rounded-lg text-emerald-500 hover:text-emerald-400 transition-colors"
                          title="Approve Inspection"
                        >
                          <CheckCircle2 className="w-4 h-4" />
                        </button>
                      )}
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedSurvey(survey);
                        }}
                        className="p-1.5 hover:bg-background rounded-lg text-text-muted hover:text-accent transition-colors"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          // Handle delete
                        }}
                        className="p-1.5 hover:bg-background rounded-lg text-text-muted hover:text-red-400 transition-colors"
                      >
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

      {/* Detail Modal */}
      {selectedSurvey && (
        <SurveyDetail 
          survey={selectedSurvey} 
          onClose={() => setSelectedSurvey(null)} 
          onApprove={handleApprove}
          onUpdate={handleUpdate}
        />
      )}
    </div>
  );
}
