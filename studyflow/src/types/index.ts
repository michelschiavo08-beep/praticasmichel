// ==========================================
// StudyFlow — Type Definitions
// ==========================================

export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  timezone: string;
  plan: 'free' | 'premium';
  streak: number;
  lastStudyDate?: string;
  studyProfile: 'concurso' | 'faculdade' | 'idioma' | 'geral';
  createdAt: string;
}

export interface Subject {
  id: string;
  name: string;
  color: string;
  icon: string;
  userId: string;
  weeklyGoalHours: number;
  order: number;
}

export interface StudySession {
  id: string;
  subjectId: string;
  date: string;
  startTime: string;
  endTime: string;
  status: 'scheduled' | 'completed' | 'cancelled';
  notes?: string;
  actualMinutes?: number;
}

export interface Task {
  id: string;
  title: string;
  description?: string;
  subjectId: string;
  deadline: string;
  priority: 'high' | 'medium' | 'low';
  status: 'pending' | 'completed';
  createdAt: string;
  completedAt?: string;
}

export interface Goal {
  id: string;
  title: string;
  subjectId: string;
  deadline: string;
  progress: number;
}

export interface Note {
  id: string;
  title: string;
  content: string;
  subjectId: string;
  folderId?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Folder {
  id: string;
  name: string;
  subjectId: string;
  parentId?: string;
}

export type ThemeMode = 'dark' | 'light';
export type ViewMode = 'week' | 'month';
export type StatsPeriod = '7d' | '30d' | 'all';
