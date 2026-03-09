import React from 'react';
import { 
  Search, 
  Filter, 
  Download, 
  ChevronRight, 
  MoreHorizontal,
  FileText,
  CheckCircle2,
  Clock
} from 'lucide-react';
import { Survey } from '../types/dashboard';
import { format } from 'date-fns';
import { cn } from '../lib/utils';

interface SurveyTableProps {
  surveys: Survey[];
  onSelectSurvey: (survey: Survey) => void;
  onExport: () => void;
}

export default function SurveyTable({ surveys, onSelectSurvey, onExport }: SurveyTableProps) {
  return (
    <div className="bg-[#0f0f11] border border-slate-800 rounded-xl overflow-hidden">
      <div className="p-6 border-b border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <h3 className="text-lg font-bold text-white">Data Grid Explorer</h3>
        <div className="flex items-center gap-3">
          <button 
            onClick={onExport}
            className="flex items-center gap-2 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold rounded-lg transition-all border border-slate-700"
          >
            <Download className="w-3.5 h-3.5" />
            Export CSV
          </button>
          <div className="h-6 w-px bg-slate-800"></div>
          <button className="flex items-center gap-2 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold rounded-lg transition-all border border-slate-700">
            <Filter className="w-3.5 h-3.5" />
            Filters
          </button>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-900/50 border-b border-slate-800">
              <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Property Address</th>
              <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Type</th>
              <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Status</th>
              <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Roof Condition</th>
              <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Submitted</th>
              <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800">
            {surveys.map((survey) => (
              <tr 
                key={survey.id} 
                className="hover:bg-slate-800/30 transition-colors cursor-pointer group"
                onClick={() => onSelectSurvey(survey)}
              >
                <td className="px-6 py-4">
                  <div>
                    <p className="text-sm font-medium text-slate-200">{survey.properties?.address}</p>
                    <p className="text-xs text-slate-500">{survey.properties?.city}, {survey.properties?.state}</p>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span className={cn(
                    "text-[10px] font-bold px-2 py-0.5 rounded-full uppercase",
                    survey.type === 'residential' ? "text-blue-400 bg-blue-500/10" : "text-purple-400 bg-purple-500/10"
                  )}>
                    {survey.type}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2">
                    {survey.status === 'complete' ? (
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                    ) : (
                      <Clock className="w-3.5 h-3.5 text-amber-500" />
                    )}
                    <span className={cn(
                      "text-xs font-medium",
                      survey.status === 'complete' ? "text-emerald-400" : "text-amber-400"
                    )}>
                      {survey.status}
                    </span>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span className={cn(
                    "text-xs font-medium",
                    survey.roof_condition === 'Good' ? "text-emerald-400" :
                    survey.roof_condition === 'Fair' ? "text-amber-400" : "text-red-400"
                  )}>
                    {survey.roof_condition}
                  </span>
                </td>
                <td className="px-6 py-4 text-sm text-slate-400">
                  {format(new Date(survey.submitted_at), 'MMM d, yyyy HH:mm')}
                </td>
                <td className="px-6 py-4 text-right">
                  <button className="p-2 text-slate-500 hover:text-emerald-400 transition-colors">
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="p-4 border-t border-slate-800 flex items-center justify-between text-xs text-slate-500">
        <p>Showing {surveys.length} of {surveys.length} results</p>
        <div className="flex items-center gap-2">
          <button className="px-2 py-1 bg-slate-900 border border-slate-800 rounded hover:bg-slate-800 disabled:opacity-50">Prev</button>
          <button className="px-2 py-1 bg-slate-900 border border-slate-800 rounded hover:bg-slate-800 disabled:opacity-50">Next</button>
        </div>
      </div>
    </div>
  );
}
