import React, { createContext, useContext, useState, ReactNode } from 'react';
import { Report, Comment, ReportStatus, ReportCategory, ReportPriority, DashboardStats } from '@/types';

interface ReportsContextType {
  reports: Report[];
  comments: Record<string, Comment[]>;
  addReport: (report: Omit<Report, 'id' | 'createdAt' | 'updatedAt' | 'status'>) => Report;
  updateReportStatus: (reportId: string, status: ReportStatus, adminId: string) => void;
  assignReport: (reportId: string, assignedTo: string, assignedToName: string) => void;
  addComment: (reportId: string, comment: Omit<Comment, 'id' | 'createdAt'>) => void;
  getReportsByUser: (userId: string) => Report[];
  getStats: () => DashboardStats;
}

const ReportsContext = createContext<ReportsContextType | undefined>(undefined);

// Mock initial data
const initialReports: Report[] = [
  {
    id: '1',
    reporterId: '1',
    reporterName: 'John Student',
    title: 'WiFi not working in Block A',
    description: 'The WiFi connection in Block A, Room 201 has been down for 3 days. Unable to access online resources for assignments.',
    category: 'IT',
    location: 'Block A, Room 201',
    priority: 'high',
    status: 'in_progress',
    assignedTo: '2',
    assignedToName: 'Admin User',
    attachments: [],
    createdAt: new Date('2024-11-20'),
    updatedAt: new Date('2024-11-22'),
  },
  {
    id: '2',
    reporterId: '1',
    reporterName: 'John Student',
    title: 'Broken chair in Library',
    description: 'There is a broken chair in the library study area near the computer section. It is a safety hazard.',
    category: 'Library',
    location: 'Central Library, Study Area',
    priority: 'medium',
    status: 'new',
    attachments: [],
    createdAt: new Date('2024-11-24'),
    updatedAt: new Date('2024-11-24'),
  },
  {
    id: '3',
    reporterId: '1',
    reporterName: 'John Student',
    title: 'Water leakage in hostel bathroom',
    description: 'There is continuous water leakage from the tap in the common bathroom. Wasting a lot of water.',
    category: 'Hostel',
    location: 'Boys Hostel, Block 2, Floor 3',
    priority: 'high',
    status: 'resolved',
    assignedTo: '2',
    assignedToName: 'Admin User',
    attachments: [],
    createdAt: new Date('2024-11-15'),
    updatedAt: new Date('2024-11-18'),
    resolvedAt: new Date('2024-11-18'),
  },
  {
    id: '4',
    reporterId: '1',
    reporterName: 'John Student',
    title: 'Projector malfunction in Lecture Hall 5',
    description: 'The projector in Lecture Hall 5 is showing distorted colors and occasionally shuts down during presentations.',
    category: 'Academics',
    location: 'Lecture Hall 5, Main Building',
    priority: 'medium',
    status: 'pending_student',
    assignedTo: '2',
    assignedToName: 'Admin User',
    attachments: [],
    createdAt: new Date('2024-11-22'),
    updatedAt: new Date('2024-11-23'),
  },
];

const initialComments: Record<string, Comment[]> = {
  '1': [
    {
      id: 'c1',
      reportId: '1',
      authorId: '2',
      authorName: 'Admin User',
      authorRole: 'admin',
      content: 'We have assigned a technician to look into this issue. Expected resolution within 24 hours.',
      attachments: [],
      createdAt: new Date('2024-11-21'),
    },
    {
      id: 'c2',
      reportId: '1',
      authorId: '1',
      authorName: 'John Student',
      authorRole: 'student',
      content: 'Thank you for the quick response!',
      attachments: [],
      createdAt: new Date('2024-11-21'),
    },
  ],
  '3': [
    {
      id: 'c3',
      reportId: '3',
      authorId: '2',
      authorName: 'Admin User',
      authorRole: 'admin',
      content: 'The plumber has fixed the leakage. Please confirm if the issue is resolved.',
      attachments: [],
      createdAt: new Date('2024-11-18'),
    },
  ],
};

export function ReportsProvider({ children }: { children: ReactNode }) {
  const [reports, setReports] = useState<Report[]>(initialReports);
  const [comments, setComments] = useState<Record<string, Comment[]>>(initialComments);

  const addReport = (reportData: Omit<Report, 'id' | 'createdAt' | 'updatedAt' | 'status'>): Report => {
    const newReport: Report = {
      ...reportData,
      id: String(reports.length + 1),
      status: 'new',
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    setReports(prev => [newReport, ...prev]);
    return newReport;
  };

  const updateReportStatus = (reportId: string, status: ReportStatus, adminId: string) => {
    setReports(prev => prev.map(report => {
      if (report.id === reportId) {
        return {
          ...report,
          status,
          updatedAt: new Date(),
          resolvedAt: status === 'resolved' ? new Date() : report.resolvedAt,
        };
      }
      return report;
    }));
  };

  const assignReport = (reportId: string, assignedTo: string, assignedToName: string) => {
    setReports(prev => prev.map(report => {
      if (report.id === reportId) {
        return {
          ...report,
          assignedTo,
          assignedToName,
          updatedAt: new Date(),
        };
      }
      return report;
    }));
  };

  const addComment = (reportId: string, commentData: Omit<Comment, 'id' | 'createdAt'>) => {
    const newComment: Comment = {
      ...commentData,
      id: `c${Date.now()}`,
      createdAt: new Date(),
    };
    setComments(prev => ({
      ...prev,
      [reportId]: [...(prev[reportId] || []), newComment],
    }));
    
    // Update report's updatedAt
    setReports(prev => prev.map(report => 
      report.id === reportId ? { ...report, updatedAt: new Date() } : report
    ));
  };

  const getReportsByUser = (userId: string): Report[] => {
    return reports.filter(report => report.reporterId === userId);
  };

  const getStats = (): DashboardStats => {
    const total = reports.length;
    const newCount = reports.filter(r => r.status === 'new').length;
    const inProgress = reports.filter(r => r.status === 'in_progress' || r.status === 'pending_student').length;
    const resolved = reports.filter(r => r.status === 'resolved').length;
    const closed = reports.filter(r => r.status === 'closed').length;

    const resolvedReports = reports.filter(r => r.resolvedAt);
    const avgResolutionDays = resolvedReports.length > 0
      ? resolvedReports.reduce((sum, r) => {
          const days = (r.resolvedAt!.getTime() - r.createdAt.getTime()) / (1000 * 60 * 60 * 24);
          return sum + days;
        }, 0) / resolvedReports.length
      : 0;

    return { total, new: newCount, inProgress, resolved, closed, avgResolutionDays };
  };

  return (
    <ReportsContext.Provider value={{
      reports,
      comments,
      addReport,
      updateReportStatus,
      assignReport,
      addComment,
      getReportsByUser,
      getStats,
    }}>
      {children}
    </ReportsContext.Provider>
  );
}

export function useReports() {
  const context = useContext(ReportsContext);
  if (context === undefined) {
    throw new Error('useReports must be used within a ReportsProvider');
  }
  return context;
}
