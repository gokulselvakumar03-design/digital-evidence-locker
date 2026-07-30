import { Badge } from '../ui/Badge';
import type { Case } from '../../types';

interface CaseStatusBadgeProps {
  status: Case['status'];
}

const statusTone: Record<Case['status'], 'indigo' | 'emerald' | 'amber' | 'slate'> = {
  ACTIVE: 'emerald',
  PENDING_REVIEW: 'amber',
  OPEN: 'indigo',
  CLOSED: 'slate',
};

export const CaseStatusBadge = ({ status }: CaseStatusBadgeProps) => {
  return <Badge tone={statusTone[status]}>{status}</Badge>;
};
