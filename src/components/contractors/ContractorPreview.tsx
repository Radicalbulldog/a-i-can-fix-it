import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import type { Contractor } from '../../types/contractor';
import { findContractors } from '../../lib/api';
import { useGeolocation } from '../../hooks/useGeolocation';
import Card from '../ui/Card';
import Button from '../ui/Button';
import Spinner from '../ui/Spinner';

interface ContractorPreviewProps {
  category: string;
}

export default function ContractorPreview({ category }: ContractorPreviewProps) {
  const { location, requestLocation, isLoading: geoLoading, error: geoError } = useGeolocation();
  const [contractors, setContractors] = useState<Contractor[]>([]);
  const [loading, setLoading] = useState(false);
  const [requested, setRequested] = useState(false);

  useEffect(() => {
    if (!location) return;
    setLoading(true);
    findContractors(location.lat, location.lng, category)
      .then(list => setContractors(list.slice(0, 3)))
      .catch(() => setContractors([]))
      .finally(() => setLoading(false));
  }, [location, category]);

  // Auto-request location on mount
  useEffect(() => {
    if (!requested) {
      setRequested(true);
      requestLocation();
    }
  }, [requested, requestLocation]);

  return (
    <Card>
      <h3 className="font-semibold text-gray-900 dark:text-slate-100 mb-3 flex items-center gap-2">
        <span>👷</span> Contractors Near You
      </h3>

      {(geoLoading || loading) && (
        <div className="flex justify-center py-4">
          <Spinner size="sm" />
        </div>
      )}

      {geoError && !location && (
        <div className="text-center py-3">
          <p className="text-xs text-gray-500 dark:text-slate-400 mb-2">Enable location to see nearby pros</p>
          <Button size="sm" onClick={requestLocation}>📍 Share Location</Button>
        </div>
      )}

      {contractors.length > 0 && (
        <div className="space-y-3">
          {contractors.map(c => (
            <div key={c.id} className="border border-gray-100 dark:border-slate-700 rounded-xl p-3">
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0">
                  <div className="text-sm font-semibold text-gray-900 dark:text-slate-100 truncate">{c.name}</div>
                  <div className="flex items-center gap-1 mt-0.5">
                    <span className="text-yellow-500 text-xs">{'★'.repeat(Math.round(c.rating))}</span>
                    <span className="text-[10px] text-gray-400 dark:text-slate-500">({c.reviewCount})</span>
                  </div>
                  <div className="text-xs text-gray-500 dark:text-slate-400 mt-1">{c.specialty} &middot; {c.yearsInBusiness}+ yrs</div>
                </div>
                <a
                  href={`tel:${c.phone}`}
                  className="flex-shrink-0 px-2.5 py-1.5 bg-brand-500 hover:bg-brand-600 text-white text-xs font-medium rounded-lg transition-colors"
                >
                  📞 Call
                </a>
              </div>
            </div>
          ))}

          <Link to="/contractors">
            <Button variant="secondary" size="sm" className="w-full">
              See All Contractors →
            </Button>
          </Link>
        </div>
      )}

      {!geoLoading && !loading && !geoError && contractors.length === 0 && location && (
        <p className="text-xs text-gray-500 dark:text-slate-400 text-center py-3">No contractors found nearby</p>
      )}
    </Card>
  );
}
