import React, { ChangeEvent, useState } from 'react';
import { UploadCloud, Image as ImageIcon, AlertCircle } from 'lucide-react';
import { AppStatus } from '../types';

interface ImageInputProps {
  onImageSelected: (file: File) => void;
  status: AppStatus;
}

export const ImageInput: React.FC<ImageInputProps> = ({ onImageSelected, status }) => {
  const [dragActive, setDragActive] = useState(false);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  };

  const handleFile = (file: File) => {
    // Basic validation
    if (!file.type.startsWith('image/')) {
      alert("Please upload an image file.");
      return;
    }
    // Limit size to ~10MB to be safe with standard requests
    if (file.size > 10 * 1024 * 1024) {
      alert("File is too large. Please try an image under 10MB.");
      return;
    }
    onImageSelected(file);
  };

  const isDisabled = status === AppStatus.PROCESSING || status === AppStatus.UPLOADING;

  return (
    <div className="w-full">
      <div 
        className={`relative group cursor-pointer transition-all duration-300 ease-in-out
          ${dragActive ? 'scale-[1.01] ring-2 ring-indigo-500' : ''}
          ${isDisabled ? 'opacity-50 cursor-not-allowed' : ''}
        `}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        <label 
          htmlFor="file-upload" 
          className={`
            flex flex-col items-center justify-center w-full h-64 sm:h-80
            border-2 border-dashed rounded-2xl
            ${dragActive ? 'border-indigo-500 bg-indigo-500/10' : 'border-slate-600 hover:border-slate-500 bg-slate-800/50 hover:bg-slate-800'}
            transition-colors duration-200
          `}
        >
          <div className="flex flex-col items-center justify-center pt-5 pb-6 text-center px-4">
            <div className={`p-4 rounded-full mb-4 ${dragActive ? 'bg-indigo-500/20' : 'bg-slate-700'}`}>
              <UploadCloud className={`w-8 h-8 sm:w-10 sm:h-10 ${dragActive ? 'text-indigo-400' : 'text-slate-400'}`} />
            </div>
            <p className="mb-2 text-lg font-medium text-slate-200">
              <span className="font-semibold text-indigo-400">Click to upload</span> or drag and drop
            </p>
            <p className="text-sm text-slate-500 mb-4">
              SVG, PNG, JPG or WEBP (max. 10MB)
            </p>
            <div className="flex items-center space-x-2 text-xs text-slate-500 bg-slate-900/50 px-3 py-1.5 rounded-full border border-slate-700">
              <ImageIcon className="w-3 h-3" />
              <span>Supports high-resolution output</span>
            </div>
          </div>
          <input 
            id="file-upload" 
            type="file" 
            className="hidden" 
            accept="image/*"
            onChange={handleChange}
            disabled={isDisabled}
          />
        </label>
        
        {/* Overlay for drag active state */}
        {dragActive && (
          <div className="absolute inset-0 bg-indigo-500/10 rounded-2xl pointer-events-none" />
        )}
      </div>
    </div>
  );
};