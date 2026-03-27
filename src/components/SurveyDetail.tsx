import React, { useState } from 'react';
import { 
  X, 
  MapPin, 
  Calendar, 
  User, 
  DollarSign, 
  Activity, 
  Home, 
  Building2,
  CheckCircle2,
  AlertCircle,
  AlertTriangle,
  Info,
  Camera,
  FileText,
  Sun,
  Car,
  Tag,
  RefreshCw,
  Search,
  ExternalLink,
  Globe,
  Plus,
  TrendingUp,
  CalendarDays,
  Maximize,
  Bed,
  Bath,
  Coins,
  ShieldCheck,
  History,
  Navigation,
  School,
  ShoppingBag,
  Utensils,
  Fuel,
  Map as MapIcon,
  Shield,
  Phone,
  Mail,
  Briefcase,
  MessageSquare
} from 'lucide-react';
import { Survey } from '../types';
import { format } from 'date-fns';
import { cn } from '../lib/utils';
import CameraCapture from './CameraCapture';
import { findPropertyPhoto } from '../services/propertySearch';
import { enrichPropertyData } from '../services/propertyEnrichment';

interface SurveyDetailProps {
  survey: Survey;
  onClose: () => void;
  onApprove?: (id: string) => void;
  onUpdate?: (id: string, updates: Partial<Survey>) => void;
}

