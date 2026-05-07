// ==========================================
// StudyFlow — Settings Page
// ==========================================

import { useState } from 'react';
import { Trash2, Plus, Edit3, LogOut } from 'lucide-react';
import { useData } from '../contexts/DataContext';
import { useTheme } from '../contexts/ThemeContext';
import { Modal } from '../components/ui/Modal';
import { useToast } from '../components/ui/Toast';
import { SUBJECT_COLORS } from '../utils';
import './Settings.css';

export default function Settings() {
  const { user, updateUser, subjects, addSubject, updateSubject, deleteSubject, logout } = useData();
  const { theme, toggleTheme } = useTheme();
  const { showToast } = useToast();

  const [showSubjectModal, setShowSubjectModal] = useState(false);
  const [editSubjectId, setEditSubjectId] = useState<string | null>(null);
  const [subName, setSubName] = useState('');
  const [subColor, setSubColor] = useState(SUBJECT_COLORS[0]);
  const [subGoal, setSubGoal] = useState(5);
  const [userName, setUserName] = useState(user?.name || '');

  const openNewSubject = () => {
    setEditSubjectId(null);
    setSubName('');
    setSubColor(SUBJECT_COLORS[Math.floor(Math.random() * SUBJECT_COLORS.length)]);
    setSubGoal(5);
    setShowSubjectModal(true);
  };

  const openEditSubject = (id: string) => {
    const s = subjects.find(x => x.id === id);
    if (!s) return;
    setEditSubjectId(id);
    setSubName(s.name);
    setSubColor(s.color);
    setSubGoal(s.weeklyGoalHours);
    setShowSubjectModal(true);
  };

  const saveSubject = () => {
    if (!subName.trim()) return;
    if (editSubjectId) {
      updateSubject(editSubjectId, { name: subName, color: subColor, weeklyGoalHours: subGoal });
      showToast('Matéria atualizada!');
    } else {
      addSubject({ name: subName, color: subColor, icon: 'BookOpen', weeklyGoalHours: subGoal });
      showToast('Matéria criada!');
    }
    setShowSubjectModal(false);
  };

  const handleDeleteSubject = (id: string) => {
    if (confirm('Excluir esta matéria? Sessões, tarefas e notas relacionadas também serão excluídas.')) {
      deleteSubject(id);
      showToast('Matéria excluída', 'info');
    }
  };

  const handleSaveName = () => {
    if (userName.trim()) {
      updateUser({ name: userName.trim() });
      showToast('Nome atualizado!');
    }
  };

  const handleLogout = () => {
    if (confirm('Tem certeza que deseja sair? Todos os dados locais serão perdidos.')) {
      logout();
      window.location.reload();
    }
  };

  return (
    <div>
      <div className="sf-page-header">
        <div>
          <h1 className="sf-page-title">⚙️ Configurações</h1>
          <p className="sf-page-subtitle">Personalize sua experiência</p>
        </div>
      </div>

      <div className="settings-grid">
        {/* Profile */}
        <div className="settings-section" style={{ animationDelay: '0ms' }}>
          <div className="settings-section-title">👤 Perfil</div>
          <div className="sf-input-wrapper" style={{ marginBottom: 'var(--space-4)' }}>
            <label className="sf-input-label">Nome</label>
            <div style={{ display: 'flex', gap: 'var(--space-2)' }}>
              <div className="sf-input-container" style={{ flex: 1 }}>
                <input className="sf-input" value={userName} onChange={e => setUserName(e.target.value)} />
              </div>
              <button className="sf-btn sf-btn--primary sf-btn--sm" onClick={handleSaveName}>Salvar</button>
            </div>
          </div>
          <div className="settings-row">
            <div>
              <div className="settings-row-label">E-mail</div>
              <div className="settings-row-desc">{user?.email}</div>
            </div>
          </div>
          <div className="settings-row">
            <div>
              <div className="settings-row-label">Perfil de estudo</div>
              <div className="settings-row-desc">{user?.studyProfile === 'geral' ? 'Geral' : user?.studyProfile === 'concurso' ? 'Concurso' : user?.studyProfile === 'faculdade' ? 'Faculdade' : 'Idioma'}</div>
            </div>
          </div>
        </div>

        {/* Appearance */}
        <div className="settings-section" style={{ animationDelay: '100ms' }}>
          <div className="settings-section-title">🎨 Aparência</div>
          <div className="settings-row">
            <div>
              <div className="settings-row-label">Tema Escuro</div>
              <div className="settings-row-desc">Ativar modo escuro na interface</div>
            </div>
            <button
              className={`settings-toggle ${theme === 'dark' ? 'settings-toggle--active' : ''}`}
              onClick={toggleTheme}
              aria-label="Toggle dark mode"
            />
          </div>
        </div>

        {/* Subjects */}
        <div className="settings-section" style={{ animationDelay: '200ms' }}>
          <div className="settings-section-title" style={{ justifyContent: 'space-between', display: 'flex' }}>
            <span>📚 Matérias</span>
            <button className="sf-btn sf-btn--primary sf-btn--sm" onClick={openNewSubject}>
              <Plus size={16} /> Adicionar
            </button>
          </div>
          {subjects.map(sub => (
            <div key={sub.id} className="settings-subject-item">
              <div className="sf-color-dot" style={{ background: sub.color, width: 16, height: 16 }} />
              <span className="settings-subject-name">{sub.name}</span>
              <span style={{ fontSize: 'var(--font-size-xs)', color: 'var(--text-tertiary)' }}>
                Meta: {sub.weeklyGoalHours}h/sem
              </span>
              <div className="settings-subject-actions">
                <button className="sf-btn sf-btn--ghost sf-btn--icon" style={{ width: 28, height: 28 }}
                  onClick={() => openEditSubject(sub.id)}>
                  <Edit3 size={14} />
                </button>
                <button className="sf-btn sf-btn--ghost sf-btn--icon" style={{ width: 28, height: 28 }}
                  onClick={() => handleDeleteSubject(sub.id)}>
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Plan */}
        <div className="settings-section" style={{ animationDelay: '300ms' }}>
          <div className="settings-section-title">💎 Plano</div>
          <div className="settings-plan">
            <div className="settings-plan-name">
              {user?.plan === 'premium' ? '✨ Premium' : '🆓 Gratuito'}
            </div>
            <div className="settings-plan-desc">
              {user?.plan === 'premium'
                ? 'Acesso ilimitado a todas as funcionalidades'
                : 'Até 5 matérias, 30 notas, estatísticas de 30 dias'
              }
            </div>
            {user?.plan !== 'premium' && (
              <button className="sf-btn sf-btn--secondary" style={{ color: 'white', borderColor: 'rgba(255,255,255,0.3)' }}
                onClick={() => { updateUser({ plan: 'premium' }); showToast('Plano atualizado para Premium! ✨'); }}>
                Upgrade para Premium
              </button>
            )}
          </div>
          <div style={{ marginTop: 'var(--space-6)' }}>
            <button className="sf-btn sf-btn--danger sf-btn--full" onClick={handleLogout}>
              <LogOut size={18} /> Sair da conta
            </button>
          </div>
        </div>
      </div>

      {/* Subject Modal */}
      <Modal
        isOpen={showSubjectModal}
        onClose={() => setShowSubjectModal(false)}
        title={editSubjectId ? 'Editar Matéria' : 'Nova Matéria'}
        actions={
          <>
            <button className="sf-btn sf-btn--secondary" onClick={() => setShowSubjectModal(false)}>Cancelar</button>
            <button className="sf-btn sf-btn--primary" onClick={saveSubject}>Salvar</button>
          </>
        }
      >
        <div className="sf-input-wrapper">
          <label className="sf-input-label">Nome</label>
          <div className="sf-input-container">
            <input className="sf-input" value={subName} onChange={e => setSubName(e.target.value)} placeholder="Ex: Matemática" />
          </div>
        </div>
        <div className="sf-input-wrapper">
          <label className="sf-input-label">Cor</label>
          <div style={{ display: 'flex', gap: 'var(--space-2)', flexWrap: 'wrap' }}>
            {SUBJECT_COLORS.map(c => (
              <button
                key={c}
                onClick={() => setSubColor(c)}
                style={{
                  width: 32, height: 32, borderRadius: 'var(--radius-full)', background: c,
                  border: subColor === c ? '3px solid white' : '3px solid transparent',
                  cursor: 'pointer', transition: 'transform 0.15s',
                  transform: subColor === c ? 'scale(1.15)' : 'scale(1)',
                }}
              />
            ))}
          </div>
        </div>
        <div className="sf-input-wrapper">
          <label className="sf-input-label">Meta semanal (horas)</label>
          <div className="sf-input-container">
            <input className="sf-input" type="number" min={1} max={40} value={subGoal} onChange={e => setSubGoal(Number(e.target.value))} />
          </div>
        </div>
      </Modal>
    </div>
  );
}
