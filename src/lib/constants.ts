export const DIFFICULTY_LABELS: Record<number, { label: string; color: string; bg: string }> = {
  1: { label: 'Easy', color: 'text-green-700', bg: 'bg-green-100' },
  2: { label: 'Moderate', color: 'text-blue-700', bg: 'bg-blue-100' },
  3: { label: 'Intermediate', color: 'text-yellow-700', bg: 'bg-yellow-100' },
  4: { label: 'Advanced', color: 'text-orange-700', bg: 'bg-orange-100' },
  5: { label: 'Professional', color: 'text-red-700', bg: 'bg-red-100' },
};

export const STEP_ICONS: Record<string, string> = {
  measure: '📏',
  cut: '✂️',
  drill: '🔩',
  apply: '🖌️',
  connect: '🔗',
  remove: '🗑️',
  clean: '🧹',
  inspect: '🔍',
  install: '🔧',
  sand: '📐',
  paint: '🎨',
  seal: '💧',
  tighten: '🔧',
  test: '✅',
};

export const CATEGORIES = [
  { value: 'all', label: 'All Categories' },
  { value: 'plumbing', label: 'Plumbing' },
  { value: 'electrical', label: 'Electrical' },
  { value: 'hvac', label: 'HVAC' },
  { value: 'roofing', label: 'Roofing' },
  { value: 'flooring', label: 'Flooring' },
  { value: 'painting', label: 'Painting' },
  { value: 'exterior', label: 'Exterior' },
  { value: 'general', label: 'General' },
];
