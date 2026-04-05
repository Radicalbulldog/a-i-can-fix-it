import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import PageShell from '../components/layout/PageShell';
import MediaCapture from '../components/media/MediaCapture';
import MediaPreview from '../components/media/MediaPreview';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Spinner from '../components/ui/Spinner';
import { useCamera } from '../hooks/useCamera';
import { useAppContext } from '../context/AppContext';
import { analyzeMedia } from '../lib/api';

export default function HomePage() {
  const { files, previews, addFiles, removeFile, clearFiles } = useCamera();
  const { setAnalysis, setIsAnalyzing, isAnalyzing, setMedia } = useAppContext();
  const [context, setContext] = useState('');
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

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

  return (
    <PageShell>
      <div className="space-y-6">
        {/* Hero */}
        <div className="text-center py-6 sm:py-10">
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-2">
            <span className="text-brand-500">a.</span> I can fix it
          </h1>
          <p className="text-gray-500 text-sm sm:text-base max-w-md mx-auto">
            Snap a photo of any home problem. Get instant step-by-step repair instructions, tools list, and local contractor recommendations.
          </p>
        </div>

        {/* Capture */}
        <Card>
          <h2 className="font-semibold text-gray-900 mb-3">What needs fixing?</h2>
          <MediaCapture onFilesSelected={addFiles} disabled={isAnalyzing} />
        </Card>

        {/* Preview */}
        {previews.length > 0 && (
          <div className="space-y-4">
            <MediaPreview
              previews={previews}
              fileNames={files.map(f => f.name)}
              onRemove={removeFile}
            />

            <Card>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Add context <span className="text-gray-400">(optional)</span>
              </label>
              <textarea
                value={context}
                onChange={e => setContext(e.target.value)}
                placeholder="e.g. 'This leak started yesterday' or 'The outlet sparks when I plug in...'"
                className="w-full px-3 py-2 border border-gray-300 rounded-xl text-sm focus:border-brand-500 focus:ring-2 focus:ring-brand-200 outline-none resize-none"
                rows={2}
              />
            </Card>

            {error && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-sm text-red-700">
                {error}
              </div>
            )}

            <div className="flex gap-3">
              <Button
                variant="secondary"
                className="flex-1"
                onClick={() => { clearFiles(); setContext(''); setError(null); }}
                disabled={isAnalyzing}
              >
                Clear
              </Button>
              <Button
                className="flex-1"
                onClick={handleAnalyze}
                disabled={isAnalyzing}
              >
                {isAnalyzing ? (
                  <span className="flex items-center gap-2"><Spinner size="sm" /> Analyzing...</span>
                ) : (
                  'Analyze Problem'
                )}
              </Button>
            </div>
          </div>
        )}

        {/* How it works */}
        {previews.length === 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4">
            {[
              { icon: '📸', title: 'Capture', desc: 'Take a photo or video of the problem' },
              { icon: '🤖', title: 'Diagnose', desc: 'AI identifies the issue and creates a repair plan' },
              { icon: '🔧', title: 'Fix It', desc: 'Follow step-by-step instructions or hire a pro' },
            ].map((step, i) => (
              <Card key={i} className="text-center">
                <div className="text-3xl mb-2">{step.icon}</div>
                <h3 className="font-semibold text-gray-900 text-sm">{step.title}</h3>
                <p className="text-xs text-gray-500 mt-1">{step.desc}</p>
              </Card>
            ))}
          </div>
        )}
      </div>
    </PageShell>
  );
}
