import { Badge } from '@/components/ui/badge';
import { ReportStatus } from '@/types';

const statusConfig: Record<ReportStatus, { label: string; variant: 'new' | 'in-progress' | 'pending' | 'resolved' | 'closed' }> = {
  new: { label: 'New', variant: 'new' },
  in_progress: { label: 'In Progress', variant: 'in-progress' },
  pending_student: { label: 'Pending Student', variant: 'pending' },
  resolved: { label: 'Resolved', variant: 'resolved' },
  closed: { label: 'Closed', variant: 'closed' },
};

interface StatusBadgeProps {
  status: ReportStatus;
}

export function StatusBadge({ status }: StatusBadgeProps) {
  const config = statusConfig[status];
  return <Badge variant={config.variant}>{config.label}</Badge>;
}
