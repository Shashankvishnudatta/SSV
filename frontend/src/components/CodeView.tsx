import { Check, Copy } from 'lucide-react';
import { useState } from 'react';

interface CodeViewProps {
  html: string;
}

export function CodeView({ html }: CodeViewProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(html);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="w-full h-full flex flex-col bg-[#07090e]">
      <div className="h-11 border-b border-slate-800/80 bg-slate-950/80 px-4 flex items-center justify-between">
        <span className="text-xs font-mono text-slate-400">index.html</span>
        <button
          onClick={handleCopy}
          className="flex items-center gap-1.5 px-2.5 py-1 text-xs bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 rounded-md transition-colors"
        >
          {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
          <span>{copied ? 'Copied' : 'Copy Source'}</span>
        </button>
      </div>
      <div className="flex-1 p-4 overflow-auto font-mono text-xs text-purple-200/90 leading-relaxed bg-[#0a0e17]">
        <pre className="whitespace-pre-wrap break-all">{html || '<!-- Code will appear here -->'}
        </pre>
      </div>
    </div>
  );
}