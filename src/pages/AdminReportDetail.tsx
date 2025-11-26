import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useReports } from '@/contexts/ReportsContext';
import { DashboardLayout } from '@/components/layouts/DashboardLayout';
import { StatusBadge } from '@/components/StatusBadge';
import { PriorityBadge } from '@/components/PriorityBadge';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { ArrowLeft, Clock, MapPin, User, Send, Loader2, CheckCircle2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { formatDistanceToNow, format } from 'date-fns';
import { ReportStatus } from '@/types';

export default function AdminReportDetail() {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const { reports, comments, addComment, updateReportStatus, assignReport } = useReports();
  const navigate = useNavigate();
  const { toast } = useToast();

  const [newComment, setNewComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState<ReportStatus | ''>('');

  const report = reports.find((r) => r.id === id);
  const reportComments = comments[id || ''] || [];

  if (!report) {
    return (
      <DashboardLayout>
        <div className="text-center py-12">
          <h2 className="text-xl font-semibold text-foreground">Report not found</h2>
          <p className="text-muted-foreground mt-2">This report may have been deleted or doesn't exist.</p>
          <Button onClick={() => navigate(-1)} className="mt-4">
            Go Back
          </Button>
        </div>
      </DashboardLayout>
    );
  }

  const handleStatusUpdate = () => {
    if (!selectedStatus || !user) return;
    
    updateReportStatus(report.id, selectedStatus, user.id);
    
    // Add automatic comment
    addComment(report.id, {
      reportId: report.id,
      authorId: user.id,
      authorName: user.name,
      authorRole: user.role,
      content: `Status updated to "${selectedStatus.replace('_', ' ')}"`,
      attachments: [],
    });

    toast({
      title: 'Status updated',
      description: `Report status changed to ${selectedStatus.replace('_', ' ')}.`,
    });
    
    setSelectedStatus('');
  };

  const handleAssignToMe = () => {
    if (!user) return;
    
    assignReport(report.id, user.id, user.name);
    
    addComment(report.id, {
      reportId: report.id,
      authorId: user.id,
      authorName: user.name,
      authorRole: user.role,
      content: `Assigned this report to themselves`,
      attachments: [],
    });

    toast({
      title: 'Report assigned',
      description: 'You are now assigned to this report.',
    });
  };

  const handleSubmitComment = async () => {
    if (!newComment.trim() || !user) return;

    setIsSubmitting(true);

    addComment(report.id, {
      reportId: report.id,
      authorId: user.id,
      authorName: user.name,
      authorRole: user.role,
      content: newComment.trim(),
      attachments: [],
    });

    toast({
      title: 'Comment added',
      description: 'Your comment has been posted.',
    });

    setNewComment('');
    setIsSubmitting(false);
  };

  return (
    <DashboardLayout>
      <div className="max-w-5xl mx-auto">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => navigate(-1)}
          className="mb-6 -ml-2"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Reports
        </Button>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Main Report Card */}
          <div className="lg:col-span-2 space-y-6">
            <Card className="shadow-elevated animate-fade-in">
              <CardHeader className="pb-4">
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <Badge variant="secondary" className="font-normal">
                        #{report.id}
                      </Badge>
                      <StatusBadge status={report.status} />
                      <PriorityBadge priority={report.priority} />
                    </div>
                    <CardTitle className="text-2xl">{report.title}</CardTitle>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Meta Info */}
                <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <User className="h-4 w-4" />
                    <span>{report.reporterName}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4" />
                    <span>{report.location}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4" />
                    <span>Created {formatDistanceToNow(report.createdAt, { addSuffix: true })}</span>
                  </div>
                  <Badge variant="secondary">{report.category}</Badge>
                </div>

                <Separator />

                {/* Description */}
                <div>
                  <h3 className="font-semibold text-foreground mb-2">Description</h3>
                  <p className="text-muted-foreground whitespace-pre-wrap">{report.description}</p>
                </div>
              </CardContent>
            </Card>

            {/* Comments Section */}
            <Card className="animate-fade-in" style={{ animationDelay: '100ms' }}>
              <CardHeader>
                <CardTitle className="text-lg">
                  Activity ({reportComments.length})
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {reportComments.length > 0 ? (
                  <div className="space-y-4">
                    {reportComments.map((comment) => (
                      <div key={comment.id} className="flex gap-3">
                        <Avatar className="h-8 w-8 shrink-0">
                          <AvatarFallback className={`text-sm ${
                            comment.authorRole !== 'student' 
                              ? 'bg-primary text-primary-foreground' 
                              : 'bg-secondary text-secondary-foreground'
                          }`}>
                            {comment.authorName.charAt(0)}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="font-medium text-foreground">{comment.authorName}</span>
                            {comment.authorRole !== 'student' && (
                              <Badge variant="secondary" className="text-xs">Admin</Badge>
                            )}
                            <span className="text-xs text-muted-foreground">
                              {format(comment.createdAt, 'MMM d, yyyy h:mm a')}
                            </span>
                          </div>
                          <p className="text-muted-foreground">{comment.content}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-center text-muted-foreground py-4">
                    No activity yet
                  </p>
                )}

                <Separator />

                {/* Add Comment */}
                <div className="space-y-4">
                  <Textarea
                    placeholder="Add a note or response..."
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    rows={3}
                  />
                  <div className="flex justify-end">
                    <Button
                      onClick={handleSubmitComment}
                      disabled={!newComment.trim() || isSubmitting}
                    >
                      {isSubmitting ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <>
                          <Send className="h-4 w-4 mr-2" />
                          Post Comment
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar - Actions */}
          <div className="space-y-6">
            {/* Quick Actions */}
            <Card className="animate-fade-in" style={{ animationDelay: '150ms' }}>
              <CardHeader>
                <CardTitle className="text-lg">Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Status Update */}
                <div className="space-y-2">
                  <Label>Update Status</Label>
                  <div className="flex gap-2">
                    <Select value={selectedStatus} onValueChange={(v) => setSelectedStatus(v as ReportStatus)}>
                      <SelectTrigger className="flex-1">
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="new">New</SelectItem>
                        <SelectItem value="in_progress">In Progress</SelectItem>
                        <SelectItem value="pending_student">Pending Student</SelectItem>
                        <SelectItem value="resolved">Resolved</SelectItem>
                        <SelectItem value="closed">Closed</SelectItem>
                      </SelectContent>
                    </Select>
                    <Button onClick={handleStatusUpdate} disabled={!selectedStatus}>
                      Update
                    </Button>
                  </div>
                </div>

                <Separator />

                {/* Assignment */}
                <div className="space-y-2">
                  <Label>Assignment</Label>
                  {report.assignedTo ? (
                    <div className="flex items-center gap-2 p-2 bg-secondary rounded-lg">
                      <Avatar className="h-6 w-6">
                        <AvatarFallback className="bg-primary/10 text-primary text-xs">
                          {report.assignedToName?.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                      <span className="text-sm text-foreground">{report.assignedToName}</span>
                    </div>
                  ) : (
                    <Button variant="outline" className="w-full" onClick={handleAssignToMe}>
                      <User className="h-4 w-4 mr-2" />
                      Assign to me
                    </Button>
                  )}
                </div>

                {/* Quick Resolve */}
                {report.status !== 'resolved' && report.status !== 'closed' && (
                  <>
                    <Separator />
                    <Button 
                      variant="success" 
                      className="w-full"
                      onClick={() => {
                        if (user) {
                          updateReportStatus(report.id, 'resolved', user.id);
                          addComment(report.id, {
                            reportId: report.id,
                            authorId: user.id,
                            authorName: user.name,
                            authorRole: user.role,
                            content: 'Marked this report as resolved',
                            attachments: [],
                          });
                          toast({
                            title: 'Report resolved',
                            description: 'The report has been marked as resolved.',
                          });
                        }
                      }}
                    >
                      <CheckCircle2 className="h-4 w-4 mr-2" />
                      Mark as Resolved
                    </Button>
                  </>
                )}
              </CardContent>
            </Card>

            {/* Report Info */}
            <Card className="animate-fade-in" style={{ animationDelay: '200ms' }}>
              <CardHeader>
                <CardTitle className="text-lg">Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Report ID</span>
                  <span className="font-medium text-foreground">#{report.id}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Category</span>
                  <span className="font-medium text-foreground">{report.category}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Priority</span>
                  <PriorityBadge priority={report.priority} />
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Created</span>
                  <span className="font-medium text-foreground">
                    {format(report.createdAt, 'MMM d, yyyy')}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Last Updated</span>
                  <span className="font-medium text-foreground">
                    {format(report.updatedAt, 'MMM d, yyyy')}
                  </span>
                </div>
                {report.resolvedAt && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Resolved</span>
                    <span className="font-medium text-foreground">
                      {format(report.resolvedAt, 'MMM d, yyyy')}
                    </span>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
