import { ReactNode } from 'react';

export default function PageShell({ children, className = '' }: { children: ReactNode; className?: string }) {
  return (
    <main className={`max-w-4xl mx-auto px-4 py-6 pb-24 md:pb-6 min-h-[calc(100vh-3.5rem)] ${className}`}>
      {children}
    </main>
  );
}
