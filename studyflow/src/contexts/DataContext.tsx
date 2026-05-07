// ==========================================
// StudyFlow — Data Context (All app data)
// ==========================================

import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from 'react';
import type { User, Subject, StudySession, Task, Goal, Note, Folder } from '../types';
import { storage, STORAGE_KEYS } from '../services/storage';
import { demoData } from '../services/demoData';
import { v4 as uuid } from 'uuid';

interface DataContextType {
  // User
  user: User | null;
  setUser: (user: User | null) => void;
  updateUser: (updates: Partial<User>) => void;
  login: (email: string, _password: string) => boolean;
  register: (name: string, email: string, _password: string, profile: User['studyProfile']) => void;
  logout: () => void;
  isAuthenticated: boolean;

  // Subjects
  subjects: Subject[];
  addSubject: (subject: Omit<Subject, 'id' | 'userId' | 'order'>) => void;
  updateSubject: (id: string, updates: Partial<Subject>) => void;
  deleteSubject: (id: string) => void;

  // Sessions
  sessions: StudySession[];
  addSession: (session: Omit<StudySession, 'id'>) => void;
  updateSession: (id: string, updates: Partial<StudySession>) => void;
  deleteSession: (id: string) => void;

  // Tasks
  tasks: Task[];
  addTask: (task: Omit<Task, 'id' | 'createdAt'>) => void;
  updateTask: (id: string, updates: Partial<Task>) => void;
  deleteTask: (id: string) => void;
  toggleTask: (id: string) => void;

  // Goals
  goals: Goal[];
  addGoal: (goal: Omit<Goal, 'id'>) => void;
  updateGoal: (id: string, updates: Partial<Goal>) => void;
  deleteGoal: (id: string) => void;

