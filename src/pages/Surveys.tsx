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
  TrendingUp
} from 'lucide-react';
import { cn } from '../lib/utils';
import { format } from 'date-fns';
import { generateMockData } from '../lib/mockData';
import { Survey } from '../types/dashboard';
import SurveyDetail from '../components/SurveyDetail';
import { findPropertyPhoto } from '../services/propertySearch';
import { enrichPropertyData } from '../services/propertyEnrichment';
import { supabase } from '../lib/supabase';
import { Globe } from 'lucide-react';

export default function Surveys() {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('All');
  const [surveys, setSurveys] = useState<Survey[]>(() => generateMockData().surveys);
  const [selectedSurvey, setSelectedSurvey] = useState<Survey | null>(null);
  const [isAutoFetching, setIsAutoFetching] = useState(false);
  const [isAutoEnriching, setIsAutoEnriching] = useState(false);

  const autoEnrichProperties = async (surveysList: Survey[], forceAll = false) => {
    if (isAutoEnriching) return;
    
    const toEnrich = surveysList.filter(s => 
      s.enrichment_status === 'none' || (forceAll && s.enrichment_status === 'failed')
    ).slice(0, 3);
    
    if (toEnrich.length === 0) return;

    setIsAutoEnriching(true);
    console.log(`Auto-enriching ${toEnrich.length} properties...`);

    for (const survey of toEnrich) {
      try {
        const result = await enrichPropertyData(survey.properties?.address || '');
        if (result) {
          await handleUpdate(survey.id, {
            sqft: result.sqft,
            year_built: result.year_built,
            last_sale_price: result.last_sale_price,
            last_sale_date: result.last_sale_date,
            lot_size: result.lot_size,
            bedrooms: result.bedrooms,
            bathrooms: result.bathrooms,
            property_tax: result.property_tax,
            estimated_value: result.estimated_value,
            neighborhood_rating: result.neighborhood_rating,
            closest_grocery: result.closest_grocery,
            closest_highway: result.closest_highway,
            closest_elementary: result.closest_elementary,
            closest_middle: result.closest_middle,
            closest_high: result.closest_high,
            closest_gas: result.closest_gas,
            closest_walmart: result.closest_walmart,
            closest_restaurant: result.closest_restaurant,
            safety_rating: result.safety_rating,
            safety_notes: result.safety_notes,
            enrichment_source: result.source_url,
            enrichment_status: 'complete'
          });
        } else {
          // Mark as failed so we don't keep retrying immediately
          await handleUpdate(survey.id, {
            enrichment_status: 'failed'
          });
        }
      } catch (e) {
        console.error(`Failed to auto-enrich survey ${survey.id}:`, e);
        await handleUpdate(survey.id, {
          enrichment_status: 'failed'
        });
      }
    }
    setIsAutoEnriching(false);
  };

  const fetchMissingPhotos = async (surveysList: Survey[]) => {
    if (isAutoFetching) return;
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

  React.useEffect(() => {
    if (surveys.length > 0) {
      fetchMissingPhotos(surveys);
      
      // Only trigger auto-enrich if not already enriching
      const hasUnenriched = surveys.some(s => s.enrichment_status === 'none');
      if (hasUnenriched && !isAutoEnriching) {
        autoEnrichProperties(surveys);
      }
    }
  }, [surveys, isAutoEnriching]);

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
          <button 
            onClick={() => autoEnrichProperties(surveys, true)}
            disabled={isAutoEnriching}
            className="flex items-center gap-2 px-3 py-1.5 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 text-xs font-bold rounded-lg transition-all border border-emerald-500/20 disabled:opacity-50"
          >
            <TrendingUp className={cn("w-3.5 h-3.5", isAutoEnriching && "animate-spin")} />
            {isAutoEnriching ? 'Enriching...' : 'Enrich All Data'}
          </button>
          <button 
            onClick={() => fetchMissingPhotos(surveys)}
            disabled={isAutoFetching}
            className="flex items-center gap-2 px-3 py-1.5 bg-blue-500/10 hover:bg-blue-500/20 text-blue-400 text-xs font-bold rounded-lg transition-all border border-blue-500/20 disabled:opacity-50"
          >
            <Globe className={cn("w-3.5 h-3.5", isAutoFetching && "animate-spin")} />
            {isAutoFetching ? 'Fetching Photos...' : 'Fetch Missing Photos'}
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
