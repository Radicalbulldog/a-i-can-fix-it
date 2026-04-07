import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCamera } from '../hooks/useCamera';
import { useAppContext } from '../context/AppContext';
import { analyzeMedia } from '../lib/api';
import AnalysisLoader from '../components/ui/AnalysisLoader';

export default function HomePage() {
  const { files, previews, addFiles, removeFile, clearFiles } = useCamera();
  const { setAnalysis, setIsAnalyzing, isAnalyzing, setMedia } = useAppContext();
  const [context, setContext] = useState('');
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const photoRef = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLInputElement>(null);
  const uploadRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newFiles = Array.from(e.target.files || []);
    if (newFiles.length > 0) addFiles(newFiles);
    e.target.value = '';
  };

  const handleAnalyze = async () => {
    if (files.length === 0) return;
    setError(null);
    setIsAnalyzing(true);
    setMedia(files, previews);

    try {
      const result = await analyzeMedia(files, context || undefined);
      setAnalysis(result);
      navigate('/analysis');
    } catch (err: any) {
      setError(err.message || 'Analysis failed. Please try again.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  // Full-screen loading overlay
  if (isAnalyzing) {
    return <AnalysisLoader />;
  }

  // Camera-first: no photos yet
  if (previews.length === 0) {
    return (
      <div className="min-h-[calc(100vh-3.5rem)] flex flex-col">
        {/* Hidden inputs */}
        <input ref={photoRef} type="file" accept="image/*" capture="environment" className="hidden" onChange={handleFileChange} />
        <input ref={videoRef} type="file" accept="video/*" capture="environment" className="hidden" onChange={handleFileChange} />
        <input ref={uploadRef} type="file" accept="image/*,video/*" multiple className="hidden" onChange={handleFileChange} />

        {/* Viewfinder area */}
        <div className="flex-1 flex flex-col items-center justify-center px-6 pb-24">
          {/* Viewfinder frame */}
          <div className="relative w-full max-w-sm aspect-[3/4] rounded-3xl border-2 border-dashed border-slate-300 dark:border-slate-600 bg-gradient-to-b from-slate-100 to-slate-50 dark:from-slate-800 dark:to-slate-850 flex flex-col items-center justify-center mb-8 overflow-hidden">
            {/* Corner brackets */}
            <div className="absolute top-4 left-4 w-8 h-8 border-t-3 border-l-3 border-brand-500 rounded-tl-lg" style={{borderWidth: '3px 0 0 3px'}} />
            <div className="absolute top-4 right-4 w-8 h-8 border-t-3 border-r-3 border-brand-500 rounded-tr-lg" style={{borderWidth: '3px 3px 0 0'}} />
            <div className="absolute bottom-4 left-4 w-8 h-8 border-b-3 border-l-3 border-brand-500 rounded-bl-lg" style={{borderWidth: '0 0 3px 3px'}} />
            <div className="absolute bottom-4 right-4 w-8 h-8 border-b-3 border-r-3 border-brand-500 rounded-br-lg" style={{borderWidth: '0 3px 3px 0'}} />

            {/* Crosshair center */}
            <div className="w-12 h-12 mb-4 opacity-20">
              <svg viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-slate-400">
                <circle cx="24" cy="24" r="10" />
                <line x1="24" y1="8" x2="24" y2="16" />
                <line x1="24" y1="32" x2="24" y2="40" />
                <line x1="8" y1="24" x2="16" y2="24" />
                <line x1="32" y1="24" x2="40" y2="24" />
              </svg>
            </div>

            <p className="text-slate-500 dark:text-slate-300 font-semibold text-lg mb-1">Point at what's broken</p>
            <p className="text-slate-400 dark:text-slate-500 text-sm">Take a photo to get started</p>
          </div>

          {/* Shutter button */}
          <button
            onClick={() => photoRef.current?.click()}
            className="w-20 h-20 rounded-full bg-white dark:bg-slate-800 border-4 border-brand-500 flex items-center justify-center shadow-lg shutter-ring active:scale-90 transition-transform mb-6"
            aria-label="Take photo"
          >
            <div className="w-14 h-14 rounded-full bg-brand-500" />
          </button>

          {/* Secondary actions */}
          <div className="flex items-center gap-6">
            <button
              onClick={() => videoRef.current?.click()}
              className="flex flex-col items-center gap-1 text-slate-400 hover:text-slate-600 transition-colors"
            >
              <div className="w-12 h-12 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.8}>
                  <path strokeLinecap="round" d="M15.75 10.5l4.72-4.72a.75.75 0 011.28.53v11.38a.75.75 0 01-1.28.53l-4.72-4.72M4.5 18.75h9a2.25 2.25 0 002.25-2.25v-9a2.25 2.25 0 00-2.25-2.25h-9A2.25 2.25 0 002.25 7.5v9a2.25 2.25 0 002.25 2.25z" />
                </svg>
              </div>
              <span className="text-xs font-medium">Video</span>
            </button>

            <button
              onClick={() => uploadRef.current?.click()}
              className="flex flex-col items-center gap-1 text-slate-400 hover:text-slate-600 transition-colors"
            >
              <div className="w-12 h-12 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.8}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909M3.75 21h16.5A2.25 2.25 0 0022.5 18.75V5.25A2.25 2.25 0 0020.25 3H3.75A2.25 2.25 0 001.5 5.25v13.5A2.25 2.25 0 003.75 21z" />
                </svg>
              </div>
              <span className="text-xs font-medium">Gallery</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Photos selected: show preview + analyze
  return (
    <div className="min-h-[calc(100vh-3.5rem)] flex flex-col px-4 pt-4 pb-24">
      {/* Hidden inputs */}
      <input ref={photoRef} type="file" accept="image/*" capture="environment" className="hidden" onChange={handleFileChange} />
      <input ref={uploadRef} type="file" accept="image/*,video/*" multiple className="hidden" onChange={handleFileChange} />

      {/* Preview grid */}
      <div className="grid grid-cols-2 gap-3 mb-4 animate-fade-in">
        {previews.map((url, i) => (
          <div key={i} className="relative rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-700 bg-slate-100 dark:bg-slate-800 aspect-square shadow-sm">
            <img src={url} alt={`Photo ${i + 1}`} className="w-full h-full object-cover" />
            <button
              onClick={() => removeFile(i)}
              className="absolute top-2 right-2 w-8 h-8 bg-black/50 hover:bg-black/70 text-white rounded-full flex items-center justify-center text-sm transition-colors backdrop-blur-sm"
              aria-label="Remove"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                <path strokeLinecap="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        ))}

        {/* Add more button */}
        <button
          onClick={() => uploadRef.current?.click()}
          className="rounded-2xl border-2 border-dashed border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-slate-800 aspect-square flex flex-col items-center justify-center text-slate-400 dark:text-slate-500 hover:text-slate-500 hover:border-slate-400 transition-colors"
        >
          <svg className="w-8 h-8 mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
            <path strokeLinecap="round" d="M12 4.5v15m7.5-7.5h-15" />
          </svg>
          <span className="text-xs font-medium">Add more</span>
        </button>
      </div>

      {/* Context input */}
      <div className="mb-4 animate-slide-up">
        <textarea
          value={context}
          onChange={e => setContext(e.target.value)}
          placeholder="What's the problem? (optional)"
          className="w-full px-4 py-3 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl text-sm text-slate-800 dark:text-slate-200 placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:border-brand-500 focus:ring-2 focus:ring-brand-200/50 outline-none resize-none shadow-sm"
          rows={2}
        />
      </div>

      {error && (
        <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-2xl text-sm text-red-700 animate-fade-in">
          {error}
        </div>
      )}

      {/* Action buttons */}
      <div className="flex gap-3 animate-slide-up">
        <button
          onClick={() => { clearFiles(); setContext(''); setError(null); }}
          className="flex-1 px-5 py-3.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 font-semibold rounded-2xl transition-all active:scale-[0.97] shadow-sm"
        >
          Clear
        </button>
        <button
          onClick={handleAnalyze}
          className="flex-[2] px-5 py-3.5 bg-brand-600 hover:bg-brand-700 text-white font-semibold rounded-2xl transition-all active:scale-[0.97] shadow-md shadow-brand-600/20"
        >
          Analyze Problem
        </button>
      </div>
    </div>
  );
}