  // Notes
  notes: Note[];
  addNote: (note: Omit<Note, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateNote: (id: string, updates: Partial<Note>) => void;
  deleteNote: (id: string) => void;

  // Folders
  folders: Folder[];
  addFolder: (folder: Omit<Folder, 'id'>) => void;
  deleteFolder: (id: string) => void;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export function DataProvider({ children }: { children: ReactNode }) {
  // Load from storage or demo data
  const loadInitial = useCallback(<T,>(key: string, demo: T): T => {
    const stored = storage.get<T>(key);
    if (stored) return stored;
    return demo;
  }, []);

  const [user, setUserState] = useState<User | null>(() => loadInitial(STORAGE_KEYS.USER, demoData.user));
  const [subjects, setSubjects] = useState<Subject[]>(() => loadInitial(STORAGE_KEYS.SUBJECTS, demoData.subjects));
  const [sessions, setSessions] = useState<StudySession[]>(() => loadInitial(STORAGE_KEYS.SESSIONS, demoData.sessions));
  const [tasks, setTasks] = useState<Task[]>(() => loadInitial(STORAGE_KEYS.TASKS, demoData.tasks));
  const [goals, setGoals] = useState<Goal[]>(() => loadInitial(STORAGE_KEYS.GOALS, demoData.goals));
  const [notes, setNotes] = useState<Note[]>(() => loadInitial(STORAGE_KEYS.NOTES, demoData.notes));
  const [folders, setFolders] = useState<Folder[]>(() => loadInitial(STORAGE_KEYS.FOLDERS, demoData.folders));

  // Persist on change
  useEffect(() => { storage.set(STORAGE_KEYS.USER, user); }, [user]);
  useEffect(() => { storage.set(STORAGE_KEYS.SUBJECTS, subjects); }, [subjects]);
  useEffect(() => { storage.set(STORAGE_KEYS.SESSIONS, sessions); }, [sessions]);
  useEffect(() => { storage.set(STORAGE_KEYS.TASKS, tasks); }, [tasks]);
  useEffect(() => { storage.set(STORAGE_KEYS.GOALS, goals); }, [goals]);
  useEffect(() => { storage.set(STORAGE_KEYS.NOTES, notes); }, [notes]);
  useEffect(() => { storage.set(STORAGE_KEYS.FOLDERS, folders); }, [folders]);

  // User
  const setUser = (u: User | null) => setUserState(u);
  const updateUser = (updates: Partial<User>) => setUserState(prev => prev ? { ...prev, ...updates } : prev);
  const isAuthenticated = !!user;

  const login = (email: string, _password: string): boolean => {
    if (user && user.email === email) return true;
    // Demo: accept any email
    setUserState(prev => prev ? { ...prev, email } : { ...demoData.user, email });
    return true;
  };

  const register = (name: string, email: string, _password: string, profile: User['studyProfile']) => {
    const newUser: User = {
      id: uuid(), name, email, timezone: 'America/Sao_Paulo',
      plan: 'free', streak: 0, studyProfile: profile,
      createdAt: new Date().toISOString().split('T')[0],
    };
    setUserState(newUser);
  };

  const logout = () => {
    storage.clear();
    setUserState(null);
    setSubjects([]);
    setSessions([]);
    setTasks([]);
    setGoals([]);
    setNotes([]);
    setFolders([]);
  };

  // Subjects
  const addSubject = (s: Omit<Subject, 'id' | 'userId' | 'order'>) => {
    const newSubject: Subject = { ...s, id: uuid(), userId: user?.id || '', order: subjects.length };
    setSubjects(prev => [...prev, newSubject]);
  };
  const updateSubject = (id: string, updates: Partial<Subject>) => {
    setSubjects(prev => prev.map(s => s.id === id ? { ...s, ...updates } : s));
  };
  const deleteSubject = (id: string) => {
    setSubjects(prev => prev.filter(s => s.id !== id));
    setSessions(prev => prev.filter(s => s.subjectId !== id));
    setTasks(prev => prev.filter(t => t.subjectId !== id));
    setNotes(prev => prev.filter(n => n.subjectId !== id));
    setGoals(prev => prev.filter(g => g.subjectId !== id));
    setFolders(prev => prev.filter(f => f.subjectId !== id));
  };

  // Sessions
  const addSession = (s: Omit<StudySession, 'id'>) => {
    setSessions(prev => [...prev, { ...s, id: uuid() }]);
  };
  const updateSession = (id: string, updates: Partial<StudySession>) => {
    setSessions(prev => prev.map(s => s.id === id ? { ...s, ...updates } : s));
  };
  const deleteSession = (id: string) => {
    setSessions(prev => prev.filter(s => s.id !== id));
  };

  // Tasks
  const addTask = (t: Omit<Task, 'id' | 'createdAt'>) => {
    setTasks(prev => [...prev, { ...t, id: uuid(), createdAt: new Date().toISOString().split('T')[0] }]);
  };
  const updateTask = (id: string, updates: Partial<Task>) => {
    setTasks(prev => prev.map(t => t.id === id ? { ...t, ...updates } : t));
  };
  const deleteTask = (id: string) => {
    setTasks(prev => prev.filter(t => t.id !== id));
  };
  const toggleTask = (id: string) => {
    setTasks(prev => prev.map(t => {
      if (t.id !== id) return t;
      const isCompleting = t.status === 'pending';
      return {
        ...t,
        status: isCompleting ? 'completed' as const : 'pending' as const,
        completedAt: isCompleting ? new Date().toISOString().split('T')[0] : undefined,
      };
    }));
  };

  // Goals
  const addGoal = (g: Omit<Goal, 'id'>) => {
    setGoals(prev => [...prev, { ...g, id: uuid() }]);
  };
  const updateGoal = (id: string, updates: Partial<Goal>) => {
    setGoals(prev => prev.map(g => g.id === id ? { ...g, ...updates } : g));
  };
  const deleteGoal = (id: string) => {
    setGoals(prev => prev.filter(g => g.id !== id));
  };

  // Notes
  const addNote = (n: Omit<Note, 'id' | 'createdAt' | 'updatedAt'>) => {
    const now = new Date().toISOString();
    setNotes(prev => [...prev, { ...n, id: uuid(), createdAt: now, updatedAt: now }]);
  };
  const updateNote = (id: string, updates: Partial<Note>) => {
    setNotes(prev => prev.map(n => n.id === id ? { ...n, ...updates, updatedAt: new Date().toISOString() } : n));
  };
  const deleteNote = (id: string) => {
    setNotes(prev => prev.filter(n => n.id !== id));
  };

  // Folders
  const addFolder = (f: Omit<Folder, 'id'>) => {
    setFolders(prev => [...prev, { ...f, id: uuid() }]);
  };
  const deleteFolder = (id: string) => {
    setFolders(prev => prev.filter(f => f.id !== id));
    setNotes(prev => prev.map(n => n.folderId === id ? { ...n, folderId: undefined } : n));
  };

  return (
    <DataContext.Provider value={{
      user, setUser, updateUser, login, register, logout, isAuthenticated,
      subjects, addSubject, updateSubject, deleteSubject,
      sessions, addSession, updateSession, deleteSession,
      tasks, addTask, updateTask, deleteTask, toggleTask,
      goals, addGoal, updateGoal, deleteGoal,
      notes, addNote, updateNote, deleteNote,
      folders, addFolder, deleteFolder,
    }}>
      {children}
    </DataContext.Provider>
  );
}

export function useData() {
  const ctx = useContext(DataContext);
  if (!ctx) throw new Error('useData must be used within DataProvider');
  return ctx;
}
