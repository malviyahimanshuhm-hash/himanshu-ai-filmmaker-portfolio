import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useState } from 'react';
import { HomePage } from './pages/HomePage';
import { AdminLoginPage } from './pages/AdminLoginPage';
import { AdminDashboardPage } from './pages/AdminDashboardPage';
import { ProjectDetailPage } from './pages/ProjectDetailPage';
import { Navigation } from './components/Navigation';
import './styles/globals.css';

function App() {
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState(false);

  return (
    <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/project/:slug" element={<ProjectDetailPage />} />
        <Route 
          path="/admin/login" 
          element={<AdminLoginPage onLogin={() => setIsAdminAuthenticated(true)} />} 
        />
        <Route 
          path="/admin" 
          element={
            isAdminAuthenticated ? 
              <AdminDashboardPage onLogout={() => setIsAdminAuthenticated(false)} /> : 
              <Navigate to="/admin/login" replace />
          } 
        />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
