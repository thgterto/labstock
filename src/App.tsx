import React from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import Inventory from './pages/Inventory';
import Batches from './pages/Batches';
import Login from './pages/Login';
import ProtectedRoute from './components/ProtectedRoute';
import { AuthProvider } from './context/AuthContext';

// Placeholder components for routes not fully implemented in this demo
const SettingsPlaceholder = () => (
  <div className="p-8 text-center text-slate-500">
    <h2 className="text-xl font-semibold text-slate-700 mb-2">System Settings</h2>
    <p>Configure backup schedules, user roles, and printer connections here.</p>
  </div>
);

const App: React.FC = () => {
  return (
    <HashRouter>
      <AuthProvider>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route
            path="*"
            element={
              <ProtectedRoute>
                <Layout>
                  <Routes>
                    <Route path="/" element={<Dashboard />} />
                    <Route path="/inventory" element={<Inventory />} />
                    <Route path="/batches" element={<Batches />} />
                    <Route path="/settings" element={<SettingsPlaceholder />} />
                    <Route path="*" element={<Navigate to="/" replace />} />
                  </Routes>
                </Layout>
              </ProtectedRoute>
            }
          />
        </Routes>
      </AuthProvider>
    </HashRouter>
  );
};

export default App;
