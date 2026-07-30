import { Badge } from '../ui/Badge';
import type { IntegrityStatus, ReviewStatus } from '../../types';

interface EvidenceStatusBadgeProps {
  integrityStatus?: IntegrityStatus;
  reviewStatus?: ReviewStatus;
}

export const EvidenceStatusBadge = ({ integrityStatus, reviewStatus }: EvidenceStatusBadgeProps) => {
  const badgeTone = integrityStatus === 'VERIFIED' ? 'emerald' : integrityStatus === 'FAILED' ? 'rose' : integrityStatus === 'FLAGGED' ? 'amber' : 'slate';
  return (
    <div className="flex flex-wrap gap-2">
      {integrityStatus ? <Badge tone={badgeTone}>{integrityStatus}</Badge> : null}
      {reviewStatus ? <Badge tone={reviewStatus === 'REVIEWED' ? 'emerald' : reviewStatus === 'FLAGGED' ? 'amber' : 'slate'}>{reviewStatus}</Badge> : null}
    </div>
  );
};
