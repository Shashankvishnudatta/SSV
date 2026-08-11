import { useState, useRef, useEffect } from 'react';
import {
  Monitor,
  Smartphone,
  Tablet,
  Maximize2,
  Minimize2,
  MousePointerClick,
  Globe,
} from 'lucide-react';

interface PreviewPaneProps {
  html: string;
  loading: boolean;
  onSelectElementForEdit?: (elementTag: string) => void;
}

export function PreviewPane({ html, loading, onSelectElementForEdit }: PreviewPaneProps) {
  const [viewport, setViewport] = useState<'desktop' | 'tablet' | 'mobile'>('desktop');
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isInspectorActive, setIsInspectorActive] = useState(false);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  const viewportWidths = {
    desktop: 'w-full',
    tablet: 'max-w-[768px]',
    mobile: 'max-w-[375px]',
  };

  // Inject Inspector script into iframe
  useEffect(() => {
    if (!iframeRef.current || !html || !isInspectorActive) return;

    const doc = iframeRef.current.contentDocument;
    if (!doc) return;

    const style = doc.createElement('style');
    style.id = 'ssv-inspector-style';
    style.innerHTML = `
      .ssv-inspect-hover {
        outline: 2px dashed #a855f7 !important;
        outline-offset: -2px !important;
        cursor: crosshair !important;
      }
    `;
    doc.head.appendChild(style);

    const handleMouseOver = (e: MouseEvent) => {
      e.stopPropagation();
      (e.target as HTMLElement).classList.add('ssv-inspect-hover');
    };

    const handleMouseOut = (e: MouseEvent) => {
      e.stopPropagation();
      (e.target as HTMLElement).classList.remove('ssv-inspect-hover');
    };

    const handleClick = (e: MouseEvent) => {
      e.preventDefault();
      e.stopPropagation();
      const target = e.target as HTMLElement;
      target.classList.remove('ssv-inspect-hover');
      const tagInfo = `${target.tagName.toLowerCase()}${
        target.id ? `#${target.id}` : ''
      }${target.className ? `.${target.className.split(' ').join('.')}` : ''}`;

      if (onSelectElementForEdit) {
        onSelectElementForEdit(tagInfo);
      }
      setIsInspectorActive(false);
    };

    doc.body.addEventListener('mouseover', handleMouseOver);
    doc.body.addEventListener('mouseout', handleMouseOut);
    doc.body.addEventListener('click', handleClick);

    return () => {
      doc.body.removeEventListener('mouseover', handleMouseOver);
      doc.body.removeEventListener('mouseout', handleMouseOut);
      doc.body.removeEventListener('click', handleClick);
      const injectedStyle = doc.getElementById('ssv-inspector-style');
      if (injectedStyle) injectedStyle.remove();
    };
  }, [html, isInspectorActive, onSelectElementForEdit]);

  return (
    <div
      className={`flex flex-col bg-[#07090e] transition-all duration-300 ${
        isFullscreen ? 'fixed inset-0 z-50 w-screen h-screen' : 'w-full h-full'
      }`}
    >
      {/* Canvas Top Bar */}
      <div className="h-11 border-b border-slate-800 bg-slate-950/90 px-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 text-xs text-slate-400 font-medium">
            <Globe className="w-3.5 h-3.5 text-purple-400" />
            <span>Live Canvas</span>
          </div>

          {/* Element Inspector Button */}
          {html && (
            <button
              onClick={() => setIsInspectorActive(!isInspectorActive)}
              className={`flex items-center gap-1.5 px-2.5 py-1 text-xs rounded-lg border transition-all ${
                isInspectorActive
                  ? 'bg-purple-600 text-white border-purple-500 shadow-sm animate-pulse'
                  : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200'
              }`}
            >
              <MousePointerClick className="w-3.5 h-3.5" />
              <span>{isInspectorActive ? 'Click any element...' : 'Inspect Element'}</span>
            </button>
          )}
        </div>

        <div className="flex items-center gap-2">
          {/* Viewport Toggles */}
          <div className="flex items-center gap-1 bg-slate-900 p-1 rounded-lg border border-slate-800">
            <button
              onClick={() => setViewport('desktop')}
              className={`p-1.5 rounded-md transition-colors ${
                viewport === 'desktop' ? 'bg-purple-600 text-white' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Monitor className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setViewport('tablet')}
              className={`p-1.5 rounded-md transition-colors ${
                viewport === 'tablet' ? 'bg-purple-600 text-white' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Tablet className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setViewport('mobile')}
              className={`p-1.5 rounded-md transition-colors ${
                viewport === 'mobile' ? 'bg-purple-600 text-white' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Smartphone className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Full Screen Toggle */}
          <button
            onClick={() => setIsFullscreen(!isFullscreen)}
            className="p-1.5 bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-400 hover:text-slate-200 rounded-lg transition-colors"
            title="Toggle full screen canvas"
          >
            {isFullscreen ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
          </button>
        </div>
      </div>

      {/* Frame Container */}
      <div className="flex-1 p-4 overflow-auto flex justify-center items-center bg-[radial-gradient(#1e293b_1px,transparent_1px)] [background-size:16px_16px]">
        {loading ? (
          <div className="flex flex-col items-center gap-3">
            <div className="w-10 h-10 border-2 border-purple-500/20 border-t-purple-500 rounded-full animate-spin" />
            <p className="text-xs font-medium text-slate-400">Rendering component canvas...</p>
          </div>
        ) : html ? (
          <div
            className={`h-full ${viewportWidths[viewport]} transition-all duration-300 bg-white rounded-xl shadow-2xl overflow-hidden border border-slate-800 flex flex-col`}
          >
            <iframe
              ref={iframeRef}
              title="Generated Site Preview"
              srcDoc={html}
              className="w-full h-full border-0 bg-white"
              sandbox="allow-scripts allow-same-origin"
            />
          </div>
        ) : (
          <div className="text-center p-8 border border-dashed border-slate-800 rounded-2xl bg-slate-900/40 max-w-sm">
            <Globe className="w-10 h-10 text-slate-600 mx-auto mb-3" />
            <h3 className="text-sm font-semibold text-slate-300 mb-1">Canvas Ready</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Submit a prompt in the studio panel to render a live generated web application.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}