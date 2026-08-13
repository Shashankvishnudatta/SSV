import { useState, type FormEvent, type KeyboardEvent } from 'react';
import { Sparkles, Loader2, Wand2, Target, Palette } from 'lucide-react';

interface PromptInputProps {
  onGenerate: (prompt: string) => void;
  loading: boolean;
  selectedElementPrompt?: string | null;
  onClearSelectedElement?: () => void;
}

const THEME_PRESETS = [
  { id: 'glassmorphism', name: 'Glassmorphism Dark', style: 'Dark background, sleek glass cards with backdrop-blur, subtle borders, glowing gradient accents' },
  { id: 'neobrutalism', name: 'Neo-Brutalism', style: 'Bold black outlines, high-contrast vibrant colors, sharp corners, hard shadow effects' },
  { id: 'minimalist', name: 'Minimalist Clean', style: 'Clean whitespace, slate/zinc monochromatic color palette, subtle typography focus' },
  { id: 'cyberpunk', name: 'Cyberpunk Neon', style: 'Dark void background, neon cyan and magenta glow accents, futuristic monospace fonts' },
];

export function PromptInput({
  onGenerate,
  loading,
  selectedElementPrompt,
  onClearSelectedElement,
}: PromptInputProps) {
  const [prompt, setPrompt] = useState<string>('');
  const [activePreset, setActivePreset] = useState<string | null>(null);

  const handleSubmit = (e?: FormEvent) => {
    if (e) e.preventDefault();
    const finalPromptText = prompt.trim();
    if (!finalPromptText || loading) return;

    // Append design system instructions if preset is active
    let compoundPrompt = finalPromptText;
    if (activePreset) {
      const presetObj = THEME_PRESETS.find((p) => p.id === activePreset);
      if (presetObj) {
        compoundPrompt += `\n\n[Design System Style Directive: Apply a ${presetObj.name} aesthetic: ${presetObj.style}]`;
      }
    }

    if (selectedElementPrompt) {
      compoundPrompt = `Targeted edit on element: <${selectedElementPrompt}>. Instruction: ${compoundPrompt}`;
    }

    onGenerate(compoundPrompt);
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
      e.preventDefault();
      handleSubmit();
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      {/* Targeted Element Banner */}
      {selectedElementPrompt && (
        <div className="p-2.5 bg-purple-950/60 border border-purple-500/50 rounded-xl flex items-center justify-between text-xs text-purple-200">
          <div className="flex items-center gap-2 truncate">
            <Target className="w-4 h-4 text-purple-400 shrink-0" />
            <span className="truncate">Editing: <code className="bg-purple-900/80 px-1.5 py-0.5 rounded font-mono text-purple-300">&lt;{selectedElementPrompt}&gt;</code></span>
          </div>
          <button
            type="button"
            onClick={onClearSelectedElement}
            className="text-purple-400 hover:text-purple-100 font-bold ml-2"
          >
            ×
          </button>
        </div>
      )}

      {/* Theme Presets */}
      <div className="flex flex-col gap-2">
        <label className="text-[11px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
          <Palette className="w-3.5 h-3.5 text-purple-400" />
          Style Preset
        </label>
        <div className="grid grid-cols-2 gap-1.5">
          {THEME_PRESETS.map((preset) => (
            <button
              key={preset.id}
              type="button"
              onClick={() => setActivePreset(activePreset === preset.id ? null : preset.id)}
              className={`p-2 text-left text-xs rounded-lg border transition-all ${
                activePreset === preset.id
                  ? 'bg-purple-600/20 border-purple-500 text-purple-200 font-medium'
                  : 'bg-slate-900 border-slate-800 text-slate-400 hover:border-slate-700 hover:text-slate-200'
              }`}
            >
              {preset.name}
            </button>
          ))}
        </div>
      </div>

      {/* Prompt Area */}
      <div className="flex flex-col gap-1.5">
        <label className="text-[11px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
          <Wand2 className="w-3.5 h-3.5 text-purple-400" />
          Prompt Studio
        </label>
        <div className="relative">
          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value || '')}
            onKeyDown={handleKeyDown}
            placeholder={
              selectedElementPrompt
                ? `Describe how to change <${selectedElementPrompt}> (e.g. Change text to "Explore Works" and make background translucent)...`
                : "Describe the site you want to build..."
            }
            disabled={loading}
            rows={6}
            className="w-full p-3.5 bg-slate-900/90 border border-slate-800 rounded-xl text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 resize-none transition-all disabled:opacity-50 leading-relaxed shadow-inner"
          />
          <div className="absolute bottom-2.5 right-2.5 text-[10px] text-slate-500 pointer-events-none bg-slate-950/80 px-1.5 py-0.5 rounded border border-slate-800">
            Ctrl + Enter
          </div>
        </div>
      </div>

      <button
        type="submit"
        disabled={loading || !prompt || !prompt.trim()}
        className="w-full py-3 px-4 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 disabled:from-slate-800 disabled:to-slate-800 disabled:text-slate-500 text-white font-semibold text-sm rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-purple-900/20 transition-all cursor-pointer disabled:cursor-not-allowed"
      >
        {loading ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin text-purple-200" />
            <span>Building Site...</span>
          </>
        ) : (
          <>
            <Sparkles className="w-4 h-4" />
            <span>{selectedElementPrompt ? 'Refine Element' : 'Generate Website'}</span>
          </>
        )}
      </button>
    </form>
  );
}