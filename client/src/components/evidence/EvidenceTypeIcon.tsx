import { FileText, Image as ImageIcon, Music4, Video, ScanLine, Mail } from 'lucide-react';
import type { EvidenceType } from '../../types';

interface EvidenceTypeIconProps {
  type: EvidenceType;
  className?: string;
}

export const EvidenceTypeIcon = ({ type, className = '' }: EvidenceTypeIconProps) => {
  const common = `flex-shrink-0 ${className}`;
  switch (type) {
    case 'IMAGE':
      return <ImageIcon className={common} size={18} />;
    case 'VIDEO':
      return <Video className={common} size={18} />;
    case 'AUDIO':
      return <Music4 className={common} size={18} />;
    case 'SCREENSHOT':
      return <ScanLine className={common} size={18} />;
    case 'EMAIL':
      return <Mail className={common} size={18} />;
    case 'DOCUMENT':
    case 'FILE':
    default:
      return <FileText className={common} size={18} />;
  }
};
