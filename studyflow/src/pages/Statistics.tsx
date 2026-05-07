// ==========================================
// StudyFlow — Statistics Page
// ==========================================

import { useState, useMemo } from 'react';
import { Bar, Doughnut } from 'react-chartjs-2';
import {
  Chart as ChartJS, CategoryScale, LinearScale, BarElement,
  ArcElement, Tooltip, Legend,
} from 'chart.js';
import { useData } from '../contexts/DataContext';
import { useTheme } from '../contexts/ThemeContext';
import { formatMinutes, getDayName } from '../utils';
import type { StatsPeriod } from '../types';
import './Statistics.css';

ChartJS.register(CategoryScale, LinearScale, BarElement, ArcElement, Tooltip, Legend);

export default function Statistics() {
  const { sessions, tasks, subjects, user } = useData();
  const { theme } = useTheme();
  const [period, setPeriod] = useState<StatsPeriod>('7d');

  const textColor = theme === 'dark' ? '#94a3b8' : '#475569';

  // Get date range based on period
  const dateRange = useMemo(() => {
    const end = new Date();
    const start = new Date();
    if (period === '7d') start.setDate(end.getDate() - 6);
    else if (period === '30d') start.setDate(end.getDate() - 29);
    else start.setFullYear(start.getFullYear() - 1);

    const dates: string[] = [];
    const cur = new Date(start);
    while (cur <= end) {
      dates.push(cur.toISOString().split('T')[0]);
      cur.setDate(cur.getDate() + 1);
    }
    return dates;
  }, [period]);

  // Overview stats
  const overview = useMemo(() => {
    const completedSessions = sessions.filter(s =>
      dateRange.includes(s.date) && s.status === 'completed'
    );
    const totalMinutes = completedSessions.reduce((sum, s) => sum + (s.actualMinutes || 0), 0);
    const totalSessions = completedSessions.length;
    const completedTasks = tasks.filter(t => t.status === 'completed').length;
    const totalTasks = tasks.length;
    const completionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

    return { totalMinutes, totalSessions, completionRate, totalTasks, completedTasks };
  }, [sessions, tasks, dateRange]);

  // Hours per day chart
  const barChartData = useMemo(() => {
    const displayDates = period === '7d' ? dateRange : dateRange.filter((_, i) => i % (period === '30d' ? 1 : 7) === 0);
    const hours = displayDates.map(date => {
      const dayMins = sessions
        .filter(s => s.date === date && s.status === 'completed')
        .reduce((sum, s) => sum + (s.actualMinutes || 0), 0);
      return +(dayMins / 60).toFixed(1);
    });
    const labels = displayDates.map(d => {
      if (period === '7d') return getDayName(d, true).replace('.', '');
      const date = new Date(d + 'T00:00:00');
      return `${date.getDate()}/${date.getMonth() + 1}`;
    });

    return {
      labels,
      datasets: [{
        label: 'Horas estudadas',
        data: hours,
        backgroundColor: '#7c3aed',
        borderRadius: 6,
        borderSkipped: false,
      }],
    };
  }, [sessions, dateRange, period]);

  // Subject distribution (doughnut)
  const doughnutData = useMemo(() => {
    const mins: Record<string, number> = {};
    sessions
      .filter(s => dateRange.includes(s.date) && s.status === 'completed')
      .forEach(s => { mins[s.subjectId] = (mins[s.subjectId] || 0) + (s.actualMinutes || 0); });

    const activeSubjects = subjects.filter(s => (mins[s.id] || 0) > 0);
    return {
      labels: activeSubjects.map(s => s.name),
      datasets: [{
        data: activeSubjects.map(s => mins[s.id] || 0),
        backgroundColor: activeSubjects.map(s => s.color),
        borderColor: theme === 'dark' ? '#12121f' : '#ffffff',
        borderWidth: 3,
      }],
    };
  }, [sessions, subjects, dateRange, theme]);

  // Planned vs Actual
  const plannedVsActual = useMemo(() => {
    return subjects.map(sub => {
      const planned = sessions
        .filter(s => s.subjectId === sub.id && dateRange.includes(s.date))
        .reduce((sum, s) => {
          const [sh, sm] = s.startTime.split(':').map(Number);
          const [eh, em] = s.endTime.split(':').map(Number);
          return sum + (eh * 60 + em) - (sh * 60 + sm);
        }, 0);
      const actual = sessions
        .filter(s => s.subjectId === sub.id && dateRange.includes(s.date) && s.status === 'completed')
        .reduce((sum, s) => sum + (s.actualMinutes || 0), 0);
      return { subject: sub, planned, actual, diff: actual - planned };
    }).filter(x => x.planned > 0 || x.actual > 0);
  }, [subjects, sessions, dateRange]);

  // Completion rate SVG circle
  const circleRadius = 54;
  const circleCircumference = 2 * Math.PI * circleRadius;
  const circleDashoffset = circleCircumference - (overview.completionRate / 100) * circleCircumference;

  return (
    <div>
      <div className="sf-page-header">
        <div>
          <h1 className="sf-page-title">📊 Estatísticas</h1>
          <p className="sf-page-subtitle">Acompanhe seu desempenho e evolução</p>
        </div>
        <div className="sf-tabs stats-period">
          {(['7d', '30d', 'all'] as const).map(p => (
            <button key={p} className={`sf-tab ${period === p ? 'sf-tab--active' : ''}`} onClick={() => setPeriod(p)}>
              {p === '7d' ? '7 dias' : p === '30d' ? '30 dias' : 'Tudo'}
            </button>
          ))}
        </div>
      </div>

      {/* Overview */}
      <div className="stats-overview">
        <div className="stats-card" style={{ animationDelay: '0ms' }}>
          <div className="stats-card-value" style={{ color: 'var(--accent-primary)' }}>
            {formatMinutes(overview.totalMinutes)}
          </div>
          <div className="stats-card-label">Total estudado</div>
        </div>
        <div className="stats-card" style={{ animationDelay: '80ms' }}>
          <div className="stats-card-value" style={{ color: 'var(--info)' }}>
            {overview.totalSessions}
          </div>
          <div className="stats-card-label">Sessões concluídas</div>
        </div>
        <div className="stats-card" style={{ animationDelay: '160ms' }}>
          <div className="stats-card-value" style={{ color: 'var(--success)' }}>
            {overview.completedTasks}
          </div>
          <div className="stats-card-label">Tarefas concluídas</div>
        </div>
        <div className="stats-card" style={{ animationDelay: '240ms' }}>
          <div className="stats-card-value" style={{ color: 'var(--warning)' }}>
            {user?.streak || 0} 🔥
          </div>
          <div className="stats-card-label">Dias consecutivos</div>
        </div>
      </div>

      {/* Streak Banner */}
      <div className="stats-streak">
        <div className="stats-streak-icon">🔥</div>
        <div className="stats-streak-value">{user?.streak || 0} dias</div>
        <div className="stats-streak-label">de sequência de estudos — Continue assim!</div>
      </div>

      {/* Charts */}
      <div className="stats-charts">
        <div className="stats-chart-card" style={{ animationDelay: '200ms' }}>
          <div className="stats-chart-title">📈 Horas Estudadas por Dia</div>
          <div style={{ height: 280 }}>
            <Bar
              data={barChartData}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: { legend: { display: false } },
                scales: {
                  x: { grid: { display: false }, ticks: { color: textColor, font: { family: 'Inter' } } },
                  y: {
                    grid: { color: theme === 'dark' ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)' },
                    ticks: { color: textColor, font: { family: 'Inter' }, callback: (v) => `${v}h` },
                  },
                },
              }}
            />
          </div>
        </div>

        <div className="stats-chart-card" style={{ animationDelay: '300ms' }}>
          <div className="stats-chart-title">🎯 Distribuição por Matéria</div>
          <Doughnut
            data={doughnutData}
            options={{
              responsive: true,
              plugins: {
                legend: {
                  position: 'bottom',
                  labels: { color: textColor, font: { family: 'Inter' }, padding: 16 },
                },
                tooltip: {
                  callbacks: {
                    label: (ctx) => ` ${ctx.label}: ${formatMinutes(ctx.parsed)}`,
                  },
                },
              },
              cutout: '65%',
            }}
          />
        </div>
      </div>

      {/* Completion Rate + Planned vs Actual */}
      <div className="stats-charts">
        <div className="stats-chart-card" style={{ animationDelay: '400ms' }}>
          <div className="stats-chart-title">📋 Planejado vs. Realizado</div>
          <table className="stats-table">
            <thead>
              <tr>
                <th>Matéria</th>
                <th>Planejado</th>
                <th>Realizado</th>
                <th>Diferença</th>
              </tr>
            </thead>
            <tbody>
              {plannedVsActual.map(row => (
                <tr key={row.subject.id}>
                  <td>
                    <span style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
                      <span className="sf-color-dot" style={{ background: row.subject.color }} />
                      {row.subject.name}
                    </span>
                  </td>
                  <td>{formatMinutes(row.planned)}</td>
                  <td>{formatMinutes(row.actual)}</td>
                  <td className={row.diff >= 0 ? 'stats-diff--positive' : 'stats-diff--negative'}>
                    {row.diff >= 0 ? '+' : ''}{formatMinutes(Math.abs(row.diff))}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="stats-chart-card" style={{ animationDelay: '500ms' }}>
          <div className="stats-chart-title">✅ Taxa de Conclusão de Tarefas</div>
          <div className="stats-completion">
            <div className="stats-circle-container">
              <svg width="140" height="140" viewBox="0 0 120 120">
                <circle cx="60" cy="60" r={circleRadius} fill="none"
                  stroke={theme === 'dark' ? '#1c1c30' : '#f1f5f9'} strokeWidth="10" />
                <circle cx="60" cy="60" r={circleRadius} fill="none"
                  stroke="#7c3aed" strokeWidth="10"
                  strokeDasharray={circleCircumference} strokeDashoffset={circleDashoffset}
                  strokeLinecap="round"
                  transform="rotate(-90 60 60)"
                  style={{ transition: 'stroke-dashoffset 1s ease' }}
                />
              </svg>
              <div className="stats-circle-text">{overview.completionRate}%</div>
            </div>
            <p style={{ color: 'var(--text-secondary)', fontSize: 'var(--font-size-sm)' }}>
              {overview.completedTasks} de {overview.totalTasks} tarefas concluídas
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
