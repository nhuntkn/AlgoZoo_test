import type { Role } from './auth'

export interface AdminClass {
  id: string
  name: string
  description: string
  isActive: boolean
}

export interface AdminUser {
  id: string
  name: string
  email: string
  role: Role
  isActive: boolean
}

export interface AdminClassDetail extends AdminClass {
  trainers: Array<{ id: string; name: string; email: string; isActive: boolean; joinedAt: string }>
  students: Array<{ id: string; name: string; email: string; isActive: boolean; joinedAt: string }>
}

export interface AdminDashboard {
  filter: DashboardFilter;
  classes: DashboardStats;
  students: DashboardStats;
  classProgress: ClassProgress[];
  studentsProgress: StudentProgress[];
  subjectOverview: SubjectOverview[];
}

export interface DashboardFilter {
  class_id: string;
}

export interface DashboardStats {
  total: number;
  active: number;
  inactive: number;
}

export interface ClassProgress {
  problemCount: number;
  studentCount: number;
  submissionCount: number;
  class_id: string;
  name: string;
  isActive: boolean;
  progressPercent: number;
}

export interface StudentProgress {
  student_id: string;
  fullname: string;
  email: string;
  class_id: string;
  className: string;
  submissionCount: number;
  problemCount: number;
  progressPercent: number;
}

export interface SubjectOverview {
  submissionCount: number;
  problemType: string;
  progressPercent: number;
}