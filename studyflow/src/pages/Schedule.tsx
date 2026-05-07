// ==========================================
// StudyFlow — Schedule (Cronograma) Page
// ==========================================

import { useState, useMemo } from 'react';
import { ChevronLeft, ChevronRight, Plus } from 'lucide-react';
import { useData } from '../contexts/DataContext';
import { Modal } from '../components/ui/Modal';
import { useToast } from '../components/ui/Toast';
import { getWeekDates, getDayName, isToday, getTimeDiffMinutes, formatMinutes } from '../utils';
import './Schedule.css';

export default function Schedule() {
  const { sessions, subjects, addSession, updateSession, deleteSession } = useData();
  const { showToast } = useToast();
  const [weekOffset, setWeekOffset] = useState(0);
  const [showModal, setShowModal] = useState(false);
  const [editSession, setEditSession] = useState<string | null>(null);

  // Form state
  const [formSubject, setFormSubject] = useState('');
  const [formDate, setFormDate] = useState('');
  const [formStart, setFormStart] = useState('09:00');
  const [formEnd, setFormEnd] = useState('10:00');
  const [formNotes, setFormNotes] = useState('');

  const baseDate = useMemo(() => {
    const d = new Date();
    d.setDate(d.getDate() + weekOffset * 7);
    return d;
  }, [weekOffset]);

  const weekDates = useMemo(() => getWeekDates(baseDate), [baseDate]);

  const weekLabel = useMemo(() => {
    const start = new Date(weekDates[0] + 'T00:00:00');
    const end = new Date(weekDates[6] + 'T00:00:00');
    const opts: Intl.DateTimeFormatOptions = { day: '2-digit', month: 'short' };
    return `${start.toLocaleDateString('pt-BR', opts)} — ${end.toLocaleDateString('pt-BR', opts)}, ${end.getFullYear()}`;
  }, [weekDates]);

  const getSessionsForDate = (date: string) =>
    sessions.filter(s => s.date === date).sort((a, b) => a.startTime.localeCompare(b.startTime));

  const getSubject = (id: string) => subjects.find(s => s.id === id);

  // Weekly goals progress
  const weeklyProgress = useMemo(() => {
    return subjects.map(sub => {
      const mins = sessions
        .filter(s => s.subjectId === sub.id && weekDates.includes(s.date) && s.status === 'completed')
        .reduce((sum, s) => sum + (s.actualMinutes || 0), 0);
      const goalMins = sub.weeklyGoalHours * 60;
      return { subject: sub, minutes: mins, goal: goalMins, pct: goalMins > 0 ? Math.min(100, Math.round((mins / goalMins) * 100)) : 0 };
    });
  }, [subjects, sessions, weekDates]);

  const openNewSession = (date?: string) => {
    setEditSession(null);
    setFormSubject(subjects[0]?.id || '');
    setFormDate(date || new Date().toISOString().split('T')[0]);
    setFormStart('09:00');
    setFormEnd('10:00');
    setFormNotes('');
    setShowModal(true);
  };

  const openEditSession = (id: string) => {
    const s = sessions.find(x => x.id === id);
    if (!s) return;
    setEditSession(id);
    setFormSubject(s.subjectId);
    setFormDate(s.date);
    setFormStart(s.startTime);
    setFormEnd(s.endTime);
    setFormNotes(s.notes || '');
    setShowModal(true);
  };

  const handleSave = () => {
    if (!formSubject || !formDate || !formStart || !formEnd) return;
    if (editSession) {
      updateSession(editSession, {
        subjectId: formSubject, date: formDate,
        startTime: formStart, endTime: formEnd, notes: formNotes,
      });
      showToast('Sessão atualizada!');
    } else {
      addSession({
        subjectId: formSubject, date: formDate,
        startTime: formStart, endTime: formEnd,
        status: 'scheduled', notes: formNotes,
      });
      showToast('Sessão criada!');
    }
    setShowModal(false);
  };

  const handleComplete = (id: string) => {
    const s = sessions.find(x => x.id === id);
    if (!s) return;
    const mins = getTimeDiffMinutes(s.startTime, s.endTime);
    updateSession(id, { status: 'completed', actualMinutes: mins });
    showToast('Sessão concluída! 🎉');
  };

  const handleDelete = (id: string) => {
    deleteSession(id);
    setShowModal(false);
    showToast('Sessão removida', 'info');
  };

  return (
    <div>
      <div className="sf-page-header">
        <div>
          <h1 className="sf-page-title">📅 Cronograma</h1>
          <p className="sf-page-subtitle">Organize suas sessões de estudo</p>
        </div>
        <button className="sf-btn sf-btn--primary" onClick={() => openNewSession()}>
          <Plus size={18} /> Nova Sessão
        </button>
      </div>

      {/* Week Navigation */}
      <div className="sched-controls">
        <div className="sched-nav">
          <button className="sched-nav-btn" onClick={() => setWeekOffset(w => w - 1)}>
            <ChevronLeft size={18} />
          </button>
          <button className="sf-btn sf-btn--ghost sf-btn--sm" onClick={() => setWeekOffset(0)}>Hoje</button>
          <button className="sched-nav-btn" onClick={() => setWeekOffset(w => w + 1)}>
            <ChevronRight size={18} />
          </button>
        </div>
        <span className="sched-period">{weekLabel}</span>
      </div>

      {/* Weekly Grid */}
      <div className="sched-week">
        {weekDates.map((date, i) => {
          const daySessions = getSessionsForDate(date);
          const d = new Date(date + 'T00:00:00');
          return (
            <div
              key={date}
              className={`sched-day ${isToday(date) ? 'sched-day--today' : ''}`}
              style={{ animationDelay: `${i * 50}ms` }}
            >
              <div className="sched-day-header">
                <div className="sched-day-name">{getDayName(date, true)}</div>
                <div className="sched-day-number">{d.getDate()}</div>
              </div>

              {daySessions.map(session => {
                const sub = getSubject(session.subjectId);
                return (
                  <div
                    key={session.id}
                    className={`sched-session ${session.status === 'completed' ? 'sched-session--completed' : ''}`}
                    style={{
                      background: `${sub?.color}15`,
                      borderLeftColor: sub?.color || '#7c3aed',
                    }}
                    onClick={() => openEditSession(session.id)}
                  >
                    <div className="sched-session-name">{sub?.name}</div>
                    <div className="sched-session-time">{session.startTime} - {session.endTime}</div>
                    {session.status === 'scheduled' && (
                      <button
                        className="sf-btn sf-btn--ghost sf-btn--sm"
                        style={{ padding: '2px 6px', fontSize: '10px', marginTop: '4px' }}
                        onClick={(e) => { e.stopPropagation(); handleComplete(session.id); }}
                      >
                        ✓ Concluir
                      </button>
                    )}
                  </div>
                );
              })}

              <button
                className="sf-btn sf-btn--ghost sf-btn--sm"
                style={{ width: '100%', marginTop: 'var(--space-2)', opacity: 0.5 }}
                onClick={() => openNewSession(date)}
              >
                <Plus size={14} />
              </button>
            </div>
          );
        })}
      </div>

      {/* Weekly Goals */}
      <div className="sched-goals">
        <div className="sched-goals-title">🎯 Metas Semanais por Matéria</div>
        <div className="sched-goals-grid">
          {weeklyProgress.map(wp => (
            <div key={wp.subject.id} className="sched-goal-card">
              <div className="sched-goal-header">
                <div className="sf-color-dot" style={{ background: wp.subject.color }} />
                <span className="sched-goal-name">{wp.subject.name}</span>
                <span className="sched-goal-pct">{wp.pct}%</span>
              </div>
              <div className="sf-progress">
                <div className="sf-progress-bar" style={{ width: `${wp.pct}%`, background: wp.subject.color }} />
              </div>
              <div style={{ fontSize: 'var(--font-size-xs)', color: 'var(--text-tertiary)', marginTop: 'var(--space-2)' }}>
                {formatMinutes(wp.minutes)} / {wp.subject.weeklyGoalHours}h
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Session Modal */}
      <Modal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        title={editSession ? 'Editar Sessão' : 'Nova Sessão de Estudo'}
        actions={
          <>
            {editSession && (
              <button className="sf-btn sf-btn--danger sf-btn--sm" onClick={() => handleDelete(editSession)}>
                Excluir
              </button>
            )}
            <button className="sf-btn sf-btn--secondary" onClick={() => setShowModal(false)}>Cancelar</button>
            <button className="sf-btn sf-btn--primary" onClick={handleSave}>Salvar</button>
          </>
        }
      >
        <div className="sf-input-wrapper">
          <label className="sf-input-label">Matéria</label>
          <select className="sf-select" value={formSubject} onChange={e => setFormSubject(e.target.value)}>
            {subjects.map(s => (
              <option key={s.id} value={s.id}>{s.name}</option>
            ))}
          </select>
        </div>
        <div className="sf-input-wrapper">
          <label className="sf-input-label">Data</label>
          <input type="date" className="sf-select" value={formDate} onChange={e => setFormDate(e.target.value)} />
        </div>
        <div className="sched-form-row">
          <div className="sf-input-wrapper">
            <label className="sf-input-label">Início</label>
            <input type="time" className="sf-select" value={formStart} onChange={e => setFormStart(e.target.value)} />
          </div>
          <div className="sf-input-wrapper">
            <label className="sf-input-label">Fim</label>
            <input type="time" className="sf-select" value={formEnd} onChange={e => setFormEnd(e.target.value)} />
          </div>
        </div>
        <div className="sf-input-wrapper">
          <label className="sf-input-label">Observações</label>
          <textarea className="sf-textarea" value={formNotes} onChange={e => setFormNotes(e.target.value)} placeholder="Opcional..." />
        </div>
      </Modal>
    </div>
  );
}
