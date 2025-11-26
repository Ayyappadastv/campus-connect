import { useNavigate } from 'react-router-dom';
import { useReports } from '@/contexts/ReportsContext';
import { DashboardLayout } from '@/components/layouts/DashboardLayout';
import { ReportCard } from '@/components/ReportCard';
import { StatsCard } from '@/components/StatsCard';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { FileText, CheckCircle2, Clock, AlertTriangle, TrendingUp, ArrowRight } from 'lucide-react';

export default function AdminDashboard() {
  const { reports, getStats } = useReports();
  const navigate = useNavigate();

  const stats = getStats();
  const recentReports = reports.filter(r => r.status === 'new' || r.status === 'in_progress').slice(0, 5);
  const urgentReports = reports.filter(r => r.priority === 'high' && r.status !== 'resolved' && r.status !== 'closed');

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold text-foreground">Admin Dashboard</h1>
          <p className="text-muted-foreground mt-1">
            Overview of all campus reports and issues
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatsCard
            title="Total Reports"
            value={stats.total}
            icon={FileText}
            variant="primary"
          />
          <StatsCard
            title="New"
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
            trend={`Avg. ${stats.avgResolutionDays.toFixed(1)} days to resolve`}
          />
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Active Reports */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="text-lg">Active Reports</CardTitle>
                <Button variant="ghost" size="sm" onClick={() => navigate('/admin/reports')}>
                  View all
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              </CardHeader>
              <CardContent className="space-y-4">
                {recentReports.length > 0 ? (
                  recentReports.map((report) => (
                    <ReportCard
                      key={report.id}
                      report={report}
                      onClick={() => navigate(`/admin/reports/${report.id}`)}
                      showReporter
                    />
                  ))
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    No active reports at the moment
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Urgent Reports Sidebar */}
          <div>
            <Card className="border-priority-high/30 bg-priority-high/5">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5 text-priority-high" />
                  Urgent Issues
                </CardTitle>
              </CardHeader>
              <CardContent>
                {urgentReports.length > 0 ? (
                  <div className="space-y-3">
                    {urgentReports.slice(0, 3).map((report) => (
                      <div
                        key={report.id}
                        className="p-3 bg-card rounded-lg cursor-pointer hover:bg-secondary transition-colors"
                        onClick={() => navigate(`/admin/reports/${report.id}`)}
                      >
                        <p className="font-medium text-foreground text-sm line-clamp-1">
                          {report.title}
                        </p>
                        <p className="text-xs text-muted-foreground mt-1">
                          {report.category} • {report.location}
                        </p>
                      </div>
                    ))}
                    {urgentReports.length > 3 && (
                      <Button
                        variant="ghost"
                        size="sm"
                        className="w-full"
                        onClick={() => navigate('/admin/reports?priority=high')}
                      >
                        View all {urgentReports.length} urgent reports
                      </Button>
                    )}
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground text-center py-4">
                    No urgent reports
                  </p>
                )}
              </CardContent>
            </Card>

            {/* Quick Stats */}
            <Card className="mt-4">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-primary" />
                  Quick Stats
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Resolution Rate</span>
                  <span className="font-semibold text-foreground">
                    {stats.total > 0 ? Math.round((stats.resolved / stats.total) * 100) : 0}%
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Avg. Resolution Time</span>
                  <span className="font-semibold text-foreground">
                    {stats.avgResolutionDays.toFixed(1)} days
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Pending Review</span>
                  <span className="font-semibold text-foreground">{stats.new}</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
