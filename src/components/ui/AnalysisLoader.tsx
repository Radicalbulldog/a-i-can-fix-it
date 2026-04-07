import { useState, useEffect } from 'react';

const STAGES = [
  { label: 'Examining photo...', icon: '🔍', duration: 2500 },
  { label: 'Identifying the problem...', icon: '🧠', duration: 3000 },
  { label: 'Building your repair plan...', icon: '📋', duration: 3500 },
  { label: 'Finding tools & materials...', icon: '🔧', duration: 2000 },
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

      // Advance stage
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

  return (
    <div className="fixed inset-0 z-[100] bg-slate-900/95 flex flex-col items-center justify-center px-8">
      {/* Pulsing icon */}
      <div className="text-5xl mb-8 animate-pulse-soft">{stage.icon}</div>

      {/* Stage label */}
      <p className="text-white text-lg font-semibold mb-2 animate-fade-in" key={stageIndex}>
        {stage.label}
      </p>

      {/* Progress bar */}
      <div className="w-full max-w-xs h-1.5 bg-slate-700 rounded-full overflow-hidden mb-4">
        <div
          className="h-full bg-gradient-to-r from-brand-400 to-brand-600 rounded-full transition-all duration-200 ease-out"
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* Stage dots */}
      <div className="flex gap-2">
        {STAGES.map((_, i) => (
          <div
            key={i}
            className={`w-2 h-2 rounded-full transition-all duration-300 ${
              i < stageIndex ? 'bg-brand-400' :
              i === stageIndex ? 'bg-brand-500 scale-125' :
              'bg-slate-600'
            }`}
          />
        ))}
      </div>
    </div>
  );
}
