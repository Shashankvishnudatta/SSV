import { X, Code, ExternalLink, Archive } from 'lucide-react';
import JSZip from 'jszip';
import saveAs from 'file-saver';

interface ExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  html: string;
}

export function ExportModal({ isOpen, onClose, html }: ExportModalProps) {
  if (!isOpen) return null;

  // CodePen POST Form Submission
  const exportToCodePen = () => {
    const data = {
      title: 'SSV Studio Export',
      html: html,
      editors: '100',
    };
    const form = document.createElement('form');
    form.action = 'https://codepen.io/pen/define';
    form.method = 'POST';
    form.target = '_blank';
    const input = document.createElement('input');
    input.type = 'hidden';
    input.name = 'data';
    input.value = JSON.stringify(data);
    form.appendChild(input);
    document.body.appendChild(form);
    form.submit();
    document.body.removeChild(form);
  };

  // StackBlitz Web Container Export
  const exportToStackBlitz = () => {
    const form = document.createElement('form');
    form.action = 'https://stackblitz.com/run';
    form.method = 'POST';
    form.target = '_blank';

    const files = {
      'index.html': html,
      'package.json': JSON.stringify({
        name: 'ssv-studio-export',
        version: '1.0.0',
        dependencies: {},
      }),
    };

    Object.entries(files).forEach(([path, content]) => {
      const input = document.createElement('input');
      input.type = 'hidden';
      input.name = `project[files][${path}]`;
      input.value = content;
      form.appendChild(input);
    });

    const titleInput = document.createElement('input');
    titleInput.type = 'hidden';
    titleInput.name = 'project[title]';
    titleInput.value = 'SSV Studio Project';
    form.appendChild(titleInput);

    document.body.appendChild(form);
    form.submit();
    document.body.removeChild(form);
  };

  // ZIP File Generation
  const exportToZip = async () => {
    const zip = new JSZip();
    zip.file('index.html', html);
    zip.file(
      'README.md',
      '# Generated with SSV Studio\n\nOpen `index.html` in any browser to view your web application.'
    );

    const blob = await zip.generateAsync({ type: 'blob' });
    saveAs(blob, 'ssv-studio-project.zip');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
      <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-2xl relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-white p-1 rounded-lg bg-slate-800/50"
        >
          <X className="w-4 h-4" />
        </button>

        <h2 className="text-base font-bold text-slate-100 mb-1">Export Project</h2>
        <p className="text-xs text-slate-400 mb-6">
          Choose a platform or format to export your generated code.
        </p>

        <div className="space-y-3">
          <button
            onClick={exportToCodePen}
            className="w-full p-3 bg-slate-800/70 hover:bg-slate-800 border border-slate-700/60 rounded-xl flex items-center justify-between transition-colors group"
          >
            <div className="flex items-center gap-3">
              <Code className="w-5 h-5 text-yellow-400" />
              <div className="text-left">
                <div className="text-xs font-semibold text-slate-200">Open in CodePen</div>
                <div className="text-[11px] text-slate-400">Launch in browser sandbox</div>
              </div>
            </div>
            <ExternalLink className="w-4 h-4 text-slate-500 group-hover:text-slate-300" />
          </button>

          <button
            onClick={exportToStackBlitz}
            className="w-full p-3 bg-slate-800/70 hover:bg-slate-800 border border-slate-700/60 rounded-xl flex items-center justify-between transition-colors group"
          >
            <div className="flex items-center gap-3">
              <ExternalLink className="w-5 h-5 text-blue-400" />
              <div className="text-left">
                <div className="text-xs font-semibold text-slate-200">Open in StackBlitz</div>
                <div className="text-[11px] text-slate-400">Full IDE web environment</div>
              </div>
            </div>
            <ExternalLink className="w-4 h-4 text-slate-500 group-hover:text-slate-300" />
          </button>

          <button
            onClick={exportToZip}
            className="w-full p-3 bg-purple-600/20 hover:bg-purple-600/30 border border-purple-500/40 rounded-xl flex items-center justify-between transition-colors group"
          >
            <div className="flex items-center gap-3">
              <Archive className="w-5 h-5 text-purple-400" />
              <div className="text-left">
                <div className="text-xs font-semibold text-purple-200">Download ZIP Archive</div>
                <div className="text-[11px] text-purple-300/70">Structured HTML & project files</div>
              </div>
            </div>
            <Archive className="w-4 h-4 text-purple-400" />
          </button>
        </div>
      </div>
    </div>
  );
}