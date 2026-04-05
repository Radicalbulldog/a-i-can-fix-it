import { Link, useLocation } from 'react-router-dom';

const navLinks = [
  { to: '/', label: 'Home' },
  { to: '/analysis', label: 'Analysis' },
  { to: '/videos', label: 'Videos' },
  { to: '/contractors', label: 'Contractors' },
];

export default function Header() {
  const location = useLocation();

  return (
    <header className="sticky top-0 z-50 glass border-b border-gray-200/50">
      <div className="max-w-6xl mx-auto px-4 h-14 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <span className="text-2xl">🔧</span>
          <span className="font-bold text-lg tracking-tight">
            <span className="text-brand-500">a.</span>{' '}
            <span className="text-gray-800">I can fix it</span>
          </span>
        </Link>

        <nav className="hidden md:flex items-center gap-1">
          {navLinks.map(link => (
            <Link
              key={link.to}
              to={link.to}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                location.pathname === link.to
                  ? 'bg-brand-100 text-brand-700'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
              }`}
            >
              {link.label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}
