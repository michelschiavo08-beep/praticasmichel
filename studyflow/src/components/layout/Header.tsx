// ==========================================
// StudyFlow — Header Component
// ==========================================

import { Search, Sun, Moon } from 'lucide-react';
import { useTheme } from '../../contexts/ThemeContext';
import { useData } from '../../contexts/DataContext';
import { getGreeting } from '../../utils';

export function Header() {
  const { theme, toggleTheme } = useTheme();
  const { user } = useData();

  return (
    <header className="sf-header">
      <div className="sf-header-left">
        <h1 className="sf-header-greeting">
          {getGreeting()}, <span>{user?.name || 'Estudante'}</span> 👋
        </h1>
      </div>

      <div className="sf-header-right">
        <div className="sf-header-search">
          <Search size={16} />
          <input type="text" placeholder="Buscar..." />
        </div>

        <button className="sf-theme-toggle" onClick={toggleTheme} aria-label="Alternar tema">
          {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
        </button>

        <div className="sf-avatar">
          {user?.name?.charAt(0)?.toUpperCase() || 'E'}
        </div>
      </div>
    </header>
  );
}
