// ==========================================
// StudyFlow — Demo Data
// ==========================================

import { v4 as uuid } from 'uuid';
import type { User, Subject, StudySession, Task, Goal, Note, Folder } from '../types';

const USER_ID = uuid();

const today = new Date();
const fmt = (d: Date) => d.toISOString().split('T')[0];
const daysAgo = (n: number) => {
  const d = new Date(today);
  d.setDate(d.getDate() - n);
  return fmt(d);
};
const daysFromNow = (n: number) => {
  const d = new Date(today);
  d.setDate(d.getDate() + n);
  return fmt(d);
};

// Subjects
const subjects: Subject[] = [
  { id: uuid(), name: 'Matemática', color: '#7c3aed', icon: 'Calculator', userId: USER_ID, weeklyGoalHours: 8, order: 0 },
  { id: uuid(), name: 'Português', color: '#3b82f6', icon: 'BookOpen', userId: USER_ID, weeklyGoalHours: 6, order: 1 },
  { id: uuid(), name: 'Programação', color: '#10b981', icon: 'Code', userId: USER_ID, weeklyGoalHours: 10, order: 2 },
  { id: uuid(), name: 'Inglês', color: '#f59e0b', icon: 'Globe', userId: USER_ID, weeklyGoalHours: 5, order: 3 },
  { id: uuid(), name: 'História', color: '#ef4444', icon: 'Landmark', userId: USER_ID, weeklyGoalHours: 4, order: 4 },
];

// Sessions (last 7 days + upcoming)
const sessions: StudySession[] = [
  // Past sessions (completed)
  { id: uuid(), subjectId: subjects[0].id, date: daysAgo(6), startTime: '09:00', endTime: '10:30', status: 'completed', actualMinutes: 90 },
  { id: uuid(), subjectId: subjects[2].id, date: daysAgo(6), startTime: '14:00', endTime: '16:00', status: 'completed', actualMinutes: 120 },
  { id: uuid(), subjectId: subjects[1].id, date: daysAgo(5), startTime: '10:00', endTime: '11:30', status: 'completed', actualMinutes: 90 },
  { id: uuid(), subjectId: subjects[3].id, date: daysAgo(5), startTime: '15:00', endTime: '16:00', status: 'completed', actualMinutes: 60 },
  { id: uuid(), subjectId: subjects[0].id, date: daysAgo(4), startTime: '08:00', endTime: '10:00', status: 'completed', actualMinutes: 120 },
  { id: uuid(), subjectId: subjects[2].id, date: daysAgo(4), startTime: '13:00', endTime: '15:00', status: 'completed', actualMinutes: 120 },
  { id: uuid(), subjectId: subjects[4].id, date: daysAgo(3), startTime: '09:00', endTime: '10:00', status: 'completed', actualMinutes: 60 },
  { id: uuid(), subjectId: subjects[1].id, date: daysAgo(3), startTime: '14:00', endTime: '15:30', status: 'completed', actualMinutes: 90 },
  { id: uuid(), subjectId: subjects[2].id, date: daysAgo(2), startTime: '10:00', endTime: '12:00', status: 'completed', actualMinutes: 120 },
  { id: uuid(), subjectId: subjects[0].id, date: daysAgo(2), startTime: '14:00', endTime: '15:00', status: 'completed', actualMinutes: 60 },
  { id: uuid(), subjectId: subjects[3].id, date: daysAgo(1), startTime: '09:00', endTime: '10:00', status: 'completed', actualMinutes: 60 },
  { id: uuid(), subjectId: subjects[2].id, date: daysAgo(1), startTime: '14:00', endTime: '16:00', status: 'completed', actualMinutes: 120 },
  // Today
  { id: uuid(), subjectId: subjects[0].id, date: fmt(today), startTime: '09:00', endTime: '10:30', status: 'scheduled' },
  { id: uuid(), subjectId: subjects[1].id, date: fmt(today), startTime: '14:00', endTime: '15:30', status: 'scheduled' },
  // Future
  { id: uuid(), subjectId: subjects[2].id, date: daysFromNow(1), startTime: '10:00', endTime: '12:00', status: 'scheduled' },
  { id: uuid(), subjectId: subjects[4].id, date: daysFromNow(1), startTime: '14:00', endTime: '15:00', status: 'scheduled' },
  { id: uuid(), subjectId: subjects[0].id, date: daysFromNow(2), startTime: '09:00', endTime: '11:00', status: 'scheduled' },
  { id: uuid(), subjectId: subjects[3].id, date: daysFromNow(2), startTime: '15:00', endTime: '16:00', status: 'scheduled' },
  { id: uuid(), subjectId: subjects[1].id, date: daysFromNow(3), startTime: '10:00', endTime: '11:30', status: 'scheduled' },
  { id: uuid(), subjectId: subjects[2].id, date: daysFromNow(3), startTime: '14:00', endTime: '16:00', status: 'scheduled' },
];

