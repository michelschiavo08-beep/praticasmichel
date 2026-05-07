// ==========================================
// StudyFlow — Focus Timer Page
// ==========================================

import { useState, useEffect, useRef, useCallback } from 'react';
import { Play, Pause, Square, RotateCcw } from 'lucide-react';
import { useData } from '../contexts/DataContext';
import { useToast } from '../components/ui/Toast';
import './FocusTimer.css';

export default function FocusTimer() {
  const { subjects, addSession, updateUser, user } = useData();
  const { showToast } = useToast();

  const [selectedSubject, setSelectedSubject] = useState(subjects[0]?.id || '');
  const [isRunning, setIsRunning] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [isSetup, setIsSetup] = useState(true);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const startTimeRef = useRef<string>('');

  const formatTime = (seconds: number) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    if (h > 0) return `${h}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
    return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  };

  const startTimer = useCallback(() => {
    if (!selectedSubject) return;
    setIsSetup(false);
    setIsRunning(true);
    setIsPaused(false);
    setElapsedSeconds(0);
    const now = new Date();
    startTimeRef.current = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
  }, [selectedSubject]);

  const pauseTimer = () => {
    setIsPaused(true);
    setIsRunning(false);
  };

  const resumeTimer = () => {
    setIsRunning(true);
    setIsPaused(false);
  };

  const stopTimer = () => {
    const minutes = Math.round(elapsedSeconds / 60);
    if (minutes >= 1) {
      const now = new Date();
      const endTime = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
      addSession({
        subjectId: selectedSubject,
        date: now.toISOString().split('T')[0],
        startTime: startTimeRef.current,
        endTime: endTime,
        status: 'completed',
        actualMinutes: minutes,
      });

      // Update streak
      if (user) {
        const today = now.toISOString().split('T')[0];
        const newStreak = user.lastStudyDate === today ? user.streak : user.streak + 1;
        updateUser({ streak: newStreak, lastStudyDate: today });
      }

      showToast(`Sessão de ${minutes} min registrada! 🎉`);
    }
    resetTimer();
  };

  const resetTimer = () => {
    setIsRunning(false);
    setIsPaused(false);
    setElapsedSeconds(0);
    setIsSetup(true);
    if (intervalRef.current) clearInterval(intervalRef.current);
  };

  useEffect(() => {
    if (isRunning) {
      intervalRef.current = setInterval(() => {
        setElapsedSeconds(prev => prev + 1);
      }, 1000);
    } else {
      if (intervalRef.current) clearInterval(intervalRef.current);
    }
    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
  }, [isRunning]);

  const subject = subjects.find(s => s.id === selectedSubject);
  const circleRadius = 130;
  const circleCircumference = 2 * Math.PI * circleRadius;
  // Visual progress (one full rotation per 60 minutes)
  const progressPct = (elapsedSeconds % 3600) / 3600;
  const dashOffset = circleCircumference - progressPct * circleCircumference;

  if (isSetup) {
    return (
      <div className="focus-setup">
        <div className="focus-setup-title">🎯 Timer de Foco</div>
        <div className="focus-setup-desc">Selecione uma matéria e comece a estudar com foco total</div>
        <div className="focus-setup-form">
          <div className="sf-input-wrapper" style={{ width: '100%' }}>
            <label className="sf-input-label">Matéria</label>
            <select className="sf-select" value={selectedSubject} onChange={e => setSelectedSubject(e.target.value)}>
              {subjects.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
            </select>
          </div>
          <button className="sf-btn sf-btn--primary sf-btn--lg" onClick={startTimer}>
            <Play size={20} /> Iniciar Sessão
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="focus-container">
      <div className="focus-subject">
        <div className="focus-subject-name">
          <div className="sf-color-dot" style={{ background: subject?.color, width: 16, height: 16 }} />
          {subject?.name}
        </div>
      </div>

      <div className="focus-timer-ring">
        <svg width="300" height="300" viewBox="0 0 300 300">
          <circle cx="150" cy="150" r={circleRadius} fill="none" stroke="var(--bg-tertiary)" strokeWidth="8" />
          <circle
            cx="150" cy="150" r={circleRadius} fill="none"
            stroke={subject?.color || '#7c3aed'}
            strokeWidth="8"
            strokeDasharray={circleCircumference}
            strokeDashoffset={dashOffset}
            strokeLinecap="round"
            style={{ transition: 'stroke-dashoffset 1s linear' }}
          />
        </svg>
        <div className="focus-timer-display">
          <div className={`focus-time ${isRunning ? 'focus-time--running' : ''}`}>
            {formatTime(elapsedSeconds)}
          </div>
          <div className="focus-label">
            {isRunning ? 'Estudando...' : isPaused ? 'Pausado' : 'Pronto'}
          </div>
        </div>
      </div>

      <div className="focus-controls">
        <button className="focus-btn focus-btn--secondary" onClick={resetTimer} title="Reiniciar">
          <RotateCcw size={22} />
        </button>
        {isRunning ? (
          <button className="focus-btn focus-btn--play" onClick={pauseTimer} title="Pausar">
            <Pause size={28} />
          </button>
        ) : (
          <button className="focus-btn focus-btn--play" onClick={isPaused ? resumeTimer : startTimer} title={isPaused ? 'Retomar' : 'Iniciar'}>
            <Play size={28} />
          </button>
        )}
        <button className="focus-btn focus-btn--secondary" onClick={stopTimer} title="Concluir">
          <Square size={22} />
        </button>
      </div>

      <p style={{ color: 'var(--text-tertiary)', fontSize: 'var(--font-size-sm)', textAlign: 'center' }}>
        Ao concluir, o tempo será registrado automaticamente nas estatísticas
      </p>
    </div>
  );
}
