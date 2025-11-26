import { Badge } from '@/components/ui/badge';
import { ReportPriority } from '@/types';

const priorityConfig: Record<ReportPriority, { label: string; variant: 'low' | 'medium' | 'high' }> = {
  low: { label: 'Low', variant: 'low' },
  medium: { label: 'Medium', variant: 'medium' },
  high: { label: 'High', variant: 'high' },
};

interface PriorityBadgeProps {
  priority: ReportPriority;
}

export function PriorityBadge({ priority }: PriorityBadgeProps) {
  const config = priorityConfig[priority];
  return <Badge variant={config.variant}>{config.label}</Badge>;
}
