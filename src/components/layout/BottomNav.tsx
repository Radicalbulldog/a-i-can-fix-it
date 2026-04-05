import { NavLink } from 'react-router-dom';

const tabs = [
  { to: '/', label: 'Home', icon: '📷' },
  { to: '/analysis', label: 'Analysis', icon: '📋' },
  { to: '/videos', label: 'Videos', icon: '▶️' },
  { to: '/contractors', label: 'Pros', icon: '👷' },
];

export default function BottomNav() {
  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 glass border-t border-gray-200/50 pb-safe">
      <div className="flex justify-around items-center h-16">
        {tabs.map(tab => (
          <NavLink
            key={tab.to}
            to={tab.to}
            end={tab.to === '/'}
            className={({ isActive }) =>
              `flex flex-col items-center gap-0.5 px-3 py-1 rounded-lg transition-colors ${
                isActive ? 'text-brand-600' : 'text-gray-500'
              }`
            }
          >
            <span className="text-xl">{tab.icon}</span>
            <span className="text-[10px] font-medium">{tab.label}</span>
          </NavLink>
        ))}
      </div>
    </nav>
  );
}
