import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import DashboardPage from './pages/DashboardPage';
import CloudGuardPage from './pages/CloudGuardPage';
import AIGuardPage from './pages/AIGuardPage';
import SettingsPage from './pages/SettingsPage';
import ThreatEyePage from './pages/ThreatEyePage';

// Replace this with real auth logic
const isAuthenticated = true;

// ProtectedRoute wrapper
const ProtectedRoute = ({ children }) => {
  return isAuthenticated ? children : <Navigate to="/login" />;
};

function App() {
  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />

        {/* Protected Routes */}
        <Route path="/dashboard" element={<ProtectedRoute><DashboardPage /></ProtectedRoute>} />
        <Route path="/threat-eye" element={<ProtectedRoute><ThreatEyePage /></ProtectedRoute>} />
        <Route path="/cloud-guard" element={<ProtectedRoute><CloudGuardPage /></ProtectedRoute>} />
        <Route path="/ai-guard" element={<ProtectedRoute><AIGuardPage /></ProtectedRoute>} />
        <Route path="/settings" element={<ProtectedRoute><SettingsPage /></ProtectedRoute>} />

        {/* Default Route */}
        <Route path="/" element={<ProtectedRoute><Navigate to="/dashboard" /></ProtectedRoute>} />

        {/* Optional: 404 Page */}
        {/* <Route path="*" element={<NotFoundPage />} /> */}
      </Routes>
    </Router>
  );
}

export default App;
