// ==========================================
// StudyFlow — Utility Functions
// ==========================================

/**
 * Get greeting based on current hour
 */
export function getGreeting(): string {
  const hour = new Date().getHours();
  if (hour < 12) return 'Bom dia';
  if (hour < 18) return 'Boa tarde';
  return 'Boa noite';
}

/**
 * Format date to locale string
 */
export function formatDate(dateStr: string): string {
  const date = new Date(dateStr + 'T00:00:00');
  return date.toLocaleDateString('pt-BR', { day: '2-digit', month: 'short', year: 'numeric' });
}

/**
 * Format date to short form
 */
export function formatDateShort(dateStr: string): string {
  const date = new Date(dateStr + 'T00:00:00');
  return date.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' });
}

/**
 * Get day name
 */
export function getDayName(dateStr: string, short = false): string {
  const date = new Date(dateStr + 'T00:00:00');
  return date.toLocaleDateString('pt-BR', { weekday: short ? 'short' : 'long' });
}

/**
 * Format minutes to hours and minutes display
 */
export function formatMinutes(minutes: number): string {
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  if (h === 0) return `${m}min`;
  if (m === 0) return `${h}h`;
  return `${h}h ${m}min`;
}

/**
 * Check if a date is today
 */
export function isToday(dateStr: string): boolean {
  return dateStr === new Date().toISOString().split('T')[0];
}

/**
 * Check if a date is in the past
 */
export function isPast(dateStr: string): boolean {
  return dateStr < new Date().toISOString().split('T')[0];
}

/**
 * Check if a date is in the current week
 */
export function isThisWeek(dateStr: string): boolean {
  const date = new Date(dateStr + 'T00:00:00');
  const today = new Date();
  const startOfWeek = new Date(today);
  startOfWeek.setDate(today.getDate() - today.getDay());
  startOfWeek.setHours(0, 0, 0, 0);
  const endOfWeek = new Date(startOfWeek);
  endOfWeek.setDate(startOfWeek.getDate() + 7);
  return date >= startOfWeek && date < endOfWeek;
}

/**
 * Get start of week (Sunday)
 */
export function getStartOfWeek(date: Date = new Date()): Date {
  const d = new Date(date);
  d.setDate(d.getDate() - d.getDay());
  d.setHours(0, 0, 0, 0);
  return d;
}

/**
 * Get dates of current week
 */
export function getWeekDates(baseDate: Date = new Date()): string[] {
  const start = getStartOfWeek(baseDate);
  return Array.from({ length: 7 }, (_, i) => {
    const d = new Date(start);
    d.setDate(start.getDate() + i);
    return d.toISOString().split('T')[0];
  });
}

/**
 * Calculate time difference in minutes
 */
export function getTimeDiffMinutes(start: string, end: string): number {
  const [sh, sm] = start.split(':').map(Number);
  const [eh, em] = end.split(':').map(Number);
  return (eh * 60 + em) - (sh * 60 + sm);
}

/**
 * Get relative time (e.g., "2 dias atrás")
 */
export function relativeTime(dateStr: string): string {
  const date = new Date(dateStr + 'T00:00:00');
  const now = new Date();
  now.setHours(0, 0, 0, 0);
  const diff = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));
  if (diff === 0) return 'Hoje';
  if (diff === 1) return 'Ontem';
  if (diff < 7) return `${diff} dias atrás`;
  if (diff < 30) return `${Math.floor(diff / 7)} sem. atrás`;
  return formatDate(dateStr);
}

/**
 * Get days between dates
 */
export function daysBetween(d1: string, d2: string): number {
  const date1 = new Date(d1 + 'T00:00:00');
  const date2 = new Date(d2 + 'T00:00:00');
  return Math.ceil((date2.getTime() - date1.getTime()) / (1000 * 60 * 60 * 24));
}

/**
 * Clamp value between min and max
 */
export function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}

/**
 * Generate a random color from a list of nice colors
 */
export const SUBJECT_COLORS = [
  '#7c3aed', '#3b82f6', '#10b981', '#f59e0b', '#ef4444',
  '#ec4899', '#8b5cf6', '#06b6d4', '#84cc16', '#f97316',
  '#6366f1', '#14b8a6', '#e11d48', '#0ea5e9', '#a855f7',
];

export const SUBJECT_ICONS = [
  'BookOpen', 'Calculator', 'Code', 'Globe', 'Landmark',
  'Beaker', 'Music', 'Palette', 'Microscope', 'Scale',
  'Brain', 'Lightbulb', 'GraduationCap', 'PenTool', 'Atom',
];
