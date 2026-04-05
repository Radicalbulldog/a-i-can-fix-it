import { Routes, Route } from 'react-router-dom';
import Header from './components/layout/Header';
import BottomNav from './components/layout/BottomNav';
import HomePage from './pages/HomePage';
import AnalysisPage from './pages/AnalysisPage';
import VideosPage from './pages/VideosPage';
import ContractorsPage from './pages/ContractorsPage';

export default function App() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
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
