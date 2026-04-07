import { useState, useRef } from 'react';
import { resizeImage, createPreviewUrl } from '../../lib/media';
import { sendChatMessage } from '../../lib/api';

interface StepVerifierProps {
  stepTitle: string;
  stepDescription: string;
  stepNumber: number;
  totalSteps: number;
  projectTitle: string;
}

type VerifyStatus = 'idle' | 'preview' | 'verifying' | 'result';

interface VerifyResult {
  verdict: 'good' | 'warning' | 'issue';
  message: string;
}

export default function StepVerifier({ stepTitle, stepDescription, stepNumber, totalSteps, projectTitle }: StepVerifierProps) {
  const [status, setStatus] = useState<VerifyStatus>('idle');
  const [preview, setPreview] = useState<string | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const [result, setResult] = useState<VerifyResult | null>(null);
  const photoRef = useRef<HTMLInputElement>(null);
  const uploadRef = useRef<HTMLInputElement>(null);

  const handleFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;
    e.target.value = '';

    const resized = await resizeImage(files[0]);
    const url = createPreviewUrl(resized);
    setFile(resized);
    setPreview(url);
    setStatus('preview');
    setResult(null);
  };

  const handleVerify = async () => {
    if (!file) return;
    setStatus('verifying');

    try {
      const prompt = `I'm doing a home repair project: "${projectTitle}". I just completed step ${stepNumber} of ${totalSteps}: "${stepTitle}".

The step instructions were: "${stepDescription}"

I've attached a photo of my completed work. Please evaluate:
1. Does this look correctly done?
2. Are there any issues or mistakes you can see?
3. Any corrections or improvements needed before moving to the next step?

Be specific and practical. If it looks good, say so clearly. If there are issues, explain exactly what needs fixing.`;

      const messages = [{ role: 'user', content: prompt }];
      const response = await sendChatMessage(messages, [file]);

      const content = response.content.toLowerCase();
      let verdict: VerifyResult['verdict'] = 'good';
      if (content.includes('issue') || content.includes('incorrect') || content.includes('mistake') || content.includes('problem') || content.includes('redo') || content.includes('fix')) {
        verdict = 'issue';
      } else if (content.includes('could') || content.includes('consider') || content.includes('might want') || content.includes('suggestion') || content.includes('improve')) {
        verdict = 'warning';
      }

      setResult({ verdict, message: response.content });
      setStatus('result');
    } catch {
      setResult({ verdict: 'issue', message: 'Unable to verify right now. Please check your work visually and continue if it looks correct.' });
      setStatus('result');
    }
  };

  const handleReset = () => {
    if (preview) URL.revokeObjectURL(preview);
    setStatus('idle');
    setPreview(null);
    setFile(null);
    setResult(null);
  };

  const verdictStyles = {
    good: { bg: 'bg-emerald-50', border: 'border-emerald-200', text: 'text-emerald-800', icon: '✓', label: 'Looks Good' },
    warning: { bg: 'bg-amber-50', border: 'border-amber-200', text: 'text-amber-800', icon: '⚠', label: 'Minor Suggestions' },
    issue: { bg: 'bg-red-50', border: 'border-red-200', text: 'text-red-800', icon: '✕', label: 'Needs Attention' },
  };

  return (
    <div className="mt-4">
      {/* Hidden inputs */}
      <input ref={photoRef} type="file" accept="image/*" capture="environment" className="hidden" onChange={handleFile} />
      <input ref={uploadRef} type="file" accept="image/*" className="hidden" onChange={handleFile} />

      {/* Idle: show double-check button */}
      {status === 'idle' && (
        <div className="flex gap-2">
          <button
            onClick={() => photoRef.current?.click()}
            className="flex-1 flex items-center justify-center gap-2 py-3 bg-slate-100 hover:bg-slate-200 text-slate-600 font-medium rounded-2xl transition-all active:scale-[0.97] text-sm"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.8}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6.827 6.175A2.31 2.31 0 015.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9.574c0-1.067-.75-1.994-1.802-2.169a47.865 47.865 0 00-1.134-.175 2.31 2.31 0 01-1.64-1.055l-.822-1.316a2.192 2.192 0 00-1.736-1.039 48.774 48.774 0 00-5.232 0 2.192 2.192 0 00-1.736 1.039l-.821 1.316z" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 12.75a4.5 4.5 0 11-9 0 4.5 4.5 0 019 0z" />
            </svg>
            Double-Check My Work
          </button>
        </div>
      )}

      {/* Preview: show photo + verify button */}
      {status === 'preview' && preview && (
        <div className="space-y-3 animate-fade-in">
          <div className="relative rounded-2xl overflow-hidden border border-slate-200 aspect-video">
            <img src={preview} alt="Your work" className="w-full h-full object-cover" />
            <button
              onClick={handleReset}
              className="absolute top-2 right-2 w-8 h-8 bg-black/50 text-white rounded-full flex items-center justify-center backdrop-blur-sm"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                <path strokeLinecap="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          <button
            onClick={handleVerify}
            className="w-full py-3.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-2xl transition-all active:scale-[0.97] shadow-sm flex items-center justify-center gap-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Verify This Step
          </button>
        </div>
      )}

      {/* Verifying: loading state */}
      {status === 'verifying' && (
        <div className="flex flex-col items-center py-6 animate-fade-in">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-5 h-5 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
            <span className="text-sm font-medium text-slate-600">Checking your work...</span>
          </div>
          {preview && (
            <div className="w-32 h-20 rounded-xl overflow-hidden border border-slate-200 mt-2 opacity-60">
              <img src={preview} alt="Checking" className="w-full h-full object-cover" />
            </div>
          )}
        </div>
      )}

      {/* Result: show verdict */}
      {status === 'result' && result && (
        <div className="space-y-3 animate-slide-up">
          {preview && (
            <div className="w-full rounded-2xl overflow-hidden border border-slate-200 aspect-video">
              <img src={preview} alt="Your work" className="w-full h-full object-cover" />
            </div>
          )}

          {/* Verdict badge */}
          <div className={`flex items-center gap-2 px-4 py-2.5 rounded-xl ${verdictStyles[result.verdict].bg} ${verdictStyles[result.verdict].border} border`}>
            <span className={`text-lg font-bold ${verdictStyles[result.verdict].text}`}>
              {verdictStyles[result.verdict].icon}
            </span>
            <span className={`font-semibold text-sm ${verdictStyles[result.verdict].text}`}>
              {verdictStyles[result.verdict].label}
            </span>
          </div>

          {/* AI feedback */}
          <div className="bg-white border border-slate-200 rounded-2xl p-4">
            <p className="text-sm text-slate-700 leading-relaxed whitespace-pre-line">{result.message}</p>
          </div>

          {/* Actions */}
          <div className="flex gap-2">
            <button
              onClick={handleReset}
              className="flex-1 py-3 bg-slate-100 text-slate-600 font-medium rounded-2xl text-sm transition-all active:scale-[0.97]"
            >
              Retake Photo
            </button>
            <button
              onClick={() => photoRef.current?.click()}
              className="flex-1 py-3 bg-slate-100 text-slate-600 font-medium rounded-2xl text-sm transition-all active:scale-[0.97]"
            >
              Check Again
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
