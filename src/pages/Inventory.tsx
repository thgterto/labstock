import React, { useState, useEffect } from 'react';
import { db } from '../services/storageService';
import { CatalogItem } from '../types';
import { 
  Search, 
  Plus, 
  Filter, 
  AlertOctagon,
  Eye,
  Edit2,
  Trash2
} from 'lucide-react';
import CatalogForm from '../components/CatalogForm';

const Inventory: React.FC = () => {
  const [items, setItems] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  // State for Edit/View modes
  const [editingItem, setEditingItem] = useState<CatalogItem | undefined>(undefined);
  const [isViewMode, setIsViewMode] = useState(false);

  useEffect(() => {
    loadItems();
  }, []);

  const loadItems = () => {
    const data = db.getInventorySummary();
    setItems(data);
  };

  const handleSave = () => {
    setIsModalOpen(false);
    loadItems();
  };

  const handleAdd = () => {
    setEditingItem(undefined);
    setIsViewMode(false);
    setIsModalOpen(true);
  };

  const handleEdit = (item: CatalogItem) => {
    setEditingItem(item);
    setIsViewMode(false);
    setIsModalOpen(true);
  };

  const handleView = (item: CatalogItem) => {
    setEditingItem(item);
    setIsViewMode(true);
    setIsModalOpen(true);
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Tem certeza que deseja excluir este item do catálogo?')) {
      db.deleteCatalogItem(id);
      loadItems();
    }
  };

  const filteredItems = items.filter(item => 
    item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.casNumber?.includes(searchTerm)
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Catálogo de Inventário</h1>
          <p className="text-slate-500">Gerencie suas definições de químicos e equipamentos.</p>
        </div>
        <button 
          onClick={handleAdd}
          className="bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 font-medium transition-colors shadow-sm"
        >
          <Plus className="w-4 h-4" />
          Adicionar Item
        </button>
      </div>

      {/* Filters */}
      <div className="flex gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input 
            type="text" 
            placeholder="Buscar por nome, CAS ou código..."
            className="w-full pl-10 pr-4 py-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <button className="px-4 py-2 border border-slate-200 rounded-lg text-slate-600 hover:bg-slate-50 flex items-center gap-2">
          <Filter className="w-4 h-4" />
          Filtros
        </button>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="px-6 py-4 font-semibold text-slate-700">Nome do Item</th>
                <th className="px-6 py-4 font-semibold text-slate-700">Categoria</th>
                <th className="px-6 py-4 font-semibold text-slate-700">CAS / Specs</th>
                <th className="px-6 py-4 font-semibold text-slate-700">GHS</th>
                <th className="px-6 py-4 font-semibold text-slate-700 text-right">Estoque Total</th>
                <th className="px-6 py-4 font-semibold text-slate-700 text-right">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredItems.map((item) => (
                <tr key={item.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="font-medium text-slate-900">{item.name}</div>
                    <div className="text-xs text-slate-500">{item.id}</div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`
                      inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium
                      ${item.category === 'CHEMICAL' ? 'bg-purple-100 text-purple-800' : 
                        item.category === 'EQUIPMENT' ? 'bg-blue-100 text-blue-800' : 'bg-slate-100 text-slate-800'}
                    `}>
                      {item.category === 'CHEMICAL' ? 'Químico' :
                       item.category === 'EQUIPMENT' ? 'Equipamento' :
                       item.category === 'GLASSWARE' ? 'Vidraria' : item.category}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-slate-600">
                    {item.casNumber || item.molecularFormula || '-'}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex gap-1">
                      {item.ghsPictograms?.length > 0 ? (
                        item.ghsPictograms.map((p: string) => (
                          <span key={p} className="w-6 h-6 flex items-center justify-center bg-red-50 border border-red-200 rounded text-[10px] text-red-700 font-bold" title={p}>
                            {p.replace('GHS','')}
                          </span>
                        ))
                      ) : (
                        <span className="text-slate-400">-</span>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="font-medium text-slate-900">{item.totalQuantity} <span className="text-slate-500 text-xs font-normal">Unidades/L</span></div>
                    {item.totalQuantity < item.minStockLevel && (
                       <div className="text-xs text-red-600 flex items-center justify-end gap-1 mt-1">
                         <AlertOctagon className="w-3 h-3" /> Estoque Baixo
                       </div>
                    )}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex justify-end gap-2">
                        <button
                            className="p-1 text-slate-400 hover:text-blue-600 transition-colors"
                            title="Ver Detalhes"
                            onClick={() => handleView(item)}
                        >
                            <Eye className="w-4 h-4" />
                        </button>
                        <button
                            className="p-1 text-slate-400 hover:text-green-600 transition-colors"
                            title="Editar"
                            onClick={() => handleEdit(item)}
                        >
                            <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                            className="p-1 text-slate-400 hover:text-red-600 transition-colors"
                            title="Excluir"
                            onClick={() => handleDelete(item.id)}
                        >
                            <Trash2 className="w-4 h-4" />
                        </button>
                    </div>
                  </td>
                </tr>
              ))}
              {filteredItems.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-slate-500">
                    Nenhum item encontrado.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {isModalOpen && (
        <CatalogForm
          onClose={() => setIsModalOpen(false)}
          onSave={handleSave}
          initialItem={editingItem}
          readonly={isViewMode}
        />
      )}
    </div>
  );
};

export default Inventory;
