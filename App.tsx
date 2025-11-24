import React, { useState } from 'react';
import { Header } from './components/Header';
import { ImageInput } from './components/ImageInput';
import { ComparisonView } from './components/ComparisonView';
import { AppStatus, ImageFile } from './types';
import { removeVisualEffects, fileToRawBase64 } from './services/geminiService';
import { Info, AlertTriangle } from 'lucide-react';

const DEFAULT_PROMPT = "Remove all artificial visual effects, filters, lens flares, and overlays. Make the photo look natural, realistic, and high quality. Keep original subjects intact.";

const App: React.FC = () => {
  const [status, setStatus] = useState<AppStatus>(AppStatus.IDLE);
  const [currentImage, setCurrentImage] = useState<ImageFile | null>(null);
  const [processedUrl, setProcessedUrl] = useState<string | null>(null);
  const [prompt, setPrompt] = useState<string>(DEFAULT_PROMPT);
  const [error, setError] = useState<string | null>(null);

  const handleImageSelected = async (file: File) => {
    try {
      setStatus(AppStatus.UPLOADING);
      setError(null);
      setProcessedUrl(null); // Clear previous result
      
      const previewUrl = URL.createObjectURL(file);
      const base64Data = await fileToRawBase64(file);
      
      setCurrentImage({
        file,
        previewUrl,
        base64Data,
        mimeType: file.type
      });
      
      setStatus(AppStatus.IDLE);
    } catch (e) {
      console.error("Error reading file:", e);
      setError("Failed to read the image file. Please try again.");
      setStatus(AppStatus.ERROR);
    }
  };

  const handleProcess = async () => {
    if (!currentImage) return;

    try {
      setStatus(AppStatus.PROCESSING);
      setError(null);

      // Call Gemini Service
      const resultUrl = await removeVisualEffects(
        currentImage.base64Data,
        currentImage.mimeType,
        prompt
      );

      setProcessedUrl(resultUrl);
      setStatus(AppStatus.SUCCESS);
    } catch (e: any) {
      console.error("Processing failed:", e);
      let errorMessage = "An error occurred while processing the image.";
      
      if (e.message?.includes('400')) {
        errorMessage = "The image might be too complex or the format is unsupported by the current model.";
      } else if (e.message?.includes('API_KEY')) {
         errorMessage = "API Configuration Error. Please check your key.";
      }
      
      setError(errorMessage);
      setStatus(AppStatus.ERROR);
    }
  };

  const handleReset = () => {
    setCurrentImage(null);
    setProcessedUrl(null);
    setStatus(AppStatus.IDLE);
    setError(null);
    setPrompt(DEFAULT_PROMPT);
  };

  return (
    <div className="min-h-screen bg-slate-900 flex flex-col font-sans selection:bg-indigo-500/30">
      <Header />

      <main className="flex-grow container mx-auto px-4 py-8 sm:px-6 lg:px-8 max-w-5xl">
        {/* Intro Section */}
        {!currentImage && (
          <div className="text-center mb-10 space-y-4 animate-fade-in-up">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
              Restore your photos to <span className="text-indigo-400">perfection</span>
            </h2>
            <p className="max-w-2xl mx-auto text-lg text-slate-400">
              Upload an image with unwanted filters, overlays, or artifacts. 
              Our AI analyzes the content and intelligently removes visual noise while preserving the details.
            </p>
          </div>
        )}

        {/* Error Alert */}
        {error && (
          <div className="mb-6 p-4 bg-red-900/20 border border-red-800 rounded-xl flex items-start space-x-3 text-red-200 animate-in fade-in slide-in-from-top-4">
            <AlertTriangle className="w-5 h-5 flex-shrink-0 mt-0.5" />
            <div>
              <h4 className="font-medium text-red-100">Processing Failed</h4>
              <p className="text-sm opacity-90 mt-1">{error}</p>
            </div>
          </div>
        )}

        {/* Main Interface */}
        <div className="bg-slate-900/50 rounded-3xl">
          {!currentImage ? (
             <div className="animate-fade-in">
              <ImageInput onImageSelected={handleImageSelected} status={status} />
              
              <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4 text-left">
                {[
                  { title: "Smart Detection", desc: "Identifies artificial layers automatically." },
                  { title: "Detail Preservation", desc: "Keeps faces and objects sharp." },
                  { title: "Instant Removal", desc: "Remove lens flares, blurs, and filters." }
                ].map((feature, idx) => (
                  <div key={idx} className="p-4 rounded-xl bg-slate-800/30 border border-slate-700/50">
                    <h3 className="font-semibold text-slate-200 mb-1">{feature.title}</h3>
                    <p className="text-sm text-slate-500">{feature.desc}</p>
                  </div>
                ))}
              </div>
             </div>
          ) : (
            <ComparisonView 
              original={currentImage}
              processedUrl={processedUrl}
              status={status}
              onReset={handleReset}
              prompt={prompt}
              onPromptChange={setPrompt}
              onProcess={handleProcess}
            />
          )}
        </div>
      </main>

      <footer className="py-6 text-center text-slate-600 text-sm border-t border-slate-800 bg-slate-900">
        <div className="flex items-center justify-center space-x-1 mb-2">
          <Info className="w-4 h-4" />
          <span>Privacy Note: Images are processed in memory and not permanently stored.</span>
        </div>
        <p>&copy; {new Date().getFullYear()} ClearView AI. Built with Gemini 2.5 Flash.</p>
      </footer>
    </div>
  );
};

export default App;