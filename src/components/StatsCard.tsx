import { Card, CardContent } from '@/components/ui/card';
import { LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

interface StatsCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  trend?: string;
  variant?: 'default' | 'primary' | 'success' | 'warning' | 'info';
}

const variantStyles = {
  default: 'bg-card',
  primary: 'bg-primary/5 border-primary/20',
  success: 'bg-status-resolved/5 border-status-resolved/20',
  warning: 'bg-status-in-progress/5 border-status-in-progress/20',
  info: 'bg-status-new/5 border-status-new/20',
};

const iconStyles = {
  default: 'text-muted-foreground',
  primary: 'text-primary',
  success: 'text-status-resolved',
  warning: 'text-status-in-progress',
  info: 'text-status-new',
};

export function StatsCard({ title, value, icon: Icon, trend, variant = 'default' }: StatsCardProps) {
  return (
    <Card className={cn('transition-all duration-200 hover:shadow-elevated', variantStyles[variant])}>
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-muted-foreground">{title}</p>
            <p className="text-3xl font-bold text-foreground mt-1">{value}</p>
            {trend && (
              <p className="text-xs text-muted-foreground mt-1">{trend}</p>
            )}
          </div>
          <div className={cn('p-3 rounded-xl bg-background', iconStyles[variant])}>
            <Icon className="h-6 w-6" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
