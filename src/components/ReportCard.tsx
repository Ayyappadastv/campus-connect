import { Report } from '@/types';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { StatusBadge } from './StatusBadge';
import { PriorityBadge } from './PriorityBadge';
import { Badge } from '@/components/ui/badge';
import { Clock, MapPin, User } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

interface ReportCardProps {
  report: Report;
  onClick?: () => void;
  showReporter?: boolean;
}

export function ReportCard({ report, onClick, showReporter = false }: ReportCardProps) {
  return (
    <Card 
      className="cursor-pointer transition-all duration-200 hover:shadow-elevated hover:border-primary/20 animate-fade-in"
      onClick={onClick}
    >
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-foreground line-clamp-1">{report.title}</h3>
            <p className="text-sm text-muted-foreground mt-1 line-clamp-2">{report.description}</p>
          </div>
          <div className="flex flex-col items-end gap-2 shrink-0">
            <StatusBadge status={report.status} />
            <PriorityBadge priority={report.priority} />
          </div>
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
          <Badge variant="secondary" className="font-normal">
            {report.category}
          </Badge>
          <div className="flex items-center gap-1">
            <MapPin className="h-3.5 w-3.5" />
            <span className="line-clamp-1">{report.location}</span>
          </div>
          <div className="flex items-center gap-1">
            <Clock className="h-3.5 w-3.5" />
            <span>{formatDistanceToNow(report.createdAt, { addSuffix: true })}</span>
          </div>
          {showReporter && (
            <div className="flex items-center gap-1">
              <User className="h-3.5 w-3.5" />
              <span>{report.reporterName}</span>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
