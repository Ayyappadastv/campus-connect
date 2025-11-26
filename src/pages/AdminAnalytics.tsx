import { useReports } from '@/contexts/ReportsContext';
import { DashboardLayout } from '@/components/layouts/DashboardLayout';
import { StatsCard } from '@/components/StatsCard';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  FileText, 
  CheckCircle2, 
  Clock, 
  AlertTriangle,
  BarChart3,
  PieChart,
  TrendingUp,
} from 'lucide-react';
import { ReportCategory, ReportStatus } from '@/types';

export default function AdminAnalytics() {
  const { reports, getStats } = useReports();
  const stats = getStats();

  // Category breakdown
  const categoryBreakdown = reports.reduce((acc, report) => {
    acc[report.category] = (acc[report.category] || 0) + 1;
    return acc;
  }, {} as Record<ReportCategory, number>);

  const sortedCategories = Object.entries(categoryBreakdown)
    .sort(([, a], [, b]) => b - a);

  // Status breakdown
  const statusBreakdown = reports.reduce((acc, report) => {
    acc[report.status] = (acc[report.status] || 0) + 1;
    return acc;
  }, {} as Record<ReportStatus, number>);

  const statusLabels: Record<ReportStatus, string> = {
    new: 'New',
    in_progress: 'In Progress',
    pending_student: 'Pending Student',
    resolved: 'Resolved',
    closed: 'Closed',
  };

  const statusColors: Record<ReportStatus, string> = {
    new: 'bg-status-new',
    in_progress: 'bg-status-in-progress',
    pending_student: 'bg-status-pending',
    resolved: 'bg-status-resolved',
    closed: 'bg-status-closed',
  };

  // Priority breakdown
  const highPriority = reports.filter(r => r.priority === 'high').length;
  const mediumPriority = reports.filter(r => r.priority === 'medium').length;
  const lowPriority = reports.filter(r => r.priority === 'low').length;

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold text-foreground">Analytics</h1>
          <p className="text-muted-foreground mt-1">
            Insights and statistics about campus reports
          </p>
        </div>

        {/* Overview Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatsCard
            title="Total Reports"
            value={stats.total}
            icon={FileText}
            variant="primary"
          />
          <StatsCard
            title="New Reports"
            value={stats.new}
            icon={AlertTriangle}
            variant="info"
          />
          <StatsCard
            title="In Progress"
            value={stats.inProgress}
            icon={Clock}
            variant="warning"
          />
          <StatsCard
            title="Resolved"
            value={stats.resolved}
            icon={CheckCircle2}
            variant="success"
          />
        </div>

        <div className="grid lg:grid-cols-2 gap-6">
          {/* Status Distribution */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <PieChart className="h-5 w-5 text-primary" />
                Status Distribution
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {Object.entries(statusBreakdown).map(([status, count]) => {
                  const percentage = stats.total > 0 ? (count / stats.total) * 100 : 0;
                  return (
                    <div key={status} className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-foreground">{statusLabels[status as ReportStatus]}</span>
                        <span className="text-muted-foreground">{count} ({percentage.toFixed(1)}%)</span>
                      </div>
                      <div className="h-2 bg-secondary rounded-full overflow-hidden">
                        <div 
                          className={`h-full ${statusColors[status as ReportStatus]} transition-all duration-500`}
                          style={{ width: `${percentage}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          {/* Category Breakdown */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <BarChart3 className="h-5 w-5 text-primary" />
                Reports by Category
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {sortedCategories.map(([category, count]) => {
                  const percentage = stats.total > 0 ? (count / stats.total) * 100 : 0;
                  return (
                    <div key={category} className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-foreground">{category}</span>
                        <span className="text-muted-foreground">{count} ({percentage.toFixed(1)}%)</span>
                      </div>
                      <div className="h-2 bg-secondary rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-primary transition-all duration-500"
                          style={{ width: `${percentage}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Priority Distribution */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Priority Distribution</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 bg-priority-high/10 rounded-lg">
                  <div className="flex items-center gap-2">
                    <div className="h-3 w-3 rounded-full bg-priority-high" />
                    <span className="text-foreground font-medium">High</span>
                  </div>
                  <span className="text-lg font-bold text-foreground">{highPriority}</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-priority-medium/10 rounded-lg">
                  <div className="flex items-center gap-2">
                    <div className="h-3 w-3 rounded-full bg-priority-medium" />
                    <span className="text-foreground font-medium">Medium</span>
                  </div>
                  <span className="text-lg font-bold text-foreground">{mediumPriority}</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-priority-low/10 rounded-lg">
                  <div className="flex items-center gap-2">
                    <div className="h-3 w-3 rounded-full bg-priority-low" />
                    <span className="text-foreground font-medium">Low</span>
                  </div>
                  <span className="text-lg font-bold text-foreground">{lowPriority}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Key Metrics */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-primary" />
                Key Metrics
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-6">
                <div className="p-4 bg-secondary/50 rounded-xl text-center">
                  <p className="text-3xl font-bold text-foreground">
                    {stats.total > 0 ? Math.round((stats.resolved / stats.total) * 100) : 0}%
                  </p>
                  <p className="text-sm text-muted-foreground mt-1">Resolution Rate</p>
                </div>
                <div className="p-4 bg-secondary/50 rounded-xl text-center">
                  <p className="text-3xl font-bold text-foreground">
                    {stats.avgResolutionDays.toFixed(1)}
                  </p>
                  <p className="text-sm text-muted-foreground mt-1">Avg. Days to Resolve</p>
                </div>
                <div className="p-4 bg-secondary/50 rounded-xl text-center">
                  <p className="text-3xl font-bold text-foreground">{stats.new + stats.inProgress}</p>
                  <p className="text-sm text-muted-foreground mt-1">Active Issues</p>
                </div>
                <div className="p-4 bg-secondary/50 rounded-xl text-center">
                  <p className="text-3xl font-bold text-foreground">
                    {highPriority}
                  </p>
                  <p className="text-sm text-muted-foreground mt-1">High Priority Open</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}
