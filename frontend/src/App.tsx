import { useState } from 'react';
import { PromptInput } from './components/PromptInput';
import { PreviewPane } from './components/PreviewPane';
import { CodeView } from './components/CodeView';
import { ExportModal } from './components/ExportModal';
import { HistorySidebar } from './components/HistorySidebar';
import { useGenerate } from './hooks/useGenerate';
import type { GenerationSummary } from './types';
import { Sparkles, Eye, Code2, Columns, Share2 } from 'lucide-react';

export default function App() {
  const { generate, loading, error, currentGeneration, setCurrentGeneration } = useGenerate();
  const [viewMode, setViewMode] = useState<'preview' | 'code' | 'split'>('preview');
  const [isExportOpen, setIsExportOpen] = useState(false);
  const [selectedElementPrompt, setSelectedElementPrompt] = useState<string | null>(null);

  const handleSelectHistory = (summary: GenerationSummary) => {
    setCurrentGeneration({
      id: summary.id,
      prompt: summary.prompt,
      html: summary.html || `<!DOCTYPE html><html><head><style>body { font-family: sans-serif; padding: 2rem; background: #0f172a; color: #f8fafc; text-align: center; }</style></head><body><h1>${summary.prompt}</h1><p>Loaded from history.</p></body></html>`,
      created_at: summary.created_at,
    });
  };

  const currentHtml = currentGeneration?.html || '';

  return (
    <div className="flex h-screen bg-[#07090e] text-slate-100 font-sans overflow-hidden">
      <HistorySidebar onSelectGeneration={handleSelectHistory} />

      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Header */}
        <header className="h-14 border-b border-slate-800 px-6 flex items-center justify-between bg-slate-950/90 backdrop-blur-md">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-purple-600 to-indigo-500 flex items-center justify-center shadow-md shadow-purple-900/30">
              <Sparkles className="w-4 h-4 text-white" />
            </div>
            <h1 className="text-sm font-bold tracking-wider text-slate-100 uppercase">
              SSV <span className="text-purple-400 font-normal">Studio</span>
            </h1>
          </div>

          <div className="flex items-center gap-3">
            {/* View Mode Controls */}
            <div className="flex bg-slate-900 p-1 rounded-xl border border-slate-800">
              <button
                onClick={() => setViewMode('preview')}
                className={`flex items-center gap-1.5 px-3 py-1 text-xs rounded-lg font-medium transition-all ${
                  viewMode === 'preview'
                    ? 'bg-purple-600 text-white shadow-sm'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <Eye className="w-3.5 h-3.5" />
                Preview
              </button>
              <button
                onClick={() => setViewMode('code')}
                className={`flex items-center gap-1.5 px-3 py-1 text-xs rounded-lg font-medium transition-all ${
                  viewMode === 'code'
                    ? 'bg-purple-600 text-white shadow-sm'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <Code2 className="w-3.5 h-3.5" />
                Code
              </button>
              <button
                onClick={() => setViewMode('split')}
                className={`flex items-center gap-1.5 px-3 py-1 text-xs rounded-lg font-medium transition-all ${
                  viewMode === 'split'
                    ? 'bg-purple-600 text-white shadow-sm'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <Columns className="w-3.5 h-3.5" />
                Split
              </button>
            </div>

            {/* Export Trigger */}
            {currentGeneration && (
              <button
                onClick={() => setIsExportOpen(true)}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs bg-purple-600 hover:bg-purple-500 text-white font-medium rounded-xl transition-all shadow-md shadow-purple-900/20"
              >
                <Share2 className="w-3.5 h-3.5" />
                Export
              </button>
            )}
          </div>
        </header>

        {/* Studio Workspace */}
        <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
          <div className="w-full md:w-[380px] border-r border-slate-800/80 p-5 bg-slate-950/40 overflow-y-auto">
            <PromptInput
              onGenerate={generate}
              loading={loading}
              selectedElementPrompt={selectedElementPrompt}
              onClearSelectedElement={() => setSelectedElementPrompt(null)}
            />
            {error && (
              <div className="mt-4 p-3 bg-red-950/40 border border-red-800/60 rounded-xl text-red-300 text-xs leading-relaxed">
                {error}
              </div>
            )}
          </div>

          <div className="flex-1 relative overflow-hidden bg-[#07090e]">
            {viewMode === 'preview' && (
              <PreviewPane
                html={currentHtml}
                loading={loading}
                onSelectElementForEdit={(elementTag) => setSelectedElementPrompt(elementTag)}
              />
            )}
            {viewMode === 'code' && <CodeView html={currentHtml} />}
            {viewMode === 'split' && (
              <div className="grid grid-cols-2 h-full divide-x divide-slate-800">
                <PreviewPane
                  html={currentHtml}
                  loading={loading}
                  onSelectElementForEdit={(elementTag) => setSelectedElementPrompt(elementTag)}
                />
                <CodeView html={currentHtml} />
              </div>
            )}
          </div>
        </div>
      </div>

      {/* One-Click Export Dialog */}
      <ExportModal
        isOpen={isExportOpen}
        onClose={() => setIsExportOpen(false)}
        html={currentHtml}
      />
    </div>
  );
}