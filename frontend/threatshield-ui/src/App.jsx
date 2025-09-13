import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import DashboardPage from './pages/DashboardPage';
// 1. Import the new pages
import CloudGuardPage from './pages/CloudGuardPage';
import AIGuardPage from './pages/AIGuardPage';
import SettingsPage from './pages/SettingsPage';

const isAuthenticated = true;

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        
        {/* 2. Add the new routes, protected by the same logic */}
        <Route path="/dashboard" element={isAuthenticated ? <DashboardPage /> : <Navigate to="/login" />} />
        <Route path="/cloud-guard" element={isAuthenticated ? <CloudGuardPage /> : <Navigate to="/login" />} />
        <Route path="/ai-guard" element={isAuthenticated ? <AIGuardPage /> : <Navigate to="/login" />} />
        <Route path="/settings" element={isAuthenticated ? <SettingsPage /> : <Navigate to="/login" />} />
        
        <Route path="/" element={isAuthenticated ? <Navigate to="/dashboard" /> : <Navigate to="/login" />} />
      </Routes>
    </Router>
  );
}

export default App;