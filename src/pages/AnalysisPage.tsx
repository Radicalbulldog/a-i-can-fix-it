import { useState, useCallback, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';
import { sendChatMessage } from '../lib/api';
import type { ChatMessage } from '../types/chat';
import type { RepairStep } from '../types/analysis';
import DifficultyBadge from '../components/analysis/DifficultyBadge';
import Badge from '../components/ui/Badge';
import StepIllustration from '../components/analysis/StepIllustration';
import ProjectCart from '../components/analysis/ProjectCart';
import ContractorPreview from '../components/contractors/ContractorPreview';
import ChatWindow from '../components/chat/ChatWindow';
import Card from '../components/ui/Card';
import StepVerifier from '../components/analysis/StepVerifier';
import { STEP_ICONS } from '../lib/constants';

type Tab = 'guide' | 'cart' | 'pros' | 'chat';

function Confetti() {
  const colors = ['#0d9488', '#2dd4bf', '#f59e0b', '#3b82f6', '#ef4444', '#8b5cf6'];
  return (
    <div className="fixed inset-0 z-[200] pointer-events-none overflow-hidden">
      {Array.from({ length: 40 }).map((_, i) => (
        <div
          key={i}
          className="absolute w-2 h-2 rounded-sm"
          style={{
            backgroundColor: colors[i % colors.length],
            left: `${Math.random() * 100}%`,
            top: '-10px',
            animation: `confettiFall ${1.5 + Math.random()}s ease-out ${Math.random() * 0.5}s forwards`,
          }}
        />
      ))}
      <style>{`
        @keyframes confettiFall {
          0% { transform: translateY(0) rotate(0deg); opacity: 1; }
          100% { transform: translateY(100vh) rotate(${360 + Math.random() * 360}deg); opacity: 0; }
        }
      `}</style>
    </div>
  );
}

export default function AnalysisPage() {
  const { analysisResult, chatMessages, addChatMessage } = useAppContext();
  const [isChatLoading, setIsChatLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<Tab>('guide');
  const [completedSteps, setCompletedSteps] = useState<Set<number>>(new Set());
  const [focusMode, setFocusMode] = useState(false);
  const [focusStep, setFocusStep] = useState(0);
  const [showConfetti, setShowConfetti] = useState(false);
  const [chatOpen, setChatOpen] = useState(false);
  const focusRef = useRef<HTMLDivElement>(null);

  // Keep screen awake in focus mode
  useEffect(() => {
    if (!focusMode) return;
    let wakeLock: any = null;
    (navigator as any).wakeLock?.request?.('screen').then((wl: any) => { wakeLock = wl; }).catch(() => {});
    return () => { wakeLock?.release?.(); };
  }, [focusMode]);

  const handleSendMessage = useCallback(async (text: string, images?: File[]) => {
    const userMsg: ChatMessage = { id: `user_${Date.now()}`, role: 'user', content: text, timestamp: Date.now() };
    addChatMessage(userMsg);
    setIsChatLoading(true);
    try {
      const allMsgs = [...chatMessages, userMsg].map(m => ({ role: m.role, content: m.content }));
      const response = await sendChatMessage(allMsgs, images);
      addChatMessage({ id: `ai_${Date.now()}`, role: 'assistant', content: response.content, timestamp: Date.now() });
    } catch {
      addChatMessage({ id: `err_${Date.now()}`, role: 'assistant', content: 'Sorry, I had trouble responding. Please try again.', timestamp: Date.now() });
    } finally {
      setIsChatLoading(false);
    }
  }, [chatMessages, addChatMessage]);

  const toggleStep = (stepNum: number) => {
    setCompletedSteps(prev => {
      const next = new Set(prev);
      if (next.has(stepNum)) next.delete(stepNum);
      else next.add(stepNum);
      // Check if all complete
      if (analysisResult && next.size === analysisResult.steps.length) {
        setShowConfetti(true);
        setTimeout(() => setShowConfetti(false), 3000);
      }
      return next;
    });
  };

  if (!analysisResult) {
    return (
      <div className="min-h-[calc(100vh-3.5rem)] flex flex-col items-center justify-center px-6 pb-24">
        <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mb-4">
          <svg className="w-8 h-8 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M6.827 6.175A2.31 2.31 0 015.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9.574c0-1.067-.75-1.994-1.802-2.169a47.865 47.865 0 00-1.134-.175 2.31 2.31 0 01-1.64-1.055l-.822-1.316a2.192 2.192 0 00-1.736-1.039 48.774 48.774 0 00-5.232 0 2.192 2.192 0 00-1.736 1.039l-.821 1.316z" />
            <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 12.75a4.5 4.5 0 11-9 0 4.5 4.5 0 019 0z" />
          </svg>
        </div>
        <h2 className="text-xl font-bold text-slate-800 mb-2">No Analysis Yet</h2>
        <p className="text-slate-500 text-sm mb-6">Take a photo to get your repair plan.</p>
        <Link to="/" className="px-6 py-3 bg-brand-600 text-white font-semibold rounded-2xl shadow-sm">
          Go to Camera
        </Link>
      </div>
    );
  }

  const allComplete = completedSteps.size === analysisResult.steps.length;
  const tabs: { key: Tab; label: string }[] = [
    { key: 'guide', label: 'Guide' },
    { key: 'cart', label: 'Cart' },
    { key: 'pros', label: 'Pros' },
    { key: 'chat', label: 'Ask AI' },
  ];

  // Focus mode: one step at a time
  if (focusMode) {
    const step = analysisResult.steps[focusStep];
    const isComplete = completedSteps.has(step.number);
    const isLast = focusStep === analysisResult.steps.length - 1;
    const isFirst = focusStep === 0;

    return (
      <div ref={focusRef} className="fixed inset-0 z-[60] bg-white flex flex-col">
        {showConfetti && <Confetti />}

        {/* Focus header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-slate-100">
          <button onClick={() => setFocusMode(false)} className="text-slate-500 font-medium text-sm flex items-center gap-1">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
              <path strokeLinecap="round" d="M15 19l-7-7 7-7" />
            </svg>
            Overview
          </button>
          <span className="text-sm text-slate-400 font-medium">
            Step {focusStep + 1} of {analysisResult.steps.length}
          </span>
          <div className="flex gap-1">
            {analysisResult.steps.map((s, i) => (
              <div key={i} className={`w-2 h-2 rounded-full transition-colors ${
                completedSteps.has(s.number) ? 'bg-brand-500' :
                i === focusStep ? 'bg-brand-300' : 'bg-slate-200'
              }`} />
            ))}
          </div>
        </div>

        {/* Step content */}
        <div className="flex-1 overflow-y-auto px-5 py-6">
          {/* All complete celebration */}
          {allComplete && (
            <div className="text-center py-8 animate-scale-in">
              <div className="text-5xl mb-4">🎉</div>
              <h2 className="text-2xl font-bold text-slate-800 mb-2">Project Complete!</h2>
              <p className="text-slate-500 mb-4">You saved an estimated {analysisResult.estimatedCost} in labor costs.</p>
              <button onClick={() => setFocusMode(false)} className="px-6 py-3 bg-brand-600 text-white rounded-2xl font-semibold">
                View Summary
              </button>
            </div>
          )}

          {!allComplete && (
            <>
              <div className="flex items-center gap-3 mb-4">
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-xl font-bold shadow-sm ${
                  isComplete ? 'bg-brand-100 text-brand-700' : 'bg-brand-600 text-white'
                }`}>
                  {isComplete ? '✓' : step.number}
                </div>
                <div>
                  <h3 className="text-xl font-bold text-slate-800">{step.title}</h3>
                  <span className="text-sm text-slate-400">{STEP_ICONS[step.icon] || '🔧'} {step.icon}</span>
                </div>
              </div>

              <StepIllustration stepTitle={step.title} stepDescription={step.description} icon={step.icon} />

              <p className="text-base text-slate-600 leading-relaxed mt-4 mb-4">{step.description}</p>

              {step.tip && (
                <div className="p-4 bg-brand-50 border border-brand-200 rounded-2xl text-sm text-brand-800 mb-6">
                  <strong>Pro tip:</strong> {step.tip}
                </div>
              )}

              {/* Double-check my work */}
              <StepVerifier
                stepTitle={step.title}
                stepDescription={step.description}
                stepNumber={step.number}
                totalSteps={analysisResult.steps.length}
                projectTitle={analysisResult.problemTitle}
              />

              {/* Complete step button */}
              <button
                onClick={() => toggleStep(step.number)}
                className={`w-full py-4 rounded-2xl font-semibold text-base transition-all active:scale-[0.97] mt-4 ${
                  isComplete
                    ? 'bg-brand-50 text-brand-700 border-2 border-brand-200'
                    : 'bg-brand-600 text-white shadow-md shadow-brand-600/20'
                }`}
              >
                {isComplete ? '✓ Completed — tap to undo' : 'Mark as Complete'}
              </button>
            </>
          )}
        </div>

        {/* Navigation */}
        {!allComplete && (
          <div className="flex gap-3 px-5 py-4 border-t border-slate-100 pb-safe">
            <button
              onClick={() => setFocusStep(Math.max(0, focusStep - 1))}
              disabled={isFirst}
              className="flex-1 py-3.5 bg-slate-100 text-slate-700 font-semibold rounded-2xl disabled:opacity-30 transition-all active:scale-[0.97]"
            >
              Previous
            </button>
            <button
              onClick={() => {
                if (!isComplete) toggleStep(step.number);
                if (isLast) { setFocusMode(false); }
                else setFocusStep(focusStep + 1);
              }}
              className="flex-[2] py-3.5 bg-brand-600 text-white font-semibold rounded-2xl shadow-sm transition-all active:scale-[0.97]"
            >
              {isLast ? 'Finish' : 'Next Step'}
            </button>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-3.5rem)] flex flex-col pb-24 md:pb-6">
      {showConfetti && <Confetti />}

      {/* Summary header */}
      <div className="px-4 pt-4 pb-2 animate-fade-in">
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm p-5">
          <h2 className="text-2xl font-bold text-slate-800 mb-2">{analysisResult.problemTitle}</h2>
          <p className="text-sm text-slate-500 mb-3 leading-relaxed">{analysisResult.problemDescription}</p>

          <div className="flex flex-wrap gap-2 mb-4">
            <DifficultyBadge level={analysisResult.difficulty} />
            <Badge color="text-slate-600" bg="bg-slate-100">{analysisResult.estimatedTime}</Badge>
            <Badge color="text-emerald-700" bg="bg-emerald-50">{analysisResult.estimatedCost}</Badge>
          </div>

          {analysisResult.safetyWarnings.length > 0 && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-xl mb-4">
              <div className="text-sm font-semibold text-red-800 mb-1">Safety Warnings</div>
              <ul className="text-xs text-red-700 space-y-0.5">
                {analysisResult.safetyWarnings.map((w, i) => <li key={i}>• {w}</li>)}
              </ul>
            </div>
          )}

          {/* Progress + Start button */}
          <div className="flex items-center gap-3">
            <div className="flex-1">
              <div className="flex justify-between text-xs text-slate-400 mb-1">
                <span>{completedSteps.size} of {analysisResult.steps.length} steps</span>
                <span>{Math.round((completedSteps.size / analysisResult.steps.length) * 100)}%</span>
              </div>
              <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-brand-500 rounded-full transition-all duration-500"
                  style={{ width: `${(completedSteps.size / analysisResult.steps.length) * 100}%` }}
                />
              </div>
            </div>
            <button
              onClick={() => { setFocusMode(true); setFocusStep(0); }}
              className="px-5 py-2.5 bg-brand-600 text-white font-semibold rounded-xl text-sm shadow-sm transition-all active:scale-[0.97] whitespace-nowrap"
            >
              {completedSteps.size > 0 ? 'Continue' : 'Start Repair'}
            </button>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="sticky top-14 z-40 bg-slate-50 px-4 pt-2 pb-0">
        <div className="flex bg-white rounded-xl border border-slate-200/80 p-1 shadow-sm">
          {tabs.map(tab => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`flex-1 py-2.5 text-sm font-semibold rounded-lg transition-all ${
                activeTab === tab.key
                  ? 'bg-brand-600 text-white shadow-sm'
                  : 'text-slate-500 hover:text-slate-700'
              }`}
            >
              {tab.label}
              {tab.key === 'cart' && (
                <span className={`ml-1 text-xs ${activeTab === 'cart' ? 'text-brand-200' : 'text-slate-400'}`}>
                  {analysisResult.tools.length + analysisResult.materials.length}
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Tab content */}
      <div className="flex-1 px-4 pt-4 animate-fade-in" key={activeTab}>
        {activeTab === 'guide' && (
          <GuideTab
            steps={analysisResult.steps}
            completedSteps={completedSteps}
            onToggleStep={toggleStep}
            onStartFocus={(i) => { setFocusStep(i); setFocusMode(true); }}
          />
        )}

        {activeTab === 'cart' && (
          <ProjectCart
            tools={analysisResult.tools}
            materials={analysisResult.materials}
            projectTitle={analysisResult.problemTitle}
          />
        )}

        {activeTab === 'pros' && (
          <div className="space-y-4">
            <ContractorPreview category={analysisResult.category} />
            <Link to="/contractors" className="block">
              <button className="w-full py-3 bg-white border border-slate-200 text-slate-600 font-semibold rounded-2xl transition-all active:scale-[0.97]">
                See All Contractors
              </button>
            </Link>
          </div>
        )}

        {activeTab === 'chat' && (
          <Card className="min-h-[400px]">
            <ChatWindow
              messages={chatMessages}
              onSend={handleSendMessage}
              isLoading={isChatLoading}
              followUpQuestion={analysisResult.followUpQuestion}
            />
          </Card>
        )}
      </div>
    </div>
  );
}

// Step list for Guide tab
function GuideTab({ steps, completedSteps, onToggleStep, onStartFocus }: {
  steps: RepairStep[];
  completedSteps: Set<number>;
  onToggleStep: (n: number) => void;
  onStartFocus: (i: number) => void;
}) {
  return (
    <div className="space-y-3">
      {steps.map((step, i) => {
        const isComplete = completedSteps.has(step.number);
        return (
          <div
            key={step.number}
            className={`bg-white rounded-2xl border shadow-sm overflow-hidden transition-all ${
              isComplete ? 'border-brand-200 bg-brand-50/30' : 'border-slate-200/80'
            }`}
          >
            <div className="flex items-center gap-3 p-4">
              {/* Checkbox */}
              <button
                onClick={() => onToggleStep(step.number)}
                className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 transition-all ${
                  isComplete
                    ? 'bg-brand-500 text-white scale-100'
                    : 'bg-slate-100 text-slate-500 hover:bg-slate-200'
                }`}
              >
                {isComplete ? (
                  <svg className="w-5 h-5 animate-check" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={3}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                  </svg>
                ) : (
                  <span className="font-bold text-sm">{step.number}</span>
                )}
              </button>

              {/* Content */}
              <button
                onClick={() => onStartFocus(i)}
                className="flex-1 text-left"
              >
                <div className="flex items-center gap-2">
                  <span className="text-base">{STEP_ICONS[step.icon] || '🔧'}</span>
                  <h4 className={`font-semibold text-sm ${isComplete ? 'text-slate-400 line-through' : 'text-slate-800'}`}>
                    {step.title}
                  </h4>
                </div>
                <p className={`text-xs mt-0.5 line-clamp-1 ${isComplete ? 'text-slate-300' : 'text-slate-500'}`}>
                  {step.description}
                </p>
              </button>

              {/* Expand arrow */}
              <svg className="w-5 h-5 text-slate-300 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                <path strokeLinecap="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
              </svg>
            </div>
          </div>
        );
      })}

      {/* Video link */}
      <Link to="/videos" className="block mt-4">
        <div className="bg-white rounded-2xl border border-slate-200/80 p-4 flex items-center gap-3 shadow-sm transition-all active:scale-[0.98]">
          <div className="w-10 h-10 bg-red-50 rounded-xl flex items-center justify-center">
            <svg className="w-5 h-5 text-red-500" fill="currentColor" viewBox="0 0 24 24">
              <path d="M5.25 5.653c0-.856.917-1.398 1.667-.986l11.54 6.348a1.125 1.125 0 010 1.971l-11.54 6.347a1.125 1.125 0 01-1.667-.985V5.653z" />
            </svg>
          </div>
          <div className="flex-1">
            <h4 className="font-semibold text-sm text-slate-800">Watch Repair Videos</h4>
            <p className="text-xs text-slate-400">See how others fixed this</p>
          </div>
          <svg className="w-5 h-5 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
            <path strokeLinecap="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
          </svg>
        </div>
      </Link>
    </div>
  );
}
