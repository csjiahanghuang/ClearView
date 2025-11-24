import React from 'react';
import { Eraser, Sparkles } from 'lucide-react';

export const Header: React.FC = () => {
  return (
    <header className="border-b border-slate-700 bg-slate-800/50 backdrop-blur-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-indigo-600 rounded-lg shadow-lg shadow-indigo-500/20">
            <Eraser className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold bg-gradient-to-r from-white to-slate-400 bg-clip-text text-transparent">
              ClearView AI
            </h1>
            <p className="text-xs text-slate-400">Visual Effect Remover</p>
          </div>
        </div>
        <div className="flex items-center space-x-2 text-sm text-slate-400">
          <Sparkles className="w-4 h-4 text-amber-400" />
          <span>Powered by Gemini 2.5</span>
        </div>
      </div>
    </header>
  );
};