import { useState, useEffect } from 'react';

export interface ToolItem {
  id: string;
  name: string;
  category: string;
  confidence?: 'green' | 'yellow' | 'red';
  addedVia: 'scan' | 'manual' | 'project';
  timestamp: number;
}

export function useInventory() {
  const [tools, setTools] = useState<ToolItem[]>(() => {
    try {
      const stored = localStorage.getItem('myTools');
      if (stored) return JSON.parse(stored);
    } catch (e) {
      console.error('Failed to parse tool inventory', e);
    }
    return [];
  });

  useEffect(() => {
    localStorage.setItem('myTools', JSON.stringify(tools));
  }, [tools]);

  const addTools = (newTools: Omit<ToolItem, 'id' | 'timestamp'>[]) => {
    const timestamp = Date.now();
    const toAdd = newTools.map(t => ({
      ...t,
      id: Math.random().toString(36).substr(2, 9),
      timestamp,
    }));
    setTools(prev => [...toAdd, ...prev]);
  };

  const removeTool = (id: string) => {
    setTools(prev => prev.filter(t => t.id !== id));
  };

  const clearInventory = () => {
    setTools([]);
  };

  return { tools, addTools, removeTool, clearInventory };
}
