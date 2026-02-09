import React, { useState } from 'react';
import {
  User,
  PlusCircle,
  Trash2,
  Edit,
  Search,
  Calendar,
  Filter
} from 'lucide-react';

interface HistoryItem {
  id: string;
  action: 'create' | 'update' | 'delete' | 'consume';
  entity: 'batch' | 'item' | 'location';
  description: string;
  user: string;
  timestamp: string;
}

// Mock History Data
const MOCK_HISTORY: HistoryItem[] = [
  {
    id: 'HIST-001',
    action: 'create',
    entity: 'batch',
    description: 'Recebeu novo lote de Acetona (L2023-001)',
    user: 'Admin User',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(), // 2 hours ago
  },
  {
    id: 'HIST-002',
    action: 'consume',
    entity: 'batch',
    description: 'Consumiu 500mL de Ácido Sulfúrico',
    user: 'Lab Tech',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(), // 1 day ago
  },
  {
    id: 'HIST-003',
    action: 'update',
    entity: 'item',
    description: 'Atualizou estoque mínimo de Béquer 500mL',
    user: 'Manager',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 48).toISOString(), // 2 days ago
  },
  {
    id: 'HIST-004',
    action: 'create',
    entity: 'item',
    description: 'Cadastrou novo item: Luvas de Nitrila',
    user: 'Admin User',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 72).toISOString(), // 3 days ago
  },
  {
    id: 'HIST-005',
    action: 'delete',
    entity: 'batch',
    description: 'Descartou lote vencido de Etanol',
    user: 'Admin User',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 120).toISOString(), // 5 days ago
  },
];

const History: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<string>('all');

  const filteredHistory = MOCK_HISTORY.filter(item => {
    const matchesSearch = item.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          item.user.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterType === 'all' || item.action === filterType;
    return matchesSearch && matchesFilter;
  });

  const getActionIcon = (action: string) => {
    switch (action) {
      case 'create': return <PlusCircle className="w-4 h-4 text-green-600" />;
      case 'delete': return <Trash2 className="w-4 h-4 text-red-600" />;
      case 'update': return <Edit className="w-4 h-4 text-blue-600" />;
      default: return <User className="w-4 h-4 text-slate-600" />;
    }
  };

  const getActionLabel = (action: string) => {
    switch (action) {
      case 'create': return 'Criação';
      case 'delete': return 'Exclusão';
      case 'update': return 'Atualização';
      case 'consume': return 'Consumo';
      default: return action;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Histórico de Atividades</h1>
          <p className="text-slate-500">Registro de todas as operações realizadas no sistema.</p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Buscar por descrição ou usuário..."
            className="w-full pl-10 pr-4 py-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex items-center gap-2">
           <Filter className="w-4 h-4 text-slate-500" />
           <select
             className="px-3 py-2 rounded-lg border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-primary-500"
             value={filterType}
             onChange={(e) => setFilterType(e.target.value)}
           >
             <option value="all">Todas as Ações</option>
             <option value="create">Criação</option>
             <option value="update">Atualização</option>
             <option value="delete">Exclusão</option>
             <option value="consume">Consumo</option>
           </select>
        </div>
      </div>

      {/* Timeline List */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="divide-y divide-slate-100">
          {filteredHistory.map((item) => (
            <div key={item.id} className="p-4 hover:bg-slate-50 transition-colors flex items-start gap-4">
              <div className={`mt-1 w-8 h-8 rounded-full flex items-center justify-center bg-slate-100 border border-slate-200 flex-shrink-0`}>
                {getActionIcon(item.action)}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-1">
                  <p className="text-sm font-medium text-slate-900">
                    <span className="capitalize font-bold text-slate-700 mr-2">[{getActionLabel(item.action)}]</span>
                    {item.description}
                  </p>
                  <span className="text-xs text-slate-400 flex items-center gap-1 flex-shrink-0">
                    <Calendar className="w-3 h-3" />
                    {new Date(item.timestamp).toLocaleString('pt-BR')}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-xs text-slate-500">
                  <span className="flex items-center gap-1">
                    <User className="w-3 h-3" />
                    {item.user}
                  </span>
                  <span>•</span>
                  <span className="bg-slate-100 px-1.5 py-0.5 rounded capitalize">
                    {item.entity === 'batch' ? 'Lote' : item.entity === 'item' ? 'Item' : 'Local'}
                  </span>
                </div>
              </div>
            </div>
          ))}

          {filteredHistory.length === 0 && (
            <div className="p-8 text-center text-slate-500">
              Nenhum registro encontrado para os filtros selecionados.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default History;
