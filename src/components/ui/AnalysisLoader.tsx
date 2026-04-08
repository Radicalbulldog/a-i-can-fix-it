import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Brain, FileText, Wrench } from 'lucide-react';

const STAGES = [
  { label: 'Examining photo...', icon: Search, duration: 2500 },
  { label: 'Identifying the problem...', icon: Brain, duration: 3000 },
  { label: 'Building your repair plan...', icon: FileText, duration: 3500 },
  { label: 'Finding tools & materials...', icon: Wrench, duration: 2000 },
];

export default function AnalysisLoader() {
  const [stageIndex, setStageIndex] = useState(0);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const totalDuration = STAGES.reduce((s, st) => s + st.duration, 0);
    let elapsed = 0;

    const interval = setInterval(() => {
      elapsed += 50;
      setProgress(Math.min((elapsed / totalDuration) * 100, 95));

      let accumulated = 0;
      for (let i = 0; i < STAGES.length; i++) {
        accumulated += STAGES[i].duration;
        if (elapsed < accumulated) {
          setStageIndex(i);
          break;
        }
      }
    }, 50);

    return () => clearInterval(interval);
  }, []);

  const stage = STAGES[stageIndex];
  const Icon = stage.icon;

  return (
    <motion.div 
      initial={{ opacity: 0 }} 
      animate={{ opacity: 1 }} 
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[100] glass-dark flex flex-col items-center justify-center px-8 backdrop-blur-2xl bg-slate-900/80"
    >
      <div className="relative w-24 h-24 mb-10 flex items-center justify-center">
        {/* Glow rings */}
        <motion.div 
          animate={{ scale: [1, 1.5, 1], opacity: [0.3, 0.1, 0.3] }} 
          transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }} 
          className="absolute inset-0 bg-brand-500 rounded-full blur-xl"
        />
        <motion.div 
          animate={{ scale: [1, 1.2, 1], opacity: [0.5, 0.2, 0.5] }} 
          transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut', delay: 0.2 }} 
          className="absolute inset-2 bg-brand-400 rounded-full blur-md"
        />
        
        <div className="relative w-16 h-16 bg-slate-800 border-2 border-brand-400 rounded-2xl flex items-center justify-center shadow-glass-dark overflow-hidden z-10">
          <AnimatePresence mode="wait">
            <motion.div
              key={stageIndex}
              initial={{ scale: 0.5, opacity: 0, rotate: -90 }}
              animate={{ scale: 1, opacity: 1, rotate: 0 }}
              exit={{ scale: 1.5, opacity: 0, rotate: 90 }}
              transition={{ type: 'spring', duration: 0.5 }}
            >
              <Icon className="w-8 h-8 text-white" />
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      <AnimatePresence mode="wait">
        <motion.p 
          key={stageIndex}
          initial={{ y: 10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -10, opacity: 0 }}
          className="text-white text-xl font-bold mb-8 text-center drop-shadow-md"
        >
          {stage.label}
        </motion.p>
      </AnimatePresence>

      <div className="w-full max-w-xs h-2 bg-slate-800/80 rounded-full overflow-hidden shadow-inset-dark p-0.5">
        <motion.div
          className="h-full bg-gradient-to-r from-brand-400 to-brand-600 rounded-full shadow-[0_0_10px_rgba(45,212,191,0.5)]"
          animate={{ width: `${progress}%` }}
          transition={{ ease: "linear", duration: 0.1 }}
        />
      </div>
    </motion.div>
  );
}
