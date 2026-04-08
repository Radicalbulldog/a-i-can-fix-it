import type { Contractor } from '../../types/contractor';
import Card from '../ui/Card';
import Badge from '../ui/Badge';

export default function ContractorCard({ contractor }: { contractor: Contractor }) {
  const stars = '★'.repeat(Math.round(contractor.rating)) + '☆'.repeat(5 - Math.round(contractor.rating));

  return (
    <Card>
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <h4 className="font-semibold text-gray-900 dark:text-slate-100">{contractor.name}</h4>
          <div className="flex items-center gap-2 mt-1">
            <span className="text-yellow-500 text-sm">{stars}</span>
            <span className="text-xs text-gray-500 dark:text-slate-400">{contractor.rating} ({contractor.reviewCount} reviews)</span>
          </div>
          <p className="text-sm text-gray-600 dark:text-slate-300 mt-2">{contractor.description}</p>
          <div className="flex flex-wrap gap-2 mt-3">
            <Badge color="text-brand-700" bg="bg-brand-50">{contractor.specialty}</Badge>
            <Badge>{contractor.yearsInBusiness}+ years</Badge>
            {contractor.licensed && <Badge color="text-green-700" bg="bg-green-50">Licensed</Badge>}
            {contractor.insured && <Badge color="text-blue-700" bg="bg-blue-50">Insured</Badge>}
          </div>
        </div>
        <div className="flex-shrink-0 text-right">
          <div className="text-xs text-gray-400 dark:text-slate-500 mb-2">{contractor.distance.toFixed(1)} mi</div>
          <a
            href={`tel:${contractor.phone}`}
            className="inline-flex items-center gap-1 px-3 py-2 bg-brand-500 hover:bg-brand-600 text-white text-sm font-medium rounded-xl transition-colors"
          >
            📞 Call
          </a>
        </div>
      </div>
    </Card>
  );
}
