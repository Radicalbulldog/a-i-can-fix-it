import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Camera, Package, AlertCircle, CheckCircle2, ChevronRight, X, Loader2 } from 'lucide-react';
import { useInventory, ToolItem } from '../hooks/useInventory';

export default function InventoryPage() {
  const { tools, addTools, removeTool } = useInventory();
  const [isScanning, setIsScanning] = useState(false);
  const [scannedTools, setScannedTools] = useState<any[]>([]);
  const [selectedIndices, setSelectedIndices] = useState<Set<number>>(new Set());
  const cameraRef = useRef<HTMLInputElement>(null);

  const handleScan = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsScanning(true);
    setScannedTools([]);

    const formData = new FormData();
    formData.append('media', file);

    try {
      const res = await fetch('/api/scan-tools', { method: 'POST', body: formData });
      if (!res.ok) throw new Error('Scan failed');
      const data = await res.json();
      
      const foundTools = data.tools || [];
      setScannedTools(foundTools);
      
      // Auto-select "green" confidence tools
      const initialSelected = new Set<number>();
      foundTools.forEach((t: any, i: number) => {
        if (t.confidence === 'green') initialSelected.add(i);
      });
      setSelectedIndices(initialSelected);
      
    } catch (err) {
      alert('Failed to scan tools. Please try again.');
    } finally {
      setIsScanning(false);
      if (cameraRef.current) cameraRef.current.value = '';
    }
  };

  const toggleSelection = (index: number) => {
    const newSet = new Set(selectedIndices);
    if (newSet.has(index)) newSet.delete(index);
    else newSet.add(index);
    setSelectedIndices(newSet);
  };

  const confirmScan = () => {
    const toolsToAdd: Omit<ToolItem, 'id' | 'timestamp'>[] = [];
    scannedTools.forEach((t, i) => {
      if (selectedIndices.has(i)) {
        toolsToAdd.push({
          name: t.name,
          category: t.category || 'misc',
          confidence: t.confidence,
          addedVia: 'scan'
        });
      }
    });

    if (toolsToAdd.length > 0) addTools(toolsToAdd);
    setScannedTools([]);
  };

  // Group existing tools by category
  const toolsByCategory = tools.reduce((acc, t) => {
    const cat = t.category.replace('_', ' ');
    if (!acc[cat]) acc[cat] = [];
    acc[cat].push(t);
    return acc;
  }, {} as Record<string, ToolItem[]>);

  return (
    <div className="flex flex-col min-h-[calc(100vh-4.5rem)] pb-24 max-w-lg mx-auto">
      <input 
        ref={cameraRef} 
        type="file" 
        accept="image/*" 
        capture="environment" 
        className="hidden" 
        onChange={handleScan} 
      />

      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">My Tools</h1>
          <p className="text-slate-500 dark:text-slate-400 font-medium">{tools.length} items cataloged</p>
        </div>
        {tools.length > 0 && (
          <button 
            onClick={() => cameraRef.current?.click()}
            className="w-12 h-12 rounded-full bg-brand-500 text-white flex items-center justify-center shadow-glass dark:shadow-glass-dark hover:scale-105 active:scale-95 transition-all"
          >
            <Camera className="w-5 h-5" />
          </button>
        )}
      </div>

      <AnimatePresence mode="popLayout">
        {tools.length === 0 && scannedTools.length === 0 && !isScanning && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, y: -20 }}
            className="flex-1 flex flex-col items-center justify-center -mt-10"
          >
            <div className="w-32 h-32 mb-8 relative flex items-center justify-center">
               <motion.div animate={{ rotate: 360 }} transition={{ duration: 20, repeat: Infinity, ease: 'linear' }} className="absolute inset-0 border-2 border-dashed border-brand-200 dark:border-brand-800 rounded-full" />
               <Package className="w-12 h-12 text-brand-500" />
            </div>
            
            <h2 className="text-2xl font-bold text-slate-800 dark:text-white mb-2">Build Your Armory</h2>
            <p className="text-slate-500 dark:text-slate-400 text-center mb-10 max-w-xs leading-relaxed">
              Scan your tool bench or shed. We'll deduct tools you already own from future shopping lists automatically.
            </p>

            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={() => cameraRef.current?.click()}
              className="px-8 py-4 bg-brand-600 hover:bg-brand-500 text-white font-bold text-lg rounded-2xl shadow-[0_0_40px_rgba(13,148,136,0.3)] shutter-ring flex items-center gap-3"
            >
              <Camera className="w-6 h-6" />
              Scan My Tools
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {(isScanning || scannedTools.length > 0) && (
          <motion.div 
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            className="glass dark:glass-dark rounded-3xl p-6 mb-8 border border-brand-100 dark:border-brand-900/30 shadow-glass-dark"
          >
            {isScanning ? (
              <div className="flex flex-col items-center justify-center py-8">
                <Loader2 className="w-10 h-10 text-brand-500 animate-spin mb-4" />
                <p className="font-bold text-slate-800 dark:text-white">Scanning image...</p>
                <p className="text-sm text-slate-500 mt-1">Identifying hardware & tools</p>
              </div>
            ) : (
              <div className="flex flex-col">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="font-bold text-lg text-slate-800 dark:text-white">Detected Items</h3>
                  <button onClick={() => setScannedTools([])} className="p-2 bg-slate-100 dark:bg-slate-800 text-slate-400 rounded-full hover:bg-slate-200">
                    <X className="w-4 h-4" />
                  </button>
                </div>
                
                <div className="space-y-3 mb-6">
                  {scannedTools.map((tool, i) => {
                    const isSelected = selectedIndices.has(i);
                    const isYellow = tool.confidence === 'yellow';
                    return (
                      <motion.div 
                        initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.05 }}
                        key={i} 
                        onClick={() => toggleSelection(i)}
                        className={`p-4 rounded-2xl border-2 flex items-center justify-between cursor-pointer transition-colors ${
                          isSelected 
                            ? 'border-brand-500 bg-brand-50/50 dark:bg-brand-900/20' 
                            : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800/50 hover:border-slate-300'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <div className={`w-6 h-6 rounded-full flex items-center justify-center ${isSelected ? 'bg-brand-500 text-white' : 'border-2 border-slate-300 dark:border-slate-600'}`}>
                            {isSelected && <CheckCircle2 className="w-4 h-4" />}
                          </div>
                          <div>
                            <p className={`font-semibold ${isSelected ? 'text-brand-900 dark:text-brand-100' : 'text-slate-700 dark:text-slate-300'}`}>{tool.name}</p>
                            <p className="text-xs text-slate-500 uppercase tracking-wider">{tool.category.replace('_', ' ')}</p>
                          </div>
                        </div>
                        {isYellow && !isSelected && (
                          <div className="flex items-center gap-1 text-amber-500 bg-amber-50 dark:bg-amber-900/20 px-2 py-1 rounded-md text-xs font-bold">
                            <AlertCircle className="w-3 h-3" /> Guess
                          </div>
                        )}
                      </motion.div>
                    );
                  })}
                </div>
                
                <button 
                  onClick={confirmScan}
                  disabled={selectedIndices.size === 0}
                  className="w-full py-4 bg-brand-600 disabled:bg-slate-300 dark:disabled:bg-slate-700 disabled:text-slate-500 text-white font-bold rounded-xl shadow-glass transition-colors"
                >
                  Add {selectedIndices.size} Items to Inventory
                </button>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      <div className="space-y-8">
        {Object.entries(toolsByCategory).map(([category, items]) => (
          <div key={category}>
             <h3 className="text-xs font-bold tracking-widest text-slate-400 uppercase mb-3 pl-2 flex items-center gap-2">
                {category} <span className="bg-slate-200 dark:bg-slate-800 text-slate-500 px-2 py-0.5 rounded-full text-[10px]">{items.length}</span>
             </h3>
             <div className="bg-white dark:bg-slate-850 border border-slate-200 dark:border-slate-800 rounded-3xl overflow-hidden shadow-sm">
                {items.map((tool, i) => (
                  <div key={tool.id} className={`p-4 flex items-center justify-between ${i !== items.length - 1 ? 'border-b border-slate-100 dark:border-slate-800' : ''}`}>
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-slate-50 dark:bg-slate-800 rounded-xl flex items-center justify-center border border-slate-100 dark:border-slate-700">
                         <Wrench className="w-5 h-5 text-brand-500" />
                      </div>
                      <p className="font-semibold text-slate-800 dark:text-slate-100">{tool.name}</p>
                    </div>
                    <button onClick={() => removeTool(tool.id)} className="text-slate-400 hover:text-red-500 p-2">
                       <X className="w-4 h-4" />
                    </button>
                  </div>
                ))}
             </div>
          </div>
        ))}
      </div>
    </div>
  );
}
