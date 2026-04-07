import { ButtonHTMLAttributes, ReactNode } from 'react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  children: ReactNode;
}

const variants = {
  primary: 'bg-brand-600 hover:bg-brand-700 active:bg-brand-800 text-white shadow-sm active:scale-[0.97]',
  secondary: 'bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 active:bg-slate-100 dark:active:bg-slate-600 text-slate-700 dark:text-slate-200 border border-slate-300 dark:border-slate-600 shadow-sm active:scale-[0.97]',
  ghost: 'hover:bg-slate-100 dark:hover:bg-slate-800 active:bg-slate-200 dark:active:bg-slate-700 text-slate-600 dark:text-slate-300 active:scale-[0.97]',
  danger: 'bg-red-500 hover:bg-red-600 active:bg-red-700 text-white shadow-sm active:scale-[0.97]',
};

const sizes = {
  sm: 'px-3.5 py-2 text-sm',
  md: 'px-5 py-2.5 text-sm',
  lg: 'px-6 py-3.5 text-base',
};

export default function Button({ variant = 'primary', size = 'md', className = '', children, ...props }: ButtonProps) {
  return (
    <button
      className={`inline-flex items-center justify-center font-semibold rounded-xl transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-brand-500/40 focus:ring-offset-2 dark:focus:ring-offset-slate-900 disabled:opacity-50 disabled:cursor-not-allowed ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
