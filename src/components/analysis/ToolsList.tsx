import type { Tool } from '../../types/analysis';
import Card from '../ui/Card';

export default function ToolsList({ tools }: { tools: Tool[] }) {
  if (tools.length === 0) return null;

  return (
    <Card>
      <h3 className="font-semibold text-gray-900 dark:text-slate-100 mb-3 flex items-center gap-2">
        <span>🧰</span> Tools Needed
      </h3>
      <div className="space-y-2">
        {tools.map((tool, i) => (
          <div key={i} className="flex items-center justify-between py-1.5 border-b border-gray-100 dark:border-slate-700 last:border-0">
            <div className="flex items-center gap-2">
              <span className="text-sm">🔧</span>
              <span className="text-sm text-gray-800 dark:text-slate-200">{tool.name}</span>
              {tool.required && (
                <span className="text-[10px] px-1.5 py-0.5 bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400 rounded font-medium">Required</span>
              )}
            </div>
            <a
              href={`https://www.homedepot.com/s/${encodeURIComponent(tool.searchQuery)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-brand-600 hover:text-brand-700 font-medium"
            >
              Buy →
            </a>
          </div>
        ))}
      </div>
    </Card>
  );
}
