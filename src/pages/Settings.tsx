import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import {
  User,
  Settings as SettingsIcon,
  Bell,
  Database,
  Moon,
  Sun,
  Shield,
  Save,
  Download,
  Upload
} from 'lucide-react';
import { db } from '../services/storageService';

const Settings: React.FC = () => {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState({
    email: true,
    push: false,
    lowStock: true,
    expiry: true
  });
  const [theme, setTheme] = useState<'light' | 'dark'>('light');

  const handleBackup = () => {
    // Mock backup functionality
    const data = {
      catalog: db.getCatalog(),
      batches: db.getBatches(),
      locations: db.getLocations(),
      timestamp: new Date().toISOString()
    };

    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `labcontrol_backup_${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleRestore = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        alert(`Restauração simulada do arquivo: ${file.name}. (Funcionalidade de backend necessária para persistência real)`);
      }
    };
    input.click();
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Configurações</h1>
          <p className="text-slate-500">Gerencie seu perfil, preferências e dados do sistema.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Profile Section */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-16 h-16 rounded-full bg-primary-100 flex items-center justify-center text-2xl font-bold text-primary-700">
                {user?.initials || 'U'}
              </div>
              <div>
                <h3 className="text-lg font-semibold text-slate-900">{user?.name}</h3>
                <p className="text-sm text-slate-500 capitalize">{user?.role}</p>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center gap-3 text-slate-600">
                <User className="w-4 h-4" />
                <span className="text-sm">{user?.email}</span>
              </div>
              <div className="flex items-center gap-3 text-slate-600">
                <Shield className="w-4 h-4" />
                <span className="text-sm">Acesso: {user?.role === 'admin' ? 'Administrador' : 'Usuário Padrão'}</span>
              </div>
            </div>

            <button className="w-full mt-6 px-4 py-2 border border-slate-200 rounded-lg text-slate-600 hover:bg-slate-50 text-sm font-medium transition-colors">
              Editar Perfil
            </button>
          </div>

          {/* Theme Preference */}
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
             <h3 className="text-lg font-semibold text-slate-900 mb-4 flex items-center gap-2">
               <Sun className="w-5 h-5" />
               Aparência
             </h3>
             <div className="flex gap-2 p-1 bg-slate-100 rounded-lg">
               <button
                 onClick={() => setTheme('light')}
                 className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-all ${theme === 'light' ? 'bg-white shadow-sm text-slate-900' : 'text-slate-500 hover:text-slate-700'}`}
               >
                 Claro
               </button>
               <button
                 onClick={() => setTheme('dark')}
                 className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-all ${theme === 'dark' ? 'bg-white shadow-sm text-slate-900' : 'text-slate-500 hover:text-slate-700'}`}
               >
                 Escuro
               </button>
             </div>
          </div>
        </div>

        {/* System Settings */}
        <div className="lg:col-span-2 space-y-6">
          {/* Notifications */}
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
            <h3 className="text-lg font-semibold text-slate-900 mb-6 flex items-center gap-2">
              <Bell className="w-5 h-5" />
              Notificações
            </h3>

            <div className="space-y-4">
              <div className="flex items-center justify-between py-2">
                <div>
                  <h4 className="text-sm font-medium text-slate-900">Alertas por E-mail</h4>
                  <p className="text-xs text-slate-500">Receba resumos semanais e alertas críticos.</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" checked={notifications.email} onChange={() => setNotifications({...notifications, email: !notifications.email})} className="sr-only peer" />
                  <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
                </label>
              </div>

              <div className="border-t border-slate-100 my-2"></div>

              <div className="flex items-center justify-between py-2">
                <div>
                  <h4 className="text-sm font-medium text-slate-900">Alertas de Estoque Baixo</h4>
                  <p className="text-xs text-slate-500">Notificar quando um item atingir o nível mínimo.</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" checked={notifications.lowStock} onChange={() => setNotifications({...notifications, lowStock: !notifications.lowStock})} className="sr-only peer" />
                  <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
                </label>
              </div>

              <div className="border-t border-slate-100 my-2"></div>

              <div className="flex items-center justify-between py-2">
                <div>
                  <h4 className="text-sm font-medium text-slate-900">Alertas de Validade</h4>
                  <p className="text-xs text-slate-500">Notificar 30 dias antes do vencimento de lotes.</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" checked={notifications.expiry} onChange={() => setNotifications({...notifications, expiry: !notifications.expiry})} className="sr-only peer" />
                  <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
                </label>
              </div>
            </div>
          </div>

          {/* Data Management */}
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
            <h3 className="text-lg font-semibold text-slate-900 mb-6 flex items-center gap-2">
              <Database className="w-5 h-5" />
              Gerenciamento de Dados
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 border border-slate-200 rounded-lg bg-slate-50">
                <div className="flex items-center gap-3 mb-2">
                  <Download className="w-5 h-5 text-slate-600" />
                  <h4 className="font-medium text-slate-900">Exportar Backup</h4>
                </div>
                <p className="text-xs text-slate-500 mb-4">Baixe um arquivo JSON com todos os dados do sistema.</p>
                <button
                  onClick={handleBackup}
                  className="w-full py-2 bg-white border border-slate-300 text-slate-700 rounded-lg text-sm font-medium hover:bg-slate-50 transition-colors"
                >
                  Baixar Dados
                </button>
              </div>

              <div className="p-4 border border-slate-200 rounded-lg bg-slate-50">
                <div className="flex items-center gap-3 mb-2">
                  <Upload className="w-5 h-5 text-slate-600" />
                  <h4 className="font-medium text-slate-900">Restaurar Dados</h4>
                </div>
                <p className="text-xs text-slate-500 mb-4">Carregue um arquivo de backup para restaurar o sistema.</p>
                <button
                  onClick={handleRestore}
                  className="w-full py-2 bg-white border border-slate-300 text-slate-700 rounded-lg text-sm font-medium hover:bg-slate-50 transition-colors"
                >
                  Selecionar Arquivo
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
