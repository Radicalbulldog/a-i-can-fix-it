import { ReactNode } from 'react';

interface BadgeProps {
  children: ReactNode;
  color?: string;
  bg?: string;
  className?: string;
}

export default function Badge({ children, color = 'text-gray-700 dark:text-slate-300', bg = 'bg-gray-100 dark:bg-slate-700', className = '' }: BadgeProps) {
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${color} ${bg} ${className}`}>
      {children}
    </span>
  );
}
