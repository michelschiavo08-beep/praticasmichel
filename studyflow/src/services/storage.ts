// ==========================================
// StudyFlow — LocalStorage Service
// ==========================================

const PREFIX = 'studyflow_';

export const storage = {
  get<T>(key: string): T | null {
    try {
      const item = localStorage.getItem(PREFIX + key);
      return item ? JSON.parse(item) : null;
    } catch {
      return null;
    }
  },

  set<T>(key: string, value: T): void {
    try {
      localStorage.setItem(PREFIX + key, JSON.stringify(value));
    } catch (e) {
      console.error('Error saving to localStorage:', e);
    }
  },

  remove(key: string): void {
    localStorage.removeItem(PREFIX + key);
  },

  clear(): void {
    Object.keys(localStorage)
      .filter(k => k.startsWith(PREFIX))
      .forEach(k => localStorage.removeItem(k));
  },
};

// Keys
export const STORAGE_KEYS = {
  USER: 'user',
  SUBJECTS: 'subjects',
  SESSIONS: 'sessions',
  TASKS: 'tasks',
  GOALS: 'goals',
  NOTES: 'notes',
  FOLDERS: 'folders',
  THEME: 'theme',
  ONBOARDED: 'onboarded',
  DEMO_LOADED: 'demo_loaded',
} as const;
