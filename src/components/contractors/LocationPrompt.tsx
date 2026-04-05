import Button from '../ui/Button';
import Card from '../ui/Card';

interface LocationPromptProps {
  onRequestLocation: () => void;
  isLoading: boolean;
  error?: string | null;
}

export default function LocationPrompt({ onRequestLocation, isLoading, error }: LocationPromptProps) {
  return (
    <Card className="text-center max-w-md mx-auto">
      <div className="text-5xl mb-4">📍</div>
      <h3 className="text-lg font-semibold text-gray-900 mb-2">Find Contractors Near You</h3>
      <p className="text-sm text-gray-600 mb-4">
        Share your location to find licensed, insured contractors in your area who can handle your repair.
      </p>
      {error && (
        <p className="text-sm text-red-600 mb-3">
          {error}. Please enable location access in your browser settings.
        </p>
      )}
      <Button onClick={onRequestLocation} disabled={isLoading} size="lg" className="w-full">
        {isLoading ? 'Getting location...' : 'Share My Location'}
      </Button>
    </Card>
  );
}
