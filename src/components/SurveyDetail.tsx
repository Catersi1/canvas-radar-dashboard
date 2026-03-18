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
  Globe
} from 'lucide-react';
import { Survey } from '../types/dashboard';
import { format } from 'date-fns';
import { cn } from '../lib/utils';
import CameraCapture from './CameraCapture';
import { findPropertyPhoto } from '../services/propertySearch';
import { enrichPropertyData } from '../services/propertyEnrichment';
import { 
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
  Shield
} from 'lucide-react';

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
  const [currentPhotos, setCurrentPhotos] = useState<string[]>(
    Array.from({ length: 6 }).map((_, i) => `https://picsum.photos/seed/property-${survey.id}-${i}/600/400`)
  );

  const handleFetchExternalPhoto = async () => {
    setIsSearching(true);
    try {
      const result = await findPropertyPhoto(
        survey.properties?.address || '',
        survey.properties?.lat,
        survey.properties?.lng
      );
      
      if (onUpdate) {
        onUpdate(survey.id, {
          external_photo_url: result.imageUrl,
          external_source_url: result.sourceUrl
        });
      }
      
      // Add to current photos if it's a valid URL
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
    console.log("Enriching property for address:", survey.properties?.address);
    setIsEnriching(true);
    try {
      const fullAddress = `${survey.properties?.address}, ${survey.properties?.city}, ${survey.properties?.state} ${survey.properties?.zip}`;
      console.log("Enriching property for address:", fullAddress);
      const result = await enrichPropertyData(fullAddress);
      console.log("Enrichment result:", result);
      if (result && onUpdate) {
        onUpdate(survey.id, {
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
      } else if (!result) {
        alert("Enrichment failed. Please check the console for details or try again later.");
      }
    } catch (error) {
      console.error("Failed to enrich property data:", error);
      alert("An error occurred during enrichment. See console for details.");
    } finally {
      setIsEnriching(false);
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
      <div className="bg-[#0f0f11] border border-slate-800 rounded-2xl w-full max-w-4xl max-h-full overflow-hidden flex flex-col shadow-2xl animate-in fade-in zoom-in duration-200">
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
              <h2 className="text-xl font-bold text-white leading-tight">{survey.properties?.address}</h2>
              <p className="text-sm text-slate-500">{survey.properties?.city}, {survey.properties?.state} {survey.properties?.zip}</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-2 text-slate-500 hover:text-white hover:bg-slate-800 rounded-lg transition-all"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-8 custom-scrollbar">
          {survey.status === 'pending' && (
            <div className="mb-8 p-4 bg-amber-500/10 border border-amber-500/20 rounded-xl flex items-center gap-4 animate-pulse">
              <div className="p-2 bg-amber-500/20 rounded-lg text-amber-500">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <div>
                <p className="text-sm font-bold text-amber-400">Manual Review Required</p>
                <p className="text-xs text-amber-500/70">This submission has not been verified. Please review the data and photos before approving.</p>
              </div>
            </div>
          )}

          {survey.external_photo_url && (
            <div className="mb-8 grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
              <div className="relative group rounded-2xl overflow-hidden border border-blue-500/30 shadow-lg shadow-blue-500/5">
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
                  We've successfully cross-referenced this property with public street view data. This photo is now stored in our database for future reference.
                </p>
                <div className="flex items-center gap-6 pt-2">
                  <div className="flex flex-col">
                    <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Source</span>
                    <span className="text-xs text-slate-300">Google Search / Maps</span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Status</span>
                    <span className="text-xs text-emerald-400 flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3" />
                      Verified & Stored
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column: Metadata & Status */}
            <div className="space-y-6">
              <section>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest flex items-center gap-2">
                    <Info className="w-3.5 h-3.5" />
                    Survey Info
                  </h3>
                </div>
                <div className="bg-slate-900/50 rounded-xl p-4 border border-slate-800 space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-slate-500">Survey ID</span>
                    <span className="text-xs font-mono text-slate-300">{survey.id.slice(0, 8)}...</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-slate-500">Status</span>
                    <span className={cn(
                      "text-[10px] font-bold px-2 py-0.5 rounded-full uppercase",
                      survey.status === 'complete' ? "text-emerald-400 bg-emerald-500/10" : "text-amber-400 bg-amber-500/10"
                    )}>
                      {survey.status === 'pending' ? 'Review Required' : survey.status}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-slate-500">Earnings</span>
                    <span className="text-sm font-bold text-emerald-400">${(survey.earnings || 0).toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-slate-500">Submitted</span>
                    <span className="text-xs text-slate-300">
                      {survey.submitted_at ? format(new Date(survey.submitted_at), 'MMM d, yyyy HH:mm') : 'N/A'}
                    </span>
                  </div>
                  <div className="pt-2 border-t border-slate-800">
                    <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2">Coordinates</p>
                    <div className="grid grid-cols-2 gap-2">
                      <div className="bg-background rounded-lg p-2 border border-slate-800">
                        <p className="text-[8px] text-slate-500 uppercase font-bold">Latitude</p>
                        <p className="text-xs font-mono text-slate-300">{survey.properties?.lat?.toFixed(6) || 'N/A'}</p>
                      </div>
                      <div className="bg-background rounded-lg p-2 border border-slate-800">
                        <p className="text-[8px] text-slate-500 uppercase font-bold">Longitude</p>
                        <p className="text-xs font-mono text-slate-300">{survey.properties?.lng?.toFixed(6) || 'N/A'}</p>
                      </div>
                    </div>
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
                    { label: 'Roof', value: survey.roof_condition },
                    { label: 'House', value: survey.house_condition },
                    { label: 'Paint', value: survey.paint_condition },
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
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest flex items-center gap-2">
                    <Camera className="w-3.5 h-3.5" />
                    Property Photos
                  </h3>
                  <div className="flex gap-3">
                    {!survey.external_photo_url && (
                      <button 
                        onClick={handleFetchExternalPhoto}
                        disabled={isSearching}
                        className="flex items-center gap-1.5 text-[10px] font-bold text-blue-400 uppercase tracking-widest hover:underline disabled:opacity-50"
                      >
                        {isSearching ? <RefreshCw className="w-3 h-3 animate-spin" /> : <Globe className="w-3 h-3" />}
                        Fetch Street View
                      </button>
                    )}
                    <button 
                      onClick={() => setShowCamera(true)}
                      className="flex items-center gap-1.5 text-[10px] font-bold text-accent uppercase tracking-widest hover:underline"
                    >
                      <Camera className="w-3 h-3" />
                      Add Photo
                    </button>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  {currentPhotos.map((photo, i) => (
                    <div key={i} className="aspect-video bg-slate-900 rounded-lg overflow-hidden border border-slate-800 group relative">
                      <img 
                        src={photo} 
                        alt={`Property ${i}`} 
                        className="w-full h-full object-cover"
                        referrerPolicy="no-referrer"
                      />
                      <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <button 
                          onClick={() => setShowCamera(true)}
                          className="p-2 bg-white/10 hover:bg-white/20 rounded-full backdrop-blur-md text-white transition-all"
                        >
                          <RefreshCw className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            </div>

            {/* Middle Column: Details & Features */}
            <div className="lg:col-span-2 space-y-8">
              <section>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-4 flex items-center gap-2">
                    <TrendingUp className="w-3.5 h-3.5" />
                    Market Enrichment
                  </h3>
                  {survey.enrichment_status !== 'complete' && (
                    <button 
                      onClick={handleEnrichProperty}
                      disabled={isEnriching}
                      className={cn(
                        "flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-widest hover:underline disabled:opacity-50",
                        survey.enrichment_status === 'failed' ? "text-red-400" : "text-emerald-400"
                      )}
                    >
                      {isEnriching ? <RefreshCw className="w-3 h-3 animate-spin" /> : <TrendingUp className="w-3 h-3" />}
                      {survey.enrichment_status === 'failed' ? 'Retry Enrichment' : 'Enrich Data'}
                    </button>
                  )}
                </div>
                
                {survey.enrichment_status === 'complete' ? (
                  <div className="bg-slate-900/50 rounded-xl p-6 border border-slate-800 space-y-6">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <p className="text-[10px] text-slate-500 uppercase font-bold flex items-center gap-1">
                          <Maximize className="w-3 h-3" /> Sq Ft
                        </p>
                        <p className="text-sm font-bold text-slate-200">{survey.sqft?.toLocaleString() || 'N/A'}</p>
                      </div>
                      <div className="space-y-1">
                        <p className="text-[10px] text-slate-500 uppercase font-bold flex items-center gap-1">
                          <CalendarDays className="w-3 h-3" /> Year Built
                        </p>
                        <p className="text-sm font-bold text-slate-200">{survey.year_built || 'N/A'}</p>
                      </div>
                      <div className="space-y-1">
                        <p className="text-[10px] text-slate-500 uppercase font-bold flex items-center gap-1">
                          <Bed className="w-3 h-3" /> Beds
                        </p>
                        <p className="text-sm font-bold text-slate-200">{survey.bedrooms || 'N/A'}</p>
                      </div>
                      <div className="space-y-1">
                        <p className="text-[10px] text-slate-500 uppercase font-bold flex items-center gap-1">
                          <Bath className="w-3 h-3" /> Baths
                        </p>
                        <p className="text-sm font-bold text-slate-200">{survey.bathrooms || 'N/A'}</p>
                      </div>
                    </div>
                    
                    <div className="pt-4 border-t border-slate-800 space-y-4">
                      <div className="flex justify-between items-center">
                        <div className="flex items-center gap-2">
                          <div className="p-1.5 bg-emerald-500/10 rounded-lg text-emerald-500">
                            <Coins className="w-4 h-4" />
                          </div>
                          <span className="text-xs text-slate-400">Estimated Value</span>
                        </div>
                        <span className="text-sm font-bold text-emerald-400">
                          ${survey.estimated_value?.toLocaleString() || 'N/A'}
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <div className="flex items-center gap-2">
                          <div className="p-1.5 bg-blue-500/10 rounded-lg text-blue-400">
                            <History className="w-4 h-4" />
                          </div>
                          <span className="text-xs text-slate-400">Last Sale</span>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-bold text-slate-200">
                            ${survey.last_sale_price?.toLocaleString() || 'N/A'}
                          </p>
                          <p className="text-[10px] text-slate-500">{survey.last_sale_date || ''}</p>
                        </div>
                      </div>
                      <div className="flex justify-between items-center">
                        <div className="flex items-center gap-2">
                          <div className="p-1.5 bg-purple-500/10 rounded-lg text-purple-400">
                            <ShieldCheck className="w-4 h-4" />
                          </div>
                          <span className="text-xs text-slate-400">Neighborhood</span>
                        </div>
                        <span className="text-sm font-bold text-purple-400">
                          {survey.neighborhood_rating || 'N/A'}
                        </span>
                      </div>
                    </div>
                    
                    {survey.enrichment_source && (
                      <div className="pt-2">
                        <a 
                          href={survey.enrichment_source} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-[10px] text-slate-500 hover:text-accent flex items-center gap-1 transition-colors"
                        >
                          <ExternalLink className="w-3 h-3" />
                          Source: {new URL(survey.enrichment_source).hostname}
                        </a>
                      </div>
                    )}
                  </div>
                ) : survey.enrichment_status === 'failed' ? (
                  <div className="bg-slate-900/50 rounded-xl p-8 border border-red-500/20 flex flex-col items-center text-center">
                    <div className="w-12 h-12 bg-red-500/10 rounded-full flex items-center justify-center text-red-400 mb-4">
                      <AlertTriangle className="w-6 h-6" />
                    </div>
                    <p className="text-sm font-bold text-red-400 mb-1">Enrichment Failed</p>
                    <p className="text-xs text-slate-500 mb-4 max-w-[200px]">
                      We couldn't find enough public data for this address. Check the console for details or try again.
                    </p>
                    <button 
                      onClick={handleEnrichProperty}
                      disabled={isEnriching}
                      className="px-6 py-2 bg-red-500/20 hover:bg-red-500/30 text-red-400 text-xs font-bold rounded-lg transition-all border border-red-500/30"
                    >
                      {isEnriching ? 'Retrying...' : 'Retry Enrichment'}
                    </button>
                  </div>
                ) : (
                  <div className="bg-slate-900/50 rounded-xl p-8 border border-slate-800 border-dashed flex flex-col items-center text-center">
                    <div className="w-12 h-12 bg-slate-800 rounded-full flex items-center justify-center text-slate-500 mb-4">
                      <TrendingUp className="w-6 h-6" />
                    </div>
                    <p className="text-sm font-bold text-slate-300 mb-1">Enrich Property Profile</p>
                    <p className="text-xs text-slate-500 mb-4 max-w-[200px]">
                      Fetch market data, tax history, and property specs from public records.
                    </p>
                    <button 
                      onClick={handleEnrichProperty}
                      disabled={isEnriching}
                      className="btn-primary py-2 px-6 text-xs"
                    >
                      {isEnriching ? 'Searching...' : 'Start Enrichment'}
                    </button>
                  </div>
                )}
              </section>

              <section>
                <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-4 flex items-center gap-2">
                  <Navigation className="w-3.5 h-3.5" />
                  Location & Amenities
                </h3>
                
                {survey.enrichment_status === 'complete' ? (
                  <div className="bg-slate-900/50 rounded-xl p-6 border border-slate-800 space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-4">
                        <h4 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Daily Essentials</h4>
                        <div className="space-y-3">
                          {[
                            { icon: ShoppingBag, label: 'Grocery', data: survey.closest_grocery },
                            { icon: ShoppingBag, label: 'Walmart', data: survey.closest_walmart },
                            { icon: Fuel, label: 'Gas Station', data: survey.closest_gas },
                            { icon: Utensils, label: 'Restaurant', data: survey.closest_restaurant },
                          ].map((item, idx) => (
                            <div key={idx} className="flex items-start gap-3">
                              <div className="p-1.5 bg-slate-800 rounded-lg text-slate-400">
                                <item.icon className="w-3.5 h-3.5" />
                              </div>
                              <div>
                                <p className="text-xs font-bold text-slate-200">{item.data?.name || 'N/A'}</p>
                                <p className="text-[10px] text-slate-500">{item.label} • {item.data?.distance || ''} ({item.data?.miles || 0} mi)</p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                      
                      <div className="space-y-4">
                        <h4 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Schools & Transit</h4>
                        <div className="space-y-3">
                          {[
                            { icon: School, label: 'Elementary', data: survey.closest_elementary },
                            { icon: School, label: 'Middle', data: survey.closest_middle },
                            { icon: School, label: 'High School', data: survey.closest_high },
                            { icon: MapIcon, label: 'Highway', data: survey.closest_highway },
                          ].map((item, idx) => (
                            <div key={idx} className="flex items-start gap-3">
                              <div className="p-1.5 bg-slate-800 rounded-lg text-slate-400">
                                <item.icon className="w-3.5 h-3.5" />
                              </div>
                              <div>
                                <p className="text-xs font-bold text-slate-200">{item.data?.name || 'N/A'}</p>
                                <p className="text-[10px] text-slate-500">{item.label} • {item.data?.distance || ''} ({item.data?.miles || 0} mi)</p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                    
                    <div className="pt-4 border-t border-slate-800">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <Shield className={cn(
                            "w-4 h-4",
                            survey.safety_rating?.includes('Very Safe') ? "text-emerald-400" :
                            survey.safety_rating?.includes('Safe') ? "text-blue-400" : "text-amber-400"
                          )} />
                          <span className="text-xs font-bold text-slate-200">Area Safety: {survey.safety_rating || 'N/A'}</span>
                        </div>
                      </div>
                      <p className="text-[10px] text-slate-500 leading-relaxed italic">
                        {survey.safety_notes || 'No specific safety data available for this immediate area.'}
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="bg-slate-900/50 rounded-xl p-8 border border-slate-800 border-dashed flex flex-col items-center text-center">
                    <div className="w-12 h-12 bg-slate-800 rounded-full flex items-center justify-center text-slate-500 mb-4">
                      <Navigation className="w-6 h-6" />
                    </div>
                    <p className="text-sm font-bold text-slate-300 mb-1">Local Amenities Map</p>
                    <p className="text-xs text-slate-500 mb-4 max-w-[200px]">
                      Discover nearby schools, transit, and shopping centers to complete the property profile.
                    </p>
                    <button 
                      onClick={handleEnrichProperty}
                      disabled={isEnriching}
                      className="btn-primary py-2 px-6 text-xs"
                    >
                      {isEnriching ? 'Searching...' : 'Fetch Amenities'}
                    </button>
                  </div>
                )}
              </section>

              <section>
                <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-4 flex items-center gap-2">
                  <Tag className="w-3.5 h-3.5" />
                  Property Features
                </h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                  <div className="bg-slate-900/50 rounded-xl p-4 border border-slate-800 flex flex-col items-center text-center">
                    <Sun className={cn("w-5 h-5 mb-2", survey.has_solar_panels === 'Yes' ? "text-amber-400" : "text-slate-600")} />
                    <p className="text-[10px] text-slate-500 uppercase font-bold">Solar Panels</p>
                    <p className="text-sm font-bold">{survey.has_solar_panels}</p>
                  </div>
                  <div className="bg-slate-900/50 rounded-xl p-4 border border-slate-800 flex flex-col items-center text-center">
                    <Car className="w-5 h-5 mb-2 text-blue-400" />
                    <p className="text-[10px] text-slate-500 uppercase font-bold">Vehicles</p>
                    <p className="text-sm font-bold">{survey.vehicle_count}</p>
                  </div>
                  <div className="bg-slate-900/50 rounded-xl p-4 border border-slate-800 flex flex-col items-center text-center">
                    <FileText className="w-5 h-5 mb-2 text-emerald-400" />
                    <p className="text-[10px] text-slate-500 uppercase font-bold">For Sale</p>
                    <p className="text-sm font-bold">{survey.is_for_sale}</p>
                  </div>
                </div>
              </section>

              {survey.type === 'commercial' && (
                <section>
                  <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-4 flex items-center gap-2">
                    <Building2 className="w-3.5 h-3.5" />
                    Commercial Data
                  </h3>
                  <div className="bg-slate-900/50 rounded-xl p-6 border border-slate-800 grid grid-cols-2 gap-6">
                    <div>
                      <p className="text-xs text-slate-500 mb-1">Building Type</p>
                      <p className="text-sm font-bold text-slate-200">{survey.building_type || 'N/A'}</p>
                    </div>
                    <div>
                      <p className="text-xs text-slate-500 mb-1">Occupancy</p>
                      <p className="text-sm font-bold text-slate-200">{survey.occupancy || 'N/A'}</p>
                    </div>
                    <div>
                      <p className="text-xs text-slate-500 mb-1">Zoning</p>
                      <p className="text-sm font-bold text-slate-200">{survey.zoning_type || 'N/A'}</p>
                    </div>
                    <div>
                      <p className="text-xs text-slate-500 mb-1">Parking</p>
                      <p className="text-sm font-bold text-slate-200">{survey.parking_avail || 'N/A'}</p>
                    </div>
                  </div>
                </section>
              )}

              <section>
                <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-4 flex items-center gap-2">
                  <FileText className="w-3.5 h-3.5" />
                  Surveyor Notes
                </h3>
                <div className="bg-slate-900/50 rounded-xl p-6 border border-slate-800 min-h-[100px]">
                  <p className="text-sm text-slate-300 leading-relaxed italic">
                    {survey.notes || 'No notes provided for this survey.'}
                  </p>
                </div>
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
