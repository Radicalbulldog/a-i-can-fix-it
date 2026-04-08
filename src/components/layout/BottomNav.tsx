import { NavLink } from 'react-router-dom';
import { Camera, Wrench, Package, Video, HardHat } from 'lucide-react';

const tabs = [
  { to: '/', label: 'Capture', icon: <Camera className="w-[22px] h-[22px]" /> },
  { to: '/analysis', label: 'Repair', icon: <Wrench className="w-[22px] h-[22px]" /> },
  { to: '/inventory', label: 'My Tools', icon: <Package className="w-[22px] h-[22px]" /> },
  { to: '/videos', label: 'Videos', icon: <Video className="w-[22px] h-[22px]" /> },
  { to: '/contractors', label: 'Pros', icon: <HardHat className="w-[22px] h-[22px]" /> },
];

export default function BottomNav() {
  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 glass dark:glass-dark border-t border-slate-200/60 dark:border-slate-700/60 pb-safe">
      <div className="flex justify-around items-center h-[4.5rem]">
        {tabs.map(tab => (
          <NavLink
            key={tab.to}
            to={tab.to}
            end={tab.to === '/'}
            className={({ isActive }) =>
              `flex flex-col items-center justify-center gap-1 w-full h-full transition-all duration-200 ${
                isActive
                  ? 'text-brand-600 dark:text-brand-400 scale-[1.03] font-bold'
                  : 'text-slate-400 dark:text-slate-500 active:scale-95'
              }`
            }
          >
            {tab.icon}
            <span className="text-[10px] tracking-wide">{tab.label}</span>
          </NavLink>
        ))}
      </div>
    </nav>
  );
}
