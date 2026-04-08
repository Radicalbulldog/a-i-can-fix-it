import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Camera, Image as ImageIcon, Video, Mic, MicOff, X, ChevronUp, ChevronDown, Wrench } from 'lucide-react';
import { useCamera } from '../hooks/useCamera';
import { useAppContext } from '../context/AppContext';
import { analyzeMedia } from '../lib/api';
import AnalysisLoader from '../components/ui/AnalysisLoader';

export default function HomePage() {
  const { files, previews, addFiles, removeFile } = useCamera();
  const { setAnalysis, setIsAnalyzing, isAnalyzing, setMedia } = useAppContext();
  const [context, setContext] = useState('');
  const [error, setError] = useState<string | null>(null);
  
  // Voice recording state
  const [isRecording, setIsRecording] = useState(false);
  const [recognition, setRecognition] = useState<any>(null);

  // Accordion state
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);

  const navigate = useNavigate();

  const photoRef = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLInputElement>(null);
  const uploadRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    // Initialize Speech Recognition if supported
    // @ts-ignore
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      const rec = new SpeechRecognition();
      rec.continuous = true;
      rec.interimResults = true;
      rec.onresult = (event: any) => {
        let finalTranscript = '';
        for (let i = event.resultIndex; i < event.results.length; ++i) {
          if (event.results[i].isFinal) {
            finalTranscript += event.results[i][0].transcript;
          }
        }
        if (finalTranscript) {
          setContext((prev) => (prev ? prev + ' ' + finalTranscript : finalTranscript));
        }
      };
      rec.onerror = (event: any) => {
        console.error('Speech recognition error', event.error);
        setIsRecording(false);
      };
      rec.onend = () => {
        setIsRecording(false);
      };
      setRecognition(rec);
    }
  }, []);

  const toggleRecording = () => {
    if (!recognition) {
       alert("Speech recognition is not supported in this browser.");
       return;
    }
    if (isRecording) {
      recognition.stop();
      setIsRecording(false);
    } else {
      recognition.start();
      setIsRecording(true);
    }
  };

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

  if (isAnalyzing) return <AnalysisLoader />;

  return (
    <div className="min-h-[calc(100vh-3.5rem)] flex flex-col px-4 pt-4 pb-24 overflow-x-hidden">
      <input ref={photoRef} type="file" accept="image/*" capture="environment" className="hidden" onChange={handleFileChange} />
      <input ref={videoRef} type="file" accept="video/*" capture="environment" className="hidden" onChange={handleFileChange} />
      <input ref={uploadRef} type="file" accept="image/*,video/*" multiple className="hidden" onChange={handleFileChange} />

      <AnimatePresence mode="wait">
        {previews.length === 0 ? (
          <motion.div 
            key="zero-state"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.05 }}
            transition={{ type: 'spring', bounce: 0, duration: 0.4 }}
            className="flex-1 flex flex-col items-center justify-center -mt-8"
          >
            <div className="relative w-full max-w-sm aspect-[3/4] rounded-3xl border border-slate-300 dark:border-slate-700 bg-gradient-to-b from-slate-100/50 to-slate-50/50 dark:from-slate-800/50 dark:to-slate-850/50 shadow-glass dark:shadow-glass-dark flex flex-col items-center justify-center mb-10 overflow-hidden">
              
              <motion.div animate={{ scale: [1, 1.05, 1] }} transition={{ repeat: Infinity, duration: 3, ease: 'easeInOut' }} className="absolute inset-4">
                <div className="absolute top-0 left-0 w-8 h-8 border-t-4 border-l-4 border-brand-500 rounded-tl-xl opacity-80" />
                <div className="absolute top-0 right-0 w-8 h-8 border-t-4 border-r-4 border-brand-500 rounded-tr-xl opacity-80" />
                <div className="absolute bottom-0 left-0 w-8 h-8 border-b-4 border-l-4 border-brand-500 rounded-bl-xl opacity-80" />
                <div className="absolute bottom-0 right-0 w-8 h-8 border-b-4 border-r-4 border-brand-500 rounded-br-xl opacity-80" />
              </motion.div>

              <Camera className="w-12 h-12 text-slate-300 dark:text-slate-600 mb-4" />
              <p className="text-slate-900 dark:text-white font-bold text-xl mb-2">Capture the issue</p>
              <p className="text-slate-500 dark:text-slate-400 text-sm font-medium text-center px-8">Center the exact spot that needs fixing to get started.</p>
            </div>

            <motion.button
              whileTap={{ scale: 0.9 }}
              whileHover={{ scale: 1.05 }}
              onClick={() => photoRef.current?.click()}
              className="w-24 h-24 rounded-full bg-slate-100 dark:bg-slate-800 border-4 border-brand-500 flex items-center justify-center shadow-[0_0_40px_rgba(13,148,136,0.3)] shutter-ring mb-8 relative z-10"
              aria-label="Take photo"
            >
              <div className="w-16 h-16 rounded-full bg-brand-500 shadow-inner" />
            </motion.button>

            <div className="flex items-center gap-10">
              <motion.button whileTap={{ scale: 0.9 }} onClick={() => uploadRef.current?.click()} className="flex flex-col items-center gap-2 text-slate-500 hover:text-slate-800 dark:hover:text-white transition-colors">
                <div className="w-12 h-12 rounded-2xl glass dark:glass-dark flex items-center justify-center shadow-glass dark:shadow-glass-dark">
                  <ImageIcon className="w-5 h-5 text-slate-600 dark:text-slate-300" />
                </div>
                <span className="text-xs font-semibold">Gallery</span>
              </motion.button>
              <motion.button whileTap={{ scale: 0.9 }} onClick={() => videoRef.current?.click()} className="flex flex-col items-center gap-2 text-slate-500 hover:text-slate-800 dark:hover:text-white transition-colors">
                <div className="w-12 h-12 rounded-2xl glass dark:glass-dark flex items-center justify-center shadow-glass dark:shadow-glass-dark">
                  <Video className="w-5 h-5 text-slate-600 dark:text-slate-300" />
                </div>
                <span className="text-xs font-semibold">Video</span>
              </motion.button>
            </div>
          </motion.div>
        ) : (
          <motion.div 
            key="ready-state"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col w-full max-w-md mx-auto"
          >
            <div className="grid grid-cols-2 gap-4 mb-6">
              <AnimatePresence>
                {previews.map((url, i) => (
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    key={url} 
                    className="relative rounded-3xl overflow-hidden glass dark:glass-dark aspect-square shadow-glass dark:shadow-glass-dark group"
                  >
                    <img src={url} alt={`Photo ${i + 1}`} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                    <button
                      onClick={() => removeFile(i)}
                      className="absolute top-3 right-3 w-8 h-8 glass dark:glass-dark hover:bg-black/80 text-slate-800 dark:text-white rounded-full flex items-center justify-center transition-colors !p-0 shadow-sm"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </motion.div>
                ))}
              </AnimatePresence>

              <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={() => uploadRef.current?.click()}
                className="rounded-3xl border-2 border-dashed border-slate-300 dark:border-slate-700 bg-slate-100/50 dark:bg-slate-800/50 aspect-square flex flex-col items-center justify-center text-slate-500 dark:text-slate-400 hover:text-brand-600 dark:hover:text-brand-400 hover:border-brand-500 hover:bg-brand-50 dark:hover:bg-brand-900/20 transition-all shadow-sm"
              >
                <Camera className="w-8 h-8 mb-2 opacity-80" />
                <span className="text-sm font-bold">Add media</span>
              </motion.button>
            </div>

            {error && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mb-6 p-4 rounded-2xl glass bg-red-50/80 dark:bg-red-900/20 border-red-200 dark:border-red-800/30 text-sm text-red-700 dark:text-red-400 font-medium">
                {error}
              </motion.div>
            )}

            <div className="mb-6 bg-white dark:bg-slate-850 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden transition-all">
              <button 
                onClick={() => setIsDetailsOpen(!isDetailsOpen)}
                className="w-full px-5 py-4 flex items-center justify-between text-slate-800 dark:text-slate-200 font-semibold text-sm hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors"
              >
                <span>Tell me any additional details...</span>
                {isDetailsOpen ? <ChevronUp className="w-5 h-5 text-slate-400" /> : <ChevronDown className="w-5 h-5 text-slate-400" />}
              </button>
              
              <AnimatePresence>
                {isDetailsOpen && (
                  <motion.div 
                    initial={{ height: 0, opacity: 0 }} 
                    animate={{ height: 'auto', opacity: 1 }} 
                    exit={{ height: 0, opacity: 0 }} 
                    className="border-t border-slate-100 dark:border-slate-800"
                  >
                    <div className="p-4 relative">
                      <textarea
                        value={context}
                        onChange={e => setContext(e.target.value)}
                        placeholder="It leaks behind the wall when I turn on the hot water..."
                        className="w-full px-4 py-3 pb-12 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700/50 rounded-2xl text-sm text-slate-800 dark:text-slate-200 placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:border-brand-500 focus:ring-1 focus:ring-brand-500 outline-none resize-none shadow-inset-soft dark:shadow-inset-dark"
                        rows={3}
                      />
                      <motion.button
                        whileTap={{ scale: 0.9 }}
                        onClick={toggleRecording}
                        className={`absolute bottom-6 right-6 w-10 h-10 rounded-full flex items-center justify-center transition-colors ${isRecording ? 'bg-red-500 text-white animate-pulse shadow-[0_0_15px_rgba(239,68,68,0.5)]' : 'bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-300 dark:hover:bg-slate-700'}`}
                        aria-label="Use Voice Dictation"
                      >
                        {isRecording ? <Mic className="w-5 h-5" /> : <MicOff className="w-5 h-5" />}
                      </motion.button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <motion.button
              whileTap={{ scale: 0.97 }}
              onClick={handleAnalyze}
              className="w-full py-4 bg-brand-600 hover:bg-brand-500 text-white font-bold text-lg rounded-2xl shadow-glass dark:shadow-glass-dark flex items-center justify-center gap-2 mb-4 transition-colors"
            >
              <Wrench className="w-5 h-5" />
              Fix It
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
