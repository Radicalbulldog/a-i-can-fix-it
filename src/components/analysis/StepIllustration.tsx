import { getStepIllustration } from '../../lib/illustrations';

interface StepIllustrationProps {
  stepTitle: string;
  stepDescription: string;
  icon: string;
}

export default function StepIllustration({ icon }: StepIllustrationProps) {
  const svg = getStepIllustration(icon);

  return (
    <div className="w-full flex justify-center my-3">
      <div className="w-48 h-36 sm:w-56 sm:h-42 rounded-xl bg-white border border-gray-200 flex items-center justify-center overflow-hidden shadow-sm">
        <div
          className="w-full h-full"
          dangerouslySetInnerHTML={{ __html: svg }}
        />
      </div>
    </div>
  );
}
