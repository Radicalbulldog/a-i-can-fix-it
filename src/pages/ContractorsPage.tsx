import { useState, useEffect } from 'react';
import PageShell from '../components/layout/PageShell';
import LocationPrompt from '../components/contractors/LocationPrompt';
import ContractorList from '../components/contractors/ContractorList';
import { useGeolocation } from '../hooks/useGeolocation';
import { useAppContext } from '../context/AppContext';
import { findContractors } from '../lib/api';
import { CATEGORIES } from '../lib/constants';
import type { Contractor } from '../types/contractor';

export default function ContractorsPage() {
  const { location, error: geoError, isLoading: geoLoading, requestLocation } = useGeolocation();
  const { analysisResult, userLocation, setLocation } = useAppContext();
  const [contractors, setContractors] = useState<Contractor[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [category, setCategory] = useState(analysisResult?.category || 'all');

  const loc = location || userLocation;

  useEffect(() => {
    if (location) setLocation(location);
  }, [location, setLocation]);

  useEffect(() => {
    if (!loc) return;
    setIsLoading(true);
    findContractors(loc.lat, loc.lng, category)
      .then(setContractors)
      .catch(() => setContractors([]))
      .finally(() => setIsLoading(false));
  }, [loc, category]);

  if (!loc) {
    return (
      <PageShell>
        <div className="space-y-6">
          <div>
            <h2 className="text-xl font-bold text-gray-900 mb-1">Find Local Contractors</h2>
            <p className="text-sm text-gray-500">Licensed professionals in your area</p>
          </div>
          <LocationPrompt
            onRequestLocation={requestLocation}
            isLoading={geoLoading}
            error={geoError}
          />
        </div>
      </PageShell>
    );
  }

  return (
    <PageShell>
      <div className="space-y-6">
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div>
            <h2 className="text-xl font-bold text-gray-900 mb-1">Local Contractors</h2>
            <p className="text-sm text-gray-500">Licensed & insured professionals near you</p>
          </div>
          <select
            value={category}
            onChange={e => setCategory(e.target.value)}
            className="px-3 py-2 rounded-xl border border-gray-300 text-sm focus:border-brand-500 focus:ring-2 focus:ring-brand-200 outline-none"
          >
            {CATEGORIES.map(c => (
              <option key={c.value} value={c.value}>{c.label}</option>
            ))}
          </select>
        </div>

        <ContractorList contractors={contractors} isLoading={isLoading} />
      </div>
    </PageShell>
  );
}
