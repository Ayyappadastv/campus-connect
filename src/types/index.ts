export type UserRole = 'student' | 'admin' | 'superadmin';

export type ReportStatus = 'new' | 'in_progress' | 'pending_student' | 'resolved' | 'closed';

export type ReportCategory = 'IT' | 'Hostel' | 'Library' | 'Academics' | 'Infrastructure' | 'Other';

export type ReportPriority = 'low' | 'medium' | 'high';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  department?: string;
  createdAt: Date;
}

export interface Report {
  id: string;
  reporterId: string;
  reporterName: string;
  title: string;
  description: string;
  category: ReportCategory;
  location: string;
  priority: ReportPriority;
  status: ReportStatus;
  assignedTo?: string;
  assignedToName?: string;
  attachments: Attachment[];
  createdAt: Date;
  updatedAt: Date;
  resolvedAt?: Date;
}

export interface Attachment {
  id: string;
  filename: string;
  url: string;
  mimeType: string;
  size: number;
}

export interface Comment {
  id: string;
  reportId: string;
  authorId: string;
  authorName: string;
  authorRole: UserRole;
  content: string;
  attachments: Attachment[];
  createdAt: Date;
}

export interface DashboardStats {
  total: number;
  new: number;
  inProgress: number;
  resolved: number;
  closed: number;
  avgResolutionDays: number;
}
