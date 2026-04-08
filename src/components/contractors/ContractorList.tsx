import type { Contractor } from '../../types/contractor';
import ContractorCard from './ContractorCard';
import Spinner from '../ui/Spinner';

interface ContractorListProps {
  contractors: Contractor[];
  isLoading: boolean;
}

export default function ContractorList({ contractors, isLoading }: ContractorListProps) {
  if (isLoading) {
    return (
      <div className="flex justify-center py-12">
        <Spinner />
      </div>
    );
  }

  if (contractors.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-4xl mb-3">👷</div>
        <p className="text-gray-600 dark:text-slate-300 text-sm">No contractors found in your area</p>
        <p className="text-gray-400 dark:text-slate-500 text-xs mt-1">Try expanding your search radius</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {contractors.map(c => (
        <ContractorCard key={c.id} contractor={c} />
      ))}
    </div>
  );
}
