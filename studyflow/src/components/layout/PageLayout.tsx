// ==========================================
// StudyFlow — Page Layout Wrapper
// ==========================================

import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { Header } from './Header';

export function PageLayout() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  return (
    <div className="sf-app">
      <Sidebar collapsed={sidebarCollapsed} onToggle={() => setSidebarCollapsed(!sidebarCollapsed)} />
      <main className={`sf-main ${sidebarCollapsed ? 'sf-main--expanded' : ''}`}>
        <Header />
        <div className="sf-page">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
