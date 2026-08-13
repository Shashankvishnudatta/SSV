import React from 'react';
import { History, Clock, ChevronLeft, ChevronRight, Loader2, Sparkles } from 'lucide-react';
import type { GenerationSummary } from '../types';

interface HistorySidebarProps {
  generations: GenerationSummary[];
  onSelectGeneration: (id: string) => void;
  activeId?: string | null;
  isLoading: boolean;
  isOpen: boolean;
  onToggle: () => void;
}

export const HistorySidebar: React.FC<HistorySidebarProps> = ({
  generations,
  onSelectGeneration,
  activeId,
  isLoading,
  isOpen,
  onToggle,
}) => {
  const formatDate = (isoString: string) => {
    try {
      const date = new Date(isoString);
      return new Intl.DateTimeFormat('en-US', {
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      }).format(date);
    } catch {
      return isoString;
    }
  };

  return (
    <aside
      className={`relative flex flex-col h-full bg-slate-900 border-r border-slate-800 transition-all duration-300 z-10 ${
        isOpen ? 'w-64' : 'w-12'
      }`}
    >
      {/* Sidebar Header & Collapse Toggle */}
      <div className="flex items-center justify-between p-3 border-b border-slate-800 shrink-0">
        {isOpen ? (
          <div className="flex items-center gap-2">
            <History className="w-4 h-4 text-indigo-400" />
            <span className="text-xs font-semibold text-slate-200">Generation History</span>
          </div>
        ) : (
          <History className="w-4 h-4 text-indigo-400 mx-auto" />
        )}

        <button
          onClick={onToggle}
          title={isOpen ? 'Collapse Sidebar' : 'Expand Sidebar'}
          className="p-1 rounded-md text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition-colors"
        >
          {isOpen ? <ChevronLeft className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
        </button>
      </div>

      {/* History Items Container */}
      {isOpen && (
        <div className="flex-1 overflow-y-auto p-2 space-y-1.5">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center p-6 gap-2 text-slate-500">
              <Loader2 className="w-5 h-5 animate-spin text-indigo-400" />
              <span className="text-xs">Loading history...</span>
            </div>
          ) : generations.length === 0 ? (
            <div className="flex flex-col items-center justify-center p-6 text-center text-slate-500">
              <Sparkles className="w-6 h-6 mb-2 opacity-40 text-slate-400" />
              <p className="text-xs font-medium text-slate-400">No past generations</p>
              <p className="text-[11px] text-slate-600 mt-1">
                Your generated websites will appear here.
              </p>
            </div>
          ) : (
            generations.map((item) => {
              const isActive = activeId === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => onSelectGeneration(item.id)}
                  className={`w-full text-left p-2.5 rounded-lg border transition-all text-xs flex flex-col gap-1.5 group ${
                    isActive
                      ? 'bg-indigo-950/40 border-indigo-500/50 text-indigo-200'
                      : 'bg-slate-950/50 border-slate-800/80 hover:bg-slate-800/60 hover:border-slate-700 text-slate-300'
                  }`}
                >
                  <p className="line-clamp-2 font-medium leading-snug group-hover:text-slate-100">
                    {item.prompt}
                  </p>
                  <div className="flex items-center gap-1 text-[10px] text-slate-500">
                    <Clock className="w-3 h-3 text-slate-600" />
                    <span>{formatDate(item.created_at)}</span>
                  </div>
                </button>
              );
            })
          )}
        </div>
      )}
    </aside>
  );
};