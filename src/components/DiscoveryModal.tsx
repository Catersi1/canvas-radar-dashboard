import React, { useState } from 'react';
import { X, Search, Globe, Loader2, Plus, CheckCircle2, AlertCircle } from 'lucide-react';
import { discoverProperties, DiscoveredProperty } from '../services/propertyDiscovery';
import { cn } from '../lib/utils';

interface DiscoveryModalProps {
  onClose: () => void;
  onAddProperty: (property: DiscoveredProperty) => Promise<void>;
}

export default function DiscoveryModal({ onClose, onAddProperty }: DiscoveryModalProps) {
  const [location, setLocation] = useState('');
  const [criteria, setCriteria] = useState('recent real estate listings');
  const [isSearching, setIsSearching] = useState(false);
  const [results, setResults] = useState<DiscoveredProperty[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [addedIds, setAddedIds] = useState<Set<string>>(new Set());

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!location.trim()) return;

    setIsSearching(true);
    setError(null);
    setResults([]);
    
    try {
      const result = await discoverProperties(location, criteria);
      if (result.error) {
        setError(result.error);
      } else {
        setResults(result.properties);
      }
    } catch (err: any) {
      setError(err.message || "An unexpected error occurred");
    } finally {
      setIsSearching(false);
    }
  };

  const handleAdd = async (prop: DiscoveredProperty, index: number) => {
    try {
      await onAddProperty(prop);
      setAddedIds(prev => new Set(prev).add(index.toString()));
    } catch (err) {
      console.error("Failed to add property:", err);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <div className="bg-[#0f0f11] border border-slate-800 rounded-2xl w-full max-w-3xl max-h-[90vh] overflow-hidden flex flex-col shadow-2xl animate-in fade-in zoom-in duration-200">
        {/* Header */}
        <div className="p-6 border-b border-slate-800 flex items-center justify-between bg-slate-900/30">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-500/10 rounded-xl border border-blue-500/20 text-blue-400">
              <Globe className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">Property Discovery</h2>
              <p className="text-xs text-slate-500 uppercase tracking-wider font-medium">Scrape Web & Maps Data</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-2 text-slate-500 hover:text-white hover:bg-slate-800 rounded-lg transition-all"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Search Form */}
        <div className="p-6 border-b border-slate-800 bg-slate-900/10">
          <form onSubmit={handleSearch} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Location</label>
                <div className="relative">
                  <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
                  <input 
                    type="text" 
                    placeholder="e.g. Austin, TX or 78701" 
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-10 pr-4 py-2 text-sm text-white focus:outline-none focus:border-blue-500/50 transition-all"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Search Criteria</label>
                <input 
                  type="text" 
                  placeholder="e.g. commercial office spaces" 
                  value={criteria}
                  onChange={(e) => setCriteria(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-2 text-sm text-white focus:outline-none focus:border-blue-500/50 transition-all"
                />
              </div>
            </div>
            <button 
              type="submit"
              disabled={isSearching || !location.trim()}
              className="w-full py-2.5 bg-blue-600 hover:bg-blue-500 disabled:bg-slate-800 text-white text-sm font-bold rounded-xl transition-all flex items-center justify-center gap-2 shadow-lg shadow-blue-600/20"
            >
              {isSearching ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Scraping Data...
                </>
              ) : (
                <>
                  <Globe className="w-4 h-4" />
                  Discover Properties
                </>
              )}
            </button>
          </form>
        </div>

        {/* Results */}
        <div className="flex-1 overflow-y-auto p-6 custom-scrollbar">
          {error && (
            <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl flex items-center gap-3 text-red-400 mb-4">
              <AlertCircle className="w-5 h-5 shrink-0" />
              <p className="text-sm">{error}</p>
            </div>
          )}

          {results.length > 0 ? (
            <div className="space-y-4">
              <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Discovered Properties ({results.length})</h3>
              {results.map((prop, i) => (
                <div key={i} className="p-4 bg-slate-900/50 border border-slate-800 rounded-xl flex items-center justify-between group hover:border-blue-500/30 transition-all">
                  <div className="flex-1 min-w-0 pr-4">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="font-bold text-slate-200 truncate">{prop.address}</h4>
                      <span className={cn(
                        "text-[8px] font-bold px-1.5 py-0.5 rounded uppercase",
                        prop.type === 'residential' ? "bg-blue-500/10 text-blue-400" : "bg-purple-500/10 text-purple-400"
                      )}>
                        {prop.type}
                      </span>
                    </div>
                    <p className="text-xs text-slate-500">{prop.city}, {prop.state} {prop.zip}</p>
                    {prop.description && (
                      <p className="text-[10px] text-slate-600 mt-1 line-clamp-1 italic">"{prop.description}"</p>
                    )}
                  </div>
                  <button 
                    onClick={() => handleAdd(prop, i)}
                    disabled={addedIds.has(i.toString())}
                    className={cn(
                      "flex items-center gap-2 px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase transition-all",
                      addedIds.has(i.toString()) 
                        ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                        : "bg-blue-500/10 hover:bg-blue-500/20 text-blue-400 border border-blue-500/20"
                    )}
                  >
                    {addedIds.has(i.toString()) ? (
                      <>
                        <CheckCircle2 className="w-3 h-3" />
                        Added
                      </>
                    ) : (
                      <>
                        <Plus className="w-3 h-3" />
                        Add to DB
                      </>
                    )}
                  </button>
                </div>
              ))}
            </div>
          ) : !isSearching && !error && (
            <div className="flex flex-col items-center justify-center py-12 text-center space-y-4 opacity-50">
              <Globe className="w-12 h-12 text-slate-700" />
              <div>
                <p className="text-sm font-bold text-slate-400">No properties discovered yet</p>
                <p className="text-xs text-slate-600 mt-1">Enter a location and criteria above to start scraping.</p>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-slate-800 bg-slate-900/30 flex justify-end">
          <button 
            onClick={onClose}
            className="px-6 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-sm font-bold rounded-xl transition-all border border-slate-700"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
