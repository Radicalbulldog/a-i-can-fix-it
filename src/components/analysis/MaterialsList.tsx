import type { Material } from '../../types/analysis';
import Card from '../ui/Card';

export default function MaterialsList({ materials }: { materials: Material[] }) {
  if (materials.length === 0) return null;

  return (
    <Card>
      <h3 className="font-semibold text-gray-900 dark:text-slate-100 mb-3 flex items-center gap-2">
        <span>🏗️</span> Materials Needed
      </h3>
      <div className="space-y-2">
        {materials.map((mat, i) => (
          <div key={i} className="flex items-center justify-between py-2 border-b border-gray-100 dark:border-slate-700 last:border-0">
            <div>
              <div className="text-sm font-medium text-gray-800 dark:text-slate-200">{mat.name}</div>
              <div className="text-xs text-gray-500 dark:text-slate-400">Qty: {mat.quantity} &middot; Est. {mat.estimatedCost}</div>
            </div>
            <a
              href={`https://www.homedepot.com/s/${encodeURIComponent(mat.searchQuery)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-brand-600 hover:text-brand-700 font-medium whitespace-nowrap ml-3"
            >
              Buy →
            </a>
          </div>
        ))}
      </div>
    </Card>
  );
}
