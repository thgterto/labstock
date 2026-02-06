import React, { useState, useEffect } from 'react';
import { db } from '../services/storageService';
import { CatalogItem, Category } from '../types';
import { 
  Search, 
  Plus, 
  Filter, 
  MoreHorizontal, 
  AlertOctagon, 
  FlaskConical
} from 'lucide-react';

const Inventory: React.FC = () => {
  const [items, setItems] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  // Form State
  const [newItem, setNewItem] = useState<Partial<CatalogItem>>({
    name: '',
    category: 'CHEMICAL',
    minStockLevel: 0,
    ghsPictograms: [],
    ghsHazards: [],
    description: '',
  });

  useEffect(() => {
    loadItems();
  }, []);

  const loadItems = () => {
    const data = db.getInventorySummary();
    setItems(data);
  };

  const handleSave = () => {
    if (!newItem.name) return;
    const item: CatalogItem = {
      ...newItem,
      id: `CAT-${Date.now()}`,
    } as CatalogItem;
    
    db.addCatalogItem(item);
    setIsModalOpen(false);
    setNewItem({ name: '', category: 'CHEMICAL', minStockLevel: 0, ghsPictograms: [], ghsHazards: [] });
    loadItems();
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
          onClick={() => setIsModalOpen(true)}
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
                    <button className="text-slate-400 hover:text-slate-600">
                      <MoreHorizontal className="w-5 h-5" />
                    </button>
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

      {/* Add Item Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50">
              <h3 className="text-lg font-semibold text-slate-900">Adicionar Novo Item</h3>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="p-6 space-y-6">
              {/* Name */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Nome do Item</label>
                <input 
                  type="text" 
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 focus:ring-2 focus:ring-primary-500 focus:outline-none"
                  placeholder="ex: Acetona"
                  value={newItem.name}
                  onChange={(e) => setNewItem({...newItem, name: e.target.value})}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                   <label className="block text-sm font-medium text-slate-700 mb-1">Categoria</label>
                   <select 
                    className="w-full rounded-lg border border-slate-300 px-3 py-2 focus:ring-2 focus:ring-primary-500 focus:outline-none"
                    value={newItem.category}
                    onChange={(e) => setNewItem({...newItem, category: e.target.value as Category})}
                   >
                     <option value="CHEMICAL">Químico</option>
                     <option value="EQUIPMENT">Equipamento</option>
                     <option value="GLASSWARE">Vidraria</option>
                     <option value="TOOL">Ferramenta</option>
                   </select>
                </div>
                <div>
                   <label className="block text-sm font-medium text-slate-700 mb-1">Estoque Mínimo</label>
                   <input 
                    type="number" 
                    className="w-full rounded-lg border border-slate-300 px-3 py-2 focus:ring-2 focus:ring-primary-500 focus:outline-none"
                    value={newItem.minStockLevel}
                    onChange={(e) => setNewItem({...newItem, minStockLevel: parseInt(e.target.value) || 0})}
                   />
                </div>
              </div>

              {/* Chemical Specifics */}
              {newItem.category === 'CHEMICAL' && (
                <div className="p-4 bg-slate-50 rounded-lg border border-slate-100 space-y-4">
                   <div className="flex items-center gap-2 mb-2">
                     <FlaskConical className="w-4 h-4 text-slate-500" />
                     <h4 className="text-sm font-semibold text-slate-700">Propriedades Químicas</h4>
                   </div>
                   <div className="grid grid-cols-2 gap-4">
                     <div>
                       <label className="block text-xs font-medium text-slate-500 mb-1">Número CAS</label>
                       <input 
                        type="text" 
                        className="w-full rounded border border-slate-200 px-2 py-1 text-sm"
                        value={newItem.casNumber || ''}
                        onChange={(e) => setNewItem({...newItem, casNumber: e.target.value})}
                       />
                     </div>
                     <div>
                       <label className="block text-xs font-medium text-slate-500 mb-1">Fórmula</label>
                       <input 
                        type="text" 
                        className="w-full rounded border border-slate-200 px-2 py-1 text-sm"
                        value={newItem.molecularFormula || ''}
                        onChange={(e) => setNewItem({...newItem, molecularFormula: e.target.value})}
                       />
                     </div>
                   </div>
                   
                   <div>
                      <label className="block text-xs font-medium text-slate-500 mb-1">Perigos Detectados (GHS)</label>
                      <div className="flex flex-wrap gap-2 min-h-[32px] p-2 bg-white border border-slate-200 rounded">
                        {newItem.ghsPictograms?.length ? (
                          newItem.ghsPictograms.map(p => (
                             <span key={p} className="bg-red-50 text-red-700 text-xs px-2 py-1 rounded border border-red-100 font-medium">
                               {p}
                             </span>
                          ))
                        ) : <span className="text-xs text-slate-400 italic">Nenhum perigo detectado</span>}
                      </div>
                   </div>
                </div>
              )}
              
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Descrição</label>
                <textarea 
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 focus:ring-2 focus:ring-primary-500 focus:outline-none h-24"
                  value={newItem.description}
                  onChange={(e) => setNewItem({...newItem, description: e.target.value})}
                ></textarea>
              </div>

            </div>
            
            <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex justify-end gap-3">
              <button 
                onClick={() => setIsModalOpen(false)}
                className="px-4 py-2 text-slate-600 hover:text-slate-800 font-medium"
              >
                Cancelar
              </button>
              <button 
                onClick={handleSave}
                disabled={!newItem.name}
                className="bg-primary-600 hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed text-white px-6 py-2 rounded-lg font-medium shadow-sm transition-colors"
              >
                Salvar Item
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// Simple Icon component for the modal close button since Lucide X was missing in scope of component
const X = ({ className }: { className?: string }) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    width="24" 
    height="24" 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round" 
    className={className}
  >
    <path d="M18 6 6 18"/><path d="m6 6 12 12"/>
  </svg>
);

export default Inventory;
