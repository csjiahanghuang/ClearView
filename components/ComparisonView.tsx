import React from 'react';
import { Download, X, ArrowRight, Wand2, ZoomIn, Sparkles } from 'lucide-react';
import { AppStatus, ImageFile } from '../types';

interface ComparisonViewProps {
  original: ImageFile;
  processedUrl: string | null;
  status: AppStatus;
  onReset: () => void;
  prompt: string;
  onPromptChange: (text: string) => void;
  onProcess: () => void;
}

export const ComparisonView: React.FC<ComparisonViewProps> = ({
  original,
  processedUrl,
  status,
  onReset,
  prompt,
  onPromptChange,
  onProcess
}) => {
  const isProcessing = status === AppStatus.PROCESSING;

  const handleDownload = () => {
    if (!processedUrl) return;
    const link = document.createElement('a');
    link.href = processedUrl;
    link.download = `clearview-edited-${Date.now()}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="flex flex-col space-y-6 w-full animate-fade-in">
      {/* Control Bar */}
      <div className="bg-slate-800/80 backdrop-blur rounded-xl p-4 border border-slate-700 shadow-xl">
        <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
          <div className="flex-1 w-full">
            <label className="block text-xs font-semibold text-slate-400 mb-1.5 ml-1 uppercase tracking-wider">
              Refine Prompt
            </label>
            <div className="relative">
              <input
                type="text"
                value={prompt}
                onChange={(e) => onPromptChange(e.target.value)}
                disabled={isProcessing}
                className="w-full bg-slate-900 border border-slate-600 rounded-lg py-2.5 pl-4 pr-10 text-sm text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all disabled:opacity-50"
                placeholder="Describe what to remove..."
              />
              <Wand2 className="absolute right-3 top-2.5 w-4 h-4 text-slate-500" />
            </div>
          </div>
          
          <div className="flex items-center gap-3 w-full lg:w-auto mt-2 lg:mt-6">
            <button
              onClick={onReset}
              disabled={isProcessing}
              className="px-4 py-2.5 rounded-lg text-sm font-medium text-slate-300 hover:text-white hover:bg-slate-700 transition-colors disabled:opacity-50"
            >
              Start Over
            </button>
            <button
              onClick={onProcess}
              disabled={isProcessing}
              className={`
                flex-1 lg:flex-none flex items-center justify-center gap-2 px-6 py-2.5 rounded-lg text-sm font-semibold text-white shadow-lg
                ${isProcessing 
                  ? 'bg-indigo-600/50 cursor-wait' 
                  : 'bg-indigo-600 hover:bg-indigo-500 hover:shadow-indigo-500/25 active:transform active:scale-95'
                }
                transition-all duration-200
              `}
            >
              {isProcessing ? (
                <>
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Processing...
                </>
              ) : (
                <>
                  <span>{processedUrl ? 'Regenerate' : 'Remove Effects'}</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Image Display Area */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Original */}
        <div className="flex flex-col space-y-3">
          <div className="flex items-center justify-between px-1">
            <span className="text-sm font-medium text-slate-400">Original</span>
            <span className="text-xs text-slate-500">{Math.round(original.file.size / 1024)} KB</span>
          </div>
          <div className="relative group aspect-[4/3] bg-slate-800/50 rounded-2xl border border-slate-700 overflow-hidden shadow-lg">
            <img 
              src={original.previewUrl} 
              alt="Original" 
              className="w-full h-full object-contain p-2"
            />
          </div>
        </div>

        {/* Processed / Placeholder */}
        <div className="flex flex-col space-y-3">
          <div className="flex items-center justify-between px-1">
            <span className="text-sm font-medium text-slate-400">Result</span>
            {processedUrl && (
              <button 
                onClick={handleDownload}
                className="text-xs flex items-center gap-1 text-indigo-400 hover:text-indigo-300 transition-colors"
              >
                <Download className="w-3 h-3" />
                Download
              </button>
            )}
          </div>
          
          <div className="relative aspect-[4/3] bg-slate-800/50 rounded-2xl border border-slate-700 overflow-hidden shadow-lg">
            {processedUrl ? (
              <div className="relative w-full h-full group">
                <img 
                  src={processedUrl} 
                  alt="Processed" 
                  className="w-full h-full object-contain p-2 animate-in fade-in zoom-in-95 duration-500"
                />
                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center gap-4 backdrop-blur-sm">
                   <button
                    onClick={() => window.open(processedUrl, '_blank')}
                    className="p-3 bg-white/10 hover:bg-white/20 rounded-full text-white backdrop-blur transition-all transform hover:scale-110"
                    title="View Full Size"
                   >
                     <ZoomIn className="w-6 h-6" />
                   </button>
                   <button
                    onClick={handleDownload}
                    className="p-3 bg-indigo-600 hover:bg-indigo-500 rounded-full text-white shadow-lg shadow-indigo-600/30 transition-all transform hover:scale-110"
                    title="Download Image"
                   >
                     <Download className="w-6 h-6" />
                   </button>
                </div>
              </div>
            ) : (
              <div className="w-full h-full flex flex-col items-center justify-center text-slate-600 bg-slate-900/50">
                {isProcessing ? (
                  <div className="flex flex-col items-center space-y-4">
                    <div className="relative">
                      <div className="w-16 h-16 border-4 border-slate-700 border-t-indigo-500 rounded-full animate-spin"></div>
                      <div className="absolute inset-0 flex items-center justify-center">
                        <Wand2 className="w-6 h-6 text-indigo-500 animate-pulse" />
                      </div>
                    </div>
                    <div className="text-center">
                      <p className="text-sm font-medium text-slate-300">Analyzing image...</p>
                      <p className="text-xs text-slate-500 mt-1">Removing visual artifacts</p>
                    </div>
                  </div>
                ) : (
                  <>
                    <div className="p-4 bg-slate-800 rounded-full mb-3 shadow-inner">
                      <Sparkles className="w-8 h-8 opacity-20" />
                    </div>
                    <p className="text-sm font-medium">Ready to process</p>
                    <p className="text-xs opacity-60 mt-1 max-w-[200px] text-center">Click 'Remove Effects' above to start magic.</p>
                  </>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};