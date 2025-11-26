import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useReports } from '@/contexts/ReportsContext';
import { DashboardLayout } from '@/components/layouts/DashboardLayout';
import { ReportCard } from '@/components/ReportCard';
import { StatsCard } from '@/components/StatsCard';
import { Button } from '@/components/ui/button';
import { FileText, Plus, CheckCircle2, Clock, AlertCircle } from 'lucide-react';

export default function StudentDashboard() {
  const { user } = useAuth();
  const { getReportsByUser } = useReports();
  const navigate = useNavigate();

  const userReports = user ? getReportsByUser(user.id) : [];
  const recentReports = userReports.slice(0, 3);

  const stats = {
    total: userReports.length,
    open: userReports.filter(r => r.status === 'new' || r.status === 'in_progress' || r.status === 'pending_student').length,
    resolved: userReports.filter(r => r.status === 'resolved' || r.status === 'closed').length,
  };

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-foreground">
              Welcome back, {user?.name?.split(' ')[0]}!
            </h1>
            <p className="text-muted-foreground mt-1">
              Track and manage your reported issues
            </p>
          </div>
          <Button onClick={() => navigate('/reports/new')} className="gap-2">
            <Plus className="h-4 w-4" />
            New Report
          </Button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <StatsCard
            title="Total Reports"
            value={stats.total}
            icon={FileText}
            variant="primary"
          />
          <StatsCard
            title="Open Issues"
            value={stats.open}
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

        {/* Recent Reports */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-foreground">Recent Reports</h2>
            {userReports.length > 3 && (
              <Button variant="ghost" size="sm" onClick={() => navigate('/reports')}>
                View all
              </Button>
            )}
          </div>

          {recentReports.length > 0 ? (
            <div className="space-y-4">
              {recentReports.map((report) => (
                <ReportCard
                  key={report.id}
                  report={report}
                  onClick={() => navigate(`/reports/${report.id}`)}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-12 bg-card rounded-xl border border-border">
              <AlertCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="font-semibold text-foreground mb-2">No reports yet</h3>
              <p className="text-muted-foreground mb-4">
                You haven't submitted any reports. Create your first one!
              </p>
              <Button onClick={() => navigate('/reports/new')}>
                <Plus className="h-4 w-4 mr-2" />
                Create Report
              </Button>
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}
