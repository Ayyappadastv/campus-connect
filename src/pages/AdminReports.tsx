import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useReports } from '@/contexts/ReportsContext';
import { DashboardLayout } from '@/components/layouts/DashboardLayout';
import { ReportCard } from '@/components/ReportCard';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Search, Filter, AlertCircle, Download } from 'lucide-react';
import { ReportStatus, ReportCategory, ReportPriority } from '@/types';

export default function AdminReports() {
  const { reports } = useReports();
  const navigate = useNavigate();

  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<ReportStatus | 'all'>('all');
  const [categoryFilter, setCategoryFilter] = useState<ReportCategory | 'all'>('all');
  const [priorityFilter, setPriorityFilter] = useState<ReportPriority | 'all'>('all');
  const [activeTab, setActiveTab] = useState<'all' | 'new' | 'active' | 'resolved'>('all');

  const getFilteredReports = () => {
    let filtered = [...reports];

    // Tab filter
    if (activeTab === 'new') {
      filtered = filtered.filter(r => r.status === 'new');
    } else if (activeTab === 'active') {
      filtered = filtered.filter(r => r.status === 'in_progress' || r.status === 'pending_student');
    } else if (activeTab === 'resolved') {
      filtered = filtered.filter(r => r.status === 'resolved' || r.status === 'closed');
    }

    // Search
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(r => 
        r.title.toLowerCase().includes(query) ||
        r.description.toLowerCase().includes(query) ||
        r.reporterName.toLowerCase().includes(query)
      );
    }

    // Status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter(r => r.status === statusFilter);
    }

    // Category filter
    if (categoryFilter !== 'all') {
      filtered = filtered.filter(r => r.category === categoryFilter);
    }

    // Priority filter
    if (priorityFilter !== 'all') {
      filtered = filtered.filter(r => r.priority === priorityFilter);
    }

    return filtered;
  };

  const filteredReports = getFilteredReports();

  const tabCounts = {
    all: reports.length,
    new: reports.filter(r => r.status === 'new').length,
    active: reports.filter(r => r.status === 'in_progress' || r.status === 'pending_student').length,
    resolved: reports.filter(r => r.status === 'resolved' || r.status === 'closed').length,
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-foreground">All Reports</h1>
            <p className="text-muted-foreground mt-1">
              Manage and respond to campus issues
            </p>
          </div>
          <Button variant="outline" className="gap-2">
            <Download className="h-4 w-4" />
            Export CSV
          </Button>
        </div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as typeof activeTab)}>
          <TabsList className="grid w-full grid-cols-4 lg:w-auto lg:inline-flex">
            <TabsTrigger value="all">All ({tabCounts.all})</TabsTrigger>
            <TabsTrigger value="new">New ({tabCounts.new})</TabsTrigger>
            <TabsTrigger value="active">Active ({tabCounts.active})</TabsTrigger>
            <TabsTrigger value="resolved">Resolved ({tabCounts.resolved})</TabsTrigger>
          </TabsList>
        </Tabs>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search reports..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          <Select value={statusFilter} onValueChange={(v) => setStatusFilter(v as ReportStatus | 'all')}>
            <SelectTrigger className="w-full sm:w-40">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="new">New</SelectItem>
              <SelectItem value="in_progress">In Progress</SelectItem>
              <SelectItem value="pending_student">Pending</SelectItem>
              <SelectItem value="resolved">Resolved</SelectItem>
              <SelectItem value="closed">Closed</SelectItem>
            </SelectContent>
          </Select>
          <Select value={categoryFilter} onValueChange={(v) => setCategoryFilter(v as ReportCategory | 'all')}>
            <SelectTrigger className="w-full sm:w-40">
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              <SelectItem value="IT">IT</SelectItem>
              <SelectItem value="Hostel">Hostel</SelectItem>
              <SelectItem value="Library">Library</SelectItem>
              <SelectItem value="Academics">Academics</SelectItem>
              <SelectItem value="Infrastructure">Infrastructure</SelectItem>
              <SelectItem value="Other">Other</SelectItem>
            </SelectContent>
          </Select>
          <Select value={priorityFilter} onValueChange={(v) => setPriorityFilter(v as ReportPriority | 'all')}>
            <SelectTrigger className="w-full sm:w-36">
              <SelectValue placeholder="Priority" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Priority</SelectItem>
              <SelectItem value="high">High</SelectItem>
              <SelectItem value="medium">Medium</SelectItem>
              <SelectItem value="low">Low</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Reports List */}
        {filteredReports.length > 0 ? (
          <div className="space-y-4">
            {filteredReports.map((report) => (
              <ReportCard
                key={report.id}
                report={report}
                onClick={() => navigate(`/admin/reports/${report.id}`)}
                showReporter
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-12 bg-card rounded-xl border border-border">
            <AlertCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="font-semibold text-foreground mb-2">No reports found</h3>
            <p className="text-muted-foreground">
              {reports.length === 0
                ? "There are no reports in the system yet."
                : "No reports match your current filters."}
            </p>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
