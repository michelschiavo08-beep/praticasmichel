// ==========================================
// StudyFlow — Main Application
// ==========================================

import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from './contexts/ThemeContext';
import { DataProvider } from './contexts/DataContext';
import { ToastProvider } from './components/ui/Toast';
import { PageLayout } from './components/layout/PageLayout';
import Dashboard from './pages/Dashboard';
import Schedule from './pages/Schedule';
import Tasks from './pages/Tasks';
import Notes from './pages/Notes';
import Statistics from './pages/Statistics';
import Settings from './pages/Settings';
import FocusTimer from './pages/FocusTimer';

// Import styles
import './styles/global.css';
import './components/ui/ui.css';
import './components/layout/layout.css';

function App() {
  return (
    <BrowserRouter>
      <ThemeProvider>
        <DataProvider>
          <ToastProvider>
            <Routes>
              <Route element={<PageLayout />}>
                <Route path="/" element={<Dashboard />} />
                <Route path="/cronograma" element={<Schedule />} />
                <Route path="/tarefas" element={<Tasks />} />
                <Route path="/anotacoes" element={<Notes />} />
                <Route path="/estatisticas" element={<Statistics />} />
                <Route path="/configuracoes" element={<Settings />} />
                <Route path="/foco" element={<FocusTimer />} />
              </Route>
            </Routes>
          </ToastProvider>
        </DataProvider>
      </ThemeProvider>
    </BrowserRouter>
  );
}

export default App;
