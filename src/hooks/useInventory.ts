import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from './useAuth';

export interface ToolItem {
  id: string;
  name: string;
  category: string;
  confidence?: 'green' | 'yellow' | 'red';
  addedVia: 'scan' | 'manual' | 'project';
  timestamp: number;
}

export function useInventory() {
  const { user } = useAuth();
  const [tools, setTools] = useState<ToolItem[]>([]);
  const [loading, setLoading] = useState(true);

  // Load tools (Supabase or Local)
  useEffect(() => {
    async function loadData() {
      if (!user) {
        // Guest mode
        try {
          const stored = localStorage.getItem('myTools');
          if (stored) setTools(JSON.parse(stored));
        } catch (e) {
          console.error(e);
        }
        setLoading(false);
        return;
      }

      // Authenticated mode: first sync any leftover local tools
      try {
        const stored = localStorage.getItem('myTools');
        if (stored) {
          const localTools: ToolItem[] = JSON.parse(stored);
          if (localTools.length > 0) {
            const inserts = localTools.map(t => ({
              user_id: user.id,
              name: t.name,
              category: t.category,
              confidence: t.confidence,
              added_via: t.addedVia
            }));
            await supabase.from('tools').insert(inserts);
            localStorage.removeItem('myTools');
          }
        }
      } catch(e) {}

      // Fetch cloud tools
      const { data, error } = await supabase
        .from('tools')
        .select('*')
        .order('created_at', { ascending: false });

      if (!error && data) {
        setTools(data.map(d => ({
          id: d.id,
          name: d.name,
          category: d.category,
          confidence: d.confidence,
          addedVia: d.added_via,
          timestamp: new Date(d.created_at).getTime()
        })));
      }
      setLoading(false);
    }
    
    loadData();
  }, [user]);

  // Sync to local storage if Guest
  useEffect(() => {
    if (!user && !loading) {
      localStorage.setItem('myTools', JSON.stringify(tools));
    }
  }, [tools, user, loading]);

  const addTools = async (newTools: Omit<ToolItem, 'id' | 'timestamp'>[]) => {
    if (!user) {
      // Guest local update
      const timestamp = Date.now();
      const toAdd = newTools.map(t => ({
        ...t,
        id: Math.random().toString(36).substr(2, 9),
        timestamp,
      }));
      setTools(prev => [...toAdd, ...prev]);
      return;
    }

    // Cloud update
    const inserts = newTools.map(t => ({
      user_id: user.id,
      name: t.name,
      category: t.category,
      confidence: t.confidence,
      added_via: t.addedVia
    }));

    const { data } = await supabase.from('tools').insert(inserts).select();
    if (data) {
      const added = data.map(d => ({
        id: d.id,
        name: d.name,
        category: d.category,
        confidence: d.confidence,
        addedVia: d.added_via,
        timestamp: new Date(d.created_at).getTime()
      }));
      setTools(prev => [...added, ...prev]);
    }
  };

  const removeTool = async (id: string) => {
    setTools(prev => prev.filter(t => t.id !== id));
    if (user) {
      await supabase.from('tools').delete().eq('id', id);
    }
  };

  const clearInventory = async () => {
    setTools([]);
    if (user) {
      await supabase.from('tools').delete().eq('user_id', user.id);
    } else {
      localStorage.removeItem('myTools');
    }
  };

  return { tools, addTools, removeTool, clearInventory, loading };
}
