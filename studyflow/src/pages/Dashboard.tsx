// ==========================================
// StudyFlow — Dashboard Page
// ==========================================

import { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Calendar, CheckSquare, Clock, Plus, FileText, Timer } from 'lucide-react';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS, CategoryScale, LinearScale, BarElement, Tooltip, Legend,
} from 'chart.js';
import { useData } from '../contexts/DataContext';
import { useTheme } from '../contexts/ThemeContext';
import { formatMinutes, getWeekDates, getDayName, isToday, isPast } from '../utils';
import './Dashboard.css';

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend);

export default function Dashboard() {
  const { sessions, tasks, subjects, user } = useData();
  const { theme } = useTheme();
  const navigate = useNavigate();

  // Today's sessions
  const todaySessions = useMemo(() => {
    const today = new Date().toISOString().split('T')[0];
    return sessions.filter(s => s.date === today);
  }, [sessions]);

  // Pending tasks
  const pendingTasks = useMemo(() => {
    return tasks
      .filter(t => t.status === 'pending')
      .sort((a, b) => a.deadline.localeCompare(b.deadline))
      .slice(0, 5);
  }, [tasks]);

  // Stats
  const stats = useMemo(() => {
    const today = new Date().toISOString().split('T')[0];
    const completedToday = sessions.filter(s => s.date === today && s.status === 'completed');
    const minutesToday = completedToday.reduce((sum, s) => sum + (s.actualMinutes || 0), 0);
    const totalPending = tasks.filter(t => t.status === 'pending').length;
    const scheduledToday = sessions.filter(s => s.date === today && s.status === 'scheduled').length;

    return {
      minutesToday,
      pendingTasks: totalPending,
      sessionsToday: scheduledToday,
      streak: user?.streak || 0
    };
  }, [sessions, tasks, user]);

  // Weekly chart data
  const chartData = useMemo(() => {
    const weekDates = getWeekDates();
    const hours = weekDates.map(date => {
      const dayMins = sessions
        .filter(s => s.date === date && s.status === 'completed')
        .reduce((sum, s) => sum + (s.actualMinutes || 0), 0);
      return +(dayMins / 60).toFixed(1);
    });
    const labels = weekDates.map(d => getDayName(d, true).replace('.', ''));

    const textColor = theme === 'dark' ? '#94a3b8' : '#64748b';

    return {
      data: {
        labels,
        datasets: [{
          label: 'Horas estudadas',
          data: hours,
          backgroundColor: hours.map((_, i) => {
            const dateStr = weekDates[i];
            if (isToday(dateStr)) return '#7c3aed';
            if (isPast(dateStr)) return 'rgba(124, 58, 237, 0.4)';
            return 'rgba(124, 58, 237, 0.15)';
          }),
          borderRadius: 8,
          borderSkipped: false,
        }],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: false },
          tooltip: {
            backgroundColor: theme === 'dark' ? '#1c1c30' : '#ffffff',
            titleColor: theme === 'dark' ? '#f1f5f9' : '#0f172a',
            bodyColor: theme === 'dark' ? '#94a3b8' : '#475569',
            borderColor: theme === 'dark' ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)',
            borderWidth: 1,
            cornerRadius: 8,
            padding: 12,
            callbacks: {
              label: (ctx: { parsed: { y: number } }) => `${ctx.parsed.y}h estudadas`,
            },
          },
        },
        scales: {
          x: {
            grid: { display: false },
            ticks: { color: textColor, font: { family: 'Inter' } },
          },
          y: {
            grid: { color: theme === 'dark' ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)' },
            ticks: {
              color: textColor,
              font: { family: 'Inter' },
              callback: (v: string | number) => `${v}h`,
            },
          },
        },
      },
    };
  }, [sessions, theme]);

  const getSubject = (id: string) => subjects.find(s => s.id === id);

  return (
    <div>
      {/* Summary Cards */}
      <div className="dash-summary">
        <div className="dash-stat-card stagger-1" style={{ animationDelay: '0ms' }}>
          <div className="dash-stat-icon" style={{ background: 'var(--accent-primary-light)' }}>
            <Clock size={24} color="var(--accent-primary)" />
          </div>
          <div className="dash-stat-info">
            <div className="dash-stat-value">{formatMinutes(stats.minutesToday)}</div>
            <div className="dash-stat-label">Estudado hoje</div>
          </div>
        </div>

        <div className="dash-stat-card stagger-2" style={{ animationDelay: '80ms' }}>
          <div className="dash-stat-icon" style={{ background: 'var(--info-light)' }}>
            <Calendar size={24} color="var(--info)" />
          </div>
          <div className="dash-stat-info">
            <div className="dash-stat-value">{stats.sessionsToday}</div>
            <div className="dash-stat-label">Sessões agendadas</div>
          </div>
        </div>

        <div className="dash-stat-card stagger-3" style={{ animationDelay: '160ms' }}>
          <div className="dash-stat-icon" style={{ background: 'var(--warning-light)' }}>
            <CheckSquare size={24} color="var(--warning)" />
          </div>
          <div className="dash-stat-info">
            <div className="dash-stat-value">{stats.pendingTasks}</div>
            <div className="dash-stat-label">Tarefas pendentes</div>
          </div>
        </div>

        <div className="dash-stat-card dash-streak-card stagger-4" style={{ animationDelay: '240ms' }}>
          <div className="dash-streak-icon">🔥</div>
          <div className="dash-stat-info">
            <div className="dash-stat-value">{stats.streak} dias</div>
            <div className="dash-stat-label">Sequência de estudos</div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="dash-quick-actions">
        <button className="dash-quick-btn" onClick={() => navigate('/cronograma')}>
          <Plus size={16} /> Nova Sessão
        </button>
        <button className="dash-quick-btn" onClick={() => navigate('/tarefas')}>
          <CheckSquare size={16} /> Nova Tarefa
        </button>
        <button className="dash-quick-btn" onClick={() => navigate('/anotacoes')}>
          <FileText size={16} /> Nova Nota
        </button>
        <button className="dash-quick-btn" onClick={() => navigate('/foco')}>
          <Timer size={16} /> Iniciar Foco
        </button>
      </div>

      {/* Bottom Section */}
      <div className="dash-bottom">
        {/* Weekly Chart */}
        <div className="dash-chart">
          <div className="dash-chart-title">📊 Horas Estudadas na Semana</div>
          <div style={{ height: 250 }}>
            <Bar data={chartData.data} options={chartData.options as never} />
          </div>
        </div>

        {/* Today Overview */}
        <div className="dash-today">
          <div className="dash-today-title">📅 Hoje</div>
          <div className="dash-today-list">
            {todaySessions.length === 0 && (
              <p style={{ color: 'var(--text-tertiary)', fontSize: 'var(--font-size-sm)' }}>
                Nenhuma sessão agendada para hoje
              </p>
            )}
            {todaySessions.map(session => {
              const sub = getSubject(session.subjectId);
              return (
                <div key={session.id} className="dash-today-item">
                  <div className="dash-today-color" style={{ background: sub?.color || '#7c3aed' }} />
                  <div className="dash-today-info">
                    <div className="dash-today-subject">{sub?.name || 'Matéria'}</div>
                    <div className="dash-today-time">{session.startTime} - {session.endTime}</div>
                  </div>
                  <span
                    className="dash-today-status"
                    style={{
                      background: session.status === 'completed' ? 'var(--success-light)' : 'var(--accent-primary-light)',
                      color: session.status === 'completed' ? 'var(--success)' : 'var(--accent-primary)',
                    }}
                  >
                    {session.status === 'completed' ? 'Concluída' : 'Agendada'}
                  </span>
                </div>
              );
            })}
          </div>

          {/* Pending Tasks Preview */}
          {pendingTasks.length > 0 && (
            <div className="dash-pending">
              <div className="dash-today-title" style={{ marginTop: 'var(--space-6)' }}>📋 Tarefas Pendentes</div>
              {pendingTasks.map(task => {
                const sub = getSubject(task.subjectId);
                return (
                  <div key={task.id} className="dash-task-item">
                    <div className="sf-color-dot" style={{ background: sub?.color }} />
                    <span className="dash-task-title">{task.title}</span>
                    <span className={`sf-badge sf-badge--${task.priority}`}>{task.priority === 'high' ? 'Alta' : task.priority === 'medium' ? 'Média' : 'Baixa'}</span>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
