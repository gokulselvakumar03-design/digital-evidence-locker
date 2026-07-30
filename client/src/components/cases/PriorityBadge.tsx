import { Badge } from '../ui/Badge';
import type { Case } from '../../types';

interface PriorityBadgeProps {
  priority: Case['priority'];
}

const priorityTone: Record<Case['priority'], 'indigo' | 'amber' | 'rose' | 'slate'> = {
  LOW: 'slate',
  MEDIUM: 'indigo',
  HIGH: 'amber',
  CRITICAL: 'rose',
};

export const PriorityBadge = ({ priority }: PriorityBadgeProps) => {
  return <Badge tone={priorityTone[priority]}>{priority}</Badge>;
};
