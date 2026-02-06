import React, { useState, useEffect } from 'react';
import { db } from '../services/storageService';
import { CatalogItem, Category } from '../types';
import { X, FlaskConical } from 'lucide-react';

interface CatalogFormProps {
  onClose: () => void;
  onSave: () => void;
  initialItem?: CatalogItem;
  readonly?: boolean;
}

const CatalogForm: React.FC<CatalogFormProps> = ({ onClose, onSave, initialItem, readonly = false }) => {
  const [formData, setFormData] = useState<Partial<CatalogItem>>({
    name: '',
    category: 'CHEMICAL',
    minStockLevel: 0,
    ghsPictograms: [],
    ghsHazards: [],
    description: '',
    casNumber: '',
    molecularFormula: '',
  });

  useEffect(() => {
    if (initialItem) {
      setFormData(initialItem);
    }
  }, [initialItem]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (readonly) return;
    if (!formData.name) return;

    const itemToSave: CatalogItem = {
      ...formData,
      id: initialItem?.id || `CAT-${Date.now()}`,
    } as CatalogItem;

    if (initialItem) {
      db.updateCatalogItem(itemToSave);
    } else {
      db.addCatalogItem(itemToSave);
    }

    onSave();
  };

  const handleChange = (field: keyof CatalogItem, value: any) => {
    if (readonly) return;
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const toggleGhsPictogram = (pictogram: string) => {
      if (readonly) return;
      const current = formData.ghsPictograms || [];
      const updated = current.includes(pictogram)
        ? current.filter(p => p !== pictogram)
        : [...current, pictogram];
      handleChange('ghsPictograms', updated);
  };

  const AVAILABLE_GHS = ['GHS01', 'GHS02', 'GHS03', 'GHS04', 'GHS05', 'GHS06', 'GHS07', 'GHS08', 'GHS09'];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl overflow-hidden flex flex-col max-h-[90vh]">
        <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50 flex-shrink-0">
          <h3 className="text-lg font-semibold text-slate-900">
            {readonly ? 'Detalhes do Item' : initialItem ? 'Editar Item' : 'Adicionar Novo Item'}
          </h3>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-6 overflow-y-auto flex-grow">
          {/* Name */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Nome do Item</label>
            <input
              type="text"
              disabled={readonly}
              className="w-full rounded-lg border border-slate-300 px-3 py-2 focus:ring-2 focus:ring-primary-500 focus:outline-none disabled:bg-slate-100 disabled:text-slate-500"
              placeholder="ex: Acetona"
              value={formData.name}
              onChange={(e) => handleChange('name', e.target.value)}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
               <label className="block text-sm font-medium text-slate-700 mb-1">Categoria</label>
               <select
                disabled={readonly}
                className="w-full rounded-lg border border-slate-300 px-3 py-2 focus:ring-2 focus:ring-primary-500 focus:outline-none disabled:bg-slate-100 disabled:text-slate-500"
                value={formData.category}
                onChange={(e) => handleChange('category', e.target.value as Category)}
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
                disabled={readonly}
                className="w-full rounded-lg border border-slate-300 px-3 py-2 focus:ring-2 focus:ring-primary-500 focus:outline-none disabled:bg-slate-100 disabled:text-slate-500"
                value={formData.minStockLevel}
                onChange={(e) => handleChange('minStockLevel', parseInt(e.target.value) || 0)}
               />
            </div>
          </div>

          {/* Chemical Specifics */}
          {formData.category === 'CHEMICAL' && (
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
                    disabled={readonly}
                    className="w-full rounded border border-slate-200 px-2 py-1 text-sm disabled:bg-slate-100"
                    value={formData.casNumber || ''}
                    onChange={(e) => handleChange('casNumber', e.target.value)}
                   />
                 </div>
                 <div>
                   <label className="block text-xs font-medium text-slate-500 mb-1">Fórmula</label>
                   <input
                    type="text"
                    disabled={readonly}
                    className="w-full rounded border border-slate-200 px-2 py-1 text-sm disabled:bg-slate-100"
                    value={formData.molecularFormula || ''}
                    onChange={(e) => handleChange('molecularFormula', e.target.value)}
                   />
                 </div>
               </div>

               <div>
                  <label className="block text-xs font-medium text-slate-500 mb-1">Perigos Detectados (GHS)</label>
                  <div className="flex flex-wrap gap-2 min-h-[32px] p-2 bg-white border border-slate-200 rounded">
                    {readonly ? (
                        formData.ghsPictograms?.length ? (
                          formData.ghsPictograms.map(p => (
                             <span key={p} className="bg-red-50 text-red-700 text-xs px-2 py-1 rounded border border-red-100 font-medium">
                               {p}
                             </span>
                          ))
                        ) : <span className="text-xs text-slate-400 italic">Nenhum perigo detectado</span>
                    ) : (
                        AVAILABLE_GHS.map(p => (
                            <button
                                key={p}
                                type="button"
                                onClick={() => toggleGhsPictogram(p)}
                                className={`text-xs px-2 py-1 rounded border font-medium transition-colors ${
                                    formData.ghsPictograms?.includes(p)
                                    ? 'bg-red-50 text-red-700 border-red-200 ring-1 ring-red-200'
                                    : 'bg-slate-50 text-slate-500 border-slate-200 hover:bg-slate-100'
                                }`}
                            >
                                {p}
                            </button>
                        ))
                    )}
                  </div>
               </div>
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Descrição</label>
            <textarea
              disabled={readonly}
              className="w-full rounded-lg border border-slate-300 px-3 py-2 focus:ring-2 focus:ring-primary-500 focus:outline-none h-24 disabled:bg-slate-100 disabled:text-slate-500"
              value={formData.description}
              onChange={(e) => handleChange('description', e.target.value)}
            ></textarea>
          </div>
        </div>

        <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex justify-end gap-3 flex-shrink-0">
          <button
            onClick={onClose}
            className="px-4 py-2 text-slate-600 hover:text-slate-800 font-medium"
          >
            {readonly ? 'Fechar' : 'Cancelar'}
          </button>
          {!readonly && (
            <button
                onClick={handleSubmit}
                disabled={!formData.name}
                className="bg-primary-600 hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed text-white px-6 py-2 rounded-lg font-medium shadow-sm transition-colors"
            >
                {initialItem ? 'Salvar Alterações' : 'Salvar Item'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default CatalogForm;
