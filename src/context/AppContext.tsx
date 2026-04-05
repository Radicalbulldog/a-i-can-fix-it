import { createContext, useContext, useState, ReactNode } from 'react';
import type { RepairAnalysis } from '../types/analysis';
import type { ChatMessage } from '../types/chat';

interface AppState {
  currentMedia: File[];
  mediaPreviews: string[];
  analysisResult: RepairAnalysis | null;
  chatMessages: ChatMessage[];
  userLocation: { lat: number; lng: number } | null;
  isAnalyzing: boolean;
}

interface AppContextValue extends AppState {
  setMedia: (files: File[], previews: string[]) => void;
  clearMedia: () => void;
  setAnalysis: (result: RepairAnalysis | null) => void;
  setChatMessages: (msgs: ChatMessage[]) => void;
  addChatMessage: (msg: ChatMessage) => void;
  setLocation: (loc: { lat: number; lng: number } | null) => void;
  setIsAnalyzing: (v: boolean) => void;
}

const AppContext = createContext<AppContextValue | null>(null);

export function AppProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AppState>({
    currentMedia: [],
    mediaPreviews: [],
    analysisResult: null,
    chatMessages: [],
    userLocation: null,
    isAnalyzing: false,
  });

  const value: AppContextValue = {
    ...state,
    setMedia: (files, previews) => setState(s => ({ ...s, currentMedia: files, mediaPreviews: previews })),
    clearMedia: () => {
      state.mediaPreviews.forEach(u => URL.revokeObjectURL(u));
      setState(s => ({ ...s, currentMedia: [], mediaPreviews: [] }));
    },
    setAnalysis: (result) => setState(s => ({ ...s, analysisResult: result })),
    setChatMessages: (msgs) => setState(s => ({ ...s, chatMessages: msgs })),
    addChatMessage: (msg) => setState(s => ({ ...s, chatMessages: [...s.chatMessages, msg] })),
    setLocation: (loc) => setState(s => ({ ...s, userLocation: loc })),
    setIsAnalyzing: (v) => setState(s => ({ ...s, isAnalyzing: v })),
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useAppContext() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useAppContext must be used within AppProvider');
  return ctx;
}
