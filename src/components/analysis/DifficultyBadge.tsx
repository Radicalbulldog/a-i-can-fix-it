import Badge from '../ui/Badge';
import { DIFFICULTY_LABELS } from '../../lib/constants';

export default function DifficultyBadge({ level }: { level: number }) {
  const info = DIFFICULTY_LABELS[level] || DIFFICULTY_LABELS[3];
  return (
    <Badge color={info.color} bg={info.bg}>
      {'★'.repeat(level)} {info.label}
    </Badge>
  );
}
