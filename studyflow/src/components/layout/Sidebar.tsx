// ==========================================
// StudyFlow — Sidebar Component
// ==========================================

import { NavLink, useLocation } from 'react-router-dom';
import {
  LayoutDashboard, Calendar, CheckSquare, FileText,
  BarChart3, Settings, BookOpen, ChevronLeft, ChevronRight,
  Timer,
} from 'lucide-react';

interface SidebarProps {
  collapsed: boolean;
  onToggle: () => void;
}

const navItems = [
  { path: '/', icon: LayoutDashboard, label: 'Dashboard' },
  { path: '/cronograma', icon: Calendar, label: 'Cronograma' },
  { path: '/tarefas', icon: CheckSquare, label: 'Tarefas' },
  { path: '/anotacoes', icon: FileText, label: 'Anotações' },
  { path: '/estatisticas', icon: BarChart3, label: 'Estatísticas' },
  { path: '/foco', icon: Timer, label: 'Timer de Foco' },
  { path: '/configuracoes', icon: Settings, label: 'Configurações' },
];

export function Sidebar({ collapsed, onToggle }: SidebarProps) {
  const location = useLocation();

  return (
    <aside className={`sf-sidebar ${collapsed ? 'sf-sidebar--collapsed' : ''}`}>
      <div className="sf-sidebar-brand">
        <div className="sf-sidebar-logo">
          <BookOpen size={20} />
        </div>
        <span className="sf-sidebar-brand-text">StudyFlow</span>
      </div>

      <nav className="sf-sidebar-nav">
        <div className="sf-sidebar-section-title">Menu</div>
        {navItems.map(item => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path;
          return (
            <NavLink
              key={item.path}
              to={item.path}
              className={`sf-sidebar-link ${isActive ? 'sf-sidebar-link--active' : ''}`}
            >
              <Icon size={20} />
              <span>{item.label}</span>
            </NavLink>
          );
        })}
      </nav>

      <div className="sf-sidebar-footer">
        <button className="sf-sidebar-collapse-btn" onClick={onToggle} aria-label="Toggle sidebar">
          {collapsed ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
        </button>
      </div>
    </aside>
  );
}
