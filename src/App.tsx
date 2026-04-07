import { Routes, Route } from 'react-router-dom';
import Header from './components/layout/Header';
import BottomNav from './components/layout/BottomNav';
import HomePage from './pages/HomePage';
import AnalysisPage from './pages/AnalysisPage';
import VideosPage from './pages/VideosPage';
import ContractorsPage from './pages/ContractorsPage';
import { useDarkMode } from './hooks/useDarkMode';

export default function App() {
  const { dark, toggle } = useDarkMode();

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 transition-colors duration-200">
      <Header dark={dark} onToggleDark={toggle} />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/analysis" element={<AnalysisPage />} />
        <Route path="/videos" element={<VideosPage />} />
        <Route path="/contractors" element={<ContractorsPage />} />
      </Routes>
      <BottomNav />
    </div>
  );
}
