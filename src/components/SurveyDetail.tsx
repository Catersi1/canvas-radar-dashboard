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
  RefreshCw
} from 'lucide-react';
import { Survey } from '../types/dashboard';
import { format } from 'date-fns';
import { cn } from '../lib/utils';
import CameraCapture from './CameraCapture';

interface SurveyDetailProps {
  survey: Survey;
  onClose: () => void;
  onApprove?: (id: string) => void;
}

export default function SurveyDetail({ survey, onClose, onApprove }: SurveyDetailProps) {
  const [showCamera, setShowCamera] = useState(false);
  const [isApproving, setIsApproving] = useState(false);
  const [currentPhotos, setCurrentPhotos] = useState<string[]>(
    Array.from({ length: 6 }).map((_, i) => `https://picsum.photos/seed/property-${survey.id}-${i}/600/400`)
  );

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
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column: Metadata & Status */}
            <div className="space-y-6">
              <section>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest flex items-center gap-2">
                    <Info className="w-3.5 h-3.5" />
                    Survey Info
                  </h3>
                  <button 
                    onClick={() => setShowCamera(true)}
                    className="flex items-center gap-1.5 text-[10px] font-bold text-accent uppercase tracking-widest hover:underline"
                  >
                    <Camera className="w-3 h-3" />
                    Add Photo
                  </button>
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
                      {survey.status}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-slate-500">Earnings</span>
                    <span className="text-sm font-bold text-emerald-400">${survey.earnings.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-slate-500">Submitted</span>
                    <span className="text-xs text-slate-300">{format(new Date(survey.submitted_at), 'MMM d, yyyy HH:mm')}</span>
                  </div>
                  <div className="pt-2 border-t border-slate-800">
                    <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2">Coordinates</p>
                    <div className="grid grid-cols-2 gap-2">
                      <div className="bg-background rounded-lg p-2 border border-slate-800">
                        <p className="text-[8px] text-slate-500 uppercase font-bold">Latitude</p>
                        <p className="text-xs font-mono text-slate-300">{survey.properties?.lat.toFixed(6)}</p>
                      </div>
                      <div className="bg-background rounded-lg p-2 border border-slate-800">
                        <p className="text-[8px] text-slate-500 uppercase font-bold">Longitude</p>
                        <p className="text-xs font-mono text-slate-300">{survey.properties?.lng.toFixed(6)}</p>
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
                <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-4 flex items-center gap-2">
                  <Camera className="w-3.5 h-3.5" />
                  Property Photos
                </h3>
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
