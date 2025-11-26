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
import { ArrowLeft, Clock, MapPin, User, Send, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { formatDistanceToNow, format } from 'date-fns';

export default function ReportDetail() {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const { reports, comments, addComment } = useReports();
  const navigate = useNavigate();
  const { toast } = useToast();

  const [newComment, setNewComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

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
      <div className="max-w-4xl mx-auto">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => navigate(-1)}
          className="mb-6 -ml-2"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>

        <div className="grid gap-6">
          {/* Main Report Card */}
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

              {/* Assignment Info */}
              {report.assignedTo && (
                <>
                  <Separator />
                  <div>
                    <h3 className="font-semibold text-foreground mb-2">Assigned To</h3>
                    <div className="flex items-center gap-2">
                      <Avatar className="h-8 w-8">
                        <AvatarFallback className="bg-primary/10 text-primary text-sm">
                          {report.assignedToName?.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                      <span className="text-foreground">{report.assignedToName}</span>
                    </div>
                  </div>
                </>
              )}
            </CardContent>
          </Card>

          {/* Comments Section */}
          <Card className="animate-fade-in" style={{ animationDelay: '100ms' }}>
            <CardHeader>
              <CardTitle className="text-lg">
                Comments ({reportComments.length})
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Comment List */}
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
                  No comments yet. Be the first to add one!
                </p>
              )}

              <Separator />

              {/* Add Comment */}
              <div className="space-y-4">
                <Textarea
                  placeholder="Add a comment..."
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
      </div>
    </DashboardLayout>
  );
}
