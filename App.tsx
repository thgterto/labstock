import React from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import Inventory from './pages/Inventory';

// Placeholder components for routes not fully implemented in this demo
const BatchesPlaceholder = () => (
  <div className="p-8 text-center text-slate-500">
    <h2 className="text-xl font-semibold text-slate-700 mb-2">Batch Management</h2>
    <p>This module handles lot tracking, expiry dates, and QA status.</p>
  </div>
);

const SettingsPlaceholder = () => (
  <div className="p-8 text-center text-slate-500">
    <h2 className="text-xl font-semibold text-slate-700 mb-2">System Settings</h2>
    <p>Configure backup schedules, user roles, and printer connections here.</p>
  </div>
);

const App: React.FC = () => {
  return (
    <HashRouter>
      <Layout>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/inventory" element={<Inventory />} />
          <Route path="/batches" element={<BatchesPlaceholder />} />
          <Route path="/settings" element={<SettingsPlaceholder />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Layout>
    </HashRouter>
  );
};

export default App;
