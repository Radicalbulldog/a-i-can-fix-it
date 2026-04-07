import { ReactNode } from 'react';

interface CardProps {
  children: ReactNode;
  className?: string;
  padding?: boolean;
  interactive?: boolean;
}

export default function Card({ children, className = '', padding = true, interactive = false }: CardProps) {
  return (
    <div className={`bg-white rounded-2xl border border-slate-200/80 shadow-sm ${padding ? 'p-5 sm:p-6' : ''} ${interactive ? 'card-interactive cursor-pointer hover:shadow-md' : ''} ${className}`}>
      {children}
    </div>
  );
}
