import React, { useState } from 'react';
import { Download, Check } from 'lucide-react';

interface DownloadButtonProps {
  html: string | null;
  isLoading?: boolean;
}

export const DownloadButton: React.FC<DownloadButtonProps> = ({ html, isLoading }) => {
  const [downloaded, setDownloaded] = useState(false);

  const handleDownload = () => {
    if (!html) return;

    try {
      const blob = new Blob([html], { type: 'text/html;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `index-${Date.now()}.html`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      setDownloaded(true);
      setTimeout(() => setDownloaded(false), 2000);
    } catch (err) {
      console.error('Failed to download HTML file:', err);
    }
  };

  return (
    <button
      onClick={handleDownload}
      disabled={!html || isLoading}
      className="flex items-center gap-1.5 px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 disabled:bg-slate-800 disabled:text-slate-600 text-white text-xs font-medium rounded-lg shadow-sm transition-all disabled:cursor-not-allowed"
    >
      {downloaded ? (
        <>
          <Check className="w-3.5 h-3.5 text-emerald-300" />
          <span>Downloaded!</span>
        </>
      ) : (
        <>
          <Download className="w-3.5 h-3.5" />
          <span>Download HTML</span>
        </>
      )}
    </button>
  );
};