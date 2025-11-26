import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useReports } from '@/contexts/ReportsContext';
import { DashboardLayout } from '@/components/layouts/DashboardLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, Loader2, Upload, X } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { ReportCategory, ReportPriority } from '@/types';

export default function NewReport() {
  const { user } = useAuth();
  const { addReport } = useReports();
  const navigate = useNavigate();
  const { toast } = useToast();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState<ReportCategory | ''>('');
  const [location, setLocation] = useState('');
  const [priority, setPriority] = useState<ReportPriority>('medium');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!user) {
      toast({
        title: 'Not authenticated',
        description: 'Please log in to submit a report.',
        variant: 'destructive',
      });
      return;
    }

    if (!category) {
      toast({
        title: 'Category required',
        description: 'Please select a category for your report.',
        variant: 'destructive',
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const report = addReport({
        reporterId: user.id,
        reporterName: user.name,
        title,
        description,
        category: category as ReportCategory,
        location,
        priority,
        attachments: [],
      });

      toast({
        title: 'Report submitted!',
        description: 'Your report has been successfully created. We will notify you of updates.',
      });

      navigate(`/reports/${report.id}`);
    } catch (error) {
      toast({
        title: 'Submission failed',
        description: 'There was an error submitting your report. Please try again.',
        variant: 'destructive',
      });
    }

    setIsSubmitting(false);
  };

  return (
    <DashboardLayout>
      <div className="max-w-2xl mx-auto">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => navigate(-1)}
          className="mb-6 -ml-2"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>

        <Card className="shadow-elevated animate-scale-in">
          <CardHeader>
            <CardTitle className="text-2xl">Report an Issue</CardTitle>
            <CardDescription>
              Describe the problem you're facing. We'll review and assign it to the right team.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Title */}
              <div className="space-y-2">
                <Label htmlFor="title">Issue Title *</Label>
                <Input
                  id="title"
                  placeholder="Brief description of the issue"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                  className="h-11"
                />
              </div>

              {/* Category & Priority */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="category">Category *</Label>
                  <Select value={category} onValueChange={(v) => setCategory(v as ReportCategory)}>
                    <SelectTrigger className="h-11">
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="IT">IT / Technical</SelectItem>
                      <SelectItem value="Hostel">Hostel</SelectItem>
                      <SelectItem value="Library">Library</SelectItem>
                      <SelectItem value="Academics">Academics</SelectItem>
                      <SelectItem value="Infrastructure">Infrastructure</SelectItem>
                      <SelectItem value="Other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="priority">Priority</Label>
                  <Select value={priority} onValueChange={(v) => setPriority(v as ReportPriority)}>
                    <SelectTrigger className="h-11">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="low">Low - Can wait</SelectItem>
                      <SelectItem value="medium">Medium - Needs attention</SelectItem>
                      <SelectItem value="high">High - Urgent</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Location */}
              <div className="space-y-2">
                <Label htmlFor="location">Location *</Label>
                <Input
                  id="location"
                  placeholder="e.g., Block A, Room 201"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  required
                  className="h-11"
                />
              </div>

              {/* Description */}
              <div className="space-y-2">
                <Label htmlFor="description">Description *</Label>
                <Textarea
                  id="description"
                  placeholder="Provide details about the issue. Include when it started, what you've tried, and any other relevant information."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  required
                  rows={5}
                />
              </div>

              {/* Attachments (placeholder for future) */}
              <div className="space-y-2">
                <Label>Attachments (Optional)</Label>
                <div className="border-2 border-dashed border-border rounded-lg p-8 text-center hover:border-primary/50 transition-colors cursor-pointer">
                  <Upload className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                  <p className="text-sm text-muted-foreground">
                    Drag and drop images or click to upload
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    PNG, JPG, PDF up to 5MB
                  </p>
                </div>
              </div>

              {/* Submit */}
              <div className="flex items-center gap-4 pt-4">
                <Button type="submit" size="lg" disabled={isSubmitting} className="flex-1">
                  {isSubmitting ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Submitting...
                    </>
                  ) : (
                    'Submit Report'
                  )}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  size="lg"
                  onClick={() => navigate(-1)}
                >
                  Cancel
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
