export interface RepairStep {
  number: number;
  title: string;
  description: string;
  tip?: string;
  icon: string;
}

export interface Tool {
  name: string;
  required: boolean;
  searchQuery: string;
}

export interface Material {
  name: string;
  quantity: string;
  estimatedCost: string;
  searchQuery: string;
}

export interface RepairAnalysis {
  problemDescription: string;
  problemTitle: string;
  category: string;
  difficulty: number;
  estimatedTime: string;
  estimatedCost: string;
  safetyWarnings: string[];
  steps: RepairStep[];
  tools: Tool[];
  materials: Material[];
  needsMoreInfo: boolean;
  followUpQuestion: string | null;
  videoSearchQuery: string;
}
