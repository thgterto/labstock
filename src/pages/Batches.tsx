import React, { useState, useEffect, useMemo } from 'react';
import { db } from '../services/storageService';
import { Batch, CatalogItem, Location } from '../types';
import { Plus, Search, Filter, Trash2, Edit2, AlertCircle, TestTube, MinusCircle } from 'lucide-react';
import BatchForm from '../components/BatchForm';

const Batches: React.FC = () => {
  const [batches, setBatches] = useState<Batch[]>([]);
  const [catalog, setCatalog] = useState<CatalogItem[]>([]);
  const [locations, setLocations] = useState<Location[]>([]);
  const [searchTerm, setSearchTerm] = useState('');

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingBatch, setEditingBatch] = useState<Batch | undefined>(undefined);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = () => {
    setBatches(db.getBatches());
    setCatalog(db.getCatalog());
    setLocations(db.getLocations());
  };

  const catalogMap = useMemo(() => {
    return catalog.reduce((acc, item) => {
      acc[item.id] = item;
      return acc;
    }, {} as Record<string, CatalogItem>);
  }, [catalog]);

  const locationMap = useMemo(() => {
    return locations.reduce((acc, loc) => {
      acc[loc.id] = loc;
      return acc;
    }, {} as Record<string, Location>);
  }, [locations]);

  const getCatalogItemName = (id: string) => {
    return catalogMap[id]?.name || 'Item Desconhecido';
  };

  const getLocationName = (id: string) => {
    return locationMap[id]?.name || 'Local Desconhecido';
  };

  const filteredBatches = batches.filter(batch => {
    const itemName = getCatalogItemName(batch.catalogId).toLowerCase();
    const lot = batch.lotNumber.toLowerCase();
    const search = searchTerm.toLowerCase();
    return itemName.includes(search) || lot.includes(search);
  });

  const handleDelete = (id: string) => {
    if (confirm('Tem certeza que deseja excluir este lote?')) {
      db.deleteBatch(id);
      loadData();
    }
  };

  const handleEdit = (batch: Batch) => {
    setEditingBatch(batch);
    setIsModalOpen(true);
  };

  const handleAdd = () => {
    setEditingBatch(undefined);
    setIsModalOpen(true);
  };

  const handleSave = () => {
    loadData();
    setIsModalOpen(false);
  };

  const handleConsume = (batch: Batch) => {
    const amountStr = prompt(`Quantidade Atual: ${batch.quantity} ${batch.unit}\nQuanto deseja consumir?`);
    if (!amountStr) return;

    const amount = parseFloat(amountStr);
    if (isNaN(amount) || amount <= 0) {
      alert('Quantidade inválida');
      return;
    }

    if (amount > batch.quantity) {
      alert('Não é possível consumir mais que a quantidade disponível');
      return;
    }

    const newQuantity = batch.quantity - amount;
    const updatedBatch = { ...batch, quantity: newQuantity };

    if (newQuantity === 0) {
       // Ask if user wants to delete or keep as empty
       if (confirm('O lote está vazio. Deseja excluí-lo?')) {
         db.deleteBatch(batch.id);
       } else {
         db.updateBatch(updatedBatch);
       }
    } else {
      db.updateBatch(updatedBatch);
    }
    loadData();
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Gerenciamento de Lotes</h1>
          <p className="text-slate-500">Rastreie lotes de inventário, validades e localizações.</p>
        </div>
        <button
          className="bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 font-medium transition-colors shadow-sm"
          onClick={handleAdd}
        >
          <Plus className="w-4 h-4" />
          Adicionar Lote
        </button>
      </div>

      <div className="flex gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Buscar por nome do item ou número do lote..."
            className="w-full pl-10 pr-4 py-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="px-6 py-4 font-semibold text-slate-700">Nome do Item</th>
                <th className="px-6 py-4 font-semibold text-slate-700">Número do Lote</th>
                <th className="px-6 py-4 font-semibold text-slate-700">Quantidade</th>
                <th className="px-6 py-4 font-semibold text-slate-700">Localização</th>
                <th className="px-6 py-4 font-semibold text-slate-700">Validade</th>
                <th className="px-6 py-4 font-semibold text-slate-700">Status</th>
                <th className="px-6 py-4 font-semibold text-slate-700 text-right">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredBatches.map((batch) => {
                const isExpired = batch.expiryDate && batch.expiryDate < Date.now();
                return (
                  <tr key={batch.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4 font-medium text-slate-900">
                      {getCatalogItemName(batch.catalogId)}
                    </td>
                    <td className="px-6 py-4 text-slate-600">{batch.lotNumber}</td>
                    <td className="px-6 py-4 text-slate-900 font-medium">
                      {batch.quantity} <span className="text-slate-500 font-normal">{batch.unit}</span>
                    </td>
                    <td className="px-6 py-4 text-slate-600">{getLocationName(batch.locationId)}</td>
                    <td className="px-6 py-4">
                      {batch.expiryDate ? (
                        <div className={`flex items-center gap-1 ${isExpired ? 'text-red-600 font-medium' : 'text-slate-600'}`}>
                          {new Date(batch.expiryDate).toLocaleDateString()}
                          {isExpired && <AlertCircle className="w-3 h-3" />}
                        </div>
                      ) : <span className="text-slate-400">-</span>}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`
                        inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize
                        ${batch.qaStatus === 'approved' ? 'bg-green-100 text-green-800' :
                          batch.qaStatus === 'quarantine' ? 'bg-amber-100 text-amber-800' :
                          batch.qaStatus === 'rejected' ? 'bg-red-100 text-red-800' : 'bg-slate-100 text-slate-800'}
                      `}>
                        {batch.qaStatus === 'approved' ? 'Aprovado' :
                         batch.qaStatus === 'quarantine' ? 'Quarentena' :
                         batch.qaStatus === 'rejected' ? 'Rejeitado' :
                         batch.qaStatus === 'expired' ? 'Vencido' : batch.qaStatus}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end gap-2">
                        <button
                          className="p-1 text-slate-400 hover:text-green-600 transition-colors"
                          title="Consumir"
                          onClick={() => handleConsume(batch)}
                        >
                          <MinusCircle className="w-4 h-4" />
                        </button>
                        <button
                          className="p-1 text-slate-400 hover:text-blue-600 transition-colors"
                          title="Editar"
                          onClick={() => handleEdit(batch)}
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          className="p-1 text-slate-400 hover:text-red-600 transition-colors"
                          title="Excluir"
                          onClick={() => handleDelete(batch.id)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
              {filteredBatches.length === 0 && (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center text-slate-500">
                    Nenhum lote encontrado.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {isModalOpen && (
        <BatchForm
          onClose={() => setIsModalOpen(false)}
          onSave={handleSave}
          initialBatch={editingBatch}
        />
      )}
    </div>
  );
};

export default Batches;
