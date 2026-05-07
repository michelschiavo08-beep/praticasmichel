// ==========================================
// StudyFlow — Tasks Page
// ==========================================

import { useState, useMemo } from 'react';
import { Plus, Trash2, Edit3, Check } from 'lucide-react';
import { useData } from '../contexts/DataContext';
import { Modal } from '../components/ui/Modal';
import { useToast } from '../components/ui/Toast';
import { isToday, isThisWeek, isPast, formatDate } from '../utils';
import type { Task } from '../types';
import './Tasks.css';

export default function Tasks() {
  const { tasks, subjects, addTask, updateTask, deleteTask, toggleTask } = useData();
  const { showToast } = useToast();
  const [showModal, setShowModal] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [filterSubject, setFilterSubject] = useState('all');
  const [filterPriority, setFilterPriority] = useState('all');

  // Form
  const [formTitle, setFormTitle] = useState('');
  const [formDesc, setFormDesc] = useState('');
  const [formSubject, setFormSubject] = useState('');
  const [formDeadline, setFormDeadline] = useState('');
  const [formPriority, setFormPriority] = useState<Task['priority']>('medium');

  const filtered = useMemo(() => {
    let list = [...tasks];
    if (filterSubject !== 'all') list = list.filter(t => t.subjectId === filterSubject);
    if (filterPriority !== 'all') list = list.filter(t => t.priority === filterPriority);
    return list;
  }, [tasks, filterSubject, filterPriority]);

  const groups = useMemo(() => {
    const pending = filtered.filter(t => t.status === 'pending');
    const completed = filtered.filter(t => t.status === 'completed');
    return {
      today: pending.filter(t => isToday(t.deadline)),
      thisWeek: pending.filter(t => !isToday(t.deadline) && isThisWeek(t.deadline) && !isPast(t.deadline)),
      overdue: pending.filter(t => isPast(t.deadline) && !isToday(t.deadline)),
      future: pending.filter(t => !isToday(t.deadline) && !isThisWeek(t.deadline) && !isPast(t.deadline)),
      completed: completed.slice(0, 10),
    };
  }, [filtered]);

  const openNew = () => {
    setEditId(null);
    setFormTitle('');
    setFormDesc('');
    setFormSubject(subjects[0]?.id || '');
    setFormDeadline(new Date().toISOString().split('T')[0]);
    setFormPriority('medium');
    setShowModal(true);
  };

  const openEdit = (task: Task) => {
    setEditId(task.id);
    setFormTitle(task.title);
    setFormDesc(task.description || '');
    setFormSubject(task.subjectId);
    setFormDeadline(task.deadline);
    setFormPriority(task.priority);
    setShowModal(true);
  };

  const handleSave = () => {
    if (!formTitle.trim() || !formSubject) return;
    if (editId) {
      updateTask(editId, {
        title: formTitle, description: formDesc,
        subjectId: formSubject, deadline: formDeadline, priority: formPriority,
      });
      showToast('Tarefa atualizada!');
    } else {
      addTask({
        title: formTitle, description: formDesc, subjectId: formSubject,
        deadline: formDeadline, priority: formPriority, status: 'pending',
      });
      showToast('Tarefa criada!');
    }
    setShowModal(false);
  };

  const getSubject = (id: string) => subjects.find(s => s.id === id);

  const priorityLabel = { high: 'Alta', medium: 'Média', low: 'Baixa' };

  const renderGroup = (title: string, icon: string, list: Task[]) => {
    if (list.length === 0) return null;
    return (
      <div className="tasks-group">
        <div className="tasks-group-title">
          {icon} {title}
          <span className="tasks-group-count">{list.length}</span>
        </div>
        {list.map(task => {
          const sub = getSubject(task.subjectId);
          const isOverdue = isPast(task.deadline) && !isToday(task.deadline) && task.status === 'pending';
          return (
            <div key={task.id} className={`task-card ${task.status === 'completed' ? 'task-card--completed' : ''}`}>
              <button
                className={`sf-checkbox ${task.status === 'completed' ? 'sf-checkbox--checked' : ''}`}
                onClick={() => {
                  toggleTask(task.id);
                  if (task.status === 'pending') showToast('Tarefa concluída! ✅');
                }}
              >
                {task.status === 'completed' && <Check size={14} />}
              </button>
              <div className="task-content">
                <div className="task-title">{task.title}</div>
                <div className="task-meta">
                  <span className="task-subject-tag" style={{ background: `${sub?.color}20`, color: sub?.color }}>
                    <span className="sf-color-dot" style={{ background: sub?.color, width: 8, height: 8 }} />
                    {sub?.name}
                  </span>
                  <span className={isOverdue ? 'task-deadline--urgent' : ''}>
                    {isOverdue ? '⚠ Atrasada — ' : ''}{formatDate(task.deadline)}
                  </span>
                  <span className={`sf-badge sf-badge--${task.priority}`}>
                    {priorityLabel[task.priority]}
                  </span>
                </div>
              </div>
              <div className="task-actions">
                <button className="sf-btn sf-btn--ghost sf-btn--icon" onClick={() => openEdit(task)}>
                  <Edit3 size={16} />
                </button>
                <button className="sf-btn sf-btn--ghost sf-btn--icon" onClick={() => { deleteTask(task.id); showToast('Tarefa excluída', 'info'); }}>
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <div>
      <div className="sf-page-header">
        <div>
          <h1 className="sf-page-title">✅ Tarefas</h1>
          <p className="sf-page-subtitle">Gerencie suas tarefas e metas de estudo</p>
        </div>
        <button className="sf-btn sf-btn--primary" onClick={openNew}>
          <Plus size={18} /> Nova Tarefa
        </button>
      </div>

      {/* Filters */}
      <div className="tasks-filters">
        <select className="sf-select" style={{ width: 'auto' }} value={filterSubject} onChange={e => setFilterSubject(e.target.value)}>
          <option value="all">Todas as matérias</option>
          {subjects.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
        </select>
        <select className="sf-select" style={{ width: 'auto' }} value={filterPriority} onChange={e => setFilterPriority(e.target.value)}>
          <option value="all">Todas as prioridades</option>
          <option value="high">Alta</option>
          <option value="medium">Média</option>
          <option value="low">Baixa</option>
        </select>
      </div>

      {renderGroup('Atrasadas', '🔴', groups.overdue)}
      {renderGroup('Hoje', '📌', groups.today)}
      {renderGroup('Esta Semana', '📅', groups.thisWeek)}
      {renderGroup('Futuras', '🔮', groups.future)}
      {renderGroup('Concluídas', '✅', groups.completed)}

      {filtered.length === 0 && (
        <div className="sf-empty">
          <CheckSquareIcon />
          <div className="sf-empty-title">Nenhuma tarefa encontrada</div>
          <button className="sf-btn sf-btn--primary" onClick={openNew}>Criar Tarefa</button>
        </div>
      )}

      {/* Modal */}
      <Modal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        title={editId ? 'Editar Tarefa' : 'Nova Tarefa'}
        actions={
          <>
            <button className="sf-btn sf-btn--secondary" onClick={() => setShowModal(false)}>Cancelar</button>
            <button className="sf-btn sf-btn--primary" onClick={handleSave}>Salvar</button>
          </>
        }
      >
        <div className="sf-input-wrapper">
          <label className="sf-input-label">Título</label>
          <div className="sf-input-container">
            <input className="sf-input" value={formTitle} onChange={e => setFormTitle(e.target.value)} placeholder="Ex: Resolver lista de exercícios" />
          </div>
        </div>
        <div className="sf-input-wrapper">
          <label className="sf-input-label">Descrição</label>
          <textarea className="sf-textarea" value={formDesc} onChange={e => setFormDesc(e.target.value)} placeholder="Opcional..." />
        </div>
        <div className="task-form-row">
          <div className="sf-input-wrapper">
            <label className="sf-input-label">Matéria</label>
            <select className="sf-select" value={formSubject} onChange={e => setFormSubject(e.target.value)}>
              {subjects.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
            </select>
          </div>
          <div className="sf-input-wrapper">
            <label className="sf-input-label">Prazo</label>
            <input type="date" className="sf-select" value={formDeadline} onChange={e => setFormDeadline(e.target.value)} />
          </div>
        </div>
        <div className="sf-input-wrapper">
          <label className="sf-input-label">Prioridade</label>
          <select className="sf-select" value={formPriority} onChange={e => setFormPriority(e.target.value as Task['priority'])}>
            <option value="high">🔴 Alta</option>
            <option value="medium">🟡 Média</option>
            <option value="low">🔵 Baixa</option>
          </select>
        </div>
      </Modal>
    </div>
  );
}

function CheckSquareIcon() {
  return (
    <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M9 11l3 3L22 4" /><path d="M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11" />
    </svg>
  );
}