export default function SurveyDetail({ survey, onClose, onApprove, onUpdate }: SurveyDetailProps) {
  const [showCamera, setShowCamera] = useState(false);
  const [isApproving, setIsApproving] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [isEnriching, setIsEnriching] = useState(false);
  const [photoError, setPhotoError] = useState(false);
  const [currentPhotos, setCurrentPhotos] = useState<string[]>(
    survey.photos || Array.from({ length: 6 }).map((_, i) => `https://picsum.photos/seed/property-${survey.id}-${i}/600/400`)
  );

  const handleFetchExternalPhoto = async (skipMaps: boolean = false) => {
    setIsSearching(true);
    setPhotoError(false);
    try {
      const fullAddress = `${survey.properties?.address || ''}, ${survey.properties?.city || ''}, ${survey.properties?.state || ''} ${survey.properties?.zip || ''}`;
      const result = await findPropertyPhoto(
        fullAddress,
        survey.properties?.lat,
        survey.properties?.lng,
        skipMaps
      );
      
      if (onUpdate) {
        onUpdate(survey.id, {
          external_photo_url: result.imageUrl,
          external_source_url: result.sourceUrl
        });
      }
      
      if (result.imageUrl && !currentPhotos.includes(result.imageUrl)) {
        setCurrentPhotos([result.imageUrl, ...currentPhotos]);
      }
    } catch (error) {
      console.error("Failed to fetch external photo:", error);
    } finally {
      setIsSearching(false);
    }
  };

  const handleEnrichProperty = async () => {
    const address = survey.properties?.address || survey.address;
    if (!address) {
      console.error("No address found for enrichment");
      return;
    }

    setIsEnriching(true);
    try {
      const city = survey.properties?.city || '';
      const state = survey.properties?.state || '';
      const zip = survey.properties?.zip || '';
      const fullAddress = `${address}${city ? `, ${city}` : ''}${state ? `, ${state}` : ''}${zip ? ` ${zip}` : ''}`;
      
      const { data, error } = await enrichPropertyData(fullAddress);
      if (data && onUpdate) {
        onUpdate(survey.id, {
          sqft: data.sqft,
          year_built: data.year_built,
          last_sale_price: data.last_sale_price,
          last_sale_date: data.last_sale_date,
          lot_size: data.lot_size,
          bedrooms: data.bedrooms,
          bathrooms: data.bathrooms,
          property_tax: data.property_tax,
          estimated_value: data.estimated_value,
          neighborhood_rating: data.neighborhood_rating,
          closest_grocery: data.closest_grocery,
          closest_highway: data.closest_highway,
          closest_elementary: data.closest_elementary,
          closest_middle: data.closest_middle,
          closest_high: data.closest_high,
          closest_gas: data.closest_gas,
          closest_walmart: data.closest_walmart,
          closest_restaurant: data.closest_restaurant,
          safety_rating: data.safety_rating,
          safety_notes: data.safety_notes,
          enrichment_source: data.source_url,
          enrichment_status: 'complete',
          enrichment_error: undefined
        });
      } else {
        if (onUpdate) {
          onUpdate(survey.id, {
            enrichment_status: 'failed',
            enrichment_error: error || "Failed to enrich property data"
          });
        }
      }
    } catch (error) {
      console.error("Failed to enrich property data:", error);
    } finally {
      setIsEnriching(false);
    }
  };

  const handlePropertyUpdate = (updates: any) => {
    if (onUpdate && survey.properties) {
      onUpdate(survey.id, {
        properties: {
          ...survey.properties,
          ...updates
        }
      });
    }
  };

  const handleCapture = (blob: Blob) => {
    const url = URL.createObjectURL(blob);
    setCurrentPhotos([url, ...currentPhotos.slice(0, 5)]);
    setShowCamera(false);
  };

  const handleApprove = async () => {
    if (!onApprove) return;
    setIsApproving(true);
    try {
      await onApprove(survey.id);
    } finally {
      setIsApproving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-8 bg-black/80 backdrop-blur-sm">
      <div className="bg-[#0f0f11] border border-slate-800 rounded-2xl w-full max-w-5xl max-h-full overflow-hidden flex flex-col shadow-2xl animate-in fade-in zoom-in duration-200">
        {/* Header */}
        <div className="p-6 border-b border-slate-800 flex items-center justify-between bg-slate-900/30">
          <div className="flex items-center gap-4">
            <div className={cn(
              "p-3 rounded-xl border",
              survey.type === 'residential' ? "text-blue-400 bg-blue-500/10 border-blue-500/20" : "text-purple-400 bg-purple-500/10 border-purple-500/20"
            )}>
              {survey.type === 'residential' ? <Home className="w-6 h-6" /> : <Building2 className="w-6 h-6" />}
            </div>
            <div>
              <div className="flex items-center gap-3">
                <h2 className="text-xl font-bold text-white leading-tight">{survey.properties?.address || survey.address}</h2>
                {survey.quality_score && (
                  <div className={cn(
                    "px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider",
                    survey.quality_score >= 90 ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30" :
                    survey.quality_score >= 75 ? "bg-yellow-500/20 text-yellow-400 border border-yellow-500/30" :
                    "bg-red-500/20 text-red-400 border border-red-500/30"
                  )}>
                    Quality: {survey.quality_score}%
                  </div>
                )}
              </div>
              <p className="text-sm text-slate-500">{survey.properties?.city || 'Austin'}, {survey.properties?.state || 'TX'} {survey.properties?.zip || ''}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="hidden md:flex items-center gap-2 px-4 py-2 bg-slate-800/50 rounded-xl border border-slate-700">
              <ShieldCheck className={cn("w-4 h-4", survey.safety_acknowledged ? "text-emerald-400" : "text-red-400")} />
              <span className="text-xs font-medium text-slate-300">
                Safety: {survey.safety_acknowledged ? 'Acknowledged' : 'Missing'}
              </span>
            </div>
            <button 
              onClick={onClose}
              className="p-2 text-slate-500 hover:text-white hover:bg-slate-800 rounded-lg transition-all"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-8 custom-scrollbar">
          {/* Validation Flags */}
          {survey.validation_flags && survey.validation_flags.length > 0 && (
            <div className="mb-8 p-4 bg-red-500/10 border border-red-500/20 rounded-xl flex items-center gap-4">
              <div className="p-2 bg-red-500/20 rounded-lg text-red-500">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <div>
                <p className="text-sm font-bold text-red-400">Validation Flags Detected</p>
                <div className="flex flex-wrap gap-2 mt-1">
                  {survey.validation_flags.map((flag, i) => (
                    <span key={i} className="text-[10px] bg-red-500/20 text-red-400 px-2 py-0.5 rounded border border-red-500/30">
                      {flag}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column: Photos & Verification */}
            <div className="lg:col-span-2 space-y-8">
              {/* Photo Gallery */}
              <section>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest flex items-center gap-2">
                    <Camera className="w-3.5 h-3.5" />
                    Property Photo Gallery ({currentPhotos.length})
                  </h3>
                  <div className="flex gap-3">
                    <button 
                      onClick={() => setShowCamera(true)}
                      className="flex items-center gap-1.5 text-[10px] font-bold text-accent uppercase tracking-widest hover:underline"
                    >
                      <Plus className="w-3 h-3" />
                      Add Photo
                    </button>
                    <button 
                      onClick={() => handleFetchExternalPhoto()}
                      disabled={isSearching}
                      className="flex items-center gap-1.5 text-[10px] font-bold text-blue-400 uppercase tracking-widest hover:underline disabled:opacity-50"
                    >
                      {isSearching ? <RefreshCw className="w-3 h-3 animate-spin" /> : <Globe className="w-3 h-3" />}
                      Fetch Street View
                    </button>
                  </div>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {currentPhotos.map((photo, i) => (
                    <div key={i} className="aspect-video bg-slate-900 rounded-xl overflow-hidden border border-slate-800 group relative shadow-lg">
                      <img 
                        src={photo} 
                        alt={`Property ${i}`} 
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                        referrerPolicy="no-referrer"
                      />
                      <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-all flex items-center justify-center gap-2">
                        <button className="p-2 bg-white/10 hover:bg-white/20 rounded-full backdrop-blur-md text-white transition-all border border-white/10">
                          <Maximize className="w-4 h-4" />
                        </button>
                      </div>
                      <div className="absolute bottom-2 left-2 px-2 py-0.5 bg-black/50 backdrop-blur-md rounded text-[8px] font-bold text-white/70 uppercase tracking-tighter">
                        Photo {i + 1}
                      </div>
                    </div>
                  ))}
                </div>
              </section>

              {/* External Verification */}
              {survey.external_photo_url && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start bg-blue-500/5 rounded-2xl p-6 border border-blue-500/10">
                  <div className="relative group rounded-xl overflow-hidden border border-blue-500/30 shadow-lg shadow-blue-500/5">
                    <div className="absolute top-4 left-4 z-10 px-3 py-1.5 bg-blue-500 text-white text-[10px] font-bold uppercase tracking-widest rounded-full shadow-lg flex items-center gap-2">
                      <Globe className="w-3 h-3" />
                      Street View Reference
                    </div>
                    <img 
                      src={survey.external_photo_url} 
                      alt="Street View Reference" 
                      className="w-full aspect-video object-cover transition-transform duration-500 group-hover:scale-105"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-6">
                      <a 
                        href={survey.external_source_url} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 text-xs font-bold text-white hover:text-blue-400 transition-colors"
                      >
                        <ExternalLink className="w-4 h-4" />
                        View on Google Maps
                      </a>
                    </div>
                  </div>
                  <div className="space-y-4 py-2">
                    <div className="flex items-center gap-3 text-blue-400">
                      <div className="p-2 bg-blue-500/10 rounded-xl border border-blue-500/20">
                        <Search className="w-5 h-5" />
                      </div>
                      <h4 className="font-bold text-lg">External Verification</h4>
                    </div>
                    <p className="text-sm text-slate-400 leading-relaxed">
                      We've cross-referenced this property with public street view data. This photo is now stored in our database for future reference.
                    </p>
                  </div>
                </div>
              )}

              {/* Skip Logic & Conditional Visibility */}
              <section>
                <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-4 flex items-center gap-2">
                  <Activity className="w-3.5 h-3.5" />
                  Form Logic & Hidden Sections
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {Object.entries(survey.skip_logic_info || {}).map(([section, reason]) => (
                    <div key={section} className="bg-slate-900/30 rounded-xl p-4 border border-slate-800 flex items-start gap-3">
                      <div className="p-2 bg-slate-800 rounded-lg text-slate-500">
                        <Shield className="w-4 h-4" />
                      </div>
                      <div>
                        <p className="text-xs font-bold text-slate-400">{section}</p>
                        <p className="text-[10px] text-slate-600 mt-1 italic">Hidden: {reason}</p>
                      </div>
                    </div>
                  ))}
                  {(!survey.skip_logic_info || Object.keys(survey.skip_logic_info).length === 0) && (
                    <div className="col-span-full py-8 text-center bg-slate-900/20 rounded-xl border border-dashed border-slate-800">
                      <p className="text-xs text-slate-600">No sections were skipped during this survey.</p>
                    </div>
                  )}
                </div>
              </section>

              {/* Market Enrichment */}
              <section className="bg-slate-900/40 rounded-2xl border border-slate-800 overflow-hidden shadow-xl">
                <div className="p-6 border-b border-slate-800 flex items-center justify-between bg-slate-900/60">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-accent/10 rounded-xl border border-accent/20 text-accent">
                      <TrendingUp className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="font-bold text-white">Market Enrichment</h3>
                      <p className="text-[10px] text-slate-500 uppercase tracking-wider font-medium">Public Records & Tax Data</p>
                    </div>
                  </div>
                  <button 
                    onClick={handleEnrichProperty}
                    disabled={isEnriching}
                    className="flex items-center gap-2 px-3 py-1.5 bg-accent/10 hover:bg-accent/20 text-accent text-[10px] font-bold uppercase tracking-widest rounded-lg border border-accent/20 transition-all disabled:opacity-50"
                  >
                    {isEnriching ? <RefreshCw className="w-3 h-3 animate-spin" /> : <RefreshCw className="w-3 h-3" />}
                    Refresh Data
                  </button>
                </div>
                
                <div className="p-6">
                  {survey.enrichment_status === 'complete' ? (
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
                      <div className="space-y-1">
                        <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Estimated Value</p>
                        <p className="text-lg font-bold text-emerald-400">${survey.estimated_value?.toLocaleString()}</p>
                      </div>
                      <div className="space-y-1">
                        <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Square Footage</p>
                        <p className="text-lg font-bold text-white">{survey.sqft?.toLocaleString()} sqft</p>
                      </div>
                      <div className="space-y-1">
                        <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Year Built</p>
                        <p className="text-lg font-bold text-white">{survey.year_built}</p>
                      </div>
                      <div className="space-y-1">
                        <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Lot Size</p>
                        <p className="text-lg font-bold text-white">{survey.lot_size}</p>
                      </div>
                      <div className="space-y-1">
                        <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Last Sale Price</p>
                        <p className="text-sm font-bold text-slate-300">${survey.last_sale_price?.toLocaleString()}</p>
                      </div>
                      <div className="space-y-1">
                        <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Last Sale Date</p>
                        <p className="text-sm font-bold text-slate-300">{survey.last_sale_date}</p>
                      </div>
                      <div className="space-y-1">
                        <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Property Tax</p>
                        <p className="text-sm font-bold text-slate-300">${survey.property_tax?.toLocaleString()}/yr</p>
                      </div>
                      <div className="space-y-1">
                        <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Neighborhood</p>
                        <p className="text-sm font-bold text-slate-300">{survey.neighborhood_rating}</p>
                      </div>
                    </div>
                  ) : survey.enrichment_status === 'failed' ? (
                    <div className="flex flex-col items-center justify-center py-12 text-center space-y-4">
                      <div className="p-4 bg-red-500/10 rounded-full border border-red-500/20">
                        <AlertCircle className="w-8 h-8 text-red-500" />
                      </div>
                      <div>
                        <p className="text-sm font-bold text-red-400">Enrichment Failed</p>
                        <p className="text-xs text-slate-500 mt-1 max-w-xs mx-auto">{survey.enrichment_error || 'An error occurred while fetching property data.'}</p>
                        <button 
                          onClick={handleEnrichProperty}
                          disabled={isEnriching}
                          className="mt-4 px-4 py-2 bg-red-500 hover:bg-red-400 text-white text-xs font-bold uppercase rounded-xl transition-all flex items-center gap-2 mx-auto"
                        >
                          {isEnriching ? <RefreshCw className="w-4 h-4 animate-spin" /> : <RefreshCw className="w-4 h-4" />}
                          Retry Enrichment
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center py-12 text-center space-y-4">
                      <div className="p-4 bg-slate-800/50 rounded-full border border-slate-700">
                        <Search className="w-8 h-8 text-slate-600" />
                      </div>
                      <div>
                        <p className="text-sm font-bold text-slate-400">No Enrichment Data Found</p>
                        <p className="text-xs text-slate-600 mt-1 max-w-xs mx-auto">Click "Refresh Data" to pull the latest public records and market information for this property.</p>
                      </div>
                    </div>
                  )}
                </div>
              </section>

              {/* Location & Amenities */}
              <section className="space-y-4">
                <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest flex items-center gap-2">
                  <Navigation className="w-3.5 h-3.5" />
                  Location & Amenities
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {/* Daily Essentials */}
                  <div className="bg-slate-900/40 rounded-2xl p-5 border border-slate-800 space-y-4">
                    <div className="flex items-center gap-2 text-blue-400">
                      <ShoppingBag className="w-4 h-4" />
                      <h4 className="text-xs font-bold uppercase tracking-wider">Daily Essentials</h4>
                    </div>
                    <div className="space-y-3">
                      <div className="flex justify-between items-start">
                        <div className="flex items-center gap-2">
                          <ShoppingBag className="w-3 h-3 text-slate-500" />
                          <span className="text-[10px] text-slate-400">Grocery</span>
                        </div>
                        <div className="text-right">
                          <p className="text-[10px] font-bold text-slate-200">{survey.closest_grocery?.name || 'H-E-B'}</p>
                          <p className="text-[8px] text-slate-500">{survey.closest_grocery?.distance || '0.8 miles'}</p>
                        </div>
                      </div>
                      <div className="flex justify-between items-start">
                        <div className="flex items-center gap-2">
                          <Fuel className="w-3 h-3 text-slate-500" />
                          <span className="text-[10px] text-slate-400">Gas Station</span>
                        </div>
                        <div className="text-right">
                          <p className="text-[10px] font-bold text-slate-200">{survey.closest_gas?.name || 'Shell'}</p>
                          <p className="text-[8px] text-slate-500">{survey.closest_gas?.distance || '0.3 miles'}</p>
                        </div>
                      </div>
                      <div className="flex justify-between items-start">
                        <div className="flex items-center gap-2">
                          <Utensils className="w-3 h-3 text-slate-500" />
                          <span className="text-[10px] text-slate-400">Restaurant</span>
                        </div>
                        <div className="text-right">
                          <p className="text-[10px] font-bold text-slate-200">{survey.closest_restaurant?.name || 'Local Bistro'}</p>
                          <p className="text-[8px] text-slate-500">{survey.closest_restaurant?.distance || '0.5 miles'}</p>
                        </div>
                      </div>
                      <div className="flex justify-between items-start">
                        <div className="flex items-center gap-2">
                          <ShoppingBag className="w-3 h-3 text-slate-500" />
                          <span className="text-[10px] text-slate-400">Walmart</span>
                        </div>
                        <div className="text-right">
                          <p className="text-[10px] font-bold text-slate-200">{survey.closest_walmart?.name || 'Walmart Supercenter'}</p>
                          <p className="text-[8px] text-slate-500">{survey.closest_walmart?.distance || '2.1 miles'}</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Schools & Transit */}
                  <div className="bg-slate-900/40 rounded-2xl p-5 border border-slate-800 space-y-4">
                    <div className="flex items-center gap-2 text-purple-400">
                      <School className="w-4 h-4" />
                      <h4 className="text-xs font-bold uppercase tracking-wider">Schools & Transit</h4>
                    </div>
                    <div className="space-y-3">
                      <div className="flex justify-between items-start">
                        <div className="flex items-center gap-2">
                          <School className="w-3 h-3 text-slate-500" />
                          <span className="text-[10px] text-slate-400">Elementary</span>
                        </div>
                        <div className="text-right">
                          <p className="text-[10px] font-bold text-slate-200">{survey.closest_elementary?.name || 'Oak Creek Elementary'}</p>
                          <p className="text-[8px] text-slate-500">{survey.closest_elementary?.distance || '1.2 miles'}</p>
                        </div>
                      </div>
                      <div className="flex justify-between items-start">
                        <div className="flex items-center gap-2">
                          <School className="w-3 h-3 text-slate-500" />
                          <span className="text-[10px] text-slate-400">High School</span>
                        </div>
                        <div className="text-right">
                          <p className="text-[10px] font-bold text-slate-200">{survey.closest_high?.name || 'West Austin High'}</p>
                          <p className="text-[8px] text-slate-500">{survey.closest_high?.distance || '2.5 miles'}</p>
                        </div>
                      </div>
                      <div className="flex justify-between items-start">
                        <div className="flex items-center gap-2">
                          <MapIcon className="w-3 h-3 text-slate-500" />
                          <span className="text-[10px] text-slate-400">Highway</span>
                        </div>
                        <div className="text-right">
                          <p className="text-[10px] font-bold text-slate-200">{survey.closest_highway?.name || 'I-35'}</p>
                          <p className="text-[8px] text-slate-500">{survey.closest_highway?.distance || '1.5 miles'}</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Area Safety */}
                  <div className="bg-slate-900/40 rounded-2xl p-5 border border-slate-800 space-y-4">
                    <div className="flex items-center gap-2 text-emerald-400">
                      <Shield className="w-4 h-4" />
                      <h4 className="text-xs font-bold uppercase tracking-wider">Area Safety</h4>
                    </div>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-[10px] text-slate-400">Safety Rating</span>
                        <span className="text-[10px] font-bold text-emerald-400">{survey.safety_rating || 'High'}</span>
                      </div>
                      <div className="pt-2 border-t border-slate-800">
                        <p className="text-[8px] text-slate-500 leading-relaxed italic">
                          "{survey.safety_notes || 'Low crime area with active neighborhood watch and well-lit streets.'}"
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </section>

              {/* Lead & Contact Information */}
              <section className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest flex items-center gap-2">
                    <User className="w-3.5 h-3.5" />
                    Lead & Contact Information
                  </h3>
                  {survey.properties?.lead_status && (
                    <span className={cn(
                      "text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-tighter",
                      survey.properties.lead_status === 'booked' ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30" :
                      survey.properties.lead_status === 'not_interested' ? "bg-red-500/20 text-red-400 border border-red-500/30" :
                      "bg-accent/20 text-accent border border-accent/30"
                    )}>
                      {survey.properties.lead_status}
                    </span>
                  )}
                </div>
                <div className="bg-slate-900/40 rounded-2xl p-6 border border-slate-800">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <div className="space-y-1.5">
                        <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Business Name</label>
                        <div className="flex items-center gap-2 px-3 py-2 bg-slate-800/50 rounded-lg border border-slate-700">
                          <Briefcase className="w-4 h-4 text-slate-500" />
                          <input 
                            type="text"
                            value={survey.properties?.business_name || ''}
                            onChange={(e) => handlePropertyUpdate({ business_name: e.target.value })}
                            placeholder="Not specified"
                            className="bg-transparent border-none focus:ring-0 text-sm text-slate-200 w-full placeholder:text-slate-600"
                          />
                        </div>
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Contact Name</label>
                        <div className="flex items-center gap-2 px-3 py-2 bg-slate-800/50 rounded-lg border border-slate-700">
                          <User className="w-4 h-4 text-slate-500" />
                          <input 
                            type="text"
                            value={survey.properties?.contact_name || ''}
                            onChange={(e) => handlePropertyUpdate({ contact_name: e.target.value })}
                            placeholder="Not specified"
                            className="bg-transparent border-none focus:ring-0 text-sm text-slate-200 w-full placeholder:text-slate-600"
                          />
                        </div>
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Lead Status</label>
                        <select 
                          value={survey.properties?.lead_status || 'new'}
                          onChange={(e) => handlePropertyUpdate({ lead_status: e.target.value as any })}
                          className="w-full px-3 py-2 bg-slate-800/50 rounded-lg border border-slate-700 text-sm text-slate-200 focus:ring-accent focus:border-accent"
                        >
                          <option value="new">New</option>
                          <option value="contacted">Contacted</option>
                          <option value="callback">Callback</option>
                          <option value="not_interested">Not Interested</option>
                          <option value="booked">Booked</option>
                        </select>
                      </div>
                    </div>
                    <div className="space-y-4">
                      <div className="space-y-1.5">
                        <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Phone Number</label>
                        <div className="flex items-center gap-2 px-3 py-2 bg-slate-800/50 rounded-lg border border-slate-700 group">
                          <Phone className="w-4 h-4 text-slate-500" />
                          <input 
                            type="tel"
                            value={survey.properties?.phone || ''}
                            onChange={(e) => handlePropertyUpdate({ phone: e.target.value })}
                            placeholder="Not specified"
                            className="bg-transparent border-none focus:ring-0 text-sm text-slate-200 w-full placeholder:text-slate-600"
                          />
                          {survey.properties?.phone && (
                            <a 
                              href={`tel:${survey.properties.phone}`}
                              className="p-1 hover:bg-accent/20 rounded text-accent transition-colors"
                              title="Tap to call"
                            >
                              <Phone className="w-3.5 h-3.5" />
                            </a>
                          )}
                        </div>
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Email Address</label>
                        <div className="flex items-center gap-2 px-3 py-2 bg-slate-800/50 rounded-lg border border-slate-700">
                          <Mail className="w-4 h-4 text-slate-500" />
                          <input 
                            type="email"
                            value={survey.properties?.email || ''}
                            onChange={(e) => handlePropertyUpdate({ email: e.target.value })}
                            placeholder="Not specified"
                            className="bg-transparent border-none focus:ring-0 text-sm text-slate-200 w-full placeholder:text-slate-600"
                          />
                        </div>
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Lead Notes</label>
                        <div className="flex items-start gap-2 px-3 py-2 bg-slate-800/50 rounded-lg border border-slate-700">
                          <MessageSquare className="w-4 h-4 text-slate-500 mt-0.5" />
                          <textarea 
                            value={survey.properties?.notes || ''}
                            onChange={(e) => handlePropertyUpdate({ notes: e.target.value })}
                            placeholder="Add lead-specific notes..."
                            rows={2}
                            className="bg-transparent border-none focus:ring-0 text-sm text-slate-200 w-full placeholder:text-slate-600 resize-none"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </section>

              {/* Property Features */}
              <section className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="bg-slate-900/30 rounded-xl p-4 border border-slate-800 flex items-center gap-4">
                  <div className="p-2 bg-amber-500/10 rounded-lg text-amber-500">
                    <Sun className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Solar Panels</p>
                    <p className="text-sm font-bold text-slate-300">{survey.has_solar_panels || 'None'}</p>
                  </div>
                </div>
                <div className="bg-slate-900/30 rounded-xl p-4 border border-slate-800 flex items-center gap-4">
                  <div className="p-2 bg-blue-500/10 rounded-lg text-blue-500">
                    <Car className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Vehicles</p>
                    <p className="text-sm font-bold text-slate-300">{survey.vehicle_count || 0} Detected</p>
                  </div>
                </div>
                <div className="bg-slate-900/30 rounded-xl p-4 border border-slate-800 flex items-center gap-4">
                  <div className="p-2 bg-emerald-500/10 rounded-lg text-emerald-500">
                    <Tag className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">For Sale</p>
                    <p className="text-sm font-bold text-slate-300">{survey.is_for_sale || 'No'}</p>
                  </div>
                </div>
              </section>

              {/* Commercial Specific Data */}
              {survey.type === 'commercial' && (
                <section className="bg-purple-500/5 rounded-2xl p-6 border border-purple-500/10 space-y-4">
                  <div className="flex items-center gap-3 text-purple-400">
                    <Building2 className="w-5 h-5" />
                    <h4 className="font-bold text-lg">Commercial Property Data</h4>
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
                    <div className="space-y-1">
                      <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Building Type</p>
                      <p className="text-sm font-bold text-slate-300">{survey.building_type || 'Retail'}</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Occupancy</p>
                      <p className="text-sm font-bold text-slate-300">{survey.occupancy || 'Fully Occupied'}</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Zoning</p>
                      <p className="text-sm font-bold text-slate-300">{survey.zoning_type || 'C-2 General'}</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Parking</p>
                      <p className="text-sm font-bold text-slate-300">{survey.parking_avail || 'Ample'}</p>
                    </div>
                  </div>
                </section>
              )}
            </div>

            {/* Right Column: Metadata & Details */}
            <div className="space-y-6">
              <section>
                <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-4 flex items-center gap-2">
                  <Info className="w-3.5 h-3.5" />
                  Survey Metadata
                </h3>
                <div className="bg-slate-900/50 rounded-xl p-4 border border-slate-800 space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-slate-500">Surveyor</span>
                    <span className="text-xs font-bold text-slate-300">{survey.surveyorName || survey.surveyor_id}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-slate-500">Safety Acknowledged</span>
                    <span className={cn(
                      "text-[10px] font-bold px-2 py-0.5 rounded-full uppercase",
                      survey.safety_acknowledged ? "text-emerald-400 bg-emerald-500/10" : "text-red-400 bg-red-500/10"
                    )}>
                      {survey.safety_acknowledged ? 'Yes' : 'No'}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-slate-500">Status</span>
                    <span className={cn(
                      "text-[10px] font-bold px-2 py-0.5 rounded-full uppercase",
                      survey.status === 'Completed' || survey.status === 'complete' ? "text-emerald-400 bg-emerald-500/10" : "text-amber-400 bg-amber-500/10"
                    )}>
                      {survey.status}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-slate-500">Earnings</span>
                    <span className="text-sm font-bold text-emerald-400">${(survey.earnings || 25).toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-slate-500">Submitted</span>
                    <span className="text-xs text-slate-300">
                      {survey.submitted_at || survey.date ? format(new Date(survey.submitted_at || survey.date), 'MMM d, yyyy') : 'N/A'}
                    </span>
                  </div>
                </div>
              </section>

              <section>
                <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-4 flex items-center gap-2">
                  <Activity className="w-3.5 h-3.5" />
                  Condition Overview
                </h3>
                <div className="space-y-3">
                  {[
                    { label: 'Roof', value: survey.roof_condition || 'Good' },
                    { label: 'House', value: survey.house_condition || 'Good' },
                    { label: 'Paint', value: survey.paint_condition || 'Fair' },
                  ].map((item) => (
                    <div key={item.label} className="bg-slate-900/50 rounded-lg p-3 border border-slate-800 flex justify-between items-center">
                      <span className="text-xs text-slate-400">{item.label}</span>
                      <span className={cn(
                        "text-xs font-bold",
                        item.value === 'Good' ? "text-emerald-400" :
                        item.value === 'Fair' ? "text-amber-400" : "text-red-400"
                      )}>
                        {item.value}
                      </span>
                    </div>
                  ))}
                </div>
              </section>

              <section>
                <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-4 flex items-center gap-2">
                  <FileText className="w-3.5 h-3.5" />
                  Review Notes
                </h3>
                <textarea 
                  className="w-full bg-slate-900/50 rounded-xl p-4 border border-slate-800 text-sm text-slate-300 focus:outline-none focus:border-accent/50 min-h-[120px] placeholder:text-slate-600"
                  placeholder="Add administrative notes or feedback for the surveyor..."
                />
              </section>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-slate-800 bg-slate-900/30 flex justify-end gap-3">
          <button className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-sm font-bold rounded-xl transition-all border border-slate-700">
            Print Report
          </button>
          <button 
            onClick={handleApprove}
            disabled={isApproving || survey.status === 'complete'}
            className={cn(
              "px-6 py-2 text-sm font-bold rounded-xl transition-all flex items-center gap-2",
              survey.status === 'complete' 
                ? "bg-slate-800 text-slate-500 cursor-not-allowed" 
                : "bg-emerald-500 hover:bg-emerald-600 text-black"
            )}
          >
            {isApproving ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                Approving...
              </>
            ) : survey.status === 'complete' ? (
              <>
                <CheckCircle2 className="w-4 h-4" />
                Approved
              </>
            ) : (
              'Approve Inspection'
            )}
          </button>
        </div>
      </div>

      {showCamera && (
        <CameraCapture 
          onCapture={handleCapture}
          onClose={() => setShowCamera(false)}
        />
      )}
    </div>
  );
}
