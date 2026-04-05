import type { RepairAnalysis } from '../../types/analysis';
import Card from '../ui/Card';
import DifficultyBadge from './DifficultyBadge';
import Badge from '../ui/Badge';
import { STEP_ICONS } from '../../lib/constants';

export default function RepairInfographic({ analysis }: { analysis: RepairAnalysis }) {
  return (
    <div className="space-y-4">
      {/* Header */}
      <Card>
        <div className="space-y-3">
          <h2 className="text-xl font-bold text-gray-900">{analysis.problemTitle}</h2>
          <p className="text-sm text-gray-600">{analysis.problemDescription}</p>

          <div className="flex flex-wrap gap-2">
            <DifficultyBadge level={analysis.difficulty} />
            <Badge color="text-blue-700" bg="bg-blue-50">⏱️ {analysis.estimatedTime}</Badge>
            <Badge color="text-green-700" bg="bg-green-50">💰 {analysis.estimatedCost}</Badge>
            <Badge color="text-purple-700" bg="bg-purple-50">{analysis.category}</Badge>
          </div>

          {analysis.safetyWarnings.length > 0 && (
            <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded-xl">
              <div className="text-sm font-semibold text-red-800 mb-1">⚠️ Safety Warnings</div>
              <ul className="text-xs text-red-700 space-y-1">
                {analysis.safetyWarnings.map((w, i) => (
                  <li key={i}>• {w}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </Card>

      {/* Steps */}
      <Card>
        <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <span>📝</span> Step-by-Step Guide
        </h3>
        <div className="space-y-1">
          {analysis.steps.map((step, i) => (
            <div key={i} className="relative flex gap-4 pb-6 last:pb-0">
              {/* Timeline line */}
              {i < analysis.steps.length - 1 && (
                <div className="absolute left-5 top-10 bottom-0 w-0.5 bg-brand-200" />
              )}

              {/* Step number circle */}
              <div className="flex-shrink-0 w-10 h-10 rounded-full bg-brand-500 text-white flex items-center justify-center font-bold text-sm shadow-sm">
                {step.number}
              </div>

              {/* Step content */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-lg">{STEP_ICONS[step.icon] || '🔧'}</span>
                  <h4 className="font-semibold text-gray-900 text-sm">{step.title}</h4>
                </div>
                <p className="text-sm text-gray-600 leading-relaxed">{step.description}</p>
                {step.tip && (
                  <div className="mt-2 p-2 bg-blue-50 rounded-lg text-xs text-blue-700">
                    💡 <strong>Pro tip:</strong> {step.tip}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