// Tasks
const tasks: Task[] = [
  { id: uuid(), title: 'Resolver lista de exercícios cap. 5', subjectId: subjects[0].id, deadline: fmt(today), priority: 'high', status: 'pending', createdAt: daysAgo(3) },
  { id: uuid(), title: 'Ler capítulo 8 do livro', subjectId: subjects[1].id, deadline: daysFromNow(1), priority: 'medium', status: 'pending', createdAt: daysAgo(2) },
  { id: uuid(), title: 'Projeto final — entrega parcial', description: 'Implementar autenticação e dashboard do projeto', subjectId: subjects[2].id, deadline: daysFromNow(3), priority: 'high', status: 'pending', createdAt: daysAgo(5) },
  { id: uuid(), title: 'Revisar vocabulário da unidade 4', subjectId: subjects[3].id, deadline: daysFromNow(2), priority: 'low', status: 'pending', createdAt: daysAgo(1) },
  { id: uuid(), title: 'Resumo da Revolução Francesa', subjectId: subjects[4].id, deadline: daysFromNow(5), priority: 'medium', status: 'pending', createdAt: daysAgo(4) },
  { id: uuid(), title: 'Exercícios de álgebra linear', subjectId: subjects[0].id, deadline: daysAgo(1), priority: 'medium', status: 'completed', createdAt: daysAgo(5), completedAt: daysAgo(1) },
  { id: uuid(), title: 'Redação sobre tecnologia', subjectId: subjects[1].id, deadline: daysAgo(2), priority: 'high', status: 'completed', createdAt: daysAgo(6), completedAt: daysAgo(2) },
  { id: uuid(), title: 'Implementar API REST', subjectId: subjects[2].id, deadline: daysAgo(1), priority: 'high', status: 'completed', createdAt: daysAgo(4), completedAt: daysAgo(1) },
];

// Goals
const goals: Goal[] = [
  { id: uuid(), title: 'Terminar módulo de cálculo até fim do mês', subjectId: subjects[0].id, deadline: daysFromNow(15), progress: 60 },
  { id: uuid(), title: 'Concluir curso de React', subjectId: subjects[2].id, deadline: daysFromNow(20), progress: 75 },
  { id: uuid(), title: 'Atingir nível B2 em inglês', subjectId: subjects[3].id, deadline: daysFromNow(60), progress: 40 },
];

// Folders
const folders: Folder[] = [
  { id: uuid(), name: 'Cálculo', subjectId: subjects[0].id },
  { id: uuid(), name: 'Álgebra', subjectId: subjects[0].id },
  { id: uuid(), name: 'Gramática', subjectId: subjects[1].id },
  { id: uuid(), name: 'React', subjectId: subjects[2].id },
  { id: uuid(), name: 'Node.js', subjectId: subjects[2].id },
];

// Notes
const notes: Note[] = [
  {
    id: uuid(), title: 'Derivadas — Regras básicas', subjectId: subjects[0].id, folderId: folders[0].id,
    content: '<h2>Regras de Derivação</h2><p><strong>Regra da Potência:</strong> d/dx [x^n] = n·x^(n-1)</p><p><strong>Regra do Produto:</strong> d/dx [f·g] = f\'·g + f·g\'</p><p><strong>Regra da Cadeia:</strong> d/dx [f(g(x))] = f\'(g(x))·g\'(x)</p><ul><li>Praticar com exercícios da lista 3</li><li>Revisar aplicações em máximos e mínimos</li></ul>',
    createdAt: daysAgo(10), updatedAt: daysAgo(2),
  },
  {
    id: uuid(), title: 'Hooks do React', subjectId: subjects[2].id, folderId: folders[3].id,
    content: '<h2>React Hooks</h2><p><strong>useState</strong> — estado local do componente</p><p><strong>useEffect</strong> — efeitos colaterais (fetch, listeners)</p><p><strong>useContext</strong> — acessar contexto sem prop drilling</p><p><strong>useReducer</strong> — estado complexo com actions</p><p><strong>useMemo / useCallback</strong> — otimização de performance</p>',
    createdAt: daysAgo(7), updatedAt: daysAgo(1),
  },
  {
    id: uuid(), title: 'Vocabulário — Travel', subjectId: subjects[3].id,
    content: '<h2>Travel Vocabulary</h2><ul><li><strong>Boarding pass</strong> — cartão de embarque</li><li><strong>Layover</strong> — escala</li><li><strong>Customs</strong> — alfândega</li><li><strong>Luggage</strong> — bagagem</li><li><strong>Departure gate</strong> — portão de embarque</li></ul>',
    createdAt: daysAgo(5), updatedAt: daysAgo(3),
  },
  {
    id: uuid(), title: 'Figuras de Linguagem', subjectId: subjects[1].id, folderId: folders[2].id,
    content: '<h2>Figuras de Linguagem</h2><p><strong>Metáfora:</strong> comparação implícita. Ex: "A vida é um palco."</p><p><strong>Metonímia:</strong> substituição por proximidade. Ex: "Li Machado de Assis."</p><p><strong>Hipérbole:</strong> exagero expressivo. Ex: "Morri de rir."</p><p><strong>Ironia:</strong> dizer o contrário do que se pensa.</p>',
    createdAt: daysAgo(8), updatedAt: daysAgo(4),
  },
];

// User
const user: User = {
  id: USER_ID,
  name: 'Estudante',
  email: 'estudante@studyflow.com',
  timezone: 'America/Sao_Paulo',
  plan: 'free',
  streak: 6,
  lastStudyDate: daysAgo(0),
  studyProfile: 'geral',
  createdAt: daysAgo(30),
};

export const demoData = {
  user,
  subjects,
  sessions,
  tasks,
  goals,
  notes,
  folders,
};
